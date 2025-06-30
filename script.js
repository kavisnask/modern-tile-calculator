// ✅ Updated script.js for Smart Tile Calculator (Correct wall tile cost based on actual boxes)

// Tile specifications with fixed coverage per box (sq.ft per box from your shop)
const tileSpecs = {
  "1": { pcs: 8, weight: 12.5, w: 1, h: 1, coverage: 8 },              // 1x1 - 12.5kg
  "2.25": { pcs: 6, weight: 19, w: 1.5, h: 1.5, coverage: 8.9 },       // 16x16 - 19kg
  "4": { pcs: 4, weight: 26, w: 2, h: 2, coverage: 16 },               // 2x2 - 26kg
  "8": { pcs: 2, weight: 26, w: 4, h: 2, coverage: 16 },               // 4x2 - 26kg
  "1.25": { pcs: 8, weight: 9, w: 1.25, h: 0.83, coverage: 8.33 },     // 15x10 - 9kg
  "1.5": { pcs: 6, weight: 10.5, w: 1.5, h: 1, coverage: 9 },          // 18x12 - 10.5kg
  "2": { pcs: 5, weight: 12.5, w: 2, h: 1, coverage: 10 },             // 2x1 - 12.5kg
  "2.75x5.25": { pcs: 2, weight: 52, w: 2.75, h: 5.25, coverage: 28 } // 2.75x5.25 - 52kg
};

function confirmAreaSelection() {
  const selected = Array.from(document.querySelectorAll('#checkboxAreaSelector input[type="checkbox"]:checked')).map(cb => cb.value);
  const roomInputs = document.getElementById('roomInputs');

  selected.forEach(area => {
    const areaId = `rooms-${area.replaceAll(' ', '')}`;
    if (!document.getElementById(areaId)) {
      const section = document.createElement('div');
      section.classList.add('area-section');
      section.innerHTML = `
        <h3>${area}</h3>
        <div class="input-group">
          <label>Number of ${area}</label>
          <input type="number" min="1" value="1" onchange="generateRooms('${area}', this.value)">
        </div>
        <div id="${areaId}"></div>
      `;
      roomInputs.appendChild(section);
      generateRooms(area, 1);
    }
  });
}

function generateRooms(area, count) {
  const cleanArea = area.replaceAll(' ', '');
  const roomSection = document.getElementById(`rooms-${cleanArea}`);
  roomSection.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room-section');
    roomDiv.innerHTML = `
      <h4>${area} - ${i}</h4>

      <div class="input-group">
        <label>Select Tile Type(s):</label><br>
        <label><input type="checkbox" value="Floor" onchange="toggleTileInputs(this)"> Floor Tile</label>
        <label><input type="checkbox" value="Wall" onchange="toggleTileInputs(this)"> Wall Tile</label>
      </div>

      <div class="floor-tile-inputs" style="display:none;">
        <h5>Floor Tile Details</h5>
        <input type="number" class="floor-width" placeholder="Floor Length">
        <input type="number" class="floor-height" placeholder="Floor Width">
        <select class="floor-tileSize">
          <option value="1">1 x 1</option>
          <option value="2.25">16 x 16</option>
          <option value="4">2 x 2</option>
          <option value="8">4 x 2</option>
          <option value="2.75x5.25">2.75 x 5.25</option>
        </select>
        <input type="number" class="floor-price" placeholder="Price per Sq.ft (₹)">
      </div>

      <div class="wall-tile-inputs" style="display:none;">
        <h5>Wall Tile Details</h5>
        <input type="number" class="wall-width" placeholder="Wall Length">
        <input type="number" class="wall-height" placeholder="Wall Height">
        <select class="wall-tileSize">
          <option value="1.25">15 x 10</option>
          <option value="1.5">18 x 12</option>
          <option value="2">2 x 1</option>
        </select>
        <input type="number" class="wall-price" placeholder="Price per Sq.ft (₹)">
        <input type="number" class="wall-dark" placeholder="Dark Tile Rows">
        <input type="number" class="wall-highlight" placeholder="Highlight Tile Rows">
        <input type="number" class="wall-light" placeholder="Light Tile Rows">
      </div>

      <button onclick="calculateRoomDetails(this)">📋 Room ${i} Calculation</button>
      <div class="output-details"></div>
    `;
    roomSection.appendChild(roomDiv);
  }
}

