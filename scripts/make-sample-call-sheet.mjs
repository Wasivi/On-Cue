// Builds sample-data/harbor-unit-ep2-call-sheet.pdf, the sample call sheet
// you upload on the Onboarding screen, from the same data the app loads
// (src/data/samples/harbor-unit-ep2-call-sheet.json). Edit the JSON, then
// run this again so the PDF and the app never disagree:
//
//   node scripts/make-sample-call-sheet.mjs
//
// Needs Google Chrome installed; it prints the page to PDF. Set CHROME_PATH
// if Chrome lives somewhere other than /Applications.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const samples = join(root, 'src/data/samples');
const cs = JSON.parse(readFileSync(join(samples, 'harbor-unit-ep2-call-sheet.json'), 'utf8'));
const logo = readFileSync(join(samples, cs.show.logoUrl)).toString('base64');
const out = join(root, 'sample-data/harbor-unit-ep2-call-sheet.pdf');
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const up = s => esc(String(s).toUpperCase());
const shortName = character => character.trim().split(/\s+/).pop();
const castNames = ids => ids
  .map(id => cs.cast.find(c => c.id === id))
  .filter(Boolean)
  .map(c => shortName(c.character))
  .join(', ');
const li = (label, value) => `<li><b>${up(label)}:</b> ${value}</li>`;
const date = new Date(`${cs.date}T12:00:00`)
  .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const firstCall = cs.calls[0];

const crewPairs = [];
for (let i = 0; i < cs.crew.length; i += 2) {
  crewPairs.push(cs.crew.slice(i, i + 2).map(c => `<b>${up(c.role)}:</b> ${esc(c.name)}`).join(' &nbsp;|&nbsp; '));
}

const scheduleRows = cs.schedule.map(row => row.kind === 'scene'
  ? `<tr><td class="c b">${esc(row.scene)}</td><td class="c">${esc(row.intExt)}</td><td>${esc(row.set)}</td><td class="c">${esc(row.dayNight)}</td><td>${esc(castNames(row.castIds))}</td><td class="c nw">${esc(row.pages)}</td><td>${esc(row.notes)}</td></tr>`
  : `<tr class="event"><td class="c b">${esc(row.time)}</td><td class="c">---</td><td class="b">${up(row.title)}</td><td class="c">${esc(row.dayNight ?? '')}</td><td>${esc(row.who)}</td><td class="c">---</td><td>${esc(row.notes)}</td></tr>`
).join('\n');

