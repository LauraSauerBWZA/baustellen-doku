const STORAGE_KEY = 'gb-industrieklettern-hochregal-v1';

/* ---- IndexedDB-Archiv für die GBU (eigene DB, getrennt vom Tagesbericht) ---- */
const DB_NAME = 'gbu-industrieklettern', DB_VERSION = 1, STORE = 'beurteilungen';
let dbPromise = null;
function openDB(){
  if(dbPromise) return dbPromise;
  dbPromise = new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = ()=>{ const db=req.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'}); };
    req.onsuccess = ()=>resolve(req.result);
    req.onerror = ()=>reject(req.error);
  });
  return dbPromise;
}
function idbPut(rec){ return openDB().then(db=>new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(rec); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); tx.onabort=()=>rej(tx.error||new Error('Transaktion abgebrochen')); })); }
function idbGet(id){ return openDB().then(db=>new Promise((res,rej)=>{ const r=db.transaction(STORE,'readonly').objectStore(STORE).get(id); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); })); }
function idbGetAll(){ return openDB().then(db=>new Promise((res,rej)=>{ const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll(); r.onsuccess=()=>res(r.result||[]); r.onerror=()=>rej(r.error); })); }
function idbDelete(id){ return openDB().then(db=>new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); })); }
function genId(){ return 'g-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8); }
function today(){ return new Date().toISOString().slice(0,10); }
const clone = o => JSON.parse(JSON.stringify(o));
let currentId = null;

const alternatives = [
  'Hubarbeitsbühne geprüft',
  'Gerüst / Arbeitsplattform geprüft',
  'Regalbediengerät oder Wartungsbühne geprüft',
  'Leiter als ungeeignet bewertet',
  'Seilzugang als geeignet und erforderlich bewertet'
];

const hazards = [
  {
    title: 'Absturz beim Zugang, Umstieg oder Arbeiten',
    desc: 'Gefahr durch ungesicherte Bewegungen, fehlerhafte Seiltechnik oder ungeeignete Arbeitsposition.',
    measures: 'Zwei-Seil-System, getrennte Anschlagpunkte, geprüfte PSA gegen Absturz, keine ungesicherten Umstiege, Aufsicht vor Ort, Arbeiten nur durch qualifizierte Industriekletterer.'
  },
  {
    title: 'Ungeeignete oder nicht freigegebene Anschlagpunkte',
    desc: 'Regalbauteile, Kabeltrassen, Sprinklerleitungen oder dünne Bleche können unzureichend tragfähig sein.',
    measures: 'Anschlagpunkte vorab durch fachkundige Person festlegen und durch Betreiber freigeben lassen. Keine improvisierten Anschläge verwenden. Tragfähigkeit dokumentieren.'
  },
  {
    title: 'Kantenbelastung und Beschädigung der Seile',
    desc: 'Scharfe Regalkanten, Traversen, Blechprofile und Umlenkungen können Seile beschädigen.',
    measures: 'Kantenschutz und Seilschutz einsetzen, Seilverlauf planen, Umlenkungen verwenden, laufende Sichtkontrolle während der Arbeit.'
  },
  {
    title: 'Herabfallende Gegenstände',
    desc: 'Werkzeuge, Kleinteile, Verpackungen oder Lagergut können Personen oder Anlagen treffen.',
    measures: 'Werkzeugfangsicherung, geschlossene Werkzeugtaschen, Sperrbereich, Helm mit Kinnriemen, kritisches Lagergut entfernen oder sichern.'
  },
  {
    title: 'Kollision mit Staplern, Regalbediengeräten oder FTS/AGV',
    desc: 'Innerbetrieblicher Verkehr oder automatische Fördertechnik kann den Arbeitsbereich kreuzen.',
    measures: 'Gang sperren, Anlage sicher abschalten, Wiederanlauf verhindern, Lockout/Tagout, Einweiser oder Sicherungsposten, Freigabe durch Betreiber.'
  },
  {
    title: 'Quetsch- und Scherstellen an Regalanlage und Fördertechnik',
    desc: 'Gefahr durch bewegliche Teile, enge Regalbereiche oder unkontrollierte Pendelbewegung.',
    measures: 'Bewegliche Anlagen stillsetzen, Abstand halten, Seilführung stabilisieren, Pendelbereiche begrenzen, Handschutz verwenden.'
  },
  {
    title: 'Elektrische Gefährdungen',
    desc: 'Kontakt mit Stromschienen, Leuchten, Sensorik, Leitungen oder elektrischer Fördertechnik.',
    measures: 'Elektrische Anlagen identifizieren, Sicherheitsabstände einhalten, erforderlichenfalls spannungsfrei schalten, Elektrofachkraft einbeziehen.'
  },
  {
    title: 'Brand- und Explosionsgefahren',
    desc: 'Gefahr bei brennbaren Lagergütern, Verpackungen, Heißarbeiten, Akkus oder Brandschutzanlagen.',
    measures: 'Gefahrstoff- und Lagergutinfo prüfen, Heißarbeitserlaubnis, Brandwache, Feuerlöscher, keine Anschläge an Sprinklerleitungen, BMA-Schnittstellen klären.'
  },
  {
    title: 'Körperliche Belastung und Hängetrauma',
    desc: 'Langes Hängen im Gurt, Zwangshaltungen oder Rettungsverzug können schwere Folgen haben.',
    measures: 'Arbeitsdauer begrenzen, Sitzbrett einsetzen, Pausen planen, Rettungskonzept mit Material vor Ort, keine Alleinarbeit.'
  },
  {
    title: 'Fehlende Abstimmung mit dem Lagerbetrieb',
    desc: 'Unklare Zuständigkeiten, fehlende Sperrung oder Kommunikationsprobleme erhöhen das Risiko.',
    measures: 'Arbeitsfreigabe, tägliches Briefing, Ansprechpartner Betreiber, Funk/Telefon testen, Stop-Regel definieren.'
  }
];

const rescue = [
  'Rettungskonzept für handlungsfähige Person vorhanden',
  'Rettungskonzept für handlungsunfähige Person vorhanden',
  'Rettungsmaterial am Einsatzort verfügbar',
  'Rettungsteam benannt und eingewiesen',
  'Notrufkette und Treffpunkt für Rettungskräfte festgelegt',
  'Rettungsweg nach unten / oben / seitlich geprüft',
  'Keine Alleinarbeit'
];

const equipment = [
  'Auffang-/Sitzgurt geprüft',
  'Arbeitsseil und Sicherungsseil geprüft',
  'Abseil- und Sicherungsgeräte geprüft',
  'Verbindungsmittel und Karabiner geprüft',
  'Helm mit Kinnriemen vorhanden',
  'Handschuhe und geeignetes Schuhwerk vorhanden',
  'Werkzeuge gegen Herabfallen gesichert',
  'Kantenschutz ausreichend vorhanden',
  'Funk / Telefon getestet',
  'Erste-Hilfe-Material vorhanden'
];

const stops = [
  'Unklare oder nicht freigegebene Anschlagpunkte',
  'Laufender Verkehr im Gefahrenbereich',
  'Fördertechnik oder Regalbediengerät nicht sicher stillgesetzt',
  'Beschädigte Seile, Gurte, Karabiner oder Anschlagmittel',
  'Seilführung über ungeschützte scharfe Kanten',
  'Rettungsbereitschaft nicht gegeben',
  'Unbefugtes Betreten des Sperrbereichs',
  'Beschädigte Regalbauteile im Arbeitsbereich',
  'Kommunikation mit Betreiber nicht sichergestellt'
];

const briefing = [
  'Arbeitsbereich und Sperrbereich besprochen',
  'Anschlagpunkte und Seilverlauf besprochen',
  'Rettungsablauf besprochen',
  'Kommunikation und Stop-Regel besprochen',
  'Besondere Gefährdungen des Lagerbetriebs besprochen',
  'PSA-Sichtprüfung durchgeführt'
];

function key(prefix, i, field='') { return `${prefix}.${i}${field ? '.' + field : ''}`; }

function renderAlternatives() {
  const wrap = document.getElementById('alternatives');
  const tpl = document.getElementById('altTemplate');
  alternatives.forEach((text, i) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.title').textContent = text;
    node.querySelector('input').dataset.field = key('alternative', i, 'checked');
    node.querySelector('textarea').dataset.field = key('alternative', i, 'note');
    wrap.appendChild(node);
  });
}

