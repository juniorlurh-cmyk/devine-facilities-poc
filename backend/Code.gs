/**
 * Devine Facilities Management — website backend (Google Apps Script).
 *
 * Backs the static GitHub Pages site with a Google Sheet:
 *   - Leads tab       : enquiry/quote submissions from the website
 *   - Content tab     : key/value CMS content (announcement, service text…)
 *   - Sites tab       : client/site register (visibility controls portal exposure)
 *   - TaskSchedule tab: recurring task schedules per site
 *   - WorkLogs tab    : completed-work log entries (the evidence trail)
 *   - Issues tab      : defect/issue register with status + due dates
 *
 * SETUP (see backend/SETUP.md):
 *   1. Create a Google Sheet, open Extensions > Apps Script, paste this file.
 *   2. Project Settings > Script Properties > add ADMIN_KEY = <a passphrase>.
 *   3. Deploy > New deployment > Web app > Execute as: Me > Access: Anyone.
 *   4. Copy the /exec URL into the site's VITE_SHEETS_API_URL.
 */

const SHEET_LEADS = 'Leads';
const SHEET_CONTENT = 'Content';
const SHEET_SITES = 'Sites';
const SHEET_TASKS = 'TaskSchedule';
const SHEET_WORKLOGS = 'WorkLogs';
const SHEET_ISSUES = 'Issues';

const LEAD_HEADERS = [
  'Timestamp', 'Service', 'Type', 'Name', 'Contact',
  'Ref', 'Preferred', 'Message', 'Status', 'Notes',
];
const CONTENT_HEADERS = ['Key', 'Value', 'Updated', 'UpdatedBy'];
const SITE_HEADERS = ['ID', 'Client', 'Property', 'ServiceScope', 'Supervisor', 'Visibility', 'Status', 'Updated'];
const TASK_HEADERS = ['ID', 'SiteID', 'Task', 'Frequency', 'LastDone', 'NextDue', 'Status', 'Updated'];
const WORKLOG_HEADERS = ['Timestamp', 'SiteID', 'Task', 'By', 'Notes', 'PhotoURL'];
const ISSUE_HEADERS = ['Timestamp', 'SiteID', 'Title', 'Detail', 'Priority', 'Status', 'Due', 'Owner', 'Notes'];

// Demo site seeded on first run so /portal has live data to show.
// Visibility='demo' means it appears on the public portal — use 'internal'
// for real client sites until the client-reporting pilot is agreed.
const SITE_SEED = [
  ['demo-iq-whistling-thorn', 'Demo — Residential Estate', 'iQ Whistling Thorn (illustrative)',
   'Landscaping & garden maintenance + communal-area cleaning', 'Site supervisor (demo)', 'demo', 'active'],
];

const TASK_SEED = [
  ['t1', 'demo-iq-whistling-thorn', 'Lawn mowing — north & south lawns', 'Weekly', '2026-11-10', '2026-11-17', 'scheduled'],
  ['t2', 'demo-iq-whistling-thorn', 'Hedge trimming — perimeter & pool area', 'Fortnightly', '2026-11-03', '2026-11-17', 'scheduled'],
  ['t3', 'demo-iq-whistling-thorn', 'Weeding — all garden beds', 'Weekly', '2026-11-12', '2026-11-19', 'scheduled'],
  ['t4', 'demo-iq-whistling-thorn', 'Communal area cleaning — lobby & walkways', 'Twice weekly', '2026-11-14', '2026-11-17', 'scheduled'],
  ['t5', 'demo-iq-whistling-thorn', 'Irrigation system check', 'Monthly', '2026-10-28', '2026-11-28', 'scheduled'],
  ['t6', 'demo-iq-whistling-thorn', 'Tree pruning — jacaranda avenue', 'Quarterly', '2026-09-15', '2026-12-15', 'scheduled'],
];

function ss() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function adminKey() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '';
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet(name, headers) {
  let sh = ss().getSheetByName(name);
  if (!sh) sh = ss().insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}

function ensureAll() {
  sheet(SHEET_LEADS, LEAD_HEADERS);
  sheet(SHEET_CONTENT, CONTENT_HEADERS);
  const sites = sheet(SHEET_SITES, SITE_HEADERS);
  if (sites.getLastRow() === 1) {
    SITE_SEED.forEach(function (r) {
      sites.appendRow([r[0], r[1], r[2], r[3], r[4], r[5], r[6], new Date().toISOString()]);
    });
  }
  const tasks = sheet(SHEET_TASKS, TASK_HEADERS);
  if (tasks.getLastRow() === 1) {
    TASK_SEED.forEach(function (r) {
      tasks.appendRow([r[0], r[1], r[2], r[3], r[4], r[5], r[6], new Date().toISOString()]);
    });
  }
  sheet(SHEET_WORKLOGS, WORKLOG_HEADERS);
  sheet(SHEET_ISSUES, ISSUE_HEADERS);
}

/* ---------------- reads ---------------- */

function readContent() {
  const sh = sheet(SHEET_CONTENT, CONTENT_HEADERS);
  const out = {};
  const vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    const k = String(vals[i][0] || '').trim();
    if (k) out[k] = String(vals[i][1] == null ? '' : vals[i][1]);
  }
  return out;
}

function readSites() {
  const sh = sheet(SHEET_SITES, SITE_HEADERS);
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    out.push({
      id: String(vals[i][0]),
      client: String(vals[i][1] || ''),
      property: String(vals[i][2] || ''),
      serviceScope: String(vals[i][3] || ''),
      supervisor: String(vals[i][4] || ''),
      visibility: String(vals[i][5] || 'internal'),
      status: String(vals[i][6] || 'active'),
    });
  }
  return out;
}

function readTasks() {
  const sh = sheet(SHEET_TASKS, TASK_HEADERS);
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][1]) continue;
    out.push({
      id: String(vals[i][0] || ''),
      siteId: String(vals[i][1] || ''),
      task: String(vals[i][2] || ''),
      freq: String(vals[i][3] || ''),
      lastDone: String(vals[i][4] || ''),
      nextDue: String(vals[i][5] || ''),
      status: String(vals[i][6] || 'scheduled'),
    });
  }
  return out;
}

function readWorklogs() {
  const sh = sheet(SHEET_WORKLOGS, WORKLOG_HEADERS);
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][2]) continue;
    out.push({
      timestamp: vals[i][0] instanceof Date ? vals[i][0].toISOString() : String(vals[i][0]),
      siteId: String(vals[i][1] || ''),
      task: String(vals[i][2] || ''),
      by: String(vals[i][3] || ''),
      notes: String(vals[i][4] || ''),
      photo: String(vals[i][5] || ''),
    });
  }
  return out.reverse(); // newest first
}

function readIssues() {
  const sh = sheet(SHEET_ISSUES, ISSUE_HEADERS);
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][2]) continue;
    out.push({
      row: i + 1,
      timestamp: vals[i][0] instanceof Date ? vals[i][0].toISOString() : String(vals[i][0]),
      siteId: String(vals[i][1] || ''),
      title: String(vals[i][2] || ''),
      detail: String(vals[i][3] || ''),
      priority: String(vals[i][4] || 'medium'),
      status: String(vals[i][5] || 'open'),
      due: String(vals[i][6] || ''),
      owner: String(vals[i][7] || ''),
      notes: String(vals[i][8] || ''),
    });
  }
  return out.reverse();
}

function readLeads() {
  const sh = sheet(SHEET_LEADS, LEAD_HEADERS);
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][3] && !vals[i][7]) continue;
    out.push({
      row: i + 1,
      timestamp: vals[i][0] instanceof Date ? vals[i][0].toISOString() : String(vals[i][0]),
      division: String(vals[i][1] || ''),
      type: String(vals[i][2] || ''),
      name: String(vals[i][3] || ''),
      contact: String(vals[i][4] || ''),
      ref: String(vals[i][5] || ''),
      preferred: String(vals[i][6] || ''),
      message: String(vals[i][7] || ''),
      status: String(vals[i][8] || 'new'),
      notes: String(vals[i][9] || ''),
    });
  }
  return out.reverse();
}

// Ops data filtered to sites the public portal may see.
function publicOps() {
  const sites = readSites().filter(function (s) { return s.visibility === 'demo' || s.visibility === 'public'; });
  const ids = sites.map(function (s) { return s.id; });
  return {
    sites: sites,
    tasks: readTasks().filter(function (t) { return ids.indexOf(t.siteId) !== -1; }),
    worklogs: readWorklogs().filter(function (w) { return ids.indexOf(w.siteId) !== -1; }),
    issues: readIssues().filter(function (i) { return ids.indexOf(i.siteId) !== -1; }),
  };
}

/* ---------------- writes ---------------- */

function submitLead(body) {
  if (body.website) return json({ ok: true }); // honeypot
  const name = String(body.name || '').trim();
  const contact = String(body.contact || '').trim();
  const message = String(body.message || '').trim();
  if (!name || !contact || !message) return json({ error: 'name, contact and message are required' });

  const sh = sheet(SHEET_LEADS, LEAD_HEADERS);
  sh.appendRow([
    new Date().toISOString(),
    String(body.division || 'General').slice(0, 60),
    String(body.type || 'enquiry').slice(0, 40),
    name.slice(0, 120),
    contact.slice(0, 160),
    String(body.ref || '').slice(0, 160),
    String(body.preferred || '').slice(0, 60),
    message.slice(0, 2000),
    'new',
    '',
  ]);
  return json({ ok: true });
}

function adminOp(body) {
  if (!adminKey()) return json({ error: 'ADMIN_KEY script property is not set — see backend/SETUP.md' });
  if (body.key !== adminKey()) return json({ error: 'unauthorized' });

  const op = String(body.op || '');
  if (op === 'auth') return json({ ok: true });
  if (op === 'listLeads') return json({ leads: readLeads() });
  if (op === 'listContent') return json({ content: readContent() });
  if (op === 'listOps') {
    return json({
      sites: readSites(),
      tasks: readTasks(),
      worklogs: readWorklogs(),
      issues: readIssues(),
    });
  }

  if (op === 'setStatus') {
    const sh = sheet(SHEET_LEADS, LEAD_HEADERS);
    const row = Number(body.row);
    if (!row || row < 2) return json({ error: 'bad row' });
    sh.getRange(row, 9).setValue(String(body.status || 'new').slice(0, 40));
    return json({ ok: true });
  }

  if (op === 'setNotes') {
    const sh = sheet(SHEET_LEADS, LEAD_HEADERS);
    const row = Number(body.row);
    if (!row || row < 2) return json({ error: 'bad row' });
    sh.getRange(row, 10).setValue(String(body.notes || '').slice(0, 1000));
    return json({ ok: true });
  }

  if (op === 'setContent') {
    const key = String(body.key || '').trim().slice(0, 80);
    if (!key) return json({ error: 'key required' });
    const sh = sheet(SHEET_CONTENT, CONTENT_HEADERS);
    const vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]).trim() === key) {
        sh.getRange(i + 1, 2).setValue(String(body.value || '').slice(0, 2000));
        sh.getRange(i + 1, 3).setValue(new Date().toISOString());
        sh.getRange(i + 1, 4).setValue('admin');
        return json({ ok: true });
      }
    }
    sh.appendRow([key, String(body.value || '').slice(0, 2000), new Date().toISOString(), 'admin']);
    return json({ ok: true });
  }

  if (op === 'completeTask') {
    // Marks a scheduled task done and appends a work-log entry.
    const taskId = String(body.taskId || '');
    const siteId = String(body.siteId || '');
    const tasks = sheet(SHEET_TASKS, TASK_HEADERS);
    const tvals = tasks.getDataRange().getValues();
    let task = null;
    for (let i = 1; i < tvals.length; i++) {
      if (String(tvals[i][0]) === taskId && String(tvals[i][1]) === siteId) {
        task = { row: i + 1, task: String(tvals[i][2] || '') };
        tasks.getRange(i + 1, 5).setValue(new Date().toISOString().slice(0, 10)); // LastDone
        tasks.getRange(i + 1, 7).setValue('done');
        tasks.getRange(i + 1, 8).setValue(new Date().toISOString());
        break;
      }
    }
    if (!task) return json({ error: 'task not found' });
    const logs = sheet(SHEET_WORKLOGS, WORKLOG_HEADERS);
    logs.appendRow([
      new Date().toISOString(), siteId, task.task,
      String(body.by || 'Site team').slice(0, 80),
      String(body.notes || 'Completed via admin dashboard').slice(0, 1000),
      String(body.photo || '').slice(0, 500),
    ]);
    return json({ ok: true });
  }

  if (op === 'addIssue') {
    const siteId = String(body.siteId || '').trim();
    const title = String(body.title || '').trim();
    if (!siteId || !title) return json({ error: 'siteId and title are required' });
    const sh = sheet(SHEET_ISSUES, ISSUE_HEADERS);
    sh.appendRow([
      new Date().toISOString(), siteId,
      title.slice(0, 200), String(body.detail || '').slice(0, 1000),
      String(body.priority || 'medium').slice(0, 20), 'open',
      String(body.due || '').slice(0, 20),
      String(body.owner || '').slice(0, 120), '',
    ]);
    return json({ ok: true });
  }

  if (op === 'setIssueStatus') {
    const sh = sheet(SHEET_ISSUES, ISSUE_HEADERS);
    const row = Number(body.row);
    if (!row || row < 2) return json({ error: 'bad row' });
    sh.getRange(row, 6).setValue(String(body.status || 'open').slice(0, 20));
    return json({ ok: true });
  }

  return json({ error: 'unknown op' });
}

function doGet(e) {
  ensureAll();
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'ping') return json({ ok: true });
    if (p.action === 'content') return json({ content: readContent(), sites: readSites().filter(function (s) { return s.visibility === 'demo' || s.visibility === 'public'; }) });
    if (p.action === 'ops') return json(publicOps());
    return json({ error: 'unknown action' });
  } catch (err) {
    return json({ error: String(err) });
  }
}

function doPost(e) {
  ensureAll();
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ error: 'invalid JSON body' });
  }
  try {
    if (body.action === 'lead') return submitLead(body);
    if (body.action === 'admin') return adminOp(body);
    return json({ error: 'unknown action' });
  } catch (err) {
    return json({ error: String(err) });
  }
}
