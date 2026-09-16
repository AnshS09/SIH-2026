require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");

const db = require("./database");
const authenticateToken = require("./authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ======================================================
// MACH-X / KINSHUK RECONSTRUCTION PIPELINE
// ======================================================

const PIPELINE_ROOT =
    process.env.PIPELINE_ROOT ||
    "C:\\Users\\lenovo\\Downloads\\droneTo3d\\v15";

const PYTHON_COMMAND = process.env.PYTHON_COMMAND || "python";

if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is missing from .env");
    process.exit(1);
}

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://mach-x.netlify.app"
        ]
    })
);

app.use(express.json());

// ======================================================
// DIRECTORIES
// ======================================================

fs.mkdirSync("uploads", { recursive: true });
fs.mkdirSync("missions", { recursive: true });

// ======================================================
// FILE UPLOAD
// ======================================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({ storage });

// ======================================================
// TEMPORARY MISSION DATA
// ======================================================

const missions = {};

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
    res.json({
        message: "SIH Backend is running!",
        pipeline_root: PIPELINE_ROOT
    });
});

// ======================================================
// AUTH - REGISTER
// ======================================================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = db
            .prepare(
                `INSERT INTO users
                (name, email, password_hash)
                VALUES (?, ?, ?)`
            )
            .run(
                name.trim(),
                normalizedEmail,
                passwordHash
            );

        res.status(201).json({
            message: "User registered successfully",
            user_id: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            error: "Registration failed"
        });
    }
});

// ======================================================
// AUTH - LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = db
            .prepare(
                `SELECT id, name, email, password_hash
                 FROM users
                 WHERE email = ?`
            )
            .get(normalizedEmail);

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            error: "Login failed"
        });
    }
});

// ======================================================
// CREATE MISSION
// ======================================================

app.post(
    "/api/missions",
    authenticateToken,
    (req, res) => {

        try {

            const missionId = `M${Date.now()}`;

            const missionPath = path.join(
                "missions",
                missionId
            );

            fs.mkdirSync(
                path.join(missionPath, "video"),
                { recursive: true }
            );

            fs.mkdirSync(
                path.join(missionPath, "telemetry"),
                { recursive: true }
            );

            fs.mkdirSync(
                path.join(missionPath, "camera"),
                { recursive: true }
            );

            fs.mkdirSync(
                path.join(missionPath, "output"),
                { recursive: true }
            );

            missions[missionId] = {

                status: "created",

                progress: 0,

                user_id: req.user.user_id,

                created_at: new Date().toISOString()
            };

            res.json({

                message: "Mission created successfully",

                mission_id: missionId

            });

        } catch (error) {

            console.error(
                "Mission creation error:",
                error
            );

            res.status(500).json({
                error: "Mission creation failed"
            });
        }
    }
);

// ======================================================
// GET MISSION STATUS
// ======================================================

app.get(
    "/api/missions/:missionId",
    authenticateToken,
    (req, res) => {

        const missionId = req.params.missionId;

        const mission = missions[missionId];

        if (!mission) {

            return res.status(404).json({
                error: "Mission not found"
            });
        }

        if (
            mission.user_id !==
            req.user.user_id
        ) {

            return res.status(403).json({
                error: "Access denied"
            });
        }

        res.json({

            mission_id: missionId,

            status: mission.status,

            progress: mission.progress,

            output: mission.output || null,

            error: mission.error || null

        });
    }
);

// ======================================================
// GENERIC VIDEO UPLOAD
// ======================================================

app.post(
    "/api/upload",
    authenticateToken,
    upload.single("video"),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                error: "No video uploaded"
            });
        }

        res.json({

            message:
                "Video uploaded successfully",

            filename:
                req.file.filename,

            path:
                req.file.path

        });
    }
);

// ======================================================
// MISSION VIDEO UPLOAD
// ======================================================

app.post(
    "/api/missions/:missionId/video",
    authenticateToken,
    upload.single("video"),
    (req, res) => {

        const missionId =
            req.params.missionId;

        const mission =
            missions[missionId];

        if (!mission) {

            return res.status(404).json({
                error: "Mission not found"
            });
        }

        if (
            mission.user_id !==
            req.user.user_id
        ) {

            return res.status(403).json({
                error: "Access denied"
            });
        }

        if (!req.file) {

            return res.status(400).json({
                error: "No video uploaded"
            });
        }

        const missionVideoPath =
            path.join(
                "missions",
                missionId,
                "video",
                req.file.filename
            );

        fs.renameSync(
            req.file.path,
            missionVideoPath
        );

        mission.status =
            "video_uploaded";

        mission.progress = 10;

        res.json({

            message:
                "Video uploaded to mission successfully",

            mission_id:
                missionId,

            filename:
                req.file.filename,

            path:
                missionVideoPath

        });
    }
);

