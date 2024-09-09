import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';  // Import fs module for file operations

// Construct __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Route to list files in client/dist directory for debugging
app.get('/list-files', (req, res) => {
    const directoryPath = path.join(__dirname, '../../client/dist');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.send(files);
    });
});

// Catch-all route to serve the index.html file
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

// Log the resolved path for debugging
console.log("Resolved path:", path.join(__dirname, "../../client/dist", "index.html"));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Express configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";

// Route declaration
app.use("/api/v1/users", userRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