function renderHazards() {
  const wrap = document.getElementById('hazards');
  const tpl = document.getElementById('hazardTemplate');
  hazards.forEach((h, i) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('h3').textContent = h.title;
    node.querySelector('p').textContent = h.desc;
    node.querySelector('.check input').dataset.field = key('hazard', i, 'done');
    ['wp','sp','wn','sn'].forEach(cls => node.querySelector('.' + cls).dataset.field = key('hazard', i, cls));
    node.querySelector('.measures').dataset.field = key('hazard', i, 'measures');
    node.querySelector('.measures').value = h.measures;
    node.querySelector('.notes').dataset.field = key('hazard', i, 'notes');
    wrap.appendChild(node);
  });
}

function renderChecklist(id, items, prefix) {
  const wrap = document.getElementById(id);
  items.forEach((text, i) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.field = key(prefix, i, 'checked');
    const span = document.createElement('span');
    span.textContent = text;
    label.append(input, span);
    wrap.appendChild(label);
  });
}

function riskClass(value) {
  if (value >= 6) return 'high';
  if (value >= 3) return 'medium';
  return 'low';
}

function updateRisks() {
  document.querySelectorAll('.hazard').forEach(h => {
    const before = Number(h.querySelector('.wp').value) * Number(h.querySelector('.sp').value);
    const after = Number(h.querySelector('.wn').value) * Number(h.querySelector('.sn').value);
    const b = h.querySelector('.before');
    const a = h.querySelector('.after');
    b.textContent = `Risiko vorher: ${before}`;
    a.textContent = `Risiko nachher: ${after}`;
    b.className = `before ${riskClass(before)}`;
    a.className = `after ${riskClass(after)}`;
  });
}