// ======================================================
// MISSION TELEMETRY UPLOAD
// ======================================================

app.post(
    "/api/missions/:missionId/telemetry",
    authenticateToken,
    upload.single("telemetry"),
    (req, res) => {

        const missionId =
            req.params.missionId;

        const mission =
            missions[missionId];

        if (!mission) {

            return res.status(404).json({
                error: "Mission not found"
            });
        }

        if (
            mission.user_id !==
            req.user.user_id
        ) {

            return res.status(403).json({
                error: "Access denied"
            });
        }

        if (!req.file) {

            return res.status(400).json({
                error: "No telemetry file uploaded"
            });
        }

        const telemetryPath =
            path.join(
                "missions",
                missionId,
                "telemetry",
                req.file.filename
            );

        fs.renameSync(
            req.file.path,
            telemetryPath
        );

        mission.status =
            "telemetry_uploaded";

        mission.progress = 20;

        res.json({

            message:
                "Telemetry uploaded to mission successfully",

            mission_id:
                missionId,

            filename:
                req.file.filename,

            path:
                telemetryPath

        });
    }
);

// ======================================================
// RECONSTRUCTION PIPELINE
//
// Simulator sends:
//   video
//   telemetry
//   camera
//
// Backend:
//   1. Saves them
//   2. Starts Kinshuk's pipeline
//   3. Tracks mission status
// ======================================================

