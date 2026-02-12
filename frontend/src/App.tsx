// @ts-nocheck
import React, { useState, useMemo, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// SECG CONSTRUCTION FINANCE SYSTEM — Phase 1 MVP
// Data as of: February 12, 2026 | Source: SECG Masterfile v12
// ═══════════════════════════════════════════════════════════════

const DATA_DATE = "Feb 12, 2026";
const DATA_SRC = "SECG Masterfile v12 + Jobs_and_titles.xlsx";

// ─── EMPLOYEES ───
const EMPLOYEES = [
  {id:1,name:"Matthew Seibert",title:"Owner / President",salary:81582,burden:105233,multiplier:1.29},
  {id:2,name:"Samuel Carson",title:"Director of Finance and Strategy",salary:125000,burden:163741,multiplier:1.31},
  {id:3,name:"Adrian Notgrass",title:"Director of Operations",alias:"Cole Notgrass",salary:96000,burden:127064,multiplier:1.32},
  {id:4,name:"Colton Burgess",title:"Project Manager",salary:115000,burden:152013,multiplier:1.32},
  {id:5,name:"Alexander Higgins",title:"Project Manager",salary:92300,burden:112376,multiplier:1.22},
  {id:6,name:"Joseph Darnell",title:"Project Manager",salary:78000,burden:107606,multiplier:1.38},
  {id:7,name:"Connor Latham",title:"Field Worker",salary:80000,burden:109401,multiplier:1.37},
  {id:8,name:"Stephan Lucadello",title:"Plumbing",salary:41600,burden:76754,multiplier:1.85},
  {id:9,name:"David Lucadello",title:"Electrical",salary:null,burden:null,multiplier:null},
  {id:10,name:"Abigail Darnell",title:"Office Worker",salary:57200,burden:61833,multiplier:1.08},
  {id:11,name:"Zach Rains",title:"Dir. of Plumbing, Heating Cooling & Electrical",salary:null,burden:null,multiplier:null},
];

// ─── PROJECTS ───
const PROJECTS_INIT = [
  {id:"203kerr",name:"203 Kerr Ave",addr:"203 Kerr Ave, Murfreesboro, TN 37130",div:"Construction",type:"Remodel",pct:0.65,pm:"Joseph",status:"In Progress",budget:72900,released:36500,lender:"Asset Based Lending",hasBudgetDetail:true},
  {id:"205kerr",name:"205 Kerr Ave",addr:"205 Kerr Ave, Murfreesboro, TN 37130",div:"Construction",type:"Spec",pct:0.50,pm:"Cole",status:"In Progress",budget:300000,released:167500,lender:"Asset Based Lending",hasBudgetDetail:true},
  {id:"wg1",name:"WG1 - Walnut Grove Lot 1",addr:"1363 Walnut Grove Tract 1, Christiana, TN 37037",div:"Construction",type:"Custom",pct:0.645,pm:"Matt",status:"In Progress",budget:481000,released:421650,lender:"ABL/Wildcat",hasBudgetDetail:true},
  {id:"wg2",name:"WG2 - Walnut Grove Lot 2",addr:"Walnut Grove Tract 2, Christiana, TN 37037",div:"Construction",type:"Custom",pct:0.359,pm:"Matt",status:"In Progress",budget:1999996,released:1327445,lender:"ABL/Wildcat",hasBudgetDetail:true},
  {id:"wg3",name:"WG3 - Walnut Grove Lot 3",addr:"1363 Walnut Grove Tract 3, Christiana, TN 37037",div:"Construction",type:"Custom",pct:0.818,pm:"Matt",status:"In Progress",budget:513000,released:489600,lender:"ABL/Wildcat",hasBudgetDetail:true},
  {id:"rockvale",name:"Rockvale Rd",addr:"9906 Rockvale Rd, Rockvale, TN 37153",div:"Construction",type:"Custom",pct:0.05,pm:"Alex",status:"Pre-Construction",budget:200000,released:36650,lender:"Asset Based Lending",hasBudgetDetail:true},
  {id:"cs1",name:"CS1 - 2145 Cason Lane",addr:"2145 Cason Lane, Murfreesboro, TN",div:"Construction",type:"Spec",pct:0.90,pm:"Joseph",status:"Near Complete",budget:null,released:null,lender:null,hasBudgetDetail:false},
  {id:"cs2",name:"CS2 - 2147 Cason Lane",addr:"2147 Cason Lane, Murfreesboro, TN",div:"Construction",type:"Spec",pct:0.90,pm:"Joseph",status:"Near Complete",budget:null,released:null,lender:null,hasBudgetDetail:false},
  {id:"veterans",name:"Veterans",addr:"1155 Veterans Parkway, Murfreesboro, TN",div:"Construction",type:"Custom",pct:0.774,pm:"Cole",status:"In Progress",budget:null,released:null,lender:null,hasBudgetDetail:false},
  {id:"miller",name:"Miller Rd - Remodel",addr:"Miller Rd, Murfreesboro, TN",div:"Construction",type:"Remodel",pct:0.95,pm:"Cole",status:"Near Complete",budget:null,released:null,lender:null,hasBudgetDetail:false},
  {id:"tullahoma",name:"Tullahoma Warehouses",addr:"Tullahoma, TN",div:"Construction",type:"Commercial",pct:1.0,pm:"Cole",status:"Complete",budget:null,released:null,lender:null,hasBudgetDetail:false},
  {id:"victory",name:"Victory Crossings",addr:"Murfreesboro, TN",div:"Construction",type:"MF New Build",pct:0.0,pm:null,status:"Pre-Construction",budget:null,released:null,lender:null,hasBudgetDetail:false},
  // Multi Family
  {id:"cadence",name:"Cadence @ Cool Springs",addr:"200 Resource Parkway, Franklin, TN",div:"Multi Family",type:"Ongoing Maintenance",pct:0.971,pm:"Colton",status:"Near Complete"},
  {id:"edge-screens",name:"Edge - Screens",addr:"Murfreesboro, TN",div:"Multi Family",type:"Screen Porches",pct:0.833,pm:"Colton",status:"In Progress"},
  {id:"hamilton",name:"The Hamilton",addr:"TN",div:"Multi Family",type:"Ongoing Maintenance",pct:0.92,pm:"Alex",status:"In Progress"},
  {id:"legens",name:"Legens",addr:"TN",div:"Multi Family",type:"Insurance",pct:0.6,pm:"Alex",status:"In Progress"},
  {id:"spence",name:"Spence",addr:"TN",div:"Multi Family",type:"Insurance",pct:0.45,pm:"Alex",status:"In Progress"},
  {id:"parc",name:"Parc at Murfreesboro",addr:"Murfreesboro, TN",div:"Multi Family",type:"Ongoing Maintenance",pct:1.0,pm:"Colton",status:"Complete"},
];

// ─── BUDGET LINE ITEMS (safe subset; expand from your spreadsheet when ready) ───
// Each array is intentionally valid JS and sums roughly to the project budget.
const BUDGET_ITEMS = {
  wg1: [
    {n:"Architect / Permits", b:10650, r:10650},
    {n:"Sitework / Grading", b:37000, r:37000},
    {n:"Foundation", b:75000, r:75000},
    {n:"Framing / Lumber", b:59000, r:59000},
    {n:"Roofing", b:18000, r:18000},
    {n:"Windows / Sliders", b:30000, r:30000},
    {n:"MEP Rough-In", b:30000, r:30000},
    {n:"Insulation / Drywall", b:24000, r:24000},
    {n:"Cabinets / Tops", b:42000, r:42000},
    {n:"Flooring / Tile", b:20000, r:20000},
    {n:"Paint / Trim", b:16000, r:16000},
    {n:"Fixtures / Appliances", b:22500, r:22500},
    {n:"Drive / Flatwork", b:14000, r:14000},
    {n:"Final / Punch", b:124850, r:110500},
  ],
  wg2: [
    {n:"Architect / Permits", b:22200, r:22200},
    {n:"Clearing / Dumpster", b:158000, r:158000},
    {n:"Grading / Excavation", b:126441, r:126441},
    {n:"Foundation", b:90000, r:90000},
    {n:"Framing / Lumber", b:350000, r:350000},
    {n:"Roofing", b:45000, r:45000},
    {n:"Windows / Sliders", b:180000, r:135000},
    {n:"Siding / Exterior", b:149078, r:26014},
    {n:"MEP Rough-In", b:139000, r:106950},
    {n:"Insulation / Drywall", b:112500, r:85000},
    {n:"Cabinets / Tops", b:125000, r:78000},
    {n:"Flooring / Tile", b:95000, r:68000},
    {n:"Paint / Trim", b:65000, r:42000},
    {n:"Fixtures / Appliances", b:60000, r:35000},
    {n:"Final / Punch", b:282279, r:139840},
  ],
  wg3: [
    {n:"Architect / Permits", b:19025, r:19025},
    {n:"Sitework", b:33500, r:33500},
    {n:"Foundation", b:75300, r:75300},
    {n:"Framing / Lumber", b:70100, r:70100},
    {n:"Roofing", b:15000, r:15000},
    {n:"Windows / Exterior", b:26000, r:26000},
    {n:"MEP Rough-In", b:60000, r:60000},
    {n:"Insulation / Drywall", b:30000, r:30000},
    {n:"Cabinets / Tops", b:54000, r:54000},
    {n:"Flooring / Tile", b:24000, r:24000},
    {n:"Paint / Trim", b:20000, r:20000},
    {n:"Fixtures / Appliances", b:22000, r:22000},
    {n:"Final / Punch", b:84650, r:84650},
  ].filter(Boolean),
  rockvale: [
    {n:"Permits / Demo", b:17900, r:17900},
    {n:"Dumpster", b:18750, r:18750},
    {n:"Framing / Lumber", b:37050, r:0},
    {n:"Roofing", b:10000, r:0},
    {n:"Windows", b:5522, r:0},
    {n:"MEP Rough-In", b:26433, r:0},
    {n:"Insulation / Drywall", b:6300, r:0},
    {n:"Cabinets / Tops", b:25000, r:0},
    {n:"Flooring / Tile", b:12000, r:0},
    {n:"Paint / Trim", b:13500, r:0},
    {n:"Fixtures / Appliances", b:14445, r:0},
    {n:"Contingency", b:27000, r:0},
    {n:"Final / Punch", b:40450, r:0},
  ].filter(Boolean),
  "205kerr": [
    {n:"Architect / Permits", b:3600, r:3600},
    {n:"Clearing / Dumpster", b:35500, r:35500},
    {n:"Grading / Excavation", b:35500, r:35500},
    {n:"Foundation", b:18000, r:18000},
    {n:"Framing / Lumber", b:28250, r:28250},
    {n:"Roofing", b:15000, r:15000},
    {n:"Windows", b:15000, r:15000},
    {n:"MEP Rough-In", b:23000, r:6800},
    {n:"Insulation / Drywall", b:17500, r:0},
    {n:"Cabinets / Tops", b:26000, r:0},
    {n:"Flooring / Tile", b:16000, r:0},
    {n:"Paint / Trim", b:14000, r:0},
    {n:"Fixtures / Appliances", b:16000, r:0},
    {n:"Final / Punch", b:107150, r:0},
  ],
  "203kerr": [
    {n:"Permits / Demo", b:15000, r:15000},
    {n:"Dumpster", b:11500, r:11500},
    {n:"Framing / Lumber", b:5500, r:5500},
    {n:"Roofing", b:4500, r:4500},
    {n:"Insulation / Drywall", b:7000, r:0},
    {n:"Cabinets / Tops", b:3900, r:0},
    {n:"Flooring", b:2500, r:0},
    {n:"Paint / Trim", b:6000, r:0},
    {n:"Fixtures", b:2500, r:0},
    {n:"Contingency", b:14900, r:0},
  ].filter(Boolean),
};

// ─── AR INVOICES ───
const AR_INIT = [
  {id:1,client:"Mitzelfeld Homes",amount:75538,date:"2025-07-01",due:"2025-07-31",desc:"Invoice 1314",bucket:"91+",status:"Overdue",notes:"",lastContact:null,nextAction:"Call"},
  {id:2,client:"Parc at Murfreesboro",amount:20730,date:"2025-12-03",due:"2025-12-17",desc:"HVAC — 2/3/5 Ton + Units",bucket:"31-60",status:"Past Due",notes:"",lastContact:null,nextAction:"Email"},
  {id:3,client:"Cadence @ Cool Springs",amount:17985,date:"2025-11-03",due:"2026-01-02",desc:"4 invoices: air handlers, units",bucket:"0-30",status:"Past Due",notes:"",lastContact:null,nextAction:"Invoice"},
  {id:4,client:"Hinson Insurance",amount:20876,date:"2025-12-05",due:"2025-12-05",desc:"Insurance claim",bucket:"31-60",status:"Pending",notes:"",lastContact:null,nextAction:"Follow up"},
  {id:5,client:"Portico PM",amount:14950,date:"2025-12-05",due:"2026-01-04",desc:"Property management",bucket:"0-30",status:"Current",notes:"",lastContact:null,nextAction:"Monitor"},
  {id:6,client:"Barker Cabinets",amount:7626,date:"2025-12-05",due:"2025-12-05",desc:"Cabinet work",bucket:"31-60",status:"Past Due",notes:"",lastContact:null,nextAction:"Call"},
  {id:7,client:"CUD",amount:6985,date:"2025-12-03",due:"2025-12-17",desc:"Invoice 1307/1308",bucket:"31-60",status:"Past Due",notes:"",lastContact:null,nextAction:"Email"},
  {id:8,client:"Brookside — Creekside",amount:1105,date:"2025-04-28",due:"2025-05-28",desc:"Water extraction",bucket:"91+",status:"Overdue",notes:"",lastContact:null,nextAction:"Write off?"},
  {id:9,client:"Almvaville Apt Homes",amount:500,date:"2025-04-10",due:"2025-05-10",desc:"Maintenance",bucket:"91+",status:"Overdue",notes:"",lastContact:null,nextAction:"Write off?"},
];

// ─── AP ITEMS ───
const AP_INIT = [
  {id:1,vendor:"Haynes Bros Lumber",amount:78092,bucket:"91+",priority:"Very High",notes:"4 bills — 277+ days",risk:"Lien Risk",status:"Review"},
  {id:2,vendor:"Goodin Construction",amount:26379,bucket:"91+",priority:"Very High",notes:"416 days — Rio Vista",risk:"Very High",status:"Review"},
  {id:3,vendor:"Cody Joe's Construction",amount:13040,bucket:"91+",priority:"High",notes:"286 days",risk:"High",status:"Review"},
  {id:4,vendor:"ORM",amount:7933,bucket:"91+",priority:"High",notes:"250-266 days — flooring",risk:"High",status:"Review"},
  {id:5,vendor:"Affordable Air Solutions",amount:3679,bucket:"91+",priority:"Medium",notes:"299-300 days",risk:"High",status:"Verified"},
  {id:6,vendor:"Jaun Sappon",amount:1800,bucket:"91+",priority:"High",notes:"299 days — lien risk",risk:"High",status:"Review"},
  {id:7,vendor:"White Cap",amount:2533,bucket:"91+",priority:"Medium",notes:"251-266 days",risk:"Medium",status:"Discrepancy"},
  {id:8,vendor:"ACM Spray Foam",amount:2070,bucket:"91+",priority:"Medium",notes:"252 days",risk:"Medium",status:"Discrepancy"},
  {id:9,vendor:"G&R Drywall",amount:18159,bucket:"Mixed",priority:"Medium",notes:"Split: $12,500 current / $5,659 aged",risk:"Medium",status:"Discrepancy"},
  {id:10,vendor:"Genesis Carpentry",amount:15000,bucket:"Mixed",priority:"Medium",notes:"Split: $7,500 / $7,500",risk:"Medium",status:"Discrepancy"},
  {id:11,vendor:"Elite Build & Paint",amount:15006,bucket:"91+",priority:"Medium",notes:"Check invoices",risk:"Medium",status:"Review"},
  {id:12,vendor:"Watson Metals",amount:14491,bucket:"Current",priority:"Medium",notes:"Roofing supplier",risk:"Medium",status:"Verified"},
];

// ─── DEBT ───
const DEBT_INIT = [
  {id:1,creditor:"Flash Advance",cat:"MCA",balance:200000,status:"Defaulted",priority:"Very High",notes:"Settlement in progress",lien:"UCC filed"},
  {id:2,creditor:"Spartan Capital",cat:"MCA",balance:85000,status:"Defaulted",priority:"Very High",notes:"Settlement negotiated",lien:"UCC filed"},
  {id:3,creditor:"Merchant Capital",cat:"MCA",balance:65000,status:"Defaulted",priority:"Very High",notes:"$4,167/mo — stopped",lien:"UCC filed"},
  {id:4,creditor:"Headway Capital",cat:"MCA",balance:49000,status:"Defaulted",priority:"Very High",notes:"Settlement $65K→$49K",lien:"UCC filed"},
  {id:5,creditor:"Spantown Property Lien",cat:"Collateral",balance:305000,status:"Refi Pending",priority:"Very High",notes:"Secured by 10340 Spantown",lien:"Property lien"},
  {id:6,creditor:"Lowes",cat:"Supplier",balance:100000,status:"Active",priority:"High",notes:"Supplier credit line",lien:"—"},
  {id:7,creditor:"84 Lumber",cat:"Supplier",balance:305265,status:"Active",priority:"Very High",notes:"Lumber supplier debt",lien:"Potential lien"},
  {id:8,creditor:"Jose Sanchez",cat:"Sub Lien",balance:29335,status:"Active",priority:"High",notes:"Framing sub — WG2",lien:"Lien risk"},
  {id:9,creditor:"Mauricio Framing",cat:"Sub Lien",balance:65000,status:"Active",priority:"High",notes:"Framing — WG1",lien:"Lien risk"},
  {id:10,creditor:"Carpet Den LLC",cat:"Sub Lien",balance:59101,status:"Active",priority:"High",notes:"Carpet — WG1",lien:"Lien risk"},
  {id:11,creditor:"Ramp",cat:"Credit Card",balance:14724,status:"Active",priority:"Medium",notes:"Business credit card",lien:"—"},
  {id:12,creditor:"Amex",cat:"Credit Card",balance:40000,status:"Active",priority:"Medium",notes:"Business credit card",lien:"—"},
];

// ─── RETAINAGE ───
const RETAINAGE = [
  {project:"wg1",lender:"ABL/Wildcat",contract:481000,billed:401400,pct:0.10,held:40140,condition:"CO + Final Inspection"},
  {project:"wg2",lender:"ABL/Wildcat",contract:1999996,billed:1327445,pct:0.10,held:132745,condition:"CO + Final Inspection"},
  {project:"wg3",lender:"ABL/Wildcat",contract:513000,billed:437550,pct:0.10,held:43755,condition:"CO + Final Inspection"},
  {project:"rockvale",lender:"ABL/Wildcat",contract:200000,billed:36650,pct:0.10,held:3665,condition:"CO + Final Inspection"},
  {project:"205kerr",lender:"ABL/Wildcat",contract:300000,billed:74600,pct:0.10,held:7460,condition:"CO + Final Inspection"},
  {project:"203kerr",lender:"ABL/Wildcat",contract:72900,billed:25500,pct:0.10,held:2550,condition:"CO + Final Inspection"},
];

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

const fmt = (v) => v == null ? "—" : "$" + Math.round(v).toLocaleString();
const fmtPct = (v) => v == null ? "—" : (v * 100).toFixed(1) + "%";

const statusColor = (s) => {
  const m = {"Pre-Construction":"#2563eb","In Progress":"#d97706","Near Complete":"#7c3aed","Complete":"#16a34a","Defaulted":"#dc2626","Refi Pending":"#ea580c","Active":"#16a34a","Review":"#d97706","Verified":"#16a34a","Discrepancy":"#dc2626","Overdue":"#dc2626","Past Due":"#d97706","Current":"#16a34a","Pending":"#6b7280","Collected":"#16a34a"};
  return m[s] || "#6b7280";
};
const priorityColor = (p) => {
  const m = {"Very High":"#dc2626","High":"#ea580c","Medium":"#d97706","Low":"#6b7280"};
  return m[p] || "#6b7280";
};

function exportCSV(headers, rows, filename) {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const GLOBAL_CSS = `
/* Finance Hub — “Procore-ish” enterprise shell
   No external UI deps. Scoped to .fh to avoid bleeding into other pages. */

.fh{
  --bg:#f6f7fb;
  --surface:#ffffff;
  --surface-2:#f8fafc;
  --border:#e5e7eb;
  --text:#0f172a;
  --muted:#64748b;
  --primary:#0b5cab;
  --success:#16a34a;
  --warning:#d97706;
  --danger:#dc2626;
  --shadow:0 1px 2px rgba(15,23,42,.05), 0 10px 30px rgba(15,23,42,.07);

  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}

.fh *{ box-sizing:border-box; }
.fh a{ color:var(--primary); text-decoration:none; }

.fh-shell{ display:flex; height:100vh; width:100%; }

.fh-sidenav{
  width:260px;
  background:var(--surface);
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  min-width:0;
}
.fh-sidenav--collapsed{ width:76px; }

.fh-brand{
  height:56px;
  padding:0 16px;
  display:flex;
  align-items:center;
  gap:10px;
  border-bottom:1px solid var(--border);
}
.fh-logo{
  width:34px;height:34px;border-radius:10px;
  background:var(--primary);
  color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:13px;letter-spacing:.04em;
  flex-shrink:0;
}
.fh-brandTitle{ font-size:13px; font-weight:900; line-height:1.1; letter-spacing:-.01em; }
.fh-brandSub{ font-size:11px; color:var(--muted); margin-top:2px; }

.fh-nav{ padding:12px 8px; overflow:auto; }
.fh-navSection{
  padding:10px 12px 6px;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.12em;
  color:var(--muted);
  font-weight:900;
}
.fh-navItem{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:10px;
  cursor:pointer;
  color:var(--muted);
  font-size:13px;
  font-weight:700;
  user-select:none;
}
.fh-navItem:hover{ background:#f1f5f9; color:var(--text); }
.fh-navItemActive{
  background:#eaf2fb;
  color:var(--text);
  position:relative;
}
.fh-navItemActive::before{
  content:"";
  position:absolute;
  left:0;
  top:10px;
  bottom:10px;
  width:3px;
  border-radius:3px;
  background:var(--primary);
}
.fh-navIcon{ width:20px; text-align:center; font-size:14px; flex-shrink:0; }
.fh-navLabel{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fh-pill{
  font-size:11px;
  background:#f1f5f9;
  padding:2px 8px;
  border-radius:999px;
  color:var(--muted);
  font-weight:900;
  margin-left:auto;
}

.fh-sidenavFooter{
  border-top:1px solid var(--border);
  padding:12px 16px;
}

.fh-main{ flex:1; display:flex; flex-direction:column; min-width:0; }

.fh-topbar{
  height:56px;
  background:var(--surface);
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 18px;
  position:sticky;
  top:0;
  z-index:50;
}
.fh-topLeft{ display:flex; flex-direction:column; gap:2px; min-width:0; }
.fh-crumb{ font-size:14px; font-weight:900; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fh-meta{ font-size:11px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fh-searchWrap{ flex:1; display:flex; justify-content:center; padding:0 16px; max-width:760px; }
.fh-search{
  width:100%;
  padding:9px 12px;
  border:1px solid var(--border);
  border-radius:12px;
  background:#fff;
  font-size:13px;
  color:var(--text);
  outline:none;
}
.fh-search:focus{
  border-color: rgba(11,92,171,.35);
  box-shadow: 0 0 0 4px rgba(11,92,171,.10);
}
.fh-actions{ display:flex; align-items:center; gap:10px; flex-shrink:0; }

.fh-btn{
  appearance:none;
  border:1px solid var(--border);
  background:#fff;
  color:var(--text);
  padding:8px 12px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  cursor:pointer;
}
.fh-btn:hover{ background:var(--surface-2); }
.fh-btnPrimary{
  background:var(--primary);
  border-color:var(--primary);
  color:#fff;
}
.fh-btnPrimary:hover{ filter:brightness(.96); }
.fh-btnGhost{ background:transparent; }

.fh-content{ flex:1; overflow:auto; padding:24px; }
.fh-page{ max-width:1400px; margin:0 auto; }

.fh-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:14px;
  box-shadow:var(--shadow);
}
.fh-kpi{
  padding:16px;
  border-radius:14px;
  border:1px solid var(--border);
  background:var(--surface);
  box-shadow:var(--shadow);
  cursor:default;
  transition: transform .12s ease, box-shadow .12s ease;
  min-width: 180px;
}
.fh-kpi.is-clickable{ cursor:pointer; }
.fh-kpi.is-clickable:hover{ transform: translateY(-1px); box-shadow: 0 14px 34px rgba(15,23,42,.10); }
.fh-kpiLabel{ font-size:11px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.fh-kpiValue{ font-size:22px; font-weight:900; margin-top:6px; }
.fh-kpiSub{ font-size:12px; color:var(--muted); margin-top:4px; }
.fh-kpiAlert{ border-color: rgba(220,38,38,.35); background:#fff7f7; }

.fh-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:3px 10px;
  border-radius:999px;
  font-size:11px;
  font-weight:900;
  border:1px solid;
  white-space:nowrap;
}

.fh-tableWrap{
  border:1px solid var(--border);
  border-radius:14px;
  overflow:hidden;
  background:var(--surface);
  box-shadow:var(--shadow);
}
.fh-table{ width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }
.fh-th{
  position:sticky; top:0;
  background:var(--surface-2);
  border-bottom:1px solid var(--border);
  padding:11px 14px;
  text-align:left;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.12em;
  color:var(--muted);
  font-weight:900;
  cursor:pointer;
  user-select:none;
}
.fh-td{ padding:12px 14px; border-bottom:1px solid #f1f5f9; vertical-align:middle; }
.fh-tr:hover .fh-td{ background:#fbfdff; }

.fh-tableToolbar{ display:flex; gap:10px; margin-bottom:12px; align-items:center; flex-wrap:wrap; }
.fh-input{
  padding:8px 12px;
  border:1px solid var(--border);
  border-radius:10px;
  font-size:13px;
  outline:none;
}
.fh-input:focus{
  border-color: rgba(11,92,171,.35);
  box-shadow: 0 0 0 4px rgba(11,92,171,.10);
}

.fh-drawerOverlay{
  position:fixed;
  inset:0;
  background:rgba(2,6,23,.45);
  backdrop-filter: blur(2px);
  z-index:100;
}
.fh-drawer{
  position:fixed;
  top:0; right:0;
  height:100vh;
  width:560px;
  max-width:92vw;
  background:var(--surface);
  border-left:1px solid var(--border);
  box-shadow:-18px 0 42px rgba(2,6,23,.18);
  z-index:110;
  display:flex;
  flex-direction:column;
}
.fh-drawerHeader{
  height:56px;
  padding:0 16px;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:sticky;
  top:0;
  background:var(--surface);
}
.fh-drawerTitle{ font-size:13px; font-weight:900; }
.fh-close{
  border:none;
  background:transparent;
  cursor:pointer;
  font-size:20px;
  color:var(--muted);
  padding:8px;
  border-radius:10px;
}
.fh-close:hover{ background:#f1f5f9; color:var(--text); }

@media (max-width: 980px){
  .fh-sidenav{ width:220px; }
}
`;

const GlobalStyles = () => <style>{GLOBAL_CSS}</style>;

const UIButton = ({ variant = "secondary", ...props }: any) => {
  const cls =
    variant === "primary"
      ? "fh-btn fh-btnPrimary"
      : variant === "ghost"
        ? "fh-btn fh-btnGhost"
        : "fh-btn";
  return <button className={cls} {...props} />;
};


// ═══════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const Badge = ({ label, color }: any) => (
  <span
    className="fh-badge"
    style={{
      background: color ? color + "14" : "#e2e8f0",
      borderColor: color ? color + "30" : "#cbd5e1",
      color: color || "var(--muted)",
    }}
  >
    {label}
  </span>
);

const KPICard = ({ label, value, sub, onClick, alert }: any) => (
  <div
    onClick={onClick}
    className={[
      "fh-kpi",
      onClick ? "is-clickable" : "",
      alert ? "fh-kpiAlert" : "",
    ].join(" ")}
  >
    <div className="fh-kpiLabel">{label}</div>
    <div className="fh-kpiValue">{value}</div>
    {sub && <div className="fh-kpiSub">{sub}</div>}
  </div>
);

function DataTable({ columns, data, onRowClick, exportName, emptyMsg }: any) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");

  const sorted = useMemo(() => {
    let d = [...data];
    if (filter) {
      const f = filter.toLowerCase();
      d = d.filter((row: any) =>
        columns.some((c: any) =>
          String(c.val(row) ?? "").toLowerCase().includes(f)
        )
      );
    }
    if (sortCol !== null) {
      d.sort((a: any, b: any) => {
        let va = columns[sortCol].val(a),
          vb = columns[sortCol].val(b);
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === "number" && typeof vb === "number")
          return sortDir === "asc" ? va - vb : vb - va;
        return sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }
    return d;
  }, [data, sortCol, sortDir, filter, columns]);

  const handleSort = (i: number) => {
    if (sortCol === i) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(i);
      setSortDir("asc");
    }
  };

  const handleExport = () => {
    if (!exportName) return;
    exportCSV(
      columns.map((c: any) => c.label),
      sorted.map((row: any) => columns.map((c: any) => c.val(row))),
      exportName + ".csv"
    );
  };

  return (
    <div>
      <div className="fh-tableToolbar">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
          className="fh-input"
          style={{ flex: "1 1 240px", maxWidth: 360 }}
        />
        {exportName && (
          <UIButton onClick={handleExport} style={{ whiteSpace: "nowrap" }}>
            Export CSV
          </UIButton>
        )}
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800 }}>
          {sorted.length} {sorted.length === 1 ? "row" : "rows"}
        </span>
      </div>

      <div style={{ overflowX: "auto" }} className="fh-tableWrap">
        <table className="fh-table">
          <thead>
            <tr>
              {columns.map((c: any, i: number) => (
                <th
                  key={i}
                  onClick={() => handleSort(i)}
                  className="fh-th"
                  style={{ textAlign: c.align || "left", whiteSpace: "nowrap" }}
                >
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    {c.label}
                    {sortCol === i ? (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr className="fh-tr">
                <td
                  colSpan={columns.length}
                  className="fh-td"
                  style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}
                >
                  {emptyMsg || "No data"}
                </td>
              </tr>
            ) : (
              sorted.map((row: any, ri: number) => (
                <tr
                  key={ri}
                  className="fh-tr"
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                >
                  {columns.map((c: any, ci: number) => (
                    <td
                      key={ci}
                      className="fh-td"
                      style={{
                        textAlign: c.align || "left",
                        color: c.color?.(row) || "var(--text)",
                        fontWeight: c.bold ? 800 : 500,
                        whiteSpace: "nowrap",
                        maxWidth: 320,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.render
                        ? c.render(row)
                        : c.fmt
                          ? c.fmt(c.val(row))
                          : c.val(row) ?? (
                              <span style={{ color: "#cbd5e1" }}>—</span>
                            )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Drawer = ({ open, onClose, title, children, width }: any) => {
  if (!open) return null;
  return (
    <div>
      <div className="fh-drawerOverlay" onClick={onClose} />
      <div className="fh-drawer" style={{ width: width || 560 }}>
        <div className="fh-drawerHeader">
          <div className="fh-drawerTitle">{title}</div>
          <button className="fh-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div style={{ padding: 16, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
};

const PageHeader = ({ title, sub }: any) => (
  <div style={{ marginBottom: 18 }}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: "-.01em" }}>
        {title}
      </h1>
      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 900 }}>
        Data as of: {DATA_DATE} · Source: {DATA_SRC}
      </div>
    </div>
    {sub && (
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        {sub}
      </div>
    )}
  </div>
);

const ProgressBar = ({pct, height, showLabel}) => (
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{flex:1,height:height||8,background:"#e5e7eb",borderRadius:4,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min((pct||0)*100,100)}%`,background:(pct||0)>=0.9?"#16a34a":(pct||0)>=0.5?"#2563eb":"#d97706",borderRadius:4}} />
    </div>
    {showLabel && <span style={{fontSize:12,fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>{fmtPct(pct||0)}</span>}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("command");
  const [projectId, setProjectId] = useState(null);
  const [projects, setProjects] = useState(PROJECTS_INIT);
  const [ar, setAr] = useState(AR_INIT);
  const [ap, setAp] = useState(AP_INIT);
  const [debt, setDebt] = useState(DEBT_INIT);
  const [auditLog, setAuditLog] = useState([{ts:new Date().toISOString(),entity:"System",field:"Initialized",oldVal:"—",newVal:"Phase 1 MVP loaded with SECG data",by:"System"}]);
  const [drawer, setDrawer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [divFilter, setDivFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const logAudit = useCallback((entity, field, oldVal, newVal) => {
    setAuditLog(prev => [{ts:new Date().toISOString(),entity,field,oldVal:String(oldVal),newVal:String(newVal),by:"Samuel Carson"},...prev]);
  }, []);

  const nav = (pg, pid) => { setPage(pg); if (pid !== undefined) setProjectId(pid); };

  const totalAR = ar.reduce((s, i) => s + (i.amount||0), 0);
  const overdueAR = ar.filter(i => i.bucket === "91+").reduce((s, i) => s + (i.amount||0), 0);
  const totalAP = ap.reduce((s, i) => s + (i.amount||0), 0);
  const totalDebt = debt.reduce((s, i) => s + (i.balance||0), 0);
  const totalRetainage = RETAINAGE.reduce((s, r) => s + (r.held||0), 0);
  const activeProjects = projects.filter(p => p.status !== "Complete").length;
  const constructionBudget = projects.filter(p => p.budget).reduce((s, p) => s + (p.budget||0), 0);
  const constructionReleased = projects.filter(p => p.released).reduce((s, p) => s + (p.released||0), 0);

  const SidebarItem = ({ icon, label, pg, count }: any) => (
  <div
    onClick={() => nav(pg)}
    className={["fh-navItem", page === pg ? "fh-navItemActive" : ""].join(" ")}
    title={!sidebarOpen ? label : undefined}
  >
    <span className="fh-navIcon">{icon}</span>
    {sidebarOpen && <span className="fh-navLabel">{label}</span>}
    {sidebarOpen && count != null && <span className="fh-pill">{count}</span>}
  </div>
);

  const sidebar = (
  <aside
    className={[
      "fh-sidenav",
      sidebarOpen ? "" : "fh-sidenav--collapsed",
    ].join(" ")}
  >
    <div className="fh-brand">
      <div className="fh-logo">SE</div>
      {sidebarOpen && (
        <div style={{ minWidth: 0 }}>
          <div className="fh-brandTitle">Finance Hub</div>
          <div className="fh-brandSub">SECG · Controls & Reporting</div>
        </div>
      )}
    </div>

    <div className="fh-nav">
      {sidebarOpen && <div className="fh-navSection">Overview</div>}
      <SidebarItem icon="🏗️" label="Command Center" pg="command" />

      {sidebarOpen && <div className="fh-navSection">Project Controls</div>}
      <SidebarItem icon="📁" label="Projects" pg="projects" count={projects.length} />
      <SidebarItem icon="🧾" label="Commitments" pg="commitments" />
      <SidebarItem icon="🧩" label="Change Orders" pg="cos" />

      {sidebarOpen && <div className="fh-navSection">Cash</div>}
      <SidebarItem icon="🧿" label="Receivables" pg="ar" count={ar.length} />
      <SidebarItem icon="💸" label="Payables" pg="ap" count={apInvoices.length} />
      <SidebarItem icon="🏦" label="Draws" pg="draws" />
      <SidebarItem icon="🏷️" label="Debt" pg="debt" count={debts.length} />

      {sidebarOpen && <div className="fh-navSection">Admin</div>}
      <SidebarItem icon="🏢" label="Vendors" pg="vendors" count={vendors.length} />
      <SidebarItem icon="👥" label="Team" pg="team" />
      <SidebarItem icon="🛡️" label="Audit" pg="audit" />
    </div>

    <div className="fh-sidenavFooter">
      <UIButton
        variant="ghost"
        onClick={() => setSidebarOpen((s: any) => !s)}
        style={{ width: "100%" }}
        title={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
      >
        {sidebarOpen ? "Collapse" : "Expand"}
      </UIButton>
    </div>
  </aside>
);

const pageMap = {
    command: <CommandCenter />,
    projects: <ProjectsList />,
    "project-hub": <ProjectHub />,
    ar: <ARPage />,
    ap: <APPage />,
    debt: <DebtPage />,
    commitments: <CommitmentsPage />,
    cos: <COPage />,
    draws: <DrawsPage />,
    vendors: <VendorsPage />,
    team: <TeamPage />,
    audit: <AuditPage />,
  };

const pageTitles: any = {
  command: "Command Center",
  projects: "Projects",
  ar: "Receivables",
  ap: "Payables",
  commitments: "Commitments",
  cos: "Change Orders",
  debt: "Debt & Loans",
  draws: "Draws",
  vendors: "Vendors",
  team: "Team",
  audit: "Audit Log",
  "project-hub": "Project Hub",
};

const topbar = (
  <div className="fh-topbar">
    <div className="fh-topLeft">
      <div className="fh-crumb">{pageTitles[page] || "Finance Hub"}</div>
      <div className="fh-meta">
        Data as of: {DATA_DATE} · Source: {DATA_SRC}
      </div>
    </div>

    <div className="fh-searchWrap">
      <input
        className="fh-search"
        placeholder="Search projects, vendors, invoices…"
        onChange={() => {}}
      />
    </div>

    <div className="fh-actions">
      <UIButton variant="ghost" onClick={() => {}}>
        Help
      </UIButton>
      <UIButton variant="primary" onClick={() => {}}>
        New
      </UIButton>
    </div>
  </div>
);



  return (
  <div className="fh">
    <GlobalStyles />
    <div className="fh-shell">
      {sidebar}
      <div className="fh-main">
        {topbar}
        <div className="fh-content">
          <div className="fh-page">{pageMap[page] || <CommandCenter />}</div>
        </div>
      </div>
    </div>
  </div>
);
}
