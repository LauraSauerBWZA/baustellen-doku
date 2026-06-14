const STORAGE_KEY = 'gb-industrieklettern-hochregal-v1';

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

function saveData(showMessage = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()));
  if (showMessage) toast('Gespeichert.');
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyData(JSON.parse(saved));
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
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      applyData(data);
      saveData(false);
      toast('Importiert und gespeichert.');
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

function init() {
  renderAlternatives();
  renderHazards();
  renderChecklist('rescueChecklist', rescue, 'rescue');
  renderChecklist('equipmentChecklist', equipment, 'equipment');
  renderChecklist('stopChecklist', stops, 'stop');
  renderChecklist('briefingChecklist', briefing, 'briefing');
  loadData();
  updateRisks();
  updateProgress();

  document.body.addEventListener('input', e => {
    if (e.target.matches('[data-field]')) {
      updateRisks();
      updateProgress();
      saveData(false);
    }
  });
  document.body.addEventListener('change', e => {
    if (e.target.matches('[data-field]')) {
      updateRisks();
      updateProgress();
      saveData(false);
    }
  });
  document.getElementById('saveBtn').addEventListener('click', () => saveData(true));
  document.getElementById('printBtn').addEventListener('click', () => { saveData(false); window.print(); });
  document.getElementById('exportBtn').addEventListener('click', exportJson);
  document.getElementById('importFile').addEventListener('change', e => e.target.files[0] && importJson(e.target.files[0]));
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Wirklich alle Eingaben löschen?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

init();