app.post(
    "/api/missions/:missionId/reconstruct",

    authenticateToken,

    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "telemetry",
            maxCount: 1
        },
        {
            name: "camera",
            maxCount: 1
        }
    ]),

    async (req, res) => {

        const missionId =
            req.params.missionId;

        const mission =
            missions[missionId];

        try {

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!mission) {

                return res.status(404).json({
                    error: "Mission not found"
                });
            }

            if (
                mission.user_id !==
                req.user.user_id
            ) {

                return res.status(403).json({
                    error: "Access denied"
                });
            }

            const videoFile =
                req.files?.video?.[0];

            const telemetryFile =
                req.files?.telemetry?.[0];

            const cameraFile =
                req.files?.camera?.[0];

            if (
                !videoFile ||
                !telemetryFile ||
                !cameraFile
            ) {

                return res.status(400).json({

                    error:
                        "video, telemetry and camera files are required"

                });
            }

            // ------------------------------------------
            // CREATE PIPELINE DIRECTORIES
            // ------------------------------------------

            const pipelineInputDir =
                path.join(
                    PIPELINE_ROOT,
                    "mission_inputs",
                    missionId
                );

            const pipelineStem = `flight_${missionId}`;

const missionOutputDir =
    path.join(
        PIPELINE_ROOT,
        "output",
        `3D${pipelineStem}`
    );
            fs.mkdirSync(
                pipelineInputDir,
                {
                    recursive: true
                }
            );

            fs.mkdirSync(
                missionOutputDir,
                {
                    recursive: true
                }
            );

            // ------------------------------------------
            // NORMALIZE FILE NAMES
            //
            // run_complex_reconstruction.py expects:
            //
            // video
            // matching .csv
            // matching .camera.json
            // ------------------------------------------

            const originalExtension =
                path.extname(
                    videoFile.originalname
                ).toLowerCase() || ".mp4";

            const videoPath =
    path.join(
        pipelineInputDir,
        `${pipelineStem}${originalExtension}`
    );

            const telemetryPath =
    path.join(
        pipelineInputDir,
        `${pipelineStem}.csv`
    );
            const cameraPath =
    path.join(
        pipelineInputDir,
        `${pipelineStem}.camera.json`
    );
            // ------------------------------------------
            // COPY FILES INTO PIPELINE INPUT
            // ------------------------------------------

            fs.copyFileSync(
                videoFile.path,
                videoPath
            );

            fs.copyFileSync(
                telemetryFile.path,
                telemetryPath
            );

            fs.copyFileSync(
                cameraFile.path,
                cameraPath
            );

            // ------------------------------------------
            // UPDATE MISSION
            // ------------------------------------------

            mission.status =
                "processing";

            mission.progress = 30;

            mission.input = {

                video:
                    videoPath,

                telemetry:
                    telemetryPath,

                camera:
                    cameraPath
            };

            // ------------------------------------------
            // CREATE TEMPORARY PYTHON LAUNCHER
            // ------------------------------------------

            const launcherPath =
                path.join(
                    PIPELINE_ROOT,
                    `_machx_${missionId}.py`
                );

            const escapedInputDir =
                pipelineInputDir
                    .replace(/\\/g, "\\\\");

            const escapedOutputRoot =
                path.dirname(
                    missionOutputDir
                )
                .replace(/\\/g, "\\\\");

            const launcher = `
from pathlib import Path
import run_complex_reconstruction as pipeline

pipeline.INPUT_DIR = Path(r"""${escapedInputDir}""")

pipeline.OUTPUT_ROOT = Path(r"""${escapedOutputRoot}""")

pipeline.main()
`;

            fs.writeFileSync(
                launcherPath,
                launcher,
                "utf8"
            );

            // ------------------------------------------
            // LOG FILE
            // ------------------------------------------

            const logPath =
                path.join(
                    missionOutputDir,
                    "machx_pipeline.log"
                );

            const logStream =
                fs.createWriteStream(
                    logPath,
                    {
                        flags: "a"
                    }
                );

            console.log(
                `[MACH-X] Starting reconstruction for ${missionId}`
            );

            console.log(
                `[MACH-X] Pipeline root: ${PIPELINE_ROOT}`
            );

            console.log(
                `[MACH-X] Input: ${pipelineInputDir}`
            );

            console.log(
                `[MACH-X] Output: ${missionOutputDir}`
            );

            // ------------------------------------------
            // START PYTHON
            // ------------------------------------------

            const pythonProcess =
                spawn(
                    PYTHON_COMMAND,
                    [
                        launcherPath
                    ],
                    {
                        cwd: PIPELINE_ROOT,
                        windowsHide: true
                    }
                );

            mission.pid =
                pythonProcess.pid;

            // ------------------------------------------
            // PYTHON STDOUT
            // ------------------------------------------

            pythonProcess.stdout.on(
                "data",
                (data) => {

                    const text =
                        data.toString();

                    console.log(
                        `[MACH-X ${missionId}] ${text.trim()}`
                    );

                    logStream.write(text);

                    // Coarse progress tracking.
                    // We do NOT pretend these are exact
                    // internal percentages.

                    if (
                        text.includes("Stage 1")
                    ) {
                        mission.progress = 35;

                    } else if (
                        text.includes("Stage 2")
                    ) {
                        mission.progress = 42;

                    } else if (
                        text.includes("Stage 3")
                    ) {
                        mission.progress = 50;

                    } else if (
                        text.includes("Stage 4")
                    ) {
                        mission.progress = 60;

                    } else if (
                        text.includes("Stage 5")
                    ) {
                        mission.progress = 70;

                    } else if (
                        text.includes("Stage 6")
                    ) {
                        mission.progress = 80;

                    } else if (
                        text.includes("Stage 7")
                    ) {
                        mission.progress = 87;

                    } else if (
                        text.includes("Stage 8")
                    ) {
                        mission.progress = 93;

                    } else if (
                        text.includes("Stage 9")
                    ) {
                        mission.progress = 97;
                    }
                }
            );

            // ------------------------------------------
            // PYTHON STDERR
            // ------------------------------------------

            pythonProcess.stderr.on(
                "data",
                (data) => {

                    const text =
                        data.toString();

                    console.error(
                        `[MACH-X ${missionId}] ${text.trim()}`
                    );

                    logStream.write(text);
                }
            );

            // ------------------------------------------
            // PYTHON START ERROR
            // ------------------------------------------

            pythonProcess.on(
                "error",
                (error) => {

                    console.error(
                        "[MACH-X] Failed to start Python:",
                        error
                    );

                    mission.status =
                        "failed";

                    mission.progress = 0;

                    mission.error =
                        `Could not start Python reconstruction: ${error.message}`;

                    logStream.end();

                    try {

                        fs.unlinkSync(
                            launcherPath
                        );

                    } catch (_) {}
                }
            );

            // ------------------------------------------
            // PYTHON PROCESS FINISHED
            // ------------------------------------------

            pythonProcess.on(
                "close",
                (code) => {

                    logStream.end();

                    try {

                        fs.unlinkSync(
                            launcherPath
                        );

                    } catch (_) {}

                    if (code === 0) {

                        mission.status =
                            "completed";

                        mission.progress =
                            100;

                        mission.output = {

                            directory:
                                missionOutputDir,

                            model:
                                path.join(
                                    missionOutputDir,
                                    "texture",
                                    "textured.obj"
                                ),

                            material:
                                path.join(
                                    missionOutputDir,
                                    "texture",
                                    "textured.mtl"
                                ),

                            texture:
                                path.join(
                                    missionOutputDir,
                                    "texture",
                                    "atlas.png"
                                ),

                            manifest:
                                path.join(
                                    missionOutputDir,
                                    "manifest.json"
                                )
                        };

                        console.log(
                            `[MACH-X] Reconstruction completed for ${missionId}`
                        );

                    } else {

                        mission.status =
                            "failed";

                        mission.progress =
                            0;

                        mission.error =
                            `Reconstruction process exited with code ${code}`;

                        console.error(
                            `[MACH-X] Reconstruction failed for ${missionId}`
                        );
                    }
                }
            );

            // ------------------------------------------
            // DELETE TEMPORARY MULTER FILES
            // ------------------------------------------

            for (
                const file of [
                    videoFile,
                    telemetryFile,
                    cameraFile
                ]
            ) {

                try {

                    fs.unlinkSync(
                        file.path
                    );

                } catch (_) {}
            }

            // ------------------------------------------
            // RESPOND IMMEDIATELY
            //
            // Python continues running in background.
            // Frontend can poll mission status.
            // ------------------------------------------

            res.status(202).json({

                message:
                    "Reconstruction started",

                mission_id:
                    missionId,

                status:
                    mission.status,

                progress:
                    mission.progress

            });

        } catch (error) {

            console.error(
                "Reconstruction error:",
                error
            );

            if (mission) {

                mission.status =
                    "failed";

                mission.progress =
                    0;

                mission.error =
                    error.message;
            }

            res.status(500).json({

                error:
                    "Could not start reconstruction",

                details:
                    error.message

            });
        }
    }
);
// ======================================================
// 3D VIEWER + OUTPUT ASSETS
// ======================================================

