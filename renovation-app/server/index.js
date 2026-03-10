require("dotenv").config();

const express = require("express");
const session = require("express-session");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const { requireAuth, loginHandler, logoutHandler } = require("./middleware/auth");
const propertiesRouter = require("./routes/properties");

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

app.use(compression());
app.use(express.json({ limit: "10mb" }));

if (!IS_PROD) {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));

// ── Static files BEFORE auth ──────────────────────────────────────────────
if (IS_PROD) {
  const DIST = path.join(__dirname, "../dist");
  app.use(express.static(DIST));
}

// ── Public auth routes ────────────────────────────────────────────────────
app.post("/api/auth/login", loginHandler);
app.post("/api/auth/logout", logoutHandler);
app.get("/api/auth/me", (req, res) => {
  const hasPassword = !!process.env.APP_PASSWORD;
  res.json({ authenticated: !hasPassword || !!req.session?.authenticated });
});

// ── Protected API routes ──────────────────────────────────────────────────
app.use(requireAuth);
app.use("/api/properties", propertiesRouter);

// ── SPA fallback ──────────────────────────────────────────────────────────
if (IS_PROD) {
  const DIST = path.join(__dirname, "../dist");
  app.get("*", (req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Renovation app running on http://localhost:${PORT}`);
  if (!process.env.APP_PASSWORD) {
    console.warn("No APP_PASSWORD set — auth disabled.");
  }
});