function toggleTileInputs(checkbox) {
  const room = checkbox.closest('.room-section');
  const floorBox = room.querySelector('.floor-tile-inputs');
  const wallBox = room.querySelector('.wall-tile-inputs');
  if (checkbox.value === 'Floor') floorBox.style.display = checkbox.checked ? 'block' : 'none';
  if (checkbox.value === 'Wall') wallBox.style.display = checkbox.checked ? 'block' : 'none';
}

function calculateRoomDetails(button) {
  const room = button.closest('.room-section');
  let output = '';
  let totalCost = 0;
  let totalWeight = 0;

  ["floor", "wall"].forEach(type => {
    const box = room.querySelector(`.${type}-tile-inputs`);
    if (box && box.style.display !== 'none') {
      const w = parseFloat(box.querySelector(`.${type}-width`)?.value);
      const h = parseFloat(box.querySelector(`.${type}-height`)?.value);
      const tileKey = box.querySelector(`.${type}-tileSize`)?.value;
      const p = parseFloat(box.querySelector(`.${type}-price`)?.value);

      if (!isNaN(w) && !isNaN(h) && !isNaN(p)) {
        const spec = tileSpecs[tileKey];
        if (!spec) return;

        const tileArea = spec.w * spec.h;
        const tilesPerRow = Math.ceil(w / spec.w);
        const rows = Math.ceil(h / spec.h);
        const totalTiles = tilesPerRow * rows;

        output += `
          <h5>${type === 'floor' ? '🧱 Floor Tile' : '🧱 Wall Tile'}</h5>
          <p>Total Area: ${(w * h).toFixed(2)} sq.ft</p>
          <p>Tiles along Width: ${tilesPerRow}</p>
          <p>Tiles along Length: ${rows}</p>
          <p>Tiles Required: ${totalTiles}</p>
          <pre>____________________________________________________</pre>
        `;

        if (type === "wall") {
          const dark = parseInt(box.querySelector(`.${type}-dark`)?.value) || 0;
          const highlight = parseInt(box.querySelector(`.${type}-highlight`)?.value) || 0;
          const lightInput = box.querySelector(`.${type}-light`)?.value;
          const light = lightInput !== "" ? parseInt(lightInput) : Math.max(0, rows - (dark + highlight));

          const darkTiles = dark * tilesPerRow;
          const highlightTiles = highlight * tilesPerRow;
          const lightTiles = light * tilesPerRow;

          const darkBoxes = Math.ceil(darkTiles / spec.pcs);
          const highlightBoxes = Math.ceil(highlightTiles / spec.pcs);
          const lightBoxes = Math.ceil(lightTiles / spec.pcs);
          const totalWallBoxes = darkBoxes + highlightBoxes + lightBoxes;
          const totalSqFt = totalWallBoxes * spec.coverage;
          const cost = totalSqFt * p;

          totalCost += cost;
          totalWeight += totalWallBoxes * spec.weight;

          output += `
            <p>Dark Tile Rows: ${dark} → Tiles: ${darkTiles} → Boxes: ${darkBoxes}</p>
            <p>Highlight Tile Rows: ${highlight} → Tiles: ${highlightTiles} → Boxes: ${highlightBoxes}</p>
            <p>Light Tile Rows: ${light} → Tiles: ${lightTiles} → Boxes: ${lightBoxes}</p>
            <p>Total Boxes: ${totalWallBoxes}</p>
            <p>Each Box Contains: ${spec.pcs}</p>
            <pre>____________________________________________________</pre>
            <p>Total Sq.ft (from ${totalWallBoxes} boxes): ${totalSqFt.toFixed(2)} sq.ft</p>
            <p>Total Cost: ₹${cost.toFixed(2)}</p>
            <p>Total Weight: ${(totalWallBoxes * spec.weight).toFixed(2)} kg</p>
          `;
        } else {
          const totalBoxes = Math.ceil(totalTiles / spec.pcs);
          const totalSqFt = totalBoxes * spec.coverage;
          const cost = totalSqFt * p;

          totalCost += cost;
          totalWeight += totalBoxes * spec.weight;

          output += `
            <p>Total Boxes: ${totalBoxes}</p>
            <p>Each Box Contains: ${spec.pcs}</p>
            <p>Total Sq.ft (from ${totalBoxes} boxes): ${totalSqFt.toFixed(2)} sq.ft</p>
            <p>Total Cost: ₹${cost.toFixed(2)}</p>
            <p>Total Weight: ${(totalBoxes * spec.weight).toFixed(2)} kg</p>
          `;
        }

        output += `<pre>_________________________________________________</pre>`;
      }
    }
  });

  room.querySelector('.output-details').innerHTML = output +
    `<p><strong>Total Room Cost:</strong> ₹${totalCost.toFixed(2)}</p>
     <p><strong>Total Room Weight:</strong> ${totalWeight.toFixed(2)} kg</p>`;
}