app.get(
    "/api/missions/:missionId/viewer",
    (req, res) => {
        const missionId = req.params.missionId;
        const mission = missions[missionId];

        if (!mission) {
            return res.status(404).send("Mission not found");
        }

        if (
    mission.status !== "completed" ||
    !mission.output
)

        if (
            mission.status !== "completed" ||
            !mission.output
        ) {
            return res.status(409).send(
                "3D reconstruction is not completed yet"
            );
        }

        const viewerPath = path.join(
            PIPELINE_ROOT,
            "viewer",
            "Drone3DViewer.html"
        );

        if (!fs.existsSync(viewerPath)) {
            return res.status(404).send(
                "Drone3DViewer.html not found"
            );
        }

        res.sendFile(viewerPath);
    }
);


// ======================================================
// SERVE GENERATED 3D OUTPUT FILES
// ======================================================

app.get(
    "/api/missions/:missionId/output/*file",
    (req, res) => {
        const missionId = req.params.missionId;
        const mission = missions[missionId];

        if (!mission) {
            return res.status(404).send("Mission not found");
        }


        if (!mission.output) {
            return res.status(404).send("Output not ready");
        }

        const outputDir = mission.output?.directory;

if (!outputDir) {
    return res.status(404).send("Output not ready");
}

const resolvedOutputDir = path.resolve(outputDir);

        const requestedFile = Array.isArray(req.params.file)
    ? req.params.file.join("/")
    : (req.params.file || "");

        const filePath = path.resolve(
    resolvedOutputDir,
    requestedFile
);

const rootPath =
    resolvedOutputDir + path.sep;

        // Prevent accessing files outside mission output
        if (
            !filePath.startsWith(rootPath) ||
            !fs.existsSync(filePath)
        ) {
            return res.status(404).send(
                "Output file not found"
            );
        }

        res.sendFile(filePath);
    }
);

// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

        console.log(
            `MACH-X pipeline root: ${PIPELINE_ROOT}`
        );

    }
);