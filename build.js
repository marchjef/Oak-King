// Builds the site into dist/. No packages needed: just Node.
const fs = require('fs');
const path = require('path');

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dir = path.join(__dirname, 'content/releases');
const all = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
  .sort((a, b) => b.sortOrder - a.sortOrder);
const available = all.filter((r) => r.status === 'Available');
const heroPhotos = (available.length ? available : all).slice(0, 2);

const hero = heroPhotos.map((r) =>
  `      <img src="${esc(r.photo)}" alt="${esc(r.photoAlt)}" width="900" height="1200">`).join('\n');

const fact = (label, value, cls = '') =>
  `<div${cls ? ` class="${cls}"` : ''}><dt>${label}</dt><dd>${esc(value)}</dd></div>`;

const bottles = available.map((r, i) => `  <section class="bottle ${r.color === 'green' ? 'rye' : 'bourbon'}${i % 2 ? ' flip' : ''}">
    <div class="wrap">
      <div class="photo"><img src="${esc(r.photo)}" alt="${esc(r.photoAlt)}" width="900" height="1200" loading="lazy"></div>
      <div class="info">
        <p class="eyebrow">Available now</p>
        <h2>${esc(r.name)}</h2>
        <p class="blurb">${esc(r.blurb)}</p>
        <dl class="facts">
          ${fact('Proof', Number(r.proof).toFixed(2))}
          ${fact('Alc/Vol', Number(r.abv).toFixed(2) + '%')}
          ${fact('Aged', r.age)}
          ${fact('Selected by', r.selectedBy)}
          ${fact('Distilled in', r.distilledIn)}
          ${fact('Bottled in', r.bottledIn)}
          ${fact('Mash bill', r.mashBill, 'wide')}
        </dl>
        ${r.buyUrl ? `<div class="buy-row">
          <a class="btn" href="${esc(r.buyUrl)}" target="_blank" rel="noopener">See price and buy</a>
          <small>Sold and shipped by Buy Spirits Direct</small>
        </div>` : ''}
      </div>
    </div>
  </section>`).join('\n');

const rows = all.map((r) =>
  `            <tr><td>${esc(r.name)}</td><td>${Number(r.proof).toFixed(2)}</td><td>${esc(r.age)}</td><td>${esc(r.status)}</td></tr>`).join('\n');

const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
  .replace('{{HERO}}', () => hero)
  .replace('{{BOTTLES}}', () => bottles)
  .replace('{{ROWS}}', () => rows);

fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
fs.cpSync(path.join(__dirname, 'public'), path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist/index.html'), html);
console.log(`Built ${all.length} releases, ${available.length} available.`);
