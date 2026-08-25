const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// JSON requests handle karne ke liye
app.use(express.json());

// Uploaded files kahan save honge
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Temporary in-memory mission data
const missions = {};

// Home / health check
app.get("/", (req, res) => {
    res.json({
        message: "SIH Backend is running!"
    });
});

// Create a new mission
app.post("/api/missions", (req, res) => {
    const missionId = `M${Date.now()}`;

    const missionPath = `missions/${missionId}`;

    fs.mkdirSync(`${missionPath}/video`, { recursive: true });
    fs.mkdirSync(`${missionPath}/telemetry`, { recursive: true });
    fs.mkdirSync(`${missionPath}/output`, { recursive: true });

    missions[missionId] = {
        status: "created",
        progress: 0
    };

    res.json({
        message: "Mission created successfully",
        mission_id: missionId
    });
});

// Get mission status
app.get("/api/missions/:missionId", (req, res) => {
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
});

// General video upload
app.post("/api/upload", upload.single("video"), (req, res) => {

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
});

// Upload video for a specific mission
app.post("/api/missions/:missionId/video", upload.single("video"), (req, res) => {
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

    const missionVideoPath = `missions/${missionId}/video/${req.file.filename}`;

    fs.renameSync(req.file.path, missionVideoPath);

    missions[missionId].status = "video_uploaded";
    missions[missionId].progress = 10;

    res.json({
        message: "Video uploaded to mission successfully",
        mission_id: missionId,
        filename: req.file.filename,
        path: missionVideoPath
    });
});
// Upload telemetry for a specific mission
app.post("/api/missions/:missionId/telemetry", upload.single("telemetry"), (req, res) => {
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

    const telemetryPath = `missions/${missionId}/telemetry/${req.file.filename}`;

    fs.renameSync(req.file.path, telemetryPath);

    missions[missionId].status = "telemetry_uploaded";
    missions[missionId].progress = 20;

    res.json({
        message: "Telemetry uploaded to mission successfully",
        mission_id: missionId,
        filename: req.file.filename,
        path: telemetryPath
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});