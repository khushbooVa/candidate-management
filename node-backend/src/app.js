const express = require("express");
const cors = require("cors");
const path = require("path");
const errorMiddleware = require("./middleware/errorMiddleware");
const { swaggerUi, swaggerDocs } = require("./config/swagger");

const app = express();
console.log(">>> [SERVER] Initializing App...");

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow any localhost origin
        if (origin.startsWith("http://localhost:")) {
            return callback(null, true);
        }

        // Block other origins
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for file uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Diagnostic route
app.get("/ping", (req, res) => res.json({ msg: "Active Server Verified", version: "1.2", time: new Date().toISOString() }));

// Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
console.log(">>> [SERVER] Mounting /api/auth...");
app.use("/api/auth", require("./routes/authRoutes"));
console.log(">>> [SERVER] Mounting /api/candidates...");
app.use("/api/candidates", require("./routes/candidateRoutes"));
console.log(">>> [SERVER] Mounting /api/search...");
app.use("/api/search", require("./routes/searchRoutes"));

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
