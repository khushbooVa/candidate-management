const express = require("express");
const cors = require("cors");
const path = require("path");
const errorMiddleware = require("./middleware/errorMiddleware");
const { swaggerUi, swaggerDocs } = require("./config/swagger");

const app = express();
console.log(">>> [SERVER] Initializing App...");

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173", "https://candidatemgmt.netlify.app"];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for file uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/ping", (req, res) => res.json({ msg: "Active Server Verified", version: "1.2", time: new Date().toISOString() }));

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCssUrl: CSS_URL,
    customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js"
    ]
}));

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
