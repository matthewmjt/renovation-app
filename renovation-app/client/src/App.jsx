// client/src/App.jsx
import { useState, useEffect, useCallback } from "react";
import { api } from "./api.js";
import Login from "./Login.jsx";
import RenovationApp from "./RenovationApp.jsx";

// Key we use to store the flat properties array in the DB.
// We store it as a single record so the schema stays simple while
// the app evolves. If you later want per-property endpoints, the
// server already has them — just swap api.properties.update calls here.
const STORE_ID = "main";

export default function App() {
  const [authState, setAuthState]   = useState("loading"); // loading | login | ready
  const [appData,   setAppData]     = useState(null);       // null = not yet loaded
  const [saveState, setSaveState]   = useState("saved");    // saved | saving | error

  // ── Check existing session ────────────────────────────────────────────────
  useEffect(() => {
    api.auth.me().then(({ authenticated }) => {
      if (authenticated) loadData();
      else setAuthState("login");
    }).catch(() => setAuthState("login"));
  }, []);

  // ── Load data from server ─────────────────────────────────────────────────
  const loadData = async () => {
    try {
      const data = await api.properties.get(STORE_ID);
      setAppData(data.properties || []);
      setAuthState("ready");
    } catch (err) {
      if (err.message === "Not found") {
        // First run — no data yet, start fresh
        setAppData(null);
        setAuthState("ready");
      } else {
        console.error("Load failed", err);
        setAuthState("login");
      }
    }
  };

  // ── Save callback (passed into RenovationApp, called on every change) ─────
  const handleSave = useCallback(async (properties) => {
    setSaveState("saving");
    try {
      // Try update first, create if not found
      try {
        await api.properties.update(STORE_ID, { id: STORE_ID, properties });
      } catch {
        await api.properties.create({ id: STORE_ID, properties });
      }
      setSaveState("saved");
    } catch (err) {
      console.error("Save failed", err);
      setSaveState("error");
    }
  }, []);

  const handleLogin = () => loadData();

  const handleLogout = async () => {
    await api.auth.logout();
    setAuthState("login");
    setAppData(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (authState === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'DM Sans', sans-serif", color: "#AAA", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  if (authState === "login") {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Save indicator + logout — sits above the app */}
      <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999, display: "flex", gap: 8, alignItems: "center" }}>
        {saveState === "saving" && (
          <span style={{ fontSize: 11, color: "#AAA", background: "white", border: "1px solid #EEE", borderRadius: 6, padding: "3px 8px" }}>Saving…</span>
        )}
        {saveState === "error" && (
          <span style={{ fontSize: 11, color: "#E53935", background: "white", border: "1px solid #FFCDD2", borderRadius: 6, padding: "3px 8px" }}>Save failed</span>
        )}
        {process.env.APP_PASSWORD !== undefined && (
          <button onClick={handleLogout}
            style={{ fontSize: 11, color: "#AAA", background: "white", border: "1px solid #EEE", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
            Sign out
          </button>
        )}
      </div>

      <RenovationApp
        initialData={appData}
        onSave={handleSave}
      />
    </>
  );
}
