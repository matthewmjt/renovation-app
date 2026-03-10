// server/middleware/auth.js
// Current: single shared password via APP_PASSWORD env var.
//
// To upgrade to multi-user auth later:
//   - Add a `users` table to the DB
//   - Replace the password check below with a user lookup + bcrypt compare
//   - The requireAuth middleware stays identical — just the check function changes
//   - Consider: Lucia auth, Better Auth, or Passport.js for the upgrade path

const PASS = process.env.APP_PASSWORD;

// Pages that don't need auth
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"];

function requireAuth(req, res, next) {
  // If no password is set, allow all (useful for local dev)
  if (!PASS) return next();

  if (PUBLIC_PATHS.includes(req.path)) return next();

  if (req.session && req.session.authenticated) return next();

  // API requests get 401, browser requests get redirected
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  return res.redirect("/login");
}

function loginHandler(req, res) {
  const { password } = req.body;
  if (password === PASS) {
    req.session.authenticated = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: "Wrong password" });
}

function logoutHandler(req, res) {
  req.session.destroy();
  res.json({ ok: true });
}

module.exports = { requireAuth, loginHandler, logoutHandler };