function collectData() {
  const data = {};
  document.querySelectorAll('[data-field]').forEach(el => {
    data[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
  });
  return data;
}

function applyData(data) {
  document.querySelectorAll('[data-field]').forEach(el => {
    const value = data[el.dataset.field];
    if (value === undefined) return;
    if (el.type === 'checkbox') el.checked = Boolean(value);
    else el.value = value;
  });
  updateRisks();
  updateProgress();
}

/* Zentraler Speicherpfad – schreibt die offene Beurteilung nach IndexedDB.
   Gibt ein Promise<boolean> zurück; sichtbarer Fehlerstatus statt lautlosem Scheitern. */
let saveErrorShown = false, saveTimer;
function saveData(showMessage = true) {
  if(!currentId) return Promise.resolve(false);
  const rec = { id: currentId, updatedAt: Date.now(), schema: 1, state: collectData() };
  return idbPut(rec).then(()=>{
    setSaveError(false); saveErrorShown = false;
    if (showMessage) toast('Gespeichert.');
    return true;
  }).catch(err=>{
    console.error('Speichern fehlgeschlagen:', err);
    setSaveError(true);
    if(!saveErrorShown){ saveErrorShown = true; alert('Speichern fehlgeschlagen: Der lokale Datenspeicher (IndexedDB) konnte nicht beschrieben werden – möglicherweise voll oder im privaten Modus blockiert.\n\nBitte „JSON exportieren“, damit nichts verloren geht.'); }
    return false;
  });
}
// Tippen entkoppeln, damit nicht bei jedem Tastendruck geschrieben wird.
function autoSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(()=>saveData(false), 400); }
function setSaveError(show){
  let el = document.getElementById('saveError');
  if(!el){
    el = document.createElement('div'); el.id = 'saveError'; el.className = 'no-print';
    el.style.cssText = 'position:fixed;left:18px;bottom:18px;background:#fee4e2;color:#b42318;border:1px solid #b42318;padding:10px 14px;border-radius:10px;z-index:99;font-weight:700;max-width:320px';
    el.textContent = 'NICHT gespeichert – Speicher voll oder blockiert. Bitte JSON exportieren.';
    document.body.appendChild(el);
  }
  el.hidden = !show;
}

