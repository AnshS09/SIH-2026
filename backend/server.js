require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");
const authenticateToken = require("./authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is missing from .env");
    process.exit(1);
}

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

// =========================================================
// DIRECTORIES
// =========================================================

fs.mkdirSync("uploads", { recursive: true });
fs.mkdirSync("missions", { recursive: true });

// =========================================================
// FILE UPLOAD
// =========================================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// =========================================================
// TEMPORARY MISSION DATA
// =========================================================

const missions = {};

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/", (req, res) => {
    res.json({
        message: "SIH Backend is running!"
    });
});

// =========================================================
// AUTHENTICATION
// =========================================================

// REGISTER
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
            .prepare(`
                INSERT INTO users (name, email, password_hash)
                VALUES (?, ?, ?)
            `)
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

// LOGIN
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
            .prepare(`
                SELECT id, name, email, password_hash
                FROM users
                WHERE email = ?
            `)
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
            token: token,
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

// =========================================================
// MISSION APIs
// =========================================================

// CREATE MISSION
app.post(
    "/api/missions",
    authenticateToken,
    (req, res) => {

        const missionId = `M${Date.now()}`;

        const missionPath = `missions/${missionId}`;

        fs.mkdirSync(
            `${missionPath}/video`,
            { recursive: true }
        );

        fs.mkdirSync(
            `${missionPath}/telemetry`,
            { recursive: true }
        );

        fs.mkdirSync(
            `${missionPath}/output`,
            { recursive: true }
        );

        missions[missionId] = {
            status: "created",
            progress: 0,
            user_id: req.user.user_id
        };

        res.json({
            message: "Mission created successfully",
            mission_id: missionId
        });
    }
);

// GET MISSION STATUS
app.get(
    "/api/missions/:missionId",
    authenticateToken,
    (req, res) => {

        const missionId = req.params.missionId;

        if (!missions[missionId]) {
            return res.status(404).json({
                error: "Mission not found"
            });
        }

        res.json({
            mission_id: missionId,
            status: missions[missionId].status,
            progress: missions[missionId].progress
        });
    }
);

// =========================================================
// VIDEO APIs
// =========================================================

// GENERAL VIDEO UPLOAD
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
            message: "Video uploaded successfully",
            filename: req.file.filename,
            path: req.file.path
        });
    }
);

// MISSION VIDEO UPLOAD
app.post(
    "/api/missions/:missionId/video",
    authenticateToken,
    upload.single("video"),
    (req, res) => {

        const missionId = req.params.missionId;

        if (!missions[missionId]) {
            return res.status(404).json({
                error: "Mission not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "No video uploaded"
            });
        }

        const missionVideoPath =
            `missions/${missionId}/video/${req.file.filename}`;

        fs.renameSync(
            req.file.path,
            missionVideoPath
        );

        missions[missionId].status = "video_uploaded";
        missions[missionId].progress = 10;

        res.json({
            message: "Video uploaded to mission successfully",
            mission_id: missionId,
            filename: req.file.filename,
            path: missionVideoPath
        });
    }
);

// =========================================================
// TELEMETRY
// =========================================================

app.post(
    "/api/missions/:missionId/telemetry",
    authenticateToken,
    upload.single("telemetry"),
    (req, res) => {

        const missionId = req.params.missionId;

        if (!missions[missionId]) {
            return res.status(404).json({
                error: "Mission not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "No telemetry file uploaded"
            });
        }

        const telemetryPath =
            `missions/${missionId}/telemetry/${req.file.filename}`;

        fs.renameSync(
            req.file.path,
            telemetryPath
        );

        missions[missionId].status = "telemetry_uploaded";
        missions[missionId].progress = 20;

        res.json({
            message: "Telemetry uploaded to mission successfully",
            mission_id: missionId,
            filename: req.file.filename,
            path: telemetryPath
        });
    }
);

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});