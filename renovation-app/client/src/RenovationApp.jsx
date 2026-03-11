import React, { useState, useRef, useEffect, Fragment } from "react";

// ─── Paint Brands ─────────────────────────────────────────────────────────────
const PAINT_BRANDS = {
  "Farrow & Ball": [
    { name: "Elephant's Breath", hex: "#958E85" }, { name: "Cornforth White", hex: "#CEC8BC" },
    { name: "Purbeck Stone", hex: "#BDB5A6" }, { name: "Strong White", hex: "#E8E4DC" },
    { name: "Wimborne White", hex: "#F0EBE0" }, { name: "All White", hex: "#F4F1EA" },
    { name: "Pointing", hex: "#EDE8DC" }, { name: "Off-Black", hex: "#3A3530" },
    { name: "Pitch Black", hex: "#28231E" }, { name: "Railings", hex: "#3A3D40" },
    { name: "Hague Blue", hex: "#274252" }, { name: "Inchyra Blue", hex: "#4A5D6A" },
    { name: "Mizzle", hex: "#8A9A82" }, { name: "Calke Green", hex: "#4A6054" },
    { name: "Dead Salmon", hex: "#C4987A" }, { name: "Setting Plaster", hex: "#D4A898" },
    { name: "Pigeon", hex: "#8A9890" }, { name: "Manor House Gray", hex: "#6E6A62" },
    { name: "Pavilion Gray", hex: "#A8A49C" }, { name: "Mole's Breath", hex: "#7A7068" },
  ],
  "Little Greene": [
    { name: "Gauze", hex: "#E8E0D4" }, { name: "Slaked Lime", hex: "#DDD8CC" },
    { name: "Clay", hex: "#C8B89A" }, { name: "Stone Mid", hex: "#C0B49A" },
    { name: "French Grey", hex: "#A8A090" }, { name: "Lamp Black", hex: "#2C2820" },
    { name: "Obsidian", hex: "#242020" }, { name: "Dark Lead", hex: "#48484A" },
    { name: "Livid", hex: "#687880" }, { name: "Harbour", hex: "#5A7080" },
    { name: "Green Verditer", hex: "#6A8878" }, { name: "Sage", hex: "#8A9880" },
    { name: "Carmine", hex: "#8A2830" }, { name: "Drab", hex: "#887858" },
    { name: "Bone", hex: "#D8CCBC" }, { name: "Pearl", hex: "#E0D8CC" },
  ],
  "Dulux": [
    { name: "Perfectly Taupe", hex: "#C4B8A8" }, { name: "Natural Hessian", hex: "#D4C8B0" },
    { name: "Timeless", hex: "#E0D8CC" }, { name: "Polished Pebble", hex: "#B0A898" },
    { name: "Chic Shadow", hex: "#888078" }, { name: "Jasmine White", hex: "#F0EDE4" },
    { name: "Magnolia", hex: "#EDE8DC" }, { name: "Urban Obsession", hex: "#3C3C40" },
    { name: "Midnight Storm", hex: "#303848" }, { name: "Moroccan Blue", hex: "#3A5870" },
    { name: "Forest Glade", hex: "#4A6848" }, { name: "Sage Advice", hex: "#8A9878" },
    { name: "Dusted Fondant", hex: "#D4A8A0" }, { name: "Blush", hex: "#E0B8B0" },
  ],
  "Coat": [
    { name: "Chalk", hex: "#F0EDE6" }, { name: "Linen", hex: "#E4DDD2" },
    { name: "Oat", hex: "#DDD4C4" }, { name: "Bone", hex: "#D8CEBC" },
    { name: "Sand", hex: "#C8B898" }, { name: "Slate", hex: "#8A9098" },
    { name: "Storm", hex: "#6A7480" }, { name: "Ink", hex: "#2C3440" },
    { name: "Coal", hex: "#282828" }, { name: "Forest", hex: "#3A5040" },
    { name: "Sage", hex: "#7A9080" }, { name: "Duck Egg", hex: "#A8C4C0" },
    { name: "Blush", hex: "#D8B0A8" }, { name: "Terracotta", hex: "#B87860" },
    { name: "Mustard", hex: "#C8A848" }, { name: "Moss", hex: "#7A8858" },
  ],
};

// ─── Retailer Scrape Simulation ───────────────────────────────────────────────
const RETAILERS = [
  { match: "bq.com", name: "B&Q", products: [
    { name: "Karndean LVT Oak Flooring", price: 34.99, unit: "per m²" },
    { name: "Dulux Easycare Matt 2.5L", price: 24.00, unit: "tin" },
    { name: "GoodHome Ceramic Wall Tile", price: 18.99, unit: "per tile" },
    { name: "Plasterboard 2400×1200mm", price: 9.50, unit: "sheet" },
  ]},
  { match: "wickes.co.uk", name: "Wickes", products: [
    { name: "Wickes Gloss White Skirting 2.4m", price: 12.50, unit: "length" },
    { name: "Wickes Ceramic Wall Tile White", price: 11.00, unit: "per m²" },
    { name: "Multifinish Plaster 25kg", price: 14.00, unit: "bag" },
    { name: "Insulation Roll 100mm", price: 22.00, unit: "roll" },
  ]},
  { match: "screwfix.com", name: "Screwfix", products: [
    { name: "Rawlplug Screw & Plug Box 100", price: 4.99, unit: "box" },
    { name: "Brushed Brass Door Handle Pair", price: 18.50, unit: "pair" },
    { name: "Silicone Sealant White 300ml", price: 6.49, unit: "tube" },
    { name: "Copper Pipe 15mm × 3m", price: 11.20, unit: "length" },
  ]},
  { match: "wayfair.co.uk", name: "Wayfair", products: [
    { name: "Freestanding Bath 1700mm White", price: 649.00, unit: "each" },
    { name: "Pendant Light Antique Brass", price: 89.99, unit: "each" },
    { name: "Velvet Sofa 3-Seater Sage", price: 799.00, unit: "each" },
    { name: "Linen Roman Blind", price: 64.99, unit: "each" },
  ]},
  { match: "johnlewis.com", name: "John Lewis", products: [
    { name: "NEFF Built-in Oven Stainless", price: 549.00, unit: "each" },
    { name: "Neptune Kitchen Tap Chrome", price: 189.00, unit: "each" },
    { name: "Fired Earth Limestone Tile", price: 52.00, unit: "per m²" },
  ]},
];


// ─── Initial Data ─────────────────────────────────────────────────────────────
const initialProperties = [
  {
    id: 1, name: "Hawthorne House", address: "14 Hawthorne Rd, London",
    type: "Full Renovation", completion: "Jun 2026", totalBudget: 85000,
    rooms: ["Kitchen", "Living Room", "Master Bedroom", "Bathroom 1", "Bathroom 2", "Guest Room", "Hallway", "Garden", "Whole Property"],
    tasks: [
      { id: 1, room: "Kitchen", task: "Remove old cabinets", status: "done", start: "2026-03-01", end: "2026-03-05", assignee: "Mike's Carpentry", pricingType: "materials", taskBudget: 500, labourCost: 0, labourQuoted: 0,
        materials: [{ id: 1, name: "Heavy-duty waste bags", qty: 4, unit: "pack", price: 8.99, quotedPrice: 9.50, url: "", retailer: "Screwfix", status: "delivered", imageUrl: "" }] },
      { id: 2, room: "Kitchen", task: "Install new flooring", status: "in-progress", start: "2026-03-06", end: "2026-03-12", assignee: "FloorPro", pricingType: "supply-fit", taskBudget: 2200, labourCost: 680, labourQuoted: 650, labourQuotes: [{ id: 1, contractorName: "FloorPro", amount: 650, note: "Includes removal of old floor", confirmed: true }, { id: 2, contractorName: "Quick Floors Ltd", amount: 720, note: "", confirmed: false }],
        materials: [
          { id: 1, name: "Karndean LVT Oak Flooring", qty: 14, unit: "m²", price: 34.99, quotedPrice: 34.99, url: "https://bq.com/karndean", retailer: "B&Q", status: "ordered", imageUrl: "" },
          { id: 2, name: "Underlay Roll 10m²", qty: 2, unit: "roll", price: 22.00, quotedPrice: 22.00, url: "https://wickes.co.uk/underlay", retailer: "Wickes", status: "to order", imageUrl: "" },
          { id: 3, name: "Threshold strip brushed brass", qty: 3, unit: "each", price: 14.50, quotedPrice: 12.00, url: "", retailer: "", status: "to order", imageUrl: "" },
        ] },
      { id: 3, room: "Bathroom 1", task: "Replumb shower", status: "in-progress", start: "2026-03-04", end: "2026-03-10", assignee: "AquaFix Plumbing", pricingType: "supply-fit", taskBudget: 800, labourCost: 420, labourQuoted: 420,
        materials: [
          { id: 1, name: "Copper Pipe 15mm × 3m", qty: 4, unit: "length", price: 12.40, quotedPrice: 11.20, url: "https://screwfix.com/copper", retailer: "Screwfix", status: "delivered", imageUrl: "" },
          { id: 2, name: "Silicone Sealant White", qty: 3, unit: "tube", price: 6.49, quotedPrice: 6.49, url: "https://screwfix.com/sealant", retailer: "Screwfix", status: "delivered", imageUrl: "" },
        ] },
      { id: 4, room: "Living Room", task: "Paint walls", status: "todo", start: "2026-03-15", end: "2026-03-18", assignee: "Self", pricingType: "labour", taskBudget: 300, labourCost: 0, labourQuoted: 300, materials: [] },
      { id: 5, room: "Master Bedroom", task: "Install wardrobe", status: "todo", start: "2026-03-20", end: "2026-03-25", assignee: "Mike's Carpentry", pricingType: "supply-fit", taskBudget: 1200, labourCost: 0, labourQuoted: 400, materials: [] },
      { id: 6, room: "Garden", task: "Lay new patio", status: "todo", start: "2026-04-01", end: "2026-04-10", assignee: "GreenScape", pricingType: "supply-fit", taskBudget: 3500, labourCost: 0, labourQuoted: 1200, labourQuotes: [{ id: 1, contractorName: "GreenScape", amount: 1200, note: "Natural yorkstone", confirmed: true }, { id: 2, contractorName: "Patio Kings", amount: 980, note: "Concrete slabs only", confirmed: false }, { id: 3, contractorName: "Garden Build Co", amount: 1450, note: "Premium porcelain, sealed", confirmed: false }], materialOptions: [{ id: 1, name: "Patio Slabs", confirmedOptionId: 2, options: [{ id: 1, name: "Yorkshire Sandstone 600×600", price: 42, qty: 18, unit: "m²", retailer: "Marshalls", url: "", note: "Natural, warm tone" }, { id: 2, name: "Porcelain Slate Grey 600×600", price: 35, qty: 18, unit: "m²", retailer: "Tile Giant", url: "", note: "Low maintenance" }, { id: 3, name: "Concrete Buff Riven 600×600", price: 22, qty: 18, unit: "m²", retailer: "Wickes", url: "", note: "Budget option" }] }], materials: [] },
      { id: 7, room: "Whole Property", task: "Full rewire", status: "todo", start: "2026-05-01", end: "2026-05-10", assignee: "Spark Electric", pricingType: "labour", taskBudget: 8000, labourCost: 0, labourQuoted: 7500, labourQuotes: [{ id: 1, contractorName: "Spark Electric", amount: 7500, note: "Full Part P cert included", confirmed: true }, { id: 2, contractorName: "City Electrical", amount: 6800, note: "No cert included", confirmed: false }, { id: 3, contractorName: "PowerUp Electrical", amount: 8200, note: "Premium, 5yr guarantee", confirmed: false }], materials: [] },
    ],
    otherCosts: [
      { id: 1, description: "Architect fees", quotedCost: 3500, actualCost: 3500 },
      { id: 2, description: "Planning permission", quotedCost: 800, actualCost: 0 },
      { id: 3, description: "Structural survey", quotedCost: 650, actualCost: 650 },
    ],
    contractors: [
      { id: 1, name: "Mike's Carpentry", trade: "Carpentry", phone: "07700 900123", email: "mike@mikescarpentry.co.uk", rating: 5, status: "active", contactStatus: "booked", rooms: ["Kitchen", "Master Bedroom"] },
      { id: 2, name: "AquaFix Plumbing", trade: "Plumbing", phone: "07700 900456", email: "hello@aquafix.co.uk", rating: 4, status: "active", contactStatus: "booked", rooms: ["Bathroom 1", "Bathroom 2"] },
      { id: 3, name: "FloorPro", trade: "Flooring", phone: "07700 900789", email: "info@floorpro.co.uk", rating: 5, status: "active", contactStatus: "booked", rooms: ["Kitchen", "Hallway"] },
      { id: 4, name: "GreenScape", trade: "Landscaping", phone: "07700 901234", email: "team@greenscape.co.uk", rating: 4, status: "pending", contactStatus: "quoted", rooms: ["Garden"] },
    ],
    moodBoards: {
      "Kitchen": { palette: [{ hex: "#F5F0E8", label: "Pointing", brand: "Farrow & Ball" }, { hex: "#2C2C2C", label: "Off-Black", brand: "Farrow & Ball" }, { hex: "#C4956A", label: "Dead Salmon", brand: "Farrow & Ball" }], notes: "Warm whites, matte black handles, oak accents.", images: [] },
      "Living Room": { palette: [{ hex: "#FAFAF8", label: "All White", brand: "Farrow & Ball" }, { hex: "#B8CAD4", label: "Livid", brand: "Little Greene" }], notes: "Neutral tones, linen sofa, statement lighting.", images: [] },
      "Master Bedroom": { palette: [{ hex: "#F8F4F0", label: "Wimborne White", brand: "Farrow & Ball" }, { hex: "#4A4A4A", label: "Lamp Black", brand: "Little Greene" }], notes: "Calm, clutter-free. Built-in wardrobe, linen bedding.", images: [] },
      "Bathroom 1": { palette: [{ hex: "#FFFFFF", label: "Strong White", brand: "Farrow & Ball" }, { hex: "#B5C4BE", label: "Pigeon", brand: "Farrow & Ball" }], notes: "Fluted tiles, brushed brass taps, freestanding bath.", images: [] },
    },
  },
  {
    id: 2, name: "The Old Rectory", address: "2 Church Lane, Oxford",
    type: "Kitchen & Bathrooms", completion: "Sep 2026", totalBudget: 28000,
    rooms: ["Kitchen", "Bathroom", "En Suite", "Utility Room", "Whole Property"],
    tasks: [
      { id: 1, room: "Kitchen", task: "Strip out old units", status: "done", start: "2026-02-10", end: "2026-02-14", assignee: "Self", pricingType: "labour", taskBudget: 200, labourCost: 0, labourQuoted: 200, materials: [] },
      { id: 2, room: "Kitchen", task: "Rewire appliances", status: "in-progress", start: "2026-02-15", end: "2026-02-20", assignee: "Spark Electric", pricingType: "labour", taskBudget: 600, labourCost: 0, labourQuoted: 600, materials: [] },
      { id: 3, room: "Bathroom", task: "Install new suite", status: "todo", start: "2026-04-01", end: "2026-04-10", assignee: "AquaFix Plumbing", pricingType: "supply-fit", taskBudget: 2800, labourCost: 0, labourQuoted: 900, materials: [] },
    ],
    otherCosts: [
      { id: 1, description: "Design consultation", quotedCost: 500, actualCost: 500 },
    ],
    contractors: [
      { id: 1, name: "Spark Electric", trade: "Electrical", phone: "07700 902345", email: "info@sparkelectric.co.uk", rating: 5, status: "active", rooms: ["Kitchen"] },
      { id: 2, name: "AquaFix Plumbing", trade: "Plumbing", phone: "07700 900456", email: "hello@aquafix.co.uk", rating: 4, status: "pending", rooms: ["Bathroom", "En Suite"] },
    ],
    moodBoards: {
      "Kitchen": { palette: [{ hex: "#F0EBE3", label: "Clay", brand: "Little Greene" }, { hex: "#8B6F5E", label: "Drab", brand: "Little Greene" }], notes: "Shaker cabinets, butler sink, terracotta tiles.", images: [] },
      "Bathroom": { palette: [{ hex: "#F5F5F0", label: "Chalk", brand: "Coat" }], notes: "Roll-top bath, period fixtures, metro tiles.", images: [] },
    },
  },
];

const STATUS_COLORS = { done: "#4CAF50", "in-progress": "#FF9800", todo: "#9E9E9E" };
const UNITS = ["each","m²","m","m³","pack","roll","bag","box","sheet","length","litre","kg","ton","tube","pair","set","lot"];
const STATUS_LABELS = { done: "Done", "in-progress": "In Progress", todo: "To Do" };
const MAT_STATUS = { delivered: { bg: "#E8F5E9", color: "#2E7D32" }, ordered: { bg: "#E3F2FD", color: "#1565C0" }, "to order": { bg: "#FFF3E0", color: "#E65100" } };

// ─── Colour Picker ────────────────────────────────────────────────────────────
function ColourPicker({ current, onSave, onClose }) {
  const [mode, setMode] = useState("brands");
  const [brand, setBrand] = useState("Farrow & Ball");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(current || { hex: "#FFFFFF", label: "Custom", brand: "Custom" });
  const [hex, setHex] = useState(current?.hex || "#FFFFFF");

  const colours = search
    ? Object.entries(PAINT_BRANDS).flatMap(([b, cs]) => cs.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => ({ ...c, brand: b })))
    : (PAINT_BRANDS[brand] || []).map(c => ({ ...c, brand }));

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ width: 500, maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400 }}>Choose a Colour</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#999" }}>{"×"}</button>
        </div>
        <div className="toggle" style={{ marginBottom: 12 }}>
          {["brands", "custom"].map(m => <button key={m} className={`toggle-btn ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>{m === "brands" ? "Paint Brands" : "Custom"}</button>)}
        </div>
        {mode === "brands" && <>
          <input className="field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all colours…" style={{ marginBottom: 10 }} />
          {!search && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
            {Object.keys(PAINT_BRANDS).map(b => <button key={b} onClick={() => setBrand(b)} style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${brand === b ? "#1A1A1A" : "#DDD"}`, background: brand === b ? "#1A1A1A" : "white", color: brand === b ? "white" : "#555", fontSize: 11, cursor: "pointer" }}>{b}</button>)}
          </div>}
          <div style={{ overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
            {colours.map((c, i) => <div key={i} onClick={() => setSel({ hex: c.hex, label: c.name, brand: c.brand })} style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", border: `2px solid ${sel.hex === c.hex ? "#1A1A1A" : "transparent"}` }}>
              <div style={{ height: 40, background: c.hex }} />
              <div style={{ padding: "4px 6px", background: "white", borderTop: "1px solid #F0EDE8" }}>
                <div style={{ fontSize: 9.5, fontWeight: 500, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                {search && <div style={{ fontSize: 8.5, color: "#AAA" }}>{c.brand}</div>}
              </div>
            </div>)}
          </div>
        </>}
        {mode === "custom" && <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <input type="color" value={hex} onChange={e => { setHex(e.target.value); setSel({ hex: e.target.value, label: "Custom", brand: "Custom" }); }} style={{ width: 60, height: 60, borderRadius: 10, border: "1px solid #EEE", cursor: "pointer", padding: 2 }} />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Hex</label>
              <input className="field" value={hex} onChange={e => { setHex(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setSel({ hex: e.target.value, label: "Custom", brand: "Custom" }); }} style={{ fontFamily: "monospace" }} />
            </div>
          </div>
          <div style={{ height: 100, borderRadius: 10, background: sel.hex, border: "1px solid #EEE" }} />
        </div>}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #EEE", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: sel.hex, border: "1px solid #EEE", flexShrink: 0 }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{sel.label}</div>{sel.brand !== "Custom" && <div style={{ fontSize: 11, color: "#999" }}>{sel.brand}</div>}</div>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(sel)}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Modal ──────────────────────────────────────────────────────────────
function ImageModal({ onSave, onClose }) {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState(""); const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null); const [uploadData, setUploadData] = useState(null);
  const [error, setError] = useState(""); const fileRef = useRef();

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ width: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400 }}>Add Image</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#999" }}>{"×"}</button>
        </div>
        <div className="toggle" style={{ marginBottom: 12 }}>
          {["url", "upload"].map(t => <button key={t} className={`toggle-btn ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setPreview(null); setError(""); }}>{t === "url" ? "Paste URL" : "Upload"}</button>)}
        </div>
        {tab === "url"
          ? <div style={{ marginBottom: 12 }}><label className="label">Image URL</label><input className="field" value={url} onChange={e => { setUrl(e.target.value); setPreview(e.target.value); setError(""); }} placeholder="https://…" /></div>
          : <div style={{ marginBottom: 12 }}>
              <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #DDD", borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", background: "#FAFAF8" }}>
                <div style={{ fontSize: 26, marginBottom: 5 }}>{"📁"}</div><div style={{ fontSize: 13, color: "#888" }}>Click to choose a file</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { setUploadData(ev.target.result); setPreview(ev.target.result); }; r.readAsDataURL(f); }} style={{ display: "none" }} />
            </div>}
        {error && <div style={{ fontSize: 12, color: "#E53935", marginBottom: 8 }}>{error}</div>}
        {preview && <div style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden", border: "1px solid #EEE", height: 140 }}><img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setError("Could not load image.")} /></div>}
        <div style={{ marginBottom: 14 }}><label className="label">Caption (optional)</label><input className="field" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Kitchen inspiration" /></div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { const src = tab === "url" ? url : uploadData; if (!src) { setError("Please add an image."); return; } onSave({ src, caption }); }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared add-entry form ────────────────────────────────────────────────────
// isItem=true  → Name + Qty + Unit only (no price — that goes on options)
// isItem=false → Price / Retailer / Link / Note
function AddEntryForm({ isItem, unit = "each", onSave, onCancel }) {
  const blank = { name: "", qty: "1", unit, price: "", retailer: "", url: "", note: "" };
  const [v, setV] = useState(blank);
  const set = patch => setV(p => ({ ...p, ...patch }));

  if (isItem) {
    return (
      <div style={{ background: "#FAFAF8", border: "1px solid #EEEBE6", borderRadius: 10, padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 100px", gap: 8, marginBottom: 10 }}>
          <div><label className="label">Item name *</label><input className="field" autoFocus value={v.name} onChange={e => set({ name: e.target.value })} onKeyDown={e => e.key === "Enter" && v.name.trim() && onSave({ name: v.name.trim(), qty: Number(v.qty) || 1, unit: v.unit })} placeholder="e.g. Floor tiles" style={{ fontSize: 12 }} /></div>
          <div><label className="label">Qty</label><input type="number" className="field" min="0.01" step="0.01" value={v.qty} onChange={e => set({ qty: e.target.value })} style={{ fontSize: 12 }} /></div>
          <div><label className="label">Unit</label><select className="field" value={v.unit} onChange={e => set({ unit: e.target.value })} style={{ fontSize: 12 }}>{UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#AAA" }}>You{"'"}ll add pricing options next.</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
            <button className="btn-primary btn-sm" onClick={() => v.name.trim() && onSave({ name: v.name.trim(), qty: Number(v.qty) || 1, unit: v.unit })}>Add Item</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAFAF8", border: "1px solid #EEEBE6", borderRadius: 10, padding: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div><label className="label">Price / {unit} (£)</label><input type="number" className="field" autoFocus min="0" step="0.01" placeholder="0.00" value={v.price} onChange={e => set({ price: e.target.value })} style={{ fontSize: 12 }} /></div>
        <div><label className="label">Retailer</label><input className="field" placeholder="e.g. Screwfix" value={v.retailer} onChange={e => set({ retailer: e.target.value })} style={{ fontSize: 12 }} /></div>
        <div><label className="label">Link</label><input className="field" placeholder="https://…" value={v.url} onChange={e => set({ url: e.target.value })} style={{ fontSize: 12 }} /></div>
        <div><label className="label">Note</label><input className="field" placeholder="e.g. Matt finish" value={v.note} onChange={e => set({ note: e.target.value })} style={{ fontSize: 12 }} /></div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-primary btn-sm" onClick={() => { if (!v.price) return; onSave({ price: Number(v.price), retailer: v.retailer, url: v.url, note: v.note, imageUrl: "" }); }}>Add Option</button>
      </div>
    </div>
  );
}

// ─── Task Detail Modal ───────────────────────────────────────────────────────
//
// Data model for items:
//   item = { id, name, status, qty, unit, actualPrice, options: [option], confirmedOptionId }
//   option = { id, price, retailer, url, note }   ← price is per-unit
//
// An item with one option is a plain line item.
// An item with multiple options is a comparison — user picks one.
// Totals use the confirmedOption's price (or first option if only one).
//
function TaskModal({ task, onUpdate, onClose }) {
  const pt = task.pricingType || "materials";
  const hasLabour    = pt === "labour" || pt === "supply-fit" || pt === "materials-labour";
  const hasMaterials = pt === "materials" || pt === "materials-labour";

  // ── Migrate legacy data into unified items array ──────────────────────────
  const migrateItems = () => {
    // If task already has new-style items, use them
    if (task.items) return task.items;
    // Otherwise migrate from old materials + materialOptions
    const fromMats = (task.materials || []).map(m => ({
      id: m.id || Date.now() + Math.random(),
      name: m.name,
      status: m.status || "to order",
      qty: Number(m.qty) || 1,
      unit: m.unit || "each",
      actualPrice: Number(m.price) || 0,
      confirmedOptionId: "opt_only",
      options: [{ id: "opt_only", price: Number(m.quotedPrice) || Number(m.price) || 0, retailer: m.retailer || "", url: m.url || "", note: "" }],
    }));
    const fromOpts = (task.materialOptions || []).map(g => ({
      id: g.id,
      name: g.name,
      status: "to order",
      qty: (g.options[0] && Number(g.options[0].qty)) || 1,
      unit: (g.options[0] && g.options[0].unit) || "each",
      actualPrice: 0,
      confirmedOptionId: g.confirmedOptionId || null,
      options: g.options.map(o => ({ id: o.id, price: Number(o.price) || 0, retailer: o.retailer || "", url: o.url || "", note: o.note || "" })),
    }));
    // Dedupe by id
    const ids = new Set(fromMats.map(i => i.id));
    return [...fromMats, ...fromOpts.filter(i => !ids.has(i.id))];
  };

  const [items, setItems]           = useState(migrateItems);
  const [labourQuoted, setLabourQuoted] = useState(Number(task.labourQuoted) || 0);
  const [labourCost,   setLabourCost]   = useState(Number(task.labourCost)   || 0);
  const [labourQuotes, setLabourQuotes] = useState(task.labourQuotes || []);

  // Tabs
  const tabs = [
    ...(hasMaterials ? [{ id: "materials", label: "Materials" }] : []),
    ...(hasLabour    ? [{ id: "labour",    label: pt === "supply-fit" ? "Supply & Fit" : "Labour" }] : []),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "labour");

  // Add-item UI state
  const [showAddLQ, setShowAddLQ] = useState(false);
  const blankLQ = { contractorName: "", amount: "", note: "" };
  const [newLQ, setNewLQ] = useState(blankLQ);

  // Per-item expansion / adding options
  const [expandedItem, setExpandedItem] = useState(null);
  const [showAddOption, setShowAddOption] = useState(null); // item id
  const [showAddItem, setShowAddItem]    = useState(false);

  const f  = n => `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fv = n => { const v = Number(n); return (v >= 0 ? "+" : "") + `£${Math.abs(v).toFixed(2)}`; };

  // ── Commit ────────────────────────────────────────────────────────────────
  const commit = ({ it = items, lq = labourQuotes, lqd = labourQuoted, lc = labourCost } = {}) => {
    const confirmedLQ = lq.find(q => q.confirmed);
    onUpdate({ ...task, items: it, labourQuotes: lq, labourQuoted: confirmedLQ ? Number(confirmedLQ.amount) : lqd, labourCost: lc });
  };

  // ── Item price helper: use confirmed option price × qty ───────────────────
  const itemQuoted = item => {
    const opt = item.options.find(o => o.id === item.confirmedOptionId) || item.options[0];
    return opt ? Number(opt.price) * Number(item.qty) : 0;
  };
  const itemActual = item => item.actualPrice > 0 ? item.actualPrice * Number(item.qty) : itemQuoted(item);

  // Grand totals
  const totalMatQ = items.reduce((s, i) => s + itemQuoted(i), 0);
  const totalMatA = items.reduce((s, i) => s + itemActual(i), 0);
  const confirmedLQ = labourQuotes.find(q => q.confirmed);
  const pendingItems = items.filter(i => i.options.length === 0 || (i.options.length > 1 && !i.confirmedOptionId)).length;
  const pendingLabour = hasLabour && !confirmedLQ && labourQuotes.length > 0;

  // ── Add item / option via shared form ────────────────────────────────────
  const saveNewItem = ({ name, qty, unit }) => {
    const newId = Date.now();
    const item = { id: newId, name, status: "to order", qty: Number(qty) || 1, unit, actualPrice: 0, confirmedOptionId: null, options: [] };
    const next = [...items, item];
    setItems(next); setShowAddItem(false);
    setExpandedItem(newId); setShowAddOption(newId); // immediately prompt for first option
    commit({ it: next });
  };
  const saveNewOption = (itemId, { price, retailer, url, note, imageUrl }) => {
    const opt = { id: String(Date.now()), price: Number(price) || 0, retailer: retailer || "", url: url || "", note: note || "", imageUrl: imageUrl || "" };
    const next = items.map(i => i.id === itemId ? {
      ...i, options: [...i.options, opt],
      // auto-confirm if this is the first option
      confirmedOptionId: i.options.length === 0 ? opt.id : i.confirmedOptionId
    } : i);
    setItems(next); setShowAddOption(null); commit({ it: next });
  };
  const removeOption = (itemId, optId) => {
    const next = items.map(i => i.id === itemId ? {
      ...i, options: i.options.filter(o => o.id !== optId),
      confirmedOptionId: i.confirmedOptionId === optId ? null : i.confirmedOptionId
    } : i);
    setItems(next); commit({ it: next });
  };
  const confirmOption = (itemId, optId) => {
    const next = items.map(i => i.id === itemId ? { ...i, confirmedOptionId: i.confirmedOptionId === optId ? null : optId } : i);
    setItems(next); commit({ it: next });
  };
  const removeItem = (itemId) => {
    const next = items.filter(i => i.id !== itemId);
    setItems(next); commit({ it: next });
  };

  // ── Labour handlers ───────────────────────────────────────────────────────
  const confirmLQ = id => {
    const next = labourQuotes.map(q => ({ ...q, confirmed: q.id === id }));
    const conf = next.find(q => q.confirmed);
    setLabourQuotes(next); const lqd = conf ? Number(conf.amount) : labourQuoted; setLabourQuoted(lqd); commit({ lq: next, lqd });
  };
  const addLQ = () => {
    if (!newLQ.contractorName.trim() || !newLQ.amount) return;
    const next = [...labourQuotes, { ...newLQ, id: Date.now(), amount: Number(newLQ.amount), confirmed: false }];
    setLabourQuotes(next); setNewLQ(blankLQ); setShowAddLQ(false); commit({ lq: next });
  };
  const deleteLQ = id => { const next = labourQuotes.filter(q => q.id !== id); setLabourQuotes(next); commit({ lq: next }); };

  return (
    <div className="overlay" onClick={onClose}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: 780, maxWidth: "96vw", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexShrink: 0 }}>
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, fontWeight: 400, marginBottom: 2 }}>{task.task}</h3>
            <div style={{ fontSize: 12, color: "#888", display: "flex", gap: 12 }}>
              <span>{task.room}</span>{task.assignee && <span style={{ background: task.assignee === "Self" ? "#EEF4FF" : "#F0EDE8", color: task.assignee === "Self" ? "#3B6FD4" : "#555", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 500 }}>{task.assignee}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#999", cursor: "pointer", lineHeight: 1 }}>{"×"}</button>
        </div>

        {/* Tab bar */}
        {tabs.length > 1 && (
          <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #EEEBE6", flexShrink: 0 }}>
            {tabs.map(tb => {
              const badge = (tb.id === "materials" && pendingItems > 0) || (tb.id === "labour" && pendingLabour);
              return (
                <button key={tb.id} onClick={() => setActiveTab(tb.id)}
                  style={{ padding: "8px 18px", background: "none", border: "none", borderBottom: activeTab === tb.id ? "2px solid #1A1A1A" : "2px solid transparent", fontSize: 13, fontWeight: activeTab === tb.id ? 600 : 400, color: activeTab === tb.id ? "#1A1A1A" : "#888", cursor: "pointer", marginBottom: -1, display: "flex", alignItems: "center", gap: 6 }}>
                  {tb.label}
                  {badge && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E65100", display: "inline-block" }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1 }}>

          {/* ── MATERIALS TAB ── */}
          {activeTab === "materials" && (
            <div>
              {/* Item list */}
              {items.length === 0 && !showAddItem && (
                <div style={{ border: "2px dashed #EEE", borderRadius: 12, padding: "32px", textAlign: "center", color: "#BBB", fontSize: 13, marginBottom: 16 }}>
                  No items yet. Add a single item or one with multiple options to compare.
                </div>
              )}

              {items.map(item => {
                const confirmed = item.options.find(o => o.id === item.confirmedOptionId);
                const hasOptions = item.options.length > 0;
                const isMulti = item.options.length > 1;
                const isExpanded = expandedItem === item.id || showAddOption === item.id;
                const quotedTotal = itemQuoted(item);
                const actualTotal = item.actualPrice > 0 ? item.actualPrice * Number(item.qty) : 0;

                return (
                  <div key={item.id} style={{ border: `1px solid ${!hasOptions ? "#FED7AA" : "#EEEBE6"}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                    {/* Item header row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: isExpanded ? "#FAFAF8" : "white" }}>
                      {/* Expand toggle — only if has options */}
                      <button onClick={() => hasOptions && setExpandedItem(isExpanded ? null : item.id)}
                        style={{ background: "none", border: "none", color: hasOptions ? "#555" : "#DDD", cursor: hasOptions ? "pointer" : "default", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform .15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                        <span style={{ display: "inline-block", width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid currentColor" }} />
                      </button>

                      {/* Name — editable inline */}
                      <input value={item.name} onChange={e => updateItem(item.id, { name: e.target.value })}
                        style={{ flex: 1, fontWeight: 500, fontSize: 13, border: "none", outline: "none", background: "transparent", minWidth: 0 }} />

                      {/* Qty + unit */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <input type="number" min="0.01" step="0.01" value={item.qty} onChange={e => updateItem(item.id, { qty: Number(e.target.value) || 1 })}
                          style={{ width: 44, fontSize: 12, border: "1px solid #EEE", borderRadius: 5, padding: "2px 5px", background: "#FAFAF8", textAlign: "center" }} />
                        <select value={item.unit} onChange={e => updateItem(item.id, { unit: e.target.value })}
                          style={{ fontSize: 11, border: "1px solid #EEE", borderRadius: 5, padding: "2px 4px", background: "#FAFAF8" }}>
                          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>

                      {/* Price display */}
                      <div style={{ textAlign: "right", minWidth: 100, flexShrink: 0 }}>
                        {!hasOptions
                          ? <span style={{ fontSize: 11, color: "#E65100", fontWeight: 600 }}>no options yet</span>
                          : isMulti && !confirmed
                            ? <span style={{ fontSize: 11, color: "#E65100", fontWeight: 600 }}>choose option</span>
                            : <div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{f(quotedTotal)}</div>
                                {actualTotal > 0 && Math.abs(actualTotal - quotedTotal) >= 0.01 && (
                                  <div style={{ fontSize: 10, fontWeight: 600, color: actualTotal > quotedTotal ? "#E53935" : "#16A34A" }}>
                                    {actualTotal > quotedTotal ? "+" : ""}{fv(actualTotal - quotedTotal)} actual
                                  </div>
                                )}
                              </div>}
                      </div>

                      {/* Status */}
                      <select value={item.status} onChange={e => updateItem(item.id, { status: e.target.value })}
                        style={{ fontSize: 11, border: "1px solid #DDD", borderRadius: 6, padding: "2px 6px", background: "white", color: MAT_STATUS[item.status]?.color || "#555", flexShrink: 0 }}>
                        <option>to order</option><option>ordered</option><option>delivered</option>
                      </select>

                      {/* Add option + delete */}
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <button onClick={() => { setShowAddOption(item.id); setExpandedItem(item.id); }}
                          title="Add another option to compare" style={{ fontSize: 11, border: "1px solid #DEDBD6", borderRadius: 6, padding: "2px 8px", background: "white", color: "#555", cursor: "pointer" }}>
                          {hasOptions ? "+ option" : "+ add option"}
                        </button>
                        <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#CCC", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>{"✕"}</button>
                      </div>
                    </div>

                    {/* Options list (expanded) */}
                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #F0EDE8", background: "#FAFAF8" }}>
                        {[...item.options].sort((a, b) => Number(a.price) - Number(b.price)).map((opt, idx) => {
                          const isConf = item.confirmedOptionId === opt.id;
                          return (
                            <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 10px 44px", borderBottom: "1px solid #F0EDE8", background: isConf ? "#F0FDF4" : "transparent" }}>
                              <div style={{ width: 20, height: 20, borderRadius: "50%", background: isConf ? "#16A34A" : "#E8E4DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: isConf ? "white" : "#999", flexShrink: 0 }}>
                                {idx + 1}
                              </div>
                              {opt.imageUrl && (
                                <img src={opt.imageUrl} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 6, flexShrink: 0, background: "#EEE", border: "1px solid #E8E4DF" }} onError={e => e.target.style.display="none"} />
                              )}
                              <div style={{ flex: 1, fontSize: 12 }}>
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                  <span style={{ fontWeight: isConf ? 600 : 400, color: "#555" }}>
                                    {"£"}<input type="number" min="0" step="0.01" value={opt.price}
                                      onChange={e => { const next = items.map(i => i.id === item.id ? { ...i, options: i.options.map(o => o.id === opt.id ? { ...o, price: Number(e.target.value) || 0 } : o) } : i); setItems(next); commit({ it: next }); }}
                                      style={{ width: 70, fontSize: 12, fontWeight: isConf ? 600 : 400, border: "none", borderBottom: "1px solid #DDD", outline: "none", background: "transparent", padding: "0 2px" }} />
                                    <span style={{ fontSize: 10, color: "#AAA" }}> per {item.unit}</span>
                                  </span>
                                  <input value={opt.retailer} onChange={e => { const next = items.map(i => i.id === item.id ? { ...i, options: i.options.map(o => o.id === opt.id ? { ...o, retailer: e.target.value } : o) } : i); setItems(next); commit({ it: next }); }}
                                    placeholder="Retailer" style={{ fontSize: 11, border: "none", borderBottom: "1px solid #EEE", outline: "none", background: "transparent", color: "#777", width: 110 }} />
                                  <input value={opt.url} onChange={e => { const next = items.map(i => i.id === item.id ? { ...i, options: i.options.map(o => o.id === opt.id ? { ...o, url: e.target.value } : o) } : i); setItems(next); commit({ it: next }); }}
                                    placeholder="Link (optional)" style={{ fontSize: 11, border: "none", borderBottom: "1px solid #EEE", outline: "none", background: "transparent", color: "#888", flex: 1, minWidth: 80 }} />
                                  {opt.url && <a href={opt.url.startsWith("http") ? opt.url : "#"} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#888" }}>{"🔗"}</a>}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#333", marginTop: 2 }}>
                                  {f(Number(opt.price) * Number(item.qty))} total
                                </div>
                              </div>
                              <button onClick={() => confirmOption(item.id, opt.id)}
                                style={{ fontSize: 11, fontWeight: 600, border: "none", borderRadius: 7, padding: "4px 12px", background: isConf ? "#16A34A" : "#F0EDE8", color: isConf ? "white" : "#555", cursor: "pointer", flexShrink: 0 }}>
                                {isConf ? "✓ Chosen" : "Choose"}
                              </button>
                              {item.options.length > 1 && (
                                <button onClick={() => removeOption(item.id, opt.id)} style={{ background: "none", border: "none", color: "#CCC", fontSize: 14, cursor: "pointer", flexShrink: 0 }}>{"✕"}</button>
                              )}
                            </div>
                          );
                        })}

                        {/* Actual price row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 44px" }}>
                          <span style={{ fontSize: 11, color: "#888", minWidth: 100 }}>Actual paid (per {item.unit})</span>
                          <span style={{ fontSize: 12, color: "#AAA" }}>{"£"}</span>
                          <input type="number" min="0" step="0.01" value={item.actualPrice || ""} onChange={e => updateItem(item.id, { actualPrice: Number(e.target.value) || 0 })}
                            placeholder="0.00" style={{ width: 80, fontSize: 12, border: "1px solid #EEE", borderRadius: 5, padding: "3px 6px", background: "white" }} />
                          <span style={{ fontSize: 11, color: "#AAA" }}>× {item.qty} = {item.actualPrice > 0 ? f(item.actualPrice * Number(item.qty)) : "—"}</span>
                        </div>

                        {/* Add option form */}
                        {showAddOption === item.id && (
                          <div style={{ padding: "12px 14px 14px 44px", borderTop: "1px solid #F0EDE8" }}>
                            <AddEntryForm isItem={false} unit={item.unit}
                              onSave={entry => saveNewOption(item.id, entry)}
                              onCancel={() => setShowAddOption(null)} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add item form */}
              {showAddItem ? (
                <div style={{ marginBottom: 10 }}>
                  <AddEntryForm isItem={true} unit="each"
                    onSave={saveNewItem}
                    onCancel={() => setShowAddItem(false)} />
                </div>
              ) : (
                <button className="btn-ghost" onClick={() => setShowAddItem(true)} style={{ width: "100%", textAlign: "center", marginBottom: 10 }}>+ Add item</button>
              )}

              {/* Totals footer */}
              {items.length > 0 && (
                <div style={{ borderTop: "2px solid #EEEBE6", paddingTop: 12, display: "flex", justifyContent: "flex-end", gap: 24, fontSize: 13 }}>
                  <span style={{ color: "#888" }}>Quoted: <strong style={{ color: "#1A1A1A" }}>{f(totalMatQ)}</strong></span>
                  {totalMatA !== totalMatQ && <span style={{ color: "#888" }}>Actual: <strong style={{ color: totalMatA > totalMatQ ? "#E53935" : "#16A34A" }}>{f(totalMatA)}</strong></span>}
                </div>
              )}
            </div>
          )}

          {/* ── LABOUR TAB ── */}
          {activeTab === "labour" && (
            <div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-end", padding: "16px 18px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0", marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#166534", marginBottom: 2 }}>{pt === "supply-fit" ? "All-in price (supply & fit)" : "Labour cost"}</div>
                  <div style={{ fontSize: 11, color: "#6EE7B7" }}>Enter the agreed quote and actual invoice once received</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6EE7B7", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Quoted</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>{"£"}</span>
                    <input type="number" min="0" step="0.01" value={labourQuoted || ""} onChange={e => { const v = Number(e.target.value) || 0; setLabourQuoted(v); commit({ lqd: v }); }} placeholder="0.00"
                      style={{ width: 90, fontSize: 14, fontWeight: 600, border: "1px solid #BBF7D0", borderRadius: 6, padding: "5px 8px", background: "white" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6EE7B7", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Actual</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>{"£"}</span>
                    <input type="number" min="0" step="0.01" value={labourCost || ""} onChange={e => { const v = Number(e.target.value) || 0; setLabourCost(v); commit({ lc: v }); }} placeholder="0.00"
                      style={{ width: 90, fontSize: 14, fontWeight: 600, border: "1px solid #BBF7D0", borderRadius: 6, padding: "5px 8px", background: "white" }} />
                  </div>
                </div>
                {labourQuoted > 0 && labourCost > 0 && Math.abs(labourCost - labourQuoted) >= 0.01 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: labourCost > labourQuoted ? "#E53935" : "#16A34A", paddingBottom: 6 }}>
                    {labourCost > labourQuoted ? "+" : ""}{fv(labourCost - labourQuoted)}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
                  Contractor Quotes
                  <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 11, color: "#AAA" }}>sorted cheapest first</span>
                </div>
                {!showAddLQ && <button className="btn-ghost btn-sm" onClick={() => setShowAddLQ(true)}>+ Add quote</button>}
              </div>

              {labourQuotes.length === 0 && !showAddLQ && (
                <div style={{ border: "2px dashed #EEE", borderRadius: 10, padding: "24px", textAlign: "center", color: "#BBB", fontSize: 13 }}>
                  Add contractor quotes to compare prices.
                </div>
              )}

              {[...labourQuotes].sort((a, b) => Number(a.amount) - Number(b.amount)).map((q, i) => (
                <div key={q.id} style={{ border: q.confirmed ? "2px solid #1A1A1A" : "1px solid #EEEBE6", borderRadius: 10, padding: "12px 14px", marginBottom: 8, background: q.confirmed ? "#FAFAF8" : "white", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: q.confirmed ? "#1A1A1A" : "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: q.confirmed ? "white" : "#999", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{q.contractorName}</div>{q.note && <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{q.note}</div>}</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{f(q.amount)}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => confirmLQ(q.id)} style={{ fontSize: 11, fontWeight: 600, border: "none", borderRadius: 7, padding: "5px 12px", background: q.confirmed ? "#1A1A1A" : "#F0EDE8", color: q.confirmed ? "white" : "#555", cursor: "pointer" }}>
                      {q.confirmed ? "✓ Booked" : "Use this"}
                    </button>
                    <button onClick={() => deleteLQ(q.id)} style={{ background: "none", border: "none", color: "#CCC", fontSize: 16, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>{"✕"}</button>
                  </div>
                </div>
              ))}

              {showAddLQ && (
                <div style={{ border: "1px solid #EEEBE6", borderRadius: 10, padding: 14, background: "#FAFAF8", marginTop: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div><label className="label">Contractor name</label><input className="field" autoFocus placeholder="e.g. FloorPro Ltd" value={newLQ.contractorName} onChange={e => setNewLQ(p => ({ ...p, contractorName: e.target.value }))} /></div>
                    <div><label className="label">Quote amount (£)</label><input type="number" className="field" min="0" step="0.01" placeholder="0.00" value={newLQ.amount} onChange={e => setNewLQ(p => ({ ...p, amount: e.target.value }))} /></div>
                  </div>
                  <div style={{ marginBottom: 10 }}><label className="label">Note (optional)</label><input className="field" placeholder="e.g. Includes waste removal" value={newLQ.note} onChange={e => setNewLQ(p => ({ ...p, note: e.target.value }))} /></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-primary btn-sm" onClick={addLQ}>Add Quote</button>
                    <button className="btn-ghost btn-sm" onClick={() => { setShowAddLQ(false); setNewLQ(blankLQ); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div style={{ paddingTop: 14, marginTop: 8, borderTop: "1px solid #EEE", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


// ─── Moodboard Canvas ─────────────────────────────────────────────────────────
function MoodboardCanvas({ mb, onUpdate }) {
  const canvasRef = useRef(null);
  const itemsRef = useRef(mb.canvasItems || []);
  const [items, setItems] = useState(() => mb.canvasItems || []);
  const [selected, setSelected] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [showAddText, setShowAddText] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Viewport state — all in refs to avoid re-render storms during pan/zoom
  const zoom = useRef(1);
  const pan = useRef({ x: 0, y: 0 });
  const layerRef = useRef(null);
  const [zoomDisplay, setZoomDisplay] = useState(1);

  // Gesture refs
  const gesture = useRef(null);
  const selectedRef = useRef(null);
  const spaceDown = useRef(false);

  useEffect(() => {
    const next = mb.canvasItems || [];
    itemsRef.current = next;
    setItems(next);
    setSelected(null);
    selectedRef.current = null;
  }, [mb]);

  const applyTransform = () => {
    if (layerRef.current) {
      layerRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px) scale(${zoom.current})`;
    }
  };

  const commit = () => { const next = [...itemsRef.current]; onUpdate(next); setItems(next); };
  const save   = (next) => { itemsRef.current = next; setItems(next); onUpdate(next); };

  // ── Keyboard: space for pan mode ─────────────────────────────────────────
  useEffect(() => {
    const kd = e => { if (e.code === "Space" && !e.target.matches("textarea,input")) { e.preventDefault(); spaceDown.current = true; if (canvasRef.current) canvasRef.current.style.cursor = "grab"; } };
    const ku = e => { if (e.code === "Space") { spaceDown.current = false; if (canvasRef.current) canvasRef.current.style.cursor = "default"; } };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, []);

  // ── Wheel to zoom (centred on cursor) ────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY < 0 ? 1.08 : 0.93;
      const nextZoom = Math.min(4, Math.max(0.2, zoom.current * delta));
      // Adjust pan so zoom is centred on cursor
      pan.current = {
        x: mx - (mx - pan.current.x) * (nextZoom / zoom.current),
        y: my - (my - pan.current.y) * (nextZoom / zoom.current),
      };
      zoom.current = nextZoom;
      applyTransform();
      setZoomDisplay(Math.round(nextZoom * 100));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ── Global pointer move / up ──────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const g = gesture.current;
      if (!g) return;
      g.moved = true;

      if (g.type === "pan") {
        pan.current = { x: pan.current.x + e.clientX - g.lastX, y: pan.current.y + e.clientY - g.lastY };
        g.lastX = e.clientX; g.lastY = e.clientY;
        applyTransform();
        return;
      }

      if (g.type === "drag") {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        // Convert screen coords to canvas space (account for pan + zoom)
        const cx = (e.clientX - rect.left - pan.current.x) / zoom.current;
        const cy = (e.clientY - rect.top  - pan.current.y) / zoom.current;
        const x = cx - g.offsetX;
        const y = cy - g.offsetY;
        itemsRef.current = itemsRef.current.map(i => i.id === g.id ? { ...i, x, y } : i);
        setItems([...itemsRef.current]);
        return;
      }

      if (g.type === "resize") {
        const w = Math.max(60, g.startW + (e.clientX - g.startX) / zoom.current);
        const h = Math.max(40, g.startH + (e.clientY - g.startY) / zoom.current);
        itemsRef.current = itemsRef.current.map(i => i.id === g.id ? { ...i, w, h } : i);
        setItems([...itemsRef.current]);
      }
    };

    const onUp = () => {
      if (gesture.current?.moved && gesture.current.type !== "pan") commit();
      if (canvasRef.current && gesture.current?.type === "pan" && !spaceDown.current) canvasRef.current.style.cursor = "default";
      gesture.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);

  // ── Canvas pointer down: pan or deselect ─────────────────────────────────
  const handleCanvasPointerDown = (e) => {
    const isBackground = e.target === canvasRef.current || e.target === layerRef.current;
    if (spaceDown.current || e.button === 1 || (isBackground && e.altKey)) {
      e.preventDefault();
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
      gesture.current = { type: "pan", lastX: e.clientX, lastY: e.clientY, moved: false };
      return;
    }
    if (isBackground) {
      selectedRef.current = null;
      setSelected(null);
    }
  };

  // ── Item pointer down: drag ───────────────────────────────────────────────
  const handleItemPointerDown = (e, id) => {
    if (e.target.dataset.resize) return;
    if (spaceDown.current) return; // let canvas handle pan
    e.preventDefault();
    e.stopPropagation();

    selectedRef.current = id;
    setSelected(id);

    const rect = canvasRef.current.getBoundingClientRect();
    const item = itemsRef.current.find(i => i.id === id);
    // Convert mouse pos to canvas space
    const cx = (e.clientX - rect.left - pan.current.x) / zoom.current;
    const cy = (e.clientY - rect.top  - pan.current.y) / zoom.current;
    gesture.current = { type: "drag", id, offsetX: cx - item.x, offsetY: cy - item.y, moved: false };

    // Bring to front
    const next = [...itemsRef.current.filter(i => i.id !== id), item];
    itemsRef.current = next;
    setItems([...next]);
  };

  // ── Resize handle ─────────────────────────────────────────────────────────
  const handleResizePointerDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const item = itemsRef.current.find(i => i.id === id);
    gesture.current = { type: "resize", id, startX: e.clientX, startY: e.clientY, startW: item.w, startH: item.h, moved: false };
  };

  // ── Zoom controls ─────────────────────────────────────────────────────────
  const zoomTo = (factor) => {
    zoom.current = Math.min(4, Math.max(0.2, zoom.current * factor));
    applyTransform();
    setZoomDisplay(Math.round(zoom.current * 100));
  };
  const resetView = () => { zoom.current = 1; pan.current = { x: 0, y: 0 }; applyTransform(); setZoomDisplay(100); };

  // ── Add / edit / delete ───────────────────────────────────────────────────
  const addSwatch = (colour) => save([...itemsRef.current, { id: Date.now(), type: "swatch", hex: colour.hex, label: colour.label, brand: colour.brand, x: 40 + Math.random() * 300, y: 40 + Math.random() * 200, w: 110, h: 110 }]);
  const addImage  = (img)    => save([...itemsRef.current, { id: Date.now(), type: "image",  src: img.src, caption: img.caption, x: 60 + Math.random() * 260, y: 60 + Math.random() * 180, w: 220, h: 160 }]);
  const addText   = ()       => {
    if (!textInput.trim()) return;
    save([...itemsRef.current, { id: Date.now(), type: "text", text: textInput.trim(), x: 80 + Math.random() * 200, y: 80 + Math.random() * 160, w: 200, h: 60 }]);
    setTextInput(""); setShowAddText(false);
  };
  const deleteSelected = () => { save(itemsRef.current.filter(i => i.id !== selectedRef.current)); setSelected(null); selectedRef.current = null; };
  const bringForward = () => {
    const idx = itemsRef.current.findIndex(i => i.id === selectedRef.current);
    if (idx < itemsRef.current.length - 1) { const next = [...itemsRef.current]; [next[idx], next[idx+1]] = [next[idx+1], next[idx]]; save(next); }
  };
  const sendBack = () => {
    const idx = itemsRef.current.findIndex(i => i.id === selectedRef.current);
    if (idx > 0) { const next = [...itemsRef.current]; [next[idx], next[idx-1]] = [next[idx-1], next[idx]]; save(next); }
  };

  const selItem = items.find(i => i.id === selected);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Sidebar */}
      <div style={{ width: 180, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Palette</div>
          {mb.palette.length === 0
            ? <p style={{ fontSize: 11, color: "#CCC" }}>No colours — add in Library view</p>
            : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {mb.palette.map((c, i) => (
                  <div key={i} title={c.label + (c.brand ? " · " + c.brand : "")} onClick={() => addSwatch(c)}
                    style={{ width: 32, height: 32, borderRadius: 6, background: c.hex, cursor: "pointer", border: "2px solid transparent", transition: "transform .12s, border-color .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.borderColor = "#1A1A1A"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "transparent"; }} />
                ))}
              </div>}
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Images</div>
          {mb.images.length === 0
            ? <p style={{ fontSize: 11, color: "#CCC" }}>No images — add in Library view</p>
            : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mb.images.map((img, i) => (
                  <div key={i} onClick={() => addImage(img)}
                    style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", height: 48, border: "1px solid #EEE", transition: "opacity .12s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>}
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Text</div>
          {showAddText
            ? <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <textarea className="field" value={textInput} onChange={e => setTextInput(e.target.value)} rows={2} placeholder="Type something..." style={{ fontSize: 12, resize: "none" }} autoFocus />
                <div style={{ display: "flex", gap: 5 }}>
                  <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { setShowAddText(false); setTextInput(""); }}>Cancel</button>
                  <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={addText}>Add</button>
                </div>
              </div>
            : <button className="btn-ghost btn-sm" style={{ width: "100%" }} onClick={() => setShowAddText(true)}>+ Add text</button>}
        </div>
        {selItem && (
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Selected</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button className="btn-ghost btn-sm" onClick={bringForward}>Bring forward</button>
              <button className="btn-ghost btn-sm" onClick={sendBack}>Send back</button>
              {selItem.type === "text" && !editingText && (
                <button className="btn-ghost btn-sm" onClick={() => setEditingText(selItem.id)}>Edit text</button>
              )}
              <button onClick={deleteSelected} style={{ background: "none", border: "1px solid #FFCDD2", color: "#E53935", borderRadius: 8, padding: "4px 11px", fontSize: 12, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        )}
      </div>

      {/* Canvas column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Zoom toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 11, color: "#AAA" }}>Hold Space to pan</span>
          <div style={{ width: 1, height: 14, background: "#DDD", margin: "0 4px" }} />
          <button className="btn-ghost btn-sm" onClick={() => zoomTo(0.8)} style={{ width: 28, padding: 0, textAlign: "center" }}>{"−"}</button>
          <button onClick={resetView} style={{ fontSize: 11, fontWeight: 600, color: "#555", background: "none", border: "1px solid #DDD", borderRadius: 6, padding: "3px 8px", cursor: "pointer", minWidth: 48, textAlign: "center" }}>{zoomDisplay}{"%"}</button>
          <button className="btn-ghost btn-sm" onClick={() => zoomTo(1.25)} style={{ width: 28, padding: 0, textAlign: "center" }}>{"+"}</button>
        </div>

        {/* Canvas */}
        <div ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          style={{ width: "100%", height: 580, background: "#F9F7F4", borderRadius: 14, border: "1px solid #EEEBE6", position: "relative", overflow: "hidden", cursor: "default", backgroundImage: "radial-gradient(#E8E4DF 1px, transparent 1px)", backgroundSize: "24px 24px", touchAction: "none" }}>

          {/* Transform layer — all items live here */}
          <div ref={layerRef} style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, transformOrigin: "0 0", willChange: "transform" }}>
            {items.map((item) => {
              const isSel = item.id === selected;
              return (
                <div key={item.id}
                  onPointerDown={(e) => handleItemPointerDown(e, item.id)}
                  style={{ position: "absolute", left: item.x, top: item.y, width: item.w, height: item.type === "text" ? "auto" : item.h,
                    outline: isSel ? "2px solid #1A1A1A" : "none", outlineOffset: 2,
                    boxShadow: isSel ? "0 4px 24px rgba(0,0,0,.18)" : "0 2px 12px rgba(0,0,0,.08)",
                    borderRadius: item.type === "swatch" ? 10 : item.type === "text" ? 4 : 8,
                    cursor: spaceDown.current ? "inherit" : "grab",
                    userSelect: "none", zIndex: isSel ? 100 : items.indexOf(item) + 1, touchAction: "none" }}>

                  {item.type === "swatch" && (
                    <div style={{ width: "100%", height: "100%", borderRadius: 10, background: item.hex, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: 8 }}>
                      <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 5, padding: "3px 7px", textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.2 }}>{item.label}</div>
                        {item.brand && item.brand !== "Custom" && <div style={{ fontSize: 9, color: "#666" }}>{item.brand}</div>}
                      </div>
                    </div>
                  )}

                  {item.type === "image" && (
                    <div style={{ width: "100%", height: "100%", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                      <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }} />
                      {item.caption && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,.55))", padding: "16px 8px 6px", fontSize: 10, color: "white" }}>{item.caption}</div>
                      )}
                    </div>
                  )}

                  {item.type === "text" && (
                    editingText === item.id
                      ? <textarea autoFocus value={item.text}
                          onChange={e => { itemsRef.current = itemsRef.current.map(i => i.id === item.id ? { ...i, text: e.target.value } : i); setItems([...itemsRef.current]); }}
                          onBlur={() => { commit(); setEditingText(null); }}
                          onPointerDown={e => e.stopPropagation()}
                          style={{ width: "100%", minHeight: 40, border: "none", outline: "none", background: "white", borderRadius: 4, padding: "6px 8px", fontSize: 16, fontFamily: "inherit", resize: "both" }} />
                      : <div onDoubleClick={() => setEditingText(item.id)}
                          style={{ padding: "6px 10px", fontSize: 16, fontFamily: "'DM Serif Display',serif", color: "#1A1A1A", lineHeight: 1.4, background: "rgba(255,255,255,0.92)", borderRadius: 4, minHeight: 36, whiteSpace: "pre-wrap" }}>
                          {item.text}
                        </div>
                  )}

                  {isSel && item.type !== "text" && (
                    <div data-resize="true"
                      onPointerDown={(e) => handleResizePointerDown(e, item.id)}
                      style={{ position: "absolute", bottom: -5, right: -5, width: 14, height: 14, background: "#1A1A1A", borderRadius: "50%", cursor: "se-resize", zIndex: 10, touchAction: "none" }} />
                  )}
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
              <div style={{ fontSize: 28, opacity: 0.3 }}>{"✦"}</div>
              <div style={{ fontSize: 13, color: "#BBB" }}>Click colours or images from the sidebar to place them</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function RenovationApp({ initialData, onSave }) {
  const startProps = initialData || initialProperties;
  const [props_, setProps_] = useState(startProps);
  const [propId, setPropId] = useState((startProps.find(p => !p.archived) ?? startProps[0])?.id ?? 1);

  // Debounced save — fires 800ms after last change
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!onSave) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onSave(props_), 800);
    return () => clearTimeout(saveTimer.current);
  }, [props_]);
  const [tab, setTab] = useState("dashboard");
  const [roomFilter, setRoomFilter] = useState("All");
  const [budgetRoomFilter, setBudgetRoomFilter] = useState("All");
  const [matRoomFilter, setMatRoomFilter] = useState("All");
  const [selRoom, setSelRoom] = useState("Kitchen");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showPropDrop, setShowPropDrop] = useState(false);
  const [showAddProp, setShowAddProp] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [editPropData, setEditPropData] = useState(null);
  const [confirmDeleteProp, setConfirmDeleteProp] = useState(false);
  const [confirmArchiveProp, setConfirmArchiveProp] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notesVal, setNotesVal] = useState("");
  const [colourPickerIdx, setColourPickerIdx] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [taskModal, setTaskModal] = useState(null);
  const [editTaskData, setEditTaskData] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [designView, setDesignView] = useState("library"); // "library" | "canvas"
  const [conView, setConView] = useState("booked");
  const [newTask, setNewTask] = useState({ room: "", task: "", status: "todo", start: "", end: "", assignee: "", taskBudget: "" });
  const [newBudget, setNewBudget] = useState({ room: "", category: "Labour", description: "", budgeted: "", spent: "" });
  const [newProp, setNewProp] = useState({ name: "", address: "", type: "Full Renovation", completion: "", rooms: [], totalBudget: "", postcode: "", addressLine: "", postcodeResults: [], postcodeLoading: false, postcodeError: "", customRoom: "" });
  const dropRef = useRef();

  const prop = props_.find(p => p.id === propId);

  const switchProp = id => {
    const p = props_.find(x => x.id === id);
    setPropId(id); setRoomFilter("All"); setMatRoomFilter("All");
    setSelRoom(p?.moodBoards ? Object.keys(p.moodBoards)[0] : null);
    setShowPropDrop(false); setTab("dashboard");
  };

  const deleteProp = (id, e) => {
    if (e) e.stopPropagation();
    if (props_.length <= 1) return;
    if (!window.confirm("Delete this property and all its data? This cannot be undone.")) return;
    const next = props_.filter(p => p.id !== id);
    setProps_(next);
    if (propId === id) switchProp(next[0].id);
    setShowPropDrop(false);
  };

  const openEditProp = (p, e) => {
    e.stopPropagation();
    setShowPropDrop(false);
    setConfirmDeleteProp(false);
    setConfirmArchiveProp(false);
    const parts = p.address ? p.address.split(" ") : [];
    setEditPropData({
      id: p.id,
      name: p.name || "",
      type: p.type || "Full Renovation",
      addressLine: p.address || "",
      postcode: "",
      completion: p.completion || "",
      totalBudget: p.totalBudget || "",
      rooms: (p.rooms || []).filter(r => r !== "Whole Property"),
      customRoom: "",
      postcodeLoading: false,
      postcodeError: "",
    });
  };

  const saveEditProp = () => {
    if (!editPropData?.name) return;
    const baseRooms = editPropData.rooms.length > 0 ? editPropData.rooms : ["Room 1"];
    const rooms = baseRooms.includes("Whole Property") ? baseRooms : [...baseRooms, "Whole Property"];
    const address = editPropData.addressLine || "";
    setProps_(prev => prev.map(p => p.id === editPropData.id ? {
      ...p,
      name: editPropData.name,
      type: editPropData.type,
      address,
      completion: editPropData.completion,
      totalBudget: Number(editPropData.totalBudget) || 0,
      rooms,
      // Add moodboards for any new rooms, keep existing ones
      moodBoards: {
        ...Object.fromEntries(rooms.filter(r => r !== "Whole Property").map(r => [r, p.moodBoards?.[r] || { palette: [], notes: "", images: [] }])),
      },
    } : p));
    setEditPropData(null);
  };

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowPropDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const updProp = fn => setProps_(prev => prev.map(p => p.id === propId ? { ...p, ...fn(p) } : p));
  const updTask = t => updProp(p => ({ tasks: p.tasks.map(x => x.id === t.id ? t : x) }));
  const updMB = (room, fn) => updProp(p => ({ moodBoards: { ...p.moodBoards, [room]: { ...p.moodBoards[room], ...fn(p.moodBoards[room]) } } }));

  const activeProps   = props_.filter(p => !p.archived);
  const archivedProps = props_.filter(p => p.archived);
  const isReadOnly    = !!prop?.archived;

  // ── Cost roll-up from tasks ──────────────────────────────────────────────────
  // Item price helpers (mirrors TaskModal logic)
  const itemQuotedCost = item => {
    const opt = (item.options || []).find(o => o.id === item.confirmedOptionId) || (item.options || [])[0];
    return opt ? Number(opt.price) * Number(item.qty) : 0;
  };
  const itemActualCost = item => item.actualPrice > 0 ? item.actualPrice * Number(item.qty) : itemQuotedCost(item);

  const taskCosts = prop.tasks.map(t => {
    const pt = t.pricingType || "materials";
    const hasMatCost = pt === "materials" || pt === "materials-labour";
    const hasLabCost = pt === "labour" || pt === "supply-fit" || pt === "materials-labour";
    // Use new items array if present, else fall back to legacy materials
    let matQ = 0, matA = 0;
    if (t.items) {
      matQ = t.items.reduce((s, i) => s + itemQuotedCost(i), 0);
      matA = t.items.reduce((s, i) => s + itemActualCost(i), 0);
    } else {
      matQ = (t.materials || []).reduce((s, m) => s + (Number(m.quotedPrice) || Number(m.price) || 0) * Number(m.qty), 0);
      matA = (t.materials || []).reduce((s, m) => s + Number(m.price) * Number(m.qty), 0);
    }
    const labQ = Number(t.labourQuoted) || 0;
    const labA = Number(t.labourCost) || 0;
    const totalQ = (hasMatCost ? matQ : 0) + (hasLabCost ? labQ : 0);
    const totalA = (hasMatCost ? matA : 0) + (hasLabCost ? labA : 0);
    const hasActual = labA > 0 || (matA > 0 && Math.abs(matA - matQ) > 0.005);
    return { ...t, pt, matQ, matA, labQ, labA, totalQ, totalA, hasActual, hasMatCost, hasLabCost };
  });

  // Roll up tasks by room
  const roomCosts = {};
  taskCosts.forEach(t => {
    if (!roomCosts[t.room]) roomCosts[t.room] = { quoted: 0, actual: 0 };
    roomCosts[t.room].quoted += t.totalQ;
    roomCosts[t.room].actual += t.totalA;
  });

  // Other costs (non-task: surveys, architect fees etc.)
  const otherCosts = prop.otherCosts || [];
  const otherQuoted = otherCosts.reduce((s, c) => s + (Number(c.quotedCost) || 0), 0);
  const otherActual = otherCosts.reduce((s, c) => s + (Number(c.actualCost) || 0), 0);

  // Grand totals
  const totalQuoted = taskCosts.reduce((s, t) => s + t.totalQ, 0) + otherQuoted;
  const totalActual = taskCosts.reduce((s, t) => s + t.totalA, 0) + otherActual;
  const overallBudget = Number(prop.totalBudget) || 0;

  // Legacy aliases used elsewhere in the component
  const totalBudgeted = totalQuoted;
  const totalSpent = totalActual;

  const f = n => `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fd = n => `£${Number(n).toFixed(2)}`;
  const pct = (a, b) => b === 0 ? 0 : Math.round((a / b) * 100);
  const doneTasks = prop.tasks.filter(t => t.status === "done").length;
  const inProg = prop.tasks.filter(t => t.status === "in-progress").length;
  const activeCon = prop.contractors.filter(c => c.status === "active").length;

  // Flatten all items across tasks for status counts (supports both new items[] and legacy materials[])
  const allMats = prop.tasks.flatMap(t => {
    if (t.items) return t.items.map(i => ({ ...i, price: itemActualCost(i) / Math.max(Number(i.qty), 1), taskName: t.task, room: t.room, taskId: t.id }));
    return (t.materials || []).map(m => ({ ...m, taskName: t.task, room: t.room, taskId: t.id }));
  });
  const filtMats = matRoomFilter === "All" ? allMats : allMats.filter(m => m.room === matRoomFilter);
  const totalMatCost = allMats.reduce((s, m) => s + Number(m.price) * Number(m.qty), 0);
  const toOrderCost = allMats.filter(m => m.status === "to order").reduce((s, m) => s + Number(m.price) * Number(m.qty), 0);

  const filtTasks = roomFilter === "All" ? prop.tasks : prop.tasks.filter(t => t.room === roomFilter);
  const mb = selRoom && prop.moodBoards[selRoom];

  const PROP_TYPES = ["Full Renovation", "Kitchen & Bathrooms", "Extension", "Loft Conversion", "Refurbishment", "New Build", "Cosmetic Update", "Other"];
  const COMMON_ROOMS = ["Kitchen", "Living Room", "Dining Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom", "En Suite", "Shower Room", "Utility Room", "Hallway", "Garden", "Garage", "Loft", "Basement", "Office"];

  const lookupPostcode = async () => {
    const pc = newProp.postcode.trim().replace(/\s+/g, "").toUpperCase();
    if (!pc) return;
    setNewProp(p => ({ ...p, postcodeLoading: true, postcodeError: "", postcodeResults: [] }));
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${pc}`);
      const data = await res.json();
      if (data.status === 200) {
        const r = data.result;
        const address = `${r.admin_ward}, ${r.admin_district}, ${r.region}`;
        setNewProp(p => ({ ...p, addressLine: address, postcodeLoading: false }));
      } else {
        setNewProp(p => ({ ...p, postcodeError: "Postcode not found", postcodeLoading: false }));
      }
    } catch {
      setNewProp(p => ({ ...p, postcodeError: "Lookup failed", postcodeLoading: false }));
    }
  };

  const toggleRoom = room => setNewProp(p => ({ ...p, rooms: p.rooms.includes(room) ? p.rooms.filter(r => r !== room) : [...p.rooms, room] }));

  const addCustomRoom = () => {
    const r = newProp.customRoom.trim();
    if (r && !newProp.rooms.includes(r)) setNewProp(p => ({ ...p, rooms: [...p.rooms, r], customRoom: "" }));
  };

  const addProp = () => {
    if (!newProp.name) return;
    const baseRooms = newProp.rooms.length > 0 ? newProp.rooms : ["Room 1"];
    const rooms = baseRooms.includes("Whole Property") ? baseRooms : [...baseRooms, "Whole Property"];
    const address = [newProp.addressLine, newProp.postcode].filter(Boolean).join(" ").trim() || newProp.addressLine || "";
    const id = Date.now();
    const moodBoards = Object.fromEntries(rooms.filter(r => r !== "Whole Property").map(r => [r, { palette: [], notes: "", images: [] }]));
    setProps_(prev => [...prev, { id, name: newProp.name, address, type: newProp.type || "Full Renovation", completion: newProp.completion || "", totalBudget: Number(newProp.totalBudget) || 0, rooms, tasks: [], otherCosts: [], contractors: [], moodBoards }]);
    setNewProp({ name: "", address: "", type: "Full Renovation", completion: "", rooms: [], totalBudget: "", postcode: "", addressLine: "", postcodeResults: [], postcodeLoading: false, postcodeError: "", customRoom: "" });
    const firstRoom = rooms.filter(r => r !== "Whole Property")[0] || null;
    setShowAddProp(false);
    setPropId(id); setRoomFilter("All"); setMatRoomFilter("All");
    setSelRoom(firstRoom); setTab("dashboard"); setShowPropDrop(false);
  };

  const TABS = [
    { id: "dashboard", label: "Overview", icon: "◈" },
    { id: "planning", label: "Planning", icon: "◷" },
    { id: "budget", label: "Budget", icon: "◉" },
    { id: "design", label: "Design", icon: "◫" },
    { id: "contractors", label: "Contractors", icon: "◎" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#FAFAF8", minHeight: "100vh", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{outline:none;font-family:inherit}
        button{cursor:pointer;font-family:inherit}
        .btn-primary{background:#1A1A1A;color:white;border:none;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;transition:opacity .15s}
        .btn-primary:hover{opacity:.75}
        .btn-primary:disabled{opacity:.35;cursor:not-allowed}
        .btn-ghost{background:none;border:1px solid #DEDBD6;padding:7px 16px;border-radius:8px;font-size:13px;color:#555;transition:all .15s}
        .btn-ghost:hover{border-color:#1A1A1A;color:#1A1A1A}
        .btn-sm{padding:4px 11px!important;font-size:12px!important;border-radius:7px!important}
        .field{border:1px solid #DEDBD6;border-radius:8px;padding:8px 12px;font-size:13px;width:100%;background:white}
        .field:focus{border-color:#1A1A1A}
        .label{font-size:11px;color:#888;margin-bottom:3px;display:block}
        .card{background:white;border-radius:12px;border:1px solid #EEEBE6}
        .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500}
        .chip{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid #DEDBD6;background:white;cursor:pointer;transition:all .12s}
        .chip:hover{background:#F0EDE8}
        .chip.on{background:#1A1A1A;color:white;border-color:#1A1A1A}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:white;border-radius:16px;padding:24px;width:440px;max-width:95vw;max-height:90vh;overflow-y:auto}
        .toggle{display:flex;gap:3px;background:#F5F2EE;border-radius:8px;padding:3px}
        .toggle-btn{flex:1;padding:5px 0;border-radius:6px;border:none;background:transparent;font-size:12px;font-weight:500;color:#888;transition:all .15s}
        .toggle-btn.active{background:white;color:#1A1A1A;box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .tab-btn{padding:5px 10px;border-radius:7px;border:none;background:transparent;font-size:12px;font-weight:500;color:#555;display:flex;align-items:center;gap:4px;transition:background .1s}
        .tab-btn:hover{background:#F0EDE8}
        .tab-btn.on{background:#1A1A1A;color:#FAFAF8}
        .prop-drop{position:absolute;top:calc(100% + 8px);left:0;background:white;border:1px solid #EEEBE6;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.1);min-width:260px;z-index:200;overflow:hidden}
        .prop-item{padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px}
        .prop-item:hover{background:#FAFAF8}
        .prop-sw{display:flex;align-items:center;gap:8px;cursor:pointer;padding:5px 10px;border-radius:8px;border:1px solid transparent;user-select:none;transition:all .15s}
        .prop-sw:hover{border-color:#EEEBE6;background:#FAFAF8}
        .prog{height:6px;background:#EEEBE6;border-radius:3px;overflow:hidden}
        .prog-fill{height:100%;border-radius:3px}
        .img-wrap{position:relative;border-radius:10px;overflow:hidden;background:#F5F2EE;border:1px solid #EEE}
        .img-wrap:hover .img-del{opacity:1}
        .img-del{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.5);color:white;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;cursor:pointer}
        tr:hover td{background:#FAFAF8}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #EEEBE6", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 50, gap: 8 }}>
        <div style={{ position: "relative" }} ref={dropRef}>
          <div className="prop-sw" onClick={() => setShowPropDrop(v => !v)}>
            <div style={{ width: 26, height: 26, background: "#1A1A1A", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: 13 }}>{"⌂"}</span>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 15, lineHeight: 1.2 }}>{prop.name}</div>
              <div style={{ fontSize: 10, color: isReadOnly ? "#AAA" : "#999" }}>{isReadOnly ? "Archived" : prop.type}</div>
            </div>
            <span style={{ fontSize: 10, color: "#bbb", marginLeft: 2 }}>{showPropDrop ? "▲" : "▼"}</span>
          </div>
          {showPropDrop && (
            <div className="prop-drop">
              <div style={{ padding: "10px 14px 4px", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Properties</div>
              {activeProps.map(p => (
                <div key={p.id} className="prop-item" style={{ background: p.id === propId ? "#F5F2EE" : "white" }} onClick={() => switchProp(p.id)}>
                  <div style={{ width: 32, height: 32, background: p.id === propId ? "#1A1A1A" : "#F0EDE8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                    <span style={{ color: p.id === propId ? "white" : "#555" }}>{"⌂"}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>{p.address}</div>
                  </div>
                  <button onClick={e => openEditProp(p, e)}
                    title="Edit property"
                    style={{ marginLeft: 4, background: "none", border: "none", color: "#999", fontSize: 13, cursor: "pointer", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
                    onMouseEnter={e => e.target.style.color = "#1A1A1A"}
                    onMouseLeave={e => e.target.style.color = "#999"}>
                    ✎
                  </button>                </div>
              ))}
              <div style={{ borderTop: "1px solid #EEE", padding: "6px 8px" }}>
                <div className="prop-item" style={{ borderRadius: 8 }} onClick={() => { setShowPropDrop(false); setShowAddProp(true); }}>
                  <div style={{ width: 32, height: 32, border: "1.5px dashed #DDD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#bbb" }}>+</div>
                  <span style={{ fontSize: 13, color: "#555" }}>Add property</span>
                </div>
                {archivedProps.length > 0 && (
                  <div className="prop-item" style={{ borderRadius: 8 }} onClick={() => { setShowPropDrop(false); setShowArchived(true); }}>
                    <div style={{ width: 32, height: 32, background: "#F5F2EE", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#999" }}>◫</div>
                    <span style={{ fontSize: 13, color: "#888" }}>Archived ({archivedProps.length})</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => <button key={t.id} className={`tab-btn ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}><span style={{ fontSize: 10 }}>{t.icon}</span>{t.label}</button>)}
        </div>

        <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
          {isReadOnly && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#F0EDE8", border: "1px solid #DEDBD6", borderRadius: 6, padding: "2px 8px" }}>
              Archived · Read only
            </span>
          )}
          <span><strong style={{ color: "#1A1A1A" }}>{pct(doneTasks, prop.tasks.length)}%</strong> done</span>
        </div>
      </header>

      <main style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, marginBottom: 2 }}>
            {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening."; })()}
          </h1>
              <p style={{ color: "#888", fontSize: 13 }}>{prop.address} · Est. {prop.completion}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
              {(() => {
                const budgetPct = overallBudget > 0 ? pct(totalActual, overallBudget) : null;
                const quotedPct = overallBudget > 0 ? pct(totalQuoted, overallBudget) : null;
                return [
                  { label: "Overall Budget", value: overallBudget > 0 ? f(overallBudget) : "Not set", sub: overallBudget > 0 ? f(overallBudget - totalActual) + " remaining" : "Set in Budget tab", hi: overallBudget > 0 && totalActual > overallBudget },
                  { label: "Total Quoted", value: f(totalQuoted), sub: quotedPct !== null ? quotedPct + "% of budget" : "across all tasks" },
                  { label: "Total Actual", value: f(totalActual), sub: totalActual > totalQuoted ? "+" + f(totalActual - totalQuoted) + " over quote" : totalActual > 0 ? f(totalQuoted - totalActual) + " under quote" : "no actuals yet" },
                  { label: "Tasks Done", value: doneTasks + "/" + prop.tasks.length, sub: inProg + " in progress" },
                ].map((k, i) => (
                  <div key={i} className="card" style={{ padding: "16px 18px", borderColor: k.hi ? "#FFCDD2" : "#EEEBE6" }}>
                    <div style={{ fontSize: 10, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
                    <div style={{ fontSize: 22, fontFamily: "'DM Serif Display',serif", marginBottom: 3, color: k.hi ? "#E53935" : "#1A1A1A" }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: "#AAA" }}>{k.sub}</div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Budget by Room</div>
                {prop.rooms.filter(r => roomCosts[r]).map(room => {
                  const rc = roomCosts[room];
                  const quoted = rc.quoted;
                  const actual = rc.actual;
                  const hasActual = actual > 0;
                  const display = hasActual ? actual : quoted;
                  const p = overallBudget > 0 ? pct(display, overallBudget) : 0;
                  const over = hasActual && actual > quoted;
                  return (
                    <div key={room} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#444", display: "flex", alignItems: "center", gap: 4 }}>
                          {room === "Whole Property" && <span>{"⌂"}</span>}{room}
                        </span>
                        <span style={{ fontSize: 11, color: over ? "#E53935" : "#999" }}>
                          {hasActual ? f(actual) + " actual" : f(quoted) + " quoted"}
                          {over && " ▲"}
                        </span>
                      </div>
                      <div className="prog"><div className="prog-fill" style={{ width: overallBudget > 0 ? Math.min(p, 100) + "%" : "0%", background: over ? "#E53935" : "#1A1A1A" }} /></div>
                    </div>
                  );
                })}
                {Object.keys(roomCosts).length === 0 && <p style={{ fontSize: 12, color: "#CCC" }}>Add tasks to see costs by room.</p>}
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Active Tasks</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {prop.tasks.filter(t => t.status !== "done").slice(0, 5).map(t => {
                    const tItems = t.items || [];
                    const iQ3 = item => { const o = (item.options||[]).find(o=>o.id===item.confirmedOptionId)||(item.options||[])[0]; return o ? Number(o.price)*Number(item.qty) : 0; };
                    const mc = tItems.reduce((s,i)=>s+iQ3(i), 0);
                    const mcQ = mc;
                    const lc = Number(t.labourCost) || 0;
                    const lcQ = Number(t.labourQuoted) || 0;
                    const pt = t.pricingType || "materials";
                    const sfAmt = lc > 0 ? lc : lcQ;
                    const mlAmt = (mc + lc) > 0 ? mc + lc : mcQ + lcQ;
                    const mAmt = mc > 0 ? mc : mcQ;
                    const costNote = pt === "supply-fit" ? (sfAmt > 0 ? `${fd(sfAmt)} supply & fit` : "") : pt === "materials-labour" ? (mlAmt > 0 ? `${fd(mlAmt)} mat + labour` : "") : pt === "labour" ? ((lc > 0 || lcQ > 0) ? `${fd(lc > 0 ? lc : lcQ)} labour` : "") : mAmt > 0 ? `${fd(mAmt)} materials` : "";
                    return (
                      <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#FAFAF8", borderRadius: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[t.status], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{t.task}</div>
                          <div style={{ fontSize: 11, color: "#AAA", display: "flex", alignItems: "center", gap: 5 }}>
                            {t.room}
                            {t.assignee && <span style={{ background: t.assignee === "Self" ? "#EEF4FF" : "#F0EDE8", color: t.assignee === "Self" ? "#3B6FD4" : "#555", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 500 }}>{t.assignee}</span>}
                            {costNote && <span>· {costNote}</span>}
                          </div>
                        </div>
                        <span className="pill" style={{ background: t.status === "in-progress" ? "#FFF3E0" : "#F5F5F5", color: t.status === "in-progress" ? "#E65100" : "#777" }}>{STATUS_LABELS[t.status]}</span>
                      </div>
                    );
                  })}
                  {prop.tasks.filter(t => t.status !== "done").length === 0 && <p style={{ fontSize: 12, color: "#CCC" }}>{"All tasks complete! 🎉"}</p>}
                  {prop.tasks.filter(t => t.status !== "done").length > 5 && (
                    <button onClick={() => setTab("planning")} style={{ background: "none", border: "none", fontSize: 12, color: "#888", cursor: "pointer", textDecoration: "underline", textAlign: "left", padding: 0, marginTop: 4 }}>
                      View all {prop.tasks.filter(t => t.status !== "done").length} tasks in Planning →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Planning ── */}
        {tab === "planning" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, fontWeight: 400, marginBottom: 3 }}>Project Planning</h2>
                <p style={{ color: "#888", fontSize: 13 }}>{prop.name}</p>
              </div>
              {!isReadOnly && <button className="btn-primary" onClick={() => { setNewTask({ room: roomFilter !== "All" ? roomFilter : (prop.rooms[0] || ""), task: "", status: "todo", start: "", end: "", assignee: "", taskBudget: "", pricingType: "materials", labourCost: "" }); setShowAddTask(true); }}>+ Add Task</button>}
            </div>
            {/* Progress summary bar */}
            {prop.tasks.length > 0 && (() => {
              const total = filtTasks.length;
              const doneN  = filtTasks.filter(t => t.status === "done").length;
              const inProgN = filtTasks.filter(t => t.status === "in-progress").length;
              const todoN  = total - doneN - inProgN;
              const donePct   = Math.round((doneN   / total) * 100);
              const inProgPct = Math.round((inProgN / total) * 100);
              return (
                <div className="card" style={{ padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{doneN} of {total} task{total !== 1 ? "s" : ""} complete{roomFilter !== "All" ? " · " + roomFilter : ""}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>{donePct}{"%"}</span>
                    </div>
                    <div style={{ height: 8, background: "#F0EDE8", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                      <div style={{ width: donePct + "%", background: "#4CAF50", borderRadius: "4px 0 0 4px", transition: "width .3s" }} />
                      <div style={{ width: inProgPct + "%", background: "#FF9800", transition: "width .3s" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexShrink: 0, fontSize: 11, color: "#888" }}>
                    {inProgN > 0 && <span style={{ color: "#E65100" }}>{inProgN} in progress</span>}
                    {todoN > 0 && <span>{todoN} to do</span>}
                  </div>
                </div>
              );
            })()}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {["All", ...prop.rooms].map(r => <button key={r} className={`chip ${roomFilter === r ? "on" : ""}`} onClick={() => setRoomFilter(r)}>{r}</button>)}
            </div>
            <div className="card" style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 760 }}>
                <thead><tr style={{ background: "#FAFAF8", borderBottom: "1px solid #EEE" }}>
                  {["", "Task", "Room", "Dates", "Cost", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtTasks.map(t => {
                    const taskItems = t.items || [];
                    const iQ2 = item => { const o = (item.options||[]).find(o=>o.id===item.confirmedOptionId)||(item.options||[])[0]; return o ? Number(o.price)*Number(item.qty) : 0; };
                    const iA2 = item => item.actualPrice > 0 ? item.actualPrice*Number(item.qty) : iQ2(item);
                    const mc = taskItems.reduce((s,i)=>s+iA2(i), 0);
                    const mcQ = taskItems.reduce((s,i)=>s+iQ2(i), 0);
                    const lc = Number(t.labourCost) || 0;
                    const lcQ = Number(t.labourQuoted) || 0;
                    const pt = t.pricingType || "materials";
                    const matCount = taskItems.length;
                    const toOrderCount = taskItems.filter(i => i.status === "to order").length;
                    const totalActual = (pt === "labour" || pt === "supply-fit") ? lc : pt === "materials-labour" ? mc + lc : mc;
                    const totalQuoted = (pt === "labour" || pt === "supply-fit") ? lcQ : pt === "materials-labour" ? mcQ + lcQ : mcQ;
                    const hasActual = lc > 0 || ((pt === "materials" || pt === "materials-labour") && mc > 0 && Math.abs(mc - mcQ) > 0.005);
                    const displayCost = hasActual ? totalActual : totalQuoted;
                    const variance = (hasActual && totalQuoted > 0) ? totalActual - totalQuoted : null;
                    const budget = Number(t.taskBudget) || 0;
                    const overBud = budget > 0 && displayCost > budget;
                    const isExpanded = !!expandedTasks[t.id];
                    const PT_LABELS = { materials: { bg: "#EEF2FF", color: "#3730A3" }, labour: { bg: "#F0FDF4", color: "#166534" }, "supply-fit": { bg: "#FFF7ED", color: "#92400E" }, "materials-labour": { bg: "#FDF4FF", color: "#6B21A8" } };
                    const ptStyle = PT_LABELS[pt] || PT_LABELS.materials;
                    return (
                      <Fragment key={t.id}>
                        <tr style={{ borderBottom: isExpanded ? "none" : "1px solid #F5F2EE", background: isExpanded ? "#FDFCFA" : "white" }}>
                          <td style={{ padding: "11px 10px 11px 14px", width: 28 }}>
                            <button onClick={() => setExpandedTasks(p => ({ ...p, [t.id]: !p[t.id] }))}
                              style={{ background: "none", border: "none", color: isExpanded ? "#555" : "#CCC", cursor: "pointer", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "transform .15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                              <span style={{ display: "inline-block", width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid currentColor" }} />
                            </button>
                          </td>
                          <td style={{ padding: "11px 14px 11px 4px" }}>
                            <div style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                              {t.task}
                              {t.room === "Whole Property" && <span style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Whole property</span>}
                            </div>
                            <div style={{ fontSize: 11, color: "#AAA", marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {t.assignee && <span style={{ background: t.assignee === "Self" ? "#EEF4FF" : "#F0EDE8", color: t.assignee === "Self" ? "#3B6FD4" : "#555", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 500 }}>{t.assignee}</span>}
                              {matCount > 0 && <span>· {matCount} item{matCount !== 1 ? "s" : ""}</span>}
                              {toOrderCount > 0 &&
                                <span style={{ color: "#E65100" }}>· {toOrderCount} to order</span>}
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px", color: "#666", fontSize: 12 }}>{t.room}</td>
                          <td style={{ padding: "11px 14px", color: "#888", fontSize: 11, whiteSpace: "nowrap" }}>{t.start && t.end ? `${t.start} → ${t.end}` : t.start || t.end || "—"}</td>

                          <td style={{ padding: "11px 14px", fontSize: 12, minWidth: 130 }}>
                            {displayCost > 0 ? (
                              <div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                  <span style={{ fontWeight: 600, fontSize: 13, color: overBud ? "#E53935" : "#1A1A1A" }}>{fd(displayCost)}</span>
                                  <span style={{ fontSize: 10, color: "#BBB" }}>{hasActual ? "actual" : "quoted"}</span>
                                </div>
                                {variance !== null && Math.abs(variance) >= 0.01 && (
                                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 1, color: variance > 0 ? "#E53935" : "#16A34A" }}>
                                    {variance > 0 ? "+" : ""}{fd(variance)} vs quote
                                  </div>
                                )}
                                {budget > 0 && <div className="prog" style={{ marginTop: 5 }}><div className="prog-fill" style={{ width: `${Math.min(pct(displayCost, budget), 100)}%`, background: overBud ? "#E53935" : "#4CAF50" }} /></div>}
                              </div>
                            ) : <span style={{ color: "#CCC", fontSize: 12 }}>{"—"}</span>}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <select value={t.status} onChange={e => updTask({ ...t, status: e.target.value })} style={{ border: "1px solid #DDD", borderRadius: 6, padding: "3px 7px", fontSize: 12, background: "white", color: "#555" }}>
                              <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option>
                            </select>
                          </td>
                        </tr>

                        {/* ── Cost detail drawer ── */}
                        {isExpanded && (
                          <tr style={{ borderBottom: "1px solid #F0EDE8" }}>
                            <td colSpan={8} style={{ padding: 0 }}>
                              <div style={{ background: "#FAFAF8", borderTop: "1px solid #F0EDE8", padding: "18px 24px 20px 48px" }}>

                                {/* Supply & Fit: single all-in price */}
                                {pt === "supply-fit" && (
                                  <div style={{ background: "white", border: "1px solid #EEEBE6", borderRadius: 8, padding: "14px 16px" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>All-in Price (supply {"&"} fit)</div>
                                    <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
                                      <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Quoted</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          <span style={{ fontSize: 12, color: "#AAA" }}>{"£"}</span>
                                          <input type="number" min="0" step="0.01" value={t.labourQuoted || ""} onChange={e => updTask({ ...t, labourQuoted: Number(e.target.value) || 0 })} placeholder="0.00"
                                            style={{ width: 110, fontSize: 14, fontWeight: 500, border: "1px solid #EEE", borderRadius: 6, padding: "5px 8px", background: "#FAFAF8" }} />
                                        </div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Actual</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          <span style={{ fontSize: 12, color: "#AAA" }}>{"£"}</span>
                                          <input type="number" min="0" step="0.01" value={t.labourCost || ""} onChange={e => updTask({ ...t, labourCost: Number(e.target.value) || 0 })} placeholder="0.00"
                                            style={{ width: 110, fontSize: 14, fontWeight: 500, border: "1px solid #EEE", borderRadius: 6, padding: "5px 8px", background: "#FAFAF8" }} />
                                        </div>
                                      </div>
                                      {lcQ > 0 && lc > 0 && Math.abs(lc - lcQ) >= 0.01 && (
                                        <span style={{ fontSize: 12, fontWeight: 700, color: lc > lcQ ? "#E53935" : "#16A34A", paddingBottom: 6 }}>
                                          {lc > lcQ ? "+" : ""}{fd(lc - lcQ)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Items section — not for supply-fit or labour */}
                                {(pt === "materials" || pt === "materials-labour") && (() => {
                                  const taskItems = t.items || [];
                                  const iQ = item => { const o = (item.options||[]).find(o=>o.id===item.confirmedOptionId)||(item.options||[])[0]; return o ? Number(o.price)*Number(item.qty) : 0; };
                                  const iA = item => item.actualPrice > 0 ? item.actualPrice*Number(item.qty) : iQ(item);
                                  const subQ = taskItems.reduce((s,i)=>s+iQ(i),0);
                                  const subA = taskItems.reduce((s,i)=>s+iA(i),0);
                                  return (
                                    <div style={{ marginBottom: pt === "materials-labour" ? 16 : 0 }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Materials</div>
                                      {taskItems.length === 0
                                        ? <div style={{ fontSize: 12, color: "#CCC", padding: "8px 0" }}>No items yet.</div>
                                        : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                            <thead><tr>
                                              {["Item", "Qty", "Source", "Quoted", "Status"].map(h => (
                                                <th key={h} style={{ padding: "4px 10px", textAlign: "left", fontSize: 9, fontWeight: 700, color: "#BBB", textTransform: "uppercase" }}>{h}</th>
                                              ))}
                                            </tr></thead>
                                            <tbody>
                                              {taskItems.map(item => {
                                                const confOpt = (item.options||[]).find(o=>o.id===item.confirmedOptionId)||(item.options||[])[0];
                                                const needsChoice = (item.options||[]).length > 1 && !item.confirmedOptionId;
                                                const optCount = (item.options||[]).length;
                                                return (
                                                  <tr key={item.id} style={{ borderBottom: "1px solid #EEEBE6" }}>
                                                    <td style={{ padding: "6px 10px" }}>
                                                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                      {optCount > 1 && (
                                                        <div style={{ fontSize: 10, color: needsChoice ? "#E65100" : "#16A34A", marginTop: 1 }}>
                                                          {needsChoice ? `${optCount} options — choose one` : `${optCount} options · chosen`}
                                                        </div>
                                                      )}
                                                    </td>
                                                    <td style={{ padding: "6px 10px", color: "#888", whiteSpace: "nowrap" }}>{item.qty} {item.unit}</td>
                                                    <td style={{ padding: "6px 10px", color: "#888", fontSize: 11 }}>
                                                      {confOpt?.retailer || "—"}
                                                      {confOpt?.url && <a href={confOpt.url.startsWith("http") ? confOpt.url : "#"} target="_blank" rel="noreferrer" style={{ marginLeft: 4, color: "#AAA" }}>{"🔗"}</a>}
                                                    </td>
                                                    <td style={{ padding: "6px 10px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                                      {needsChoice ? <span style={{ color: "#E65100", fontSize: 11 }}>—</span> : fd(iQ(item))}
                                                    </td>
                                                    <td style={{ padding: "6px 10px" }}>
                                                      <span className="pill" style={{ fontSize: 10, padding: "2px 7px", background: MAT_STATUS[item.status]?.bg || "#F5F5F5", color: MAT_STATUS[item.status]?.color || "#555" }}>{item.status}</span>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                            {taskItems.length > 0 && <tfoot><tr style={{ borderTop: "1px solid #DDD" }}>
                                              <td colSpan={3} style={{ padding: "6px 10px", fontSize: 11, fontWeight: 600, textAlign: "right", color: "#999" }}>Subtotal</td>
                                              <td style={{ padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>{fd(subQ)}</td>
                                              <td />
                                            </tr></tfoot>}
                                          </table>}
                                    </div>
                                  );
                                })()}

                                {/* Labour section — only for labour-only or materials+labour */}
                                {(pt === "labour" || pt === "materials-labour") && (
                                  <div style={{ background: "white", border: "1px solid #EEEBE6", borderRadius: 8, padding: "12px 16px" }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 10 }}>
                                      {pt === "labour" ? "Labour" : "Labour"}
                                    </div>
                                    <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
                                      <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Quoted</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          <span style={{ fontSize: 12, color: "#AAA" }}>{"£"}</span>
                                          <input type="number" min="0" step="0.01" value={t.labourQuoted || ""} onChange={e => updTask({ ...t, labourQuoted: Number(e.target.value) || 0 })} placeholder="0.00"
                                            style={{ width: 90, fontSize: 14, fontWeight: 500, border: "1px solid #EEE", borderRadius: 6, padding: "5px 8px", background: "#FAFAF8" }} />
                                        </div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Actual</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          <span style={{ fontSize: 12, color: "#AAA" }}>{"£"}</span>
                                          <input type="number" min="0" step="0.01" value={t.labourCost || ""} onChange={e => updTask({ ...t, labourCost: Number(e.target.value) || 0 })} placeholder="0.00"
                                            style={{ width: 90, fontSize: 14, fontWeight: 500, border: "1px solid #EEE", borderRadius: 6, padding: "5px 8px", background: "#FAFAF8" }} />
                                        </div>
                                      </div>
                                      {lcQ > 0 && lc > 0 && Math.abs(lc - lcQ) >= 0.01 && (
                                        <span style={{ fontSize: 12, fontWeight: 700, color: lc > lcQ ? "#E53935" : "#16A34A", paddingBottom: 6 }}>
                                          {lc > lcQ ? "+" : ""}{fd(lc - lcQ)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Task action bar */}
                                {(() => {
                                  const taskItems = t.items || [];
                                  const pendingConf = taskItems.some(i => (i.options||[]).length > 1 && !i.confirmedOptionId)
                                    || (pt !== "materials" && !(t.labourQuotes||[]).find(q=>q.confirmed) && (t.labourQuotes||[]).length > 0);
                                  const itemCount = taskItems.length;
                                  const lqCount   = (t.labourQuotes||[]).length;
                                  const summary   = [itemCount > 0 && `${itemCount} item${itemCount!==1?"s":""}`, lqCount > 0 && `${lqCount} quote${lqCount!==1?"s":""}`].filter(Boolean).join(" · ");
                                  return (
                                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F0EDE8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <button className="btn-ghost btn-sm" onClick={() => setTaskModal(t)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        Manage
                                        {summary && <span style={{ fontSize: 10, color: "#AAA" }}>{summary}</span>}
                                        {pendingConf && <span style={{ fontSize: 10, fontWeight: 700, background: "#FFF7ED", color: "#92400E", borderRadius: 4, padding: "1px 6px" }}>action needed</span>}
                                      </button>
                                      <div style={{ display: "flex", gap: 6 }}>
                                        {!isReadOnly && <button className="btn-ghost btn-sm" onClick={() => setEditTaskData({ ...t })}>{"✎ Edit"}</button>}
                                        {!isReadOnly && <button onClick={() => { if (window.confirm("Delete this task?")) updProp(p => ({ tasks: p.tasks.filter(x => x.id !== t.id) })); }}
                                          style={{ fontSize: 12, fontWeight: 500, border: "1px solid #FFCDD2", color: "#E53935", background: "none", borderRadius: 7, padding: "4px 11px", cursor: "pointer" }}>Delete</button>}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                  {filtTasks.length === 0 && <tr><td colSpan={6} style={{ padding: "24px 14px", color: "#CCC", fontSize: 13 }}>No tasks yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Budget ── */}
        {tab === "budget" && (
          <div>
            {/* Header + overall budget setting */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, fontWeight: 400, marginBottom: 3 }}>Budget</h2>
                <p style={{ color: "#888", fontSize: 13 }}>Costs roll up automatically from tasks in Planning.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #EEEBE6", borderRadius: 10, padding: "8px 14px" }}>
                <span style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>Overall budget</span>
                <span style={{ fontSize: 13, color: "#AAA" }}>{"£"}</span>
                <input type="number" min="0" step="1000"
                  value={overallBudget || ""}
                  onChange={e => updProp(() => ({ totalBudget: Number(e.target.value) || 0 }))}
                  placeholder="0"
                  style={{ width: 100, fontSize: 14, fontWeight: 600, border: "none", outline: "none", background: "transparent", color: "#1A1A1A" }} />
              </div>
            </div>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {(() => {
                const remaining = overallBudget > 0 ? overallBudget - totalActual : null;
                const budgetPct = overallBudget > 0 ? pct(totalActual, overallBudget) : null;
                const over = remaining !== null && remaining < 0;
                return [
                  { label: "Budget", value: overallBudget > 0 ? f(overallBudget) : "—", sub: "overall target", dark: true },
                  { label: "Total Quoted", value: f(totalQuoted), sub: overallBudget > 0 ? pct(totalQuoted, overallBudget) + "% of budget" : "from all tasks" },
                  { label: "Total Actual", value: f(totalActual), sub: totalActual > totalQuoted && totalActual > 0 ? "+" + f(totalActual - totalQuoted) + " vs quote" : totalActual > 0 ? f(totalQuoted - totalActual) + " under quote" : "no actuals yet" },
                  { label: remaining !== null ? (over ? "Over budget" : "Remaining") : "Variance", value: remaining !== null ? f(Math.abs(remaining)) : f(totalActual - totalQuoted), sub: budgetPct !== null ? budgetPct + "% spent" : "actual vs quoted", warn: over },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ padding: "18px 20px", background: s.dark ? "#1A1A1A" : "white", borderColor: s.warn ? "#FFCDD2" : s.dark ? "#1A1A1A" : "#EEEBE6" }}>
                    <div style={{ fontSize: 10, color: s.dark ? "#888" : "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontFamily: "'DM Serif Display',serif", color: s.dark ? "white" : s.warn ? "#E53935" : "#1A1A1A" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: s.dark ? "#666" : "#AAA", marginTop: 3 }}>{s.sub}</div>
                  </div>
                ));
              })()}
            </div>

            {/* Overall progress bar */}
            {overallBudget > 0 && (
              <div className="card" style={{ padding: "14px 20px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: "#666" }}>Budget used</span>
                  <span style={{ fontSize: 11, color: "#999" }}>{f(totalActual)} of {f(overallBudget)}</span>
                </div>
                <div style={{ position: "relative", height: 8, background: "#EEEBE6", borderRadius: 4, overflow: "hidden" }}>
                  {/* Quoted marker */}
                  {totalQuoted > 0 && overallBudget > 0 && (
                    <div style={{ position: "absolute", left: Math.min(pct(totalQuoted, overallBudget), 100) + "%", top: 0, bottom: 0, width: 2, background: "#CCC", zIndex: 2 }} />
                  )}
                  <div style={{ height: "100%", borderRadius: 4, background: totalActual > overallBudget ? "#E53935" : "#1A1A1A", width: Math.min(pct(totalActual, overallBudget), 100) + "%" }} />
                </div>
                {totalQuoted > 0 && (
                  <div style={{ fontSize: 10, color: "#BBB", marginTop: 6 }}>
                    {"| "} quoted at {pct(totalQuoted, overallBudget)}% {"·"} actual at {pct(totalActual, overallBudget)}%
                  </div>
                )}
              </div>
            )}

            {/* Room breakdown — from tasks */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {["All", ...prop.rooms].map(r => <button key={r} className={"chip" + (roomFilter === r ? " on" : "")} onClick={() => setRoomFilter(r)}>{r}</button>)}
            </div>

            {prop.rooms.filter(r => roomFilter === "All" || r === roomFilter).filter(r => taskCosts.some(t => t.room === r)).length === 0 && (
              <div className="card" style={{ padding: "32px", textAlign: "center", color: "#CCC", fontSize: 13, marginBottom: 16 }}>
                No tasks with costs yet. Add tasks in Planning to see them here.
              </div>
            )}

            {prop.rooms.filter(r => budgetRoomFilter === "All" || r === budgetRoomFilter).filter(r => taskCosts.some(t => t.room === r)).map(room => {
              const roomTasks = taskCosts.filter(t => t.room === room);
              const roomQ = roomTasks.reduce((s, t) => s + t.totalQ, 0);
              const roomA = roomTasks.reduce((s, t) => s + t.totalA, 0);
              const hasRoomActual = roomA > 0;
              return (
                <div key={room} className="card" style={{ marginBottom: 12, overflow: "hidden" }}>
                  {/* Room header */}
                  <div style={{ padding: "12px 16px", background: room === "Whole Property" ? "#F3F4F6" : "#FAFAF8", borderBottom: "1px solid #EEEBE6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
                      {room === "Whole Property" && <span style={{ fontSize: 13 }}>{"⌂"}</span>}
                      {room}
                    </span>
                    <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                      {hasRoomActual && <span style={{ fontSize: 11, color: "#999" }}>quoted {f(roomQ)}</span>}
                      <span style={{ fontSize: 14, fontWeight: 700, color: hasRoomActual && roomA > roomQ ? "#E53935" : "#1A1A1A" }}>
                        {hasRoomActual ? f(roomA) + " actual" : f(roomQ) + " quoted"}
                      </span>
                    </div>
                  </div>
                  {/* Task rows */}
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr style={{ borderBottom: "1px solid #F5F2EE" }}>
                      {["Task", "Type", "Quoted", "Actual", "Var"].map(h => (
                        <th key={h} style={{ padding: "8px 14px", textAlign: h === "Quoted" || h === "Actual" || h === "Var" ? "right" : "left", fontSize: 10, fontWeight: 700, color: "#CCC", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {roomTasks.map(t => {
                        const varAmt = t.hasActual ? t.totalA - t.totalQ : null;
                        const PT_LABELS = { materials: "Materials", labour: "Labour", "supply-fit": "Supply & Fit", "materials-labour": "Mat + Labour" };
                        const PT_COLORS = { materials: "#3730A3", labour: "#166534", "supply-fit": "#92400E", "materials-labour": "#6B21A8" };
                        const PT_BG = { materials: "#EEF2FF", labour: "#F0FDF4", "supply-fit": "#FFF7ED", "materials-labour": "#FDF4FF" };
                        return (
                          <tr key={t.id} style={{ borderBottom: "1px solid #F9F8F6" }}>
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ fontWeight: 500 }}>{t.task}</div>
                              {t.assignee && <span style={{ background: t.assignee === "Self" ? "#EEF4FF" : "#F0EDE8", color: t.assignee === "Self" ? "#3B6FD4" : "#555", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 500 }}>{t.assignee}</span>}
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span className="pill" style={{ background: PT_BG[t.pt], color: PT_COLORS[t.pt], fontSize: 10 }}>{PT_LABELS[t.pt]}</span>
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", color: "#666" }}>{t.totalQ > 0 ? f(t.totalQ) : <span style={{ color: "#DDD" }}>{"—"}</span>}</td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: t.hasActual ? 600 : 400, color: t.hasActual ? "#1A1A1A" : "#CCC" }}>
                              {t.hasActual ? f(t.totalA) : "—"}
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, fontWeight: 600, color: varAmt === null ? "#DDD" : varAmt > 0.005 ? "#E53935" : varAmt < -0.005 ? "#16A34A" : "#CCC" }}>
                              {varAmt === null ? "—" : (varAmt > 0 ? "+" : "") + f(varAmt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Other costs */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Other Costs</span>
                  <span style={{ fontSize: 11, color: "#AAA", marginLeft: 8 }}>Surveys, architect fees, permits etc.</span>
                </div>
                {!isReadOnly && <button className="btn-ghost btn-sm" onClick={() => { setNewBudget({ description: "", quotedCost: "", actualCost: "" }); setShowAddBudget(true); }}>+ Add</button>}
              </div>
              <div className="card" style={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: "#FAFAF8", borderBottom: "1px solid #EEE" }}>
                    {["Description", "Quoted", "Actual", "Var", ""].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: h === "Quoted" || h === "Actual" || h === "Var" ? "right" : "left", fontSize: 10, fontWeight: 700, color: "#CCC", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {otherCosts.map((c, i) => {
                      const q = Number(c.quotedCost) || 0;
                      const a = Number(c.actualCost) || 0;
                      const hasA = a > 0;
                      const varAmt = hasA ? a - q : null;
                      return (
                        <tr key={c.id} style={{ borderBottom: "1px solid #F5F2EE" }}>
                          <td style={{ padding: "10px 14px", color: "#444" }}>{c.description}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right", color: "#666" }}>{q > 0 ? f(q) : "—"}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: hasA ? 600 : 400, color: hasA ? "#1A1A1A" : "#CCC" }}>{hasA ? f(a) : "—"}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, fontWeight: 600, color: varAmt === null ? "#DDD" : varAmt > 0 ? "#E53935" : varAmt < 0 ? "#16A34A" : "#CCC" }}>
                            {varAmt === null ? "—" : (varAmt > 0 ? "+" : "") + f(varAmt)}
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "right" }}>
                            <button onClick={() => updProp(p => ({ otherCosts: p.otherCosts.filter((_, j) => j !== i) }))}
                              style={{ background: "none", border: "none", color: "#CCC", cursor: "pointer", fontSize: 13 }}>{"✕"}</button>
                          </td>
                        </tr>
                      );
                    })}
                    {otherCosts.length === 0 && <tr><td colSpan={5} style={{ padding: "20px 14px", color: "#CCC", fontSize: 12 }}>No other costs yet.</td></tr>}
                    {otherCosts.length > 0 && (
                      <tr style={{ borderTop: "2px solid #EEEBE6", background: "#FAFAF8" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 12 }}>Total</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#666" }}>{f(otherQuoted)}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>{otherActual > 0 ? f(otherActual) : "—"}</td>
                        <td colSpan={2} />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Design ── */}
        {tab === "design" && (
          <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, fontWeight: 400, marginBottom: 3 }}>Design</h2>
                <p style={{ color: "#888", fontSize: 13 }}>{prop.name}</p>
              </div>
              {Object.keys(prop.moodBoards).length > 0 && (
                <div className="toggle" style={{ width: 180 }}>
                  <button className={"toggle-btn" + (designView === "library" ? " active" : "")} onClick={() => setDesignView("library")}>{"⊞ Library"}</button>
                  <button className={"toggle-btn" + (designView === "canvas" ? " active" : "")} onClick={() => setDesignView("canvas")}>{"✦ Moodboard"}</button>
                </div>
              )}
            </div>

            {Object.keys(prop.moodBoards).length === 0
              ? <div className="card" style={{ padding: 40, textAlign: "center", color: "#CCC", fontSize: 13 }}>No mood boards yet.</div>
              : <>
                  {/* Room chips */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                    {Object.keys(prop.moodBoards).filter(r => r !== "Whole Property").map(r => (
                      <button key={r} className={"chip" + (selRoom === r ? " on" : "")} onClick={() => { setSelRoom(r); setEditNotes(false); }}>{r}</button>
                    ))}
                  </div>

                  {mb && designView === "library" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* Palette */}
                      <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Colour Palette</div>
                          {mb.palette.length < 6 && <button className="btn-ghost btn-sm" onClick={() => setColourPickerIdx("new")}>+ Add</button>}
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {mb.palette.map((c, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                              <div style={{ width: 52, height: 52, borderRadius: 10, background: c.hex, border: "2px solid transparent", cursor: "pointer", position: "relative", transition: "transform .12s" }}
                                onClick={() => setColourPickerIdx(i)}
                                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.querySelector("div").style.opacity = "1"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.querySelector("div").style.opacity = "0"; }}>
                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .15s", fontSize: 14, color: "white" }}>{"✎"}</div>
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 500, color: "#444", maxWidth: 60, lineHeight: 1.2, wordBreak: "break-word" }}>{c.label}</div>
                                {c.brand && c.brand !== "Custom" && <div style={{ fontSize: 9, color: "#BBB" }}>{c.brand}</div>}
                              </div>
                              <button onClick={() => updMB(selRoom, m => ({ palette: m.palette.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: "#CCC", fontSize: 10, cursor: "pointer" }}>{"✕"}</button>
                            </div>
                          ))}
                          {mb.palette.length === 0 && <p style={{ fontSize: 12, color: "#CCC" }}>No colours yet.</p>}
                        </div>
                      </div>
                      {/* Images */}
                      <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Images</div>
                          <button className="btn-ghost btn-sm" onClick={() => setShowImageModal(true)}>+ Add</button>
                        </div>
                        {mb.images.length === 0
                          ? <div onClick={() => setShowImageModal(true)} style={{ border: "2px dashed #DDD", borderRadius: 10, padding: 30, textAlign: "center", cursor: "pointer", background: "#FAFAF8" }}>
                              <div style={{ fontSize: 26, marginBottom: 6 }}>{"🖼️"}</div>
                              <div style={{ fontSize: 13, color: "#AAA" }}>Upload or paste a link</div>
                            </div>
                          : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                              {mb.images.map((img, i) => (
                                <div key={i} className="img-wrap" style={{ aspectRatio: "4/3" }}>
                                  <img src={img.src} alt={img.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  {img.caption && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,.5))", padding: 8, fontSize: 10, color: "white" }}>{img.caption}</div>}
                                  <button className="img-del" onClick={() => updMB(selRoom, m => ({ images: m.images.filter((_, j) => j !== i) }))}>{"✕"}</button>
                                </div>
                              ))}
                              <div onClick={() => setShowImageModal(true)} style={{ aspectRatio: "4/3", border: "2px dashed #DDD", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#FAFAF8", color: "#CCC", fontSize: 24 }}>+</div>
                            </div>}
                      </div>
                      {/* Notes */}
                      <div className="card" style={{ padding: 24, gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Design Notes</div>
                        <textarea className="field" value={mb.notes || ""} onChange={e => updMB(selRoom, () => ({ notes: e.target.value }))}
                          rows={3} placeholder="Add notes about the design direction, materials, inspiration…" style={{ resize: "none", fontSize: 13, lineHeight: 1.7 }} />
                      </div>
                    </div>
                  )}

                  {mb && designView === "canvas" && (
                    <MoodboardCanvas
                      key={selRoom}
                      mb={mb}
                      onUpdate={canvasItems => updMB(selRoom, () => ({ canvasItems }))}
                    />
                  )}
                </>}
          </div>
        )}

        {/* ── Contractors ── */}
        {tab === "contractors" && (() => {
          const CS = { booked: { bg: "#E8F5E9", color: "#2E7D32", label: "Booked" }, quoted: { bg: "#EEF2FF", color: "#3730A3", label: "Quoted" }, contacted: { bg: "#FFF7ED", color: "#92400E", label: "Contacted" }, rejected: { bg: "#FEF2F2", color: "#B91C1C", label: "Not using" } };
          const dispContractors = conView === "booked"
            ? prop.contractors.filter(c => (c.contactStatus || "booked") === "booked")
            : prop.contractors;
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, fontWeight: 400, marginBottom: 3 }}>Contractors</h2>
                  <p style={{ color: "#888", fontSize: 13 }}>{prop.name}</p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div className="toggle" style={{ width: 220 }}>
                    <button className={"toggle-btn" + (conView === "booked" ? " active" : "")} onClick={() => setConView("booked")}>{"✓ Booked"}</button>
                    <button className={"toggle-btn" + (conView === "all" ? " active" : "")} onClick={() => setConView("all")}>All Contacts</button>
                  </div>
                  <button className="btn-primary">+ Add</button>
                </div>
              </div>
              {prop.contractors.length === 0
                ? <div className="card" style={{ padding: 40, textAlign: "center", color: "#CCC", fontSize: 13 }}>No contractors yet.</div>
                : dispContractors.length === 0
                  ? <div className="card" style={{ padding: 40, textAlign: "center", color: "#CCC", fontSize: 13 }}>No booked contractors yet. Switch to "All Contacts" to see everyone.</div>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                      {dispContractors.map(c => {
                        const cs = CS[c.contactStatus || "booked"] || CS.booked;
                        return (
                          <div key={c.id} className="card" style={{ padding: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{ width: 40, height: 40, background: "#F0EDE8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                                  {c.trade === "Carpentry" ? "🪵" : c.trade === "Plumbing" ? "🔧" : c.trade === "Flooring" ? "🏠" : c.trade === "Electrical" ? "⚡" : "🌿"}
                                </div>
                                <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 11, color: "#999" }}>{c.trade}</div></div>
                              </div>
                              <select value={c.contactStatus || "booked"}
                                onChange={e => updProp(p => ({ contractors: p.contractors.map(x => x.id === c.id ? { ...x, contactStatus: e.target.value } : x) }))}
                                style={{ fontSize: 11, fontWeight: 600, border: "none", borderRadius: 20, padding: "3px 10px", color: cs.color, background: cs.bg, cursor: "pointer" }}>
                                <option value="booked">Booked</option>
                                <option value="quoted">Quoted</option>
                                <option value="contacted">Contacted</option>
                                <option value="rejected">Not using</option>
                              </select>
                            </div>
                            <div style={{ display: "flex", marginBottom: 12 }}>
                              {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: i < c.rating ? "#F5C842" : "#DDD", fontSize: 13 }}>{i < c.rating ? "★" : "☆"}</span>)}
                            </div>
                            <div style={{ fontSize: 12, color: "#666", display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                              <div>{`📞 `}{c.phone}</div><div>{`✉️ `}{c.email}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Rooms</div>
                              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {c.rooms.map(r => <span key={r} className="pill" style={{ background: "#F5F2EE", color: "#555" }}>{r}</span>)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>}
            </div>
          );
        })()}
      </main>

      {/* ── Modals ── */}
      {taskModal && <TaskModal task={taskModal} onUpdate={t => { updTask(t); setTaskModal(t); }} onClose={() => setTaskModal(null)} />}
      {editTaskData && (
        <div className="overlay" onClick={() => setEditTaskData(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, marginBottom: 18 }}>Edit Task</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div><label className="label">Task description</label><input className="field" value={editTaskData.task} onChange={e => setEditTaskData(p => ({ ...p, task: e.target.value }))} autoFocus /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label className="label">Room</label><select className="field" value={editTaskData.room} onChange={e => setEditTaskData(p => ({ ...p, room: e.target.value }))}>{prop.rooms.map(r => <option key={r}>{r}</option>)}</select></div>
                <div><label className="label">Assignee</label>
                  <div style={{ display: "flex", gap: 0, borderRadius: 8, border: "1px solid #DEDBD6", overflow: "hidden" }}>
                    {["Self", "Contractor"].map(v => (
                      <button key={v} onClick={() => setEditTaskData(p => ({ ...p, assignee: v }))}
                        style={{ flex: 1, padding: "8px 0", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .12s",
                          background: editTaskData.assignee === v ? "#1A1A1A" : "white",
                          color: editTaskData.assignee === v ? "white" : "#555" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="label">Start</label><input className="field" type="date" value={editTaskData.start} onChange={e => setEditTaskData(p => ({ ...p, start: e.target.value }))} /></div>
                <div><label className="label">End</label><input className="field" type="date" value={editTaskData.end} onChange={e => setEditTaskData(p => ({ ...p, end: e.target.value }))} /></div>
              </div>
              <div>
                <label className="label">Pricing type</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["materials", "📦 Materials only"], ["labour", "🔧 Labour only"], ["supply-fit", "🔧📦 Supply & Fit"], ["materials-labour", "📦🔧 Mat + Labour"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setEditTaskData(p => ({ ...p, pricingType: val }))}
                      style={{ flex: 1, padding: "7px 6px", borderRadius: 8, border: `1.5px solid ${editTaskData.pricingType === val ? "#1A1A1A" : "#DDD"}`, background: editTaskData.pricingType === val ? "#1A1A1A" : "white", color: editTaskData.pricingType === val ? "white" : "#555", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setEditTaskData(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => { if (editTaskData.task) { updTask(editTaskData); setEditTaskData(null); } }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {colourPickerIdx !== null && (
        <ColourPicker
          current={colourPickerIdx !== "new" ? mb?.palette[colourPickerIdx] : null}
          onClose={() => setColourPickerIdx(null)}
          onSave={colour => {
            updMB(selRoom, m => {
              const pal = [...m.palette];
              if (colourPickerIdx === "new") pal.push(colour); else pal[colourPickerIdx] = colour;
              return { palette: pal };
            });
            setColourPickerIdx(null);
          }}
        />
      )}

      {showImageModal && (
        <ImageModal onClose={() => setShowImageModal(false)} onSave={img => { updMB(selRoom, m => ({ images: [...m.images, img] })); setShowImageModal(false); }} />
      )}

      {showAddTask && (
        <div className="overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, marginBottom: 18 }}>New Task</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div><label className="label">Task description</label><input className="field" value={newTask.task} onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))} placeholder="e.g. Install new flooring" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label className="label">Room</label><select className="field" value={newTask.room} onChange={e => setNewTask(p => ({ ...p, room: e.target.value }))}>{prop.rooms.map(r => <option key={r}>{r}</option>)}</select></div>
                <div><label className="label">Assignee</label>
                  <div style={{ display: "flex", gap: 0, borderRadius: 8, border: "1px solid #DEDBD6", overflow: "hidden" }}>
                    {["Self", "Contractor"].map(v => (
                      <button key={v} onClick={() => setNewTask(p => ({ ...p, assignee: v }))}
                        style={{ flex: 1, padding: "8px 0", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .12s",
                          background: newTask.assignee === v ? "#1A1A1A" : "white",
                          color: newTask.assignee === v ? "white" : "#555" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="label">Start</label><input className="field" type="date" value={newTask.start} onChange={e => setNewTask(p => ({ ...p, start: e.target.value }))} /></div>
                <div><label className="label">End</label><input className="field" type="date" value={newTask.end} onChange={e => setNewTask(p => ({ ...p, end: e.target.value }))} /></div>
              </div>
              <div>
                <label className="label">Pricing type</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["materials", "📦 Materials only"], ["labour", "🔧 Labour only"], ["supply-fit", "🔧📦 Supply & Fit"], ["materials-labour", "📦🔧 Materials + Labour"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setNewTask(p => ({ ...p, pricingType: val }))}
                      style={{ flex: 1, padding: "7px 6px", borderRadius: 8, border: `1.5px solid ${newTask.pricingType === val ? "#1A1A1A" : "#DDD"}`, background: newTask.pricingType === val ? "#1A1A1A" : "white", color: newTask.pricingType === val ? "white" : "#555", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAddTask(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { if (newTask.task) { updProp(p => ({ tasks: [...p.tasks, { ...newTask, id: Date.now(), pricingType: newTask.pricingType || "materials", taskBudget: Number(newTask.taskBudget) || 0, labourCost: Number(newTask.labourCost) || 0, materials: [] }] })); setShowAddTask(false); } }}>Add Task</button>
            </div>
          </div>
        </div>
      )}

      {showAddBudget && (
        <div className="overlay" onClick={() => setShowAddBudget(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, marginBottom: 4 }}>Add Other Cost</h3>
            <p style={{ fontSize: 12, color: "#999", marginBottom: 18 }}>For costs not linked to a specific task — surveys, fees, permits etc.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div><label className="label">Description</label><input className="field" value={newBudget.description} onChange={e => setNewBudget(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Structural survey" autoFocus /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><label className="label">Quoted ({"£"})</label><input className="field" type="number" value={newBudget.quotedCost} onChange={e => setNewBudget(p => ({ ...p, quotedCost: e.target.value }))} placeholder="0" /></div>
                <div><label className="label">Actual ({"£"})</label><input className="field" type="number" value={newBudget.actualCost} onChange={e => setNewBudget(p => ({ ...p, actualCost: e.target.value }))} placeholder="0" /></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAddBudget(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { if (newBudget.description) { updProp(p => ({ otherCosts: [...(p.otherCosts || []), { id: Date.now(), description: newBudget.description, quotedCost: Number(newBudget.quotedCost) || 0, actualCost: Number(newBudget.actualCost) || 0 }] })); setShowAddBudget(false); } }}>Add</button>
            </div>
          </div>
        </div>
      )}

      {showAddProp && (
        <div className="overlay" onClick={() => setShowAddProp(false)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, marginBottom: 4 }}>Add Property</h3>
            <p style={{ fontSize: 12, color: "#999", marginBottom: 18 }}>Each property has its own tasks, budget and mood boards.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Name + Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="label">Property name *</label>
                  <input className="field" value={newProp.name} onChange={e => setNewProp(p => ({ ...p, name: e.target.value }))} placeholder="e.g. The Barn Conversion" autoFocus />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="field" value={newProp.type} onChange={e => setNewProp(p => ({ ...p, type: e.target.value }))}>
                    {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Postcode lookup */}
              <div>
                <label className="label">Address</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <input className="field" value={newProp.postcode} onChange={e => setNewProp(p => ({ ...p, postcode: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && lookupPostcode()}
                    placeholder="Postcode e.g. SW1A 1AA" style={{ flex: 1 }} />
                  <button className="btn-ghost btn-sm" onClick={lookupPostcode} style={{ whiteSpace: "nowrap" }}>
                    {newProp.postcodeLoading ? "..." : "Look up"}
                  </button>
                </div>
                {newProp.postcodeError && <div style={{ fontSize: 11, color: "#E53935", marginBottom: 4 }}>{newProp.postcodeError}</div>}
                <input className="field" value={newProp.addressLine}
                  onChange={e => setNewProp(p => ({ ...p, addressLine: e.target.value }))}
                  placeholder="Street address (auto-filled or type manually)" />
              </div>

              {/* Completion + Budget */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="label">Est. completion</label>
                  <input className="field" type="date" value={newProp.completion} onChange={e => setNewProp(p => ({ ...p, completion: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Overall budget ({"£"})</label>
                  <input className="field" type="number" value={newProp.totalBudget || ""} onChange={e => setNewProp(p => ({ ...p, totalBudget: e.target.value }))} placeholder="e.g. 50000" />
                </div>
              </div>

              {/* Rooms multi-select */}
              <div>
                <label className="label" style={{ marginBottom: 6 }}>Rooms</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {COMMON_ROOMS.map(r => (
                    <button key={r} onClick={() => toggleRoom(r)}
                      style={{ padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", transition: "all .12s",
                        background: newProp.rooms.includes(r) ? "#1A1A1A" : "white",
                        color: newProp.rooms.includes(r) ? "white" : "#555",
                        borderColor: newProp.rooms.includes(r) ? "#1A1A1A" : "#DEDBD6" }}>
                      {r}
                    </button>
                  ))}
                </div>
                {/* Custom room */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="field" value={newProp.customRoom} onChange={e => setNewProp(p => ({ ...p, customRoom: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && addCustomRoom()}
                    placeholder="Add custom room..." style={{ flex: 1, fontSize: 12 }} />
                  <button className="btn-ghost btn-sm" onClick={addCustomRoom}>Add</button>
                </div>
                {/* Custom rooms added */}
                {newProp.rooms.filter(r => !COMMON_ROOMS.includes(r)).length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    {newProp.rooms.filter(r => !COMMON_ROOMS.includes(r)).map(r => (
                      <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, background: "#1A1A1A", color: "white" }}>
                        {r}
                        <button onClick={() => toggleRoom(r)} style={{ background: "none", border: "none", color: "#AAA", cursor: "pointer", fontSize: 11, padding: 0, lineHeight: 1 }}>{"✕"}</button>
                      </span>
                    ))}
                  </div>
                )}
                {newProp.rooms.length > 0 && (
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 6 }}>{newProp.rooms.length} room{newProp.rooms.length !== 1 ? "s" : ""} selected</div>
                )}
              </div>

            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAddProp(false)}>Cancel</button>
              <button className="btn-primary" onClick={addProp} style={{ opacity: newProp.name ? 1 : 0.4 }}>Add Property</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Property Modal ── */}
      {editPropData && (
        <div className="overlay" onClick={() => setEditPropData(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, marginBottom: 18 }}>Edit Property</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Name + Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="label">Property name *</label>
                  <input className="field" autoFocus value={editPropData.name} onChange={e => setEditPropData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. The Barn Conversion" />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="field" value={editPropData.type} onChange={e => setEditPropData(p => ({ ...p, type: e.target.value }))}>
                    {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="label">Address</label>
                <input className="field" value={editPropData.addressLine} onChange={e => setEditPropData(p => ({ ...p, addressLine: e.target.value }))} placeholder="Street address" />
              </div>

              {/* Completion + Budget */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="label">Est. completion</label>
                  <input className="field" type="date" value={editPropData.completion} onChange={e => setEditPropData(p => ({ ...p, completion: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Overall budget (£)</label>
                  <input className="field" type="number" value={editPropData.totalBudget || ""} onChange={e => setEditPropData(p => ({ ...p, totalBudget: e.target.value }))} placeholder="e.g. 50000" />
                </div>
              </div>

              {/* Rooms */}
              <div>
                <label className="label" style={{ marginBottom: 6 }}>Rooms</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {COMMON_ROOMS.map(r => (
                    <button key={r} onClick={() => setEditPropData(p => ({ ...p, rooms: p.rooms.includes(r) ? p.rooms.filter(x => x !== r) : [...p.rooms, r] }))}
                      style={{ padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", transition: "all .12s",
                        background: editPropData.rooms.includes(r) ? "#1A1A1A" : "white",
                        color: editPropData.rooms.includes(r) ? "white" : "#555",
                        borderColor: editPropData.rooms.includes(r) ? "#1A1A1A" : "#DEDBD6" }}>
                      {r}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="field" value={editPropData.customRoom} onChange={e => setEditPropData(p => ({ ...p, customRoom: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") { const r = editPropData.customRoom.trim(); if (r && !editPropData.rooms.includes(r)) setEditPropData(p => ({ ...p, rooms: [...p.rooms, r], customRoom: "" })); }}}
                    placeholder="Add custom room..." style={{ flex: 1, fontSize: 12 }} />
                  <button className="btn-ghost btn-sm" onClick={() => { const r = editPropData.customRoom.trim(); if (r && !editPropData.rooms.includes(r)) setEditPropData(p => ({ ...p, rooms: [...p.rooms, r], customRoom: "" })); }}>Add</button>
                </div>
                {editPropData.rooms.filter(r => !COMMON_ROOMS.includes(r)).length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    {editPropData.rooms.filter(r => !COMMON_ROOMS.includes(r)).map(r => (
                      <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, background: "#1A1A1A", color: "white" }}>
                        {r}
                        <button onClick={() => setEditPropData(p => ({ ...p, rooms: p.rooms.filter(x => x !== r) }))} style={{ background: "none", border: "none", color: "#AAA", cursor: "pointer", fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid #EEEBE6" }}>
              {confirmDeleteProp ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <span style={{ fontSize: 12, color: "#E53935", flex: 1 }}>Are you sure? This cannot be undone.</span>
                  <button onClick={() => setConfirmDeleteProp(false)}
                    style={{ fontSize: 12, color: "#555", background: "none", border: "1px solid #DDD", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={() => {
                    const id = editPropData.id;
                    const next = props_.filter(p => p.id !== id);
                    setProps_(next);
                    setEditPropData(null);
                    setConfirmDeleteProp(false);
                    if (propId === id) switchProp(next[0].id);
                  }} style={{ fontSize: 12, color: "white", background: "#E53935", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                    Yes, delete
                  </button>
                </div>
              ) : confirmArchiveProp ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <span style={{ fontSize: 12, color: "#888", flex: 1 }}>Archive this property? It will become read-only.</span>
                  <button onClick={() => setConfirmArchiveProp(false)}
                    style={{ fontSize: 12, color: "#555", background: "none", border: "1px solid #DDD", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={() => {
                    const id = editPropData.id;
                    setProps_(prev => prev.map(p => p.id === id ? { ...p, archived: true } : p));
                    setEditPropData(null);
                    setConfirmArchiveProp(false);
                    if (propId === id) {
                      const next = activeProps.filter(p => p.id !== id);
                      if (next.length > 0) switchProp(next[0].id);
                    }
                  }} style={{ fontSize: 12, color: "white", background: "#555", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                    Yes, archive
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 8 }}>
                    {props_.length > 1 && (
                      <button onClick={() => setConfirmDeleteProp(true)}
                        style={{ fontSize: 12, color: "#E53935", background: "none", border: "1px solid #FFCDD2", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                        Delete
                      </button>
                    )}
                    <button onClick={() => setConfirmArchiveProp(true)}
                      style={{ fontSize: 12, color: "#888", background: "none", border: "1px solid #DDD", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                      Archive
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" onClick={() => { setEditPropData(null); setConfirmDeleteProp(false); setConfirmArchiveProp(false); }}>Cancel</button>
                    <button className="btn-primary" onClick={saveEditProp} style={{ opacity: editPropData.name ? 1 : 0.4 }}>Save Changes</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Archived Properties Modal ── */}
      {showArchived && (
        <div className="overlay" onClick={() => setShowArchived(false)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, margin: 0 }}>Archived Properties</h3>
              <button onClick={() => setShowArchived(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#AAA", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            {archivedProps.length === 0 ? (
              <p style={{ fontSize: 13, color: "#AAA", textAlign: "center", padding: "24px 0" }}>No archived properties.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {archivedProps.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #EEEBE6", borderRadius: 10, background: "#FAFAF8" }}>
                    <div style={{ width: 36, height: 36, background: "#EEEBE6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                      <span style={{ color: "#888" }}>⌂</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>{p.address || p.type}</div>
                    </div>
                    <button onClick={() => { setPropId(p.id); setShowArchived(false); setTab("dashboard"); setRoomFilter("All"); }}
                      style={{ fontSize: 12, color: "#555", background: "white", border: "1px solid #DDD", borderRadius: 7, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
                      View
                    </button>
                    <button onClick={() => setProps_(prev => prev.map(x => x.id === p.id ? { ...x, archived: false } : x))}
                      style={{ fontSize: 12, color: "#555", background: "white", border: "1px solid #DDD", borderRadius: 7, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
                      Unarchive
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