/* ---- Archiv / Übersicht ---- */
let BLANK_STATE = null;                 // Standardzustand inkl. Default-Maßnahmen
function setVisible(el, show){ if(el) el.style.display = show ? '' : 'none'; }
function esc(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function setField(name,val){ const el=document.querySelector(`[data-field="${name}"]`); if(!el) return; if(el.type==='checkbox') el.checked=Boolean(val); else el.value=val; }
function showArchive(){
  if(currentId) saveData(false);
  setVisible(document.getElementById('archivView'), true);
  setVisible(document.querySelector('.layout'), false);
  setVisible(document.querySelector('.top-actions'), false);
  renderArchive();
}
function showEditor(){
  setVisible(document.getElementById('archivView'), false);
  const layout = document.querySelector('.layout'); if(layout) layout.style.display='';
  setVisible(document.querySelector('.top-actions'), true);
  window.scrollTo(0,0);
}
async function renderArchive(){
  let items = [];
  try{ items = await idbGetAll(); }catch(err){ console.error(err); }
  // Sortierung: nach Datum absteigend (neueste zuerst), Tiebreak Speicherzeit.
  items.sort((a,b)=>{ const da=(a.state&&a.state.datum)||'', db=(b.state&&b.state.datum)||''; if(da!==db) return db.localeCompare(da); return (b.updatedAt||0)-(a.updatedAt||0); });
  const list = document.getElementById('archivList');
  if(!items.length){ list.innerHTML = '<p class="hint">Noch keine Beurteilungen. Lege mit „+ Neue Beurteilung“ die erste an.</p>'; return; }
  list.innerHTML = items.map(r=>{
    const s = r.state || {};
    const datum = esc(s.datum || '—');
    const ort = esc(s.einsatzort || s.arbeitsbereich || 'Ohne Einsatzort');
    const firma = esc(s.unternehmen || '');
    const open = currentId===r.id;
    return `<div class="archiv-item${open?' current':''}">
      <div class="archiv-meta"><b>${datum}</b> – ${ort}${firma?` <span class="pill">${firma}</span>`:''}${open?' <span class="pill">geöffnet</span>':''}</div>
      <div class="archiv-actions">
        <button class="primary" onclick="openBeurteilung('${r.id}')">Öffnen</button>
        <button class="secondary" onclick="duplicateBeurteilung('${r.id}')">Duplizieren</button>
        <button class="secondary danger-inline" onclick="deleteBeurteilung('${r.id}')">Löschen</button>
      </div>
    </div>`;
  }).join('');
}
async function openBeurteilung(id){
  try{
    const rec = await idbGet(id);
    if(!rec){ alert('Beurteilung nicht gefunden.'); return renderArchive(); }
    currentId = id;
    applyData(clone(BLANK_STATE));      // erst auf Standard zurücksetzen ...
    applyData(rec.state);               // ... dann gespeicherten Stand einspielen
    showEditor();
  }catch(err){ console.error(err); alert('Beurteilung konnte nicht geöffnet werden.'); }
}
async function newBeurteilung(){
  currentId = genId();
  applyData(clone(BLANK_STATE));
  setField('datum', today());
  await saveData(false);
  showEditor();
}
async function duplicateBeurteilung(id){
  try{
    const rec = await idbGet(id); if(!rec) return;
    await idbPut({ id: genId(), updatedAt: Date.now(), schema: 1, state: clone(rec.state) });
    renderArchive(); toast('Als neue Kopie angelegt.');
  }catch(err){ console.error(err); alert('Duplizieren fehlgeschlagen.'); }
}
async function deleteBeurteilung(id){
  if(!confirm('Diese Beurteilung endgültig löschen? Das kann nicht rückgängig gemacht werden.')) return;
  try{ await idbDelete(id); if(currentId===id) currentId=null; renderArchive(); }
  catch(err){ console.error(err); alert('Löschen fehlgeschlagen.'); }
}

/* ---- Einmalige, nicht-destruktive Migration aus localStorage ---- */
async function migrateFromLocalStorage(){
  const MIG_FLAG = 'gbu-migrated-idb';
  if(localStorage.getItem(MIG_FLAG)==='1') return;
  let raw=null; try{ raw = localStorage.getItem(STORAGE_KEY); }catch(e){}
  if(!raw){ localStorage.setItem(MIG_FLAG,'1'); return; }
  let old=null; try{ old = JSON.parse(raw); }catch(e){ console.warn('Alte GBU nicht lesbar – bleibt unangetastet liegen.'); return; }
  const id = genId();
  await idbPut({ id, updatedAt: Date.now(), schema: 1, state: old });   // wirft bei Fehler → Flag NICHT gesetzt, alte Daten bleiben
  const check = await idbGet(id);                                       // erst nach nachweislichem Schreiben aufräumen
  if(check){ localStorage.setItem(MIG_FLAG,'1'); try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
}

function updateProgress() {
  const checks = [...document.querySelectorAll('input[type="checkbox"][data-field]')];
  const done = checks.filter(c => c.checked).length;
  const percent = checks.length ? Math.round(done / checks.length * 100) : 0;
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressText').textContent = `${percent} % abgeschlossen (${done}/${checks.length})`;
}

function exportJson() {
  // schema an oberster Stelle; Import bleibt rückwärtskompatibel (Dateien ohne
  // schema gelten als Version 0 und werden weiterhin geladen).
  const payload = { schema: 1, ...collectData() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `gefaehrdungsbeurteilung-hochregal-${d}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      const { schema, ...rest } = parsed;   // schema entfernen (Dateien ohne schema = v0)
      currentId = genId();                  // Import = NEUE Beurteilung, überschreibt keine bestehende
      applyData(clone(BLANK_STATE));        // auf Standard zurücksetzen ...
      applyData(rest);                      // ... dann importierte Werte einspielen
      const ok = await saveData(false);
      showEditor();
      toast(ok ? 'Importiert – als neue Beurteilung angelegt.' : 'Importiert, aber Speichern fehlgeschlagen.');
    } catch (e) {
      alert('Die Datei konnte nicht importiert werden. Bitte JSON-Datei prüfen.');
    }
  };
  reader.readAsText(file);
}

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#111827;color:white;padding:12px 16px;border-radius:10px;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.2)';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.hidden = false;
  toastTimer = setTimeout(() => el.hidden = true, 1800);
}

async function init() {
  renderAlternatives();
  renderHazards();
  renderChecklist('rescueChecklist', rescue, 'rescue');
  renderChecklist('equipmentChecklist', equipment, 'equipment');
  renderChecklist('stopChecklist', stops, 'stop');
  renderChecklist('briefingChecklist', briefing, 'briefing');
  BLANK_STATE = collectData();   // Standardzustand (leere Felder + Default-Maßnahmen) erfassen
  updateRisks();
  updateProgress();

  document.body.addEventListener('input', e => {
    if (e.target.matches('[data-field]')) { updateRisks(); updateProgress(); autoSave(); }
  });
  document.body.addEventListener('change', e => {
    if (e.target.matches('[data-field]')) { updateRisks(); updateProgress(); autoSave(); }
  });
  document.getElementById('saveBtn').addEventListener('click', () => saveData(true));
  document.getElementById('printBtn').addEventListener('click', async () => { await saveData(false); window.print(); });
  document.getElementById('exportBtn').addEventListener('click', exportJson);
  document.getElementById('importFile').addEventListener('change', e => e.target.files[0] && importJson(e.target.files[0]));
  document.getElementById('newBtn').addEventListener('click', newBeurteilung);
  document.getElementById('toArchiveBtn').addEventListener('click', showArchive);
  document.getElementById('resetBtn').addEventListener('click', () => {
    if(!currentId) return;
    if (confirm('Alle Eingaben in DIESER Beurteilung wirklich löschen? (Andere Beurteilungen im Archiv bleiben erhalten.)')) {
      applyData(clone(BLANK_STATE)); setField('datum', today()); saveData(false);
    }
  });

  try{ await openDB(); await migrateFromLocalStorage(); }
  catch(err){ console.error('IndexedDB nicht verfügbar:', err); }
  showArchive();
}

init();