const castRows = cs.cast.map(c =>
  `<tr><td class="c b">${c.id}</td><td>${esc(c.actor)}</td><td>${esc(c.character)}</td><td class="c">${esc(c.status)}</td><td class="c">${esc(c.pickup)}</td><td class="c">${esc(c.hmu)}</td><td class="c b">${esc(c.onSet)}</td></tr>`
).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(cs.show.title)} — Call Sheet, Shoot Day ${cs.shootDay}</title>
<style>
  @page { size: Letter; margin: 0.4in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 8.6pt; line-height: 1.35; color: #111; }
  header { display: grid; grid-template-columns: 1.1fr 2fr 1.1fr; gap: 10px; align-items: center; border: 1.5px solid #14304a; padding: 8px 10px; }
  header img { width: 100%; max-width: 170px; height: auto; display: block; }
  .title { text-align: center; }
  .title h1 { margin: 0 0 3px; font-size: 14pt; letter-spacing: 0.02em; }
  .title p { margin: 1px 0; font-size: 8pt; }
  .call { text-align: center; border-left: 1px solid #c8d0d8; padding-left: 8px; }
  .call .label { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.08em; }
  .call .time { font-size: 24pt; font-weight: 800; line-height: 1.05; }
  .call .sub { font-size: 7.5pt; }
  section { margin-top: 8px; }
  h2 { margin: 0 0 4px; padding: 3px 6px; background: #14304a; color: #fff; font-size: 8.4pt; letter-spacing: 0.04em; }
  ul { margin: 0; padding-left: 14px; }
  li { margin: 1.5px 0; }
  ul ul { margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  th { background: #e6ebf0; font-size: 7.4pt; letter-spacing: 0.03em; text-align: left; }
  th, td { border: 0.6pt solid #8d99a5; padding: 3px 4px; vertical-align: top; }
  tr { break-inside: avoid; }
  .c { text-align: center; }
  .b { font-weight: 700; }
  .nw { white-space: nowrap; }
  tr.event td { background: #fdf0e8; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  footer { margin-top: 10px; font-size: 7pt; color: #555; text-align: center; }
</style>
</head>
<body>
<header>
  <img src="data:image/svg+xml;base64,${logo}" alt="${esc(cs.show.title)} logo">
  <div class="title">
    <h1>${up(cs.show.title)} — "${up(cs.show.episodeTitle)}" (Episode ${esc(cs.show.episodeNumber)})</h1>
    <p><b>PRODUCTION COMPANY:</b> ${esc(cs.show.productionCompany)}</p>
    <p><b>DATE:</b> ${esc(date)}</p>
    <p><b>SHOOT DAY:</b> ${cs.shootDay} of ${cs.totalShootDays} &nbsp;|&nbsp; <b>EPISODE STATUS:</b> ${esc(cs.status)}</p>
  </div>
  <div class="call">
    <div class="label">${up(firstCall.label)}</div>
    <div class="time">${esc(firstCall.time)}</div>
    ${cs.calls.slice(1).map(c => `<div class="sub">${up(c.label)} ${esc(c.time)}</div>`).join('\n    ')}
  </div>
</header>

<div class="two">
  <section>
    <h2>1. MASTER PRODUCTION TIMELINE &amp; ENVIRONMENTAL METRICS</h2>
    <ul>
      ${cs.calls.map(c => li(c.label, esc(c.time))).join('\n      ')}
      ${cs.meals.map(m => li(m.label, `${esc(m.time)}${m.note ? ` (${esc(m.note)})` : ''}`)).join('\n      ')}
      ${li('Environmental Weather', esc(cs.weather))}
      ${li('Solar Metrics', `<b>SUNSET:</b> ${esc(cs.sunset)} &nbsp;|&nbsp; <b>TWILIGHT ENDS:</b> ${esc(cs.twilightEnds)}${cs.lightNote ? ` (${esc(cs.lightNote)})` : ''}`)}
    </ul>
  </section>
  <div>
    <section>
      <h2>2. EMERGENCY &amp; HEALTH SAFETY INFORMATION</h2>
      <ul>
        ${li('Nearest Hospital', esc(cs.hospital.name))}
        ${li('Physical Address', `${esc(cs.hospital.address)}${cs.hospital.distance ? ` (${esc(cs.hospital.distance)})` : ''}`)}
        ${cs.safety.map(s => li('Mandatory Safety Cue', `<b>${esc(s.time ?? '')} ${up(s.title)}</b> — ${esc(s.detail)}`)).join('\n        ')}
      </ul>
    </section>
    <section>
      <h2>3. LOCATION &amp; PARKING LOGISTICS</h2>
      <ul>
        ${cs.locations.map(l => [
          li('Primary Set Location', `${esc(l.name)}${l.detail ? ` (${esc(l.detail)})` : ''}`),
          li('Physical Address', esc(l.address)),
          li('Parking Arrangements', l.parking.map(esc).join(' / '))
        ].join('\n        ')).join('\n        ')}
      </ul>
    </section>
  </div>
</div>

<section>
  <h2>4. SHOOTING SCHEDULE &amp; SCENE CHRONOLOGY</h2>
  <table>
    <thead><tr><th class="c">SCENE</th><th class="c">INT/EXT</th><th>SET DESCRIPTION</th><th class="c">D/N</th><th>CAST ID</th><th class="c">PAGES</th><th>TECHNICAL / SCENE NOTES</th></tr></thead>
    <tbody>
${scheduleRows}
    </tbody>
  </table>
</section>

<section>
  <h2>5. CAST CALLING &amp; TALENT METRICS</h2>
  <table>
    <thead><tr><th class="c">CAST ID</th><th>TALENT NAME</th><th>CHARACTER ROLE</th><th class="c">STATUS</th><th class="c">PICKUP</th><th class="c">HMU/CHAIR</th><th class="c">ON-SET CALL</th></tr></thead>
    <tbody>
${castRows}
    </tbody>
  </table>
</section>

<section>
  <h2>6. EXECUTIVE CREW &amp; DEPARTMENTAL LEADS</h2>
  <ul>
    ${crewPairs.map(p => `<li>${p}</li>`).join('\n    ')}
  </ul>
</section>

<section>
  <h2>7. DEPARTMENTS, LOGISTICS, &amp; WARDROBE CONTINUITY NOTES</h2>
  <ul>
    ${cs.departmentNotes.map(d => `<li><b>${up(d.department)}${d.owners.length ? ` (${esc(d.owners.join(' / '))})` : ''}:</b>
      <ul>${d.notes.map(n => `<li>${n.subject ? `<b>${esc(n.subject)}:</b> ` : ''}${esc(n.text)}</li>`).join('')}</ul>
    </li>`).join('\n    ')}
  </ul>
</section>

<section>
  <h2>8. ADVANCE SCHEDULE: TOMORROW'S PREDICTIVE TRACKING</h2>
  <ul>
    ${li('Anticipated Call Time', `${esc(cs.advance.callTime)}${cs.advance.note ? ` (${esc(cs.advance.note)})` : ''}`)}
    ${li('Anticipated Set Locations', cs.advance.locations.map(esc).join(' / '))}
    ${li('Anticipated Scenes', cs.advance.scenes.map(esc).join(', '))}
  </ul>
</section>

<footer>Fictional demo production for On-Cue. Every name, place, and event on this sheet is invented.</footer>
</body>
</html>
`;

const dir = mkdtempSync(join(tmpdir(), 'on-cue-call-sheet-'));
const page = join(dir, 'call-sheet.html');
writeFileSync(page, html);
try {
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
    `--print-to-pdf=${out}`, pathToFileURL(page).href
  ], { stdio: 'ignore' });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`Wrote ${out}`);