function calculateAll() {
  // Optional: loop through all rooms and call calculateRoomDetails
}

function printSummary() {
  // Optional: trigger print and then optionally clear fields manually if needed
}
function calculateAll() {
  const allRooms = document.querySelectorAll('.room-section');
  const summaryContent = document.getElementById('summaryContent');
  summaryContent.innerHTML = ''; // Clear previous summary

  let grandTotalArea = 0;
  let grandTotalWeight = 0;
  let grandTotalCost = 0;

  allRooms.forEach((room, idx) => {
    const areaTitle = room.querySelector('h4')?.textContent || `Room ${idx + 1}`;
    const outputBox = room.querySelector('.output-details');

    // Calculate again to make sure data is present
    calculateRoomDetails(room.querySelector('button'));

    const outputHTML = outputBox.innerHTML;
    if (outputHTML.trim()) {
      summaryContent.innerHTML += `<div class="area-section"><h3>${areaTitle}</h3>${outputHTML}</div>`;

      // Extract totals for grand summary
      const areaMatch = outputHTML.match(/Total Area:\s([\d.]+)\s/);
      const costMatch = outputHTML.match(/Total Room Cost:<\/strong>\s₹([\d.]+)/);
      const weightMatch = outputHTML.match(/Total Room Weight:<\/strong>\s([\d.]+)/);

      grandTotalArea += areaMatch ? parseFloat(areaMatch[1]) : 0;
      grandTotalCost += costMatch ? parseFloat(costMatch[1]) : 0;
      grandTotalWeight += weightMatch ? parseFloat(weightMatch[1]) : 0;
    }
  });

  // Append Grand Totals
  summaryContent.innerHTML += `
    <div class="output-details">
      <h3>🏁 Grand Total Summary</h3>
      <p><strong>Total Area:</strong> ${grandTotalArea.toFixed(2)} sq.ft</p>
      <p><strong>Total Weight:</strong> ${grandTotalWeight.toFixed(2)} kg</p>
      <p><strong>Total Customer Payment:</strong> ₹${grandTotalCost.toFixed(2)}</p>
    </div>
  `;

  document.getElementById('finalSummary').style.display = 'block';
}

function printSummary() {
  const summaryHTML = document.getElementById('finalSummary').innerHTML;

  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <html>
    <head>
      <title>Final Summary</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #000;
        }
        h1.title {
          text-align: center;
          color: #2c3e50;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        table th, table td {
          border: 1px solid #888;
          padding: 10px;
          text-align: left;
          vertical-align: top;
        }
        table th {
          background-color: #f2f2f2;
        }
        .copy-title {
          text-align: right;
          font-size: 14px;
          font-style: italic;
          color: #555;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 50px;
        }
      </style>
    </head>
    <body>
      <h1 class="title">JAI THINDAL TILES ESTIMATE</h1>

      <div class="section">
        <div class="copy-title">Copy 1</div>
        ${convertHTMLToTables(summaryHTML)}
      </div>

      <hr style="margin:40px 0;">

      <div class="section">
        <div class="copy-title">Copy 2</div>
        ${convertHTMLToTables(summaryHTML)}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for the content to fully load before printing
  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };

  // Inline helper function to convert raw HTML to table format
  function convertHTMLToTables(rawHTML) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;

    const sections = tempDiv.querySelectorAll('.area-section, .output-details');
    let output = '';

    sections.forEach((section) => {
      const title = section.querySelector('h3')?.textContent || '';
      const lines = section.innerText.split(/\n|\r/).filter(line => line.trim() !== '');

      let rows = '';
      lines.forEach(line => {
        if (line.includes('→')) {
          const [left, right] = line.split('→');
          rows += `<tr><td>${left.trim()}</td><td>${right.trim()}</td></tr>`;
        } else if (line.includes(':')) {
          const [label, value] = line.split(':');
          rows += `<tr><td>${label.trim()}</td><td>${value.trim()}</td></tr>`;
        } else {
          rows += `<tr><td colspan="2">${line.trim()}</td></tr>`;
        }
      });

      output += `
        <h3>${title}</h3>
        <table>${rows}</table>
      `;
    });

    return output;
  }
}
