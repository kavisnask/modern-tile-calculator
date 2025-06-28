// Tile specifications
const tileSpecs = {
  "1": { pcs: 8, weight: 12.5, w: 1, h: 1, coverage: 8 },
  "2.25": { pcs: 6, weight: 13, w: 1.5, h: 1.5, coverage: 9 },
  "4": { pcs: 4, weight: 26, w: 2, h: 2, coverage: 16 },
  "8": { pcs: 2, weight: 26, w: 4, h: 2, coverage: 16 },
  "1.25": { pcs: 8, weight: 9, w: 1.25, h: 0.83, coverage: 8.33 },
  "1.5": { pcs: 6, weight: 10.5, w: 1.5, h: 1, coverage: 9 },
  "2": { pcs: 5, weight: 12.5, w: 2, h: 1, coverage: 10 },
  "2.75x5.25": { pcs: 2, weight: 26, w: 2.75, h: 5.25, coverage: 28.88 }
};

function confirmAreaSelection() {
  const selected = Array.from(document.querySelectorAll('#checkboxAreaSelector input[type="checkbox"]:checked')).map(cb => cb.value);
  const roomInputs = document.getElementById('roomInputs');
  roomInputs.innerHTML = '';

  selected.forEach(area => {
    const section = document.createElement('div');
    section.classList.add('area-section');
    section.innerHTML = `
      <h3>${area}</h3>
      <div class="input-group">
        <label>Number of ${area}</label>
        <input type="number" min="1" value="1" onchange="generateRooms('${area}', this.value)">
      </div>
      <div id="rooms-${area.replaceAll(' ', '')}"></div>
    `;
    roomInputs.appendChild(section);
    generateRooms(area, 1);
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
        const totalBoxes = Math.ceil(totalTiles / spec.pcs);
        const totalTileArea = totalTiles * tileArea;
        const totalWeightThisType = totalBoxes * spec.weight;
        const cost = w * h * p;

        totalCost += cost;
        totalWeight += totalWeightThisType;

        output += `
          <h5>${type === 'floor' ? '🧱 Floor Tile' : '🧱 Wall Tile'}</h5>
          <p>Total Area: ${(w * h).toFixed(2)} sq.ft</p>
          <p>Tile Size: ${spec.w} ft × ${spec.h} ft = ${tileArea.toFixed(2)} sq.ft</p>
          <p>Tiles along Width: ${tilesPerRow}</p>
          <p>Tiles along Height: ${rows}</p>
          <p>Tiles Required: ${totalTiles}</p>
          <pre>________________________________________</pre>
          <p>Each Box Contains: ${spec.pcs} tiles</p>
          <p>Total Boxes: ${totalBoxes}</p>
          <p>Total Tile Area: ${totalTileArea.toFixed(2)} sq.ft</p>
          <pre>________________________________________</pre>
          <p>Price per Sq.ft: ₹${p.toFixed(2)}</p>
          <p>Total Cost: ₹${cost.toFixed(2)}</p>
          <p>Total Weight: ${totalWeightThisType.toFixed(2)} kg</p>
        `;

        if (type === "wall") {
          const dark = parseInt(box.querySelector(`.${type}-dark`)?.value) || 0;
          const highlight = parseInt(box.querySelector(`.${type}-highlight`)?.value) || 0;
          const lightInput = box.querySelector(`.${type}-light`)?.value;
          const light = lightInput !== ""
            ? parseInt(lightInput)
            : Math.max(0, rows - (dark + highlight));

          const darkTiles = dark * tilesPerRow;
          const highlightTiles = highlight * tilesPerRow;
          const lightTiles = light * tilesPerRow;

          const darkBoxes = Math.ceil(darkTiles / spec.pcs);
          const highlightBoxes = Math.ceil(highlightTiles / spec.pcs);
          const lightBoxes = Math.ceil(lightTiles / spec.pcs);

          output += `
            <hr>
            <p>Dark Tile Rows: ${dark} → Tiles: ${darkTiles} → Boxes: ${darkBoxes}</p>
            <p>Highlight Tile Rows: ${highlight} → Tiles: ${highlightTiles} → Boxes: ${highlightBoxes}</p>
            <p>Light Tile Rows: ${light} → Tiles: ${lightTiles} → Boxes: ${lightBoxes}</p>
          `;
        }
      }
    }
  });

  room.querySelector('.output-details').innerHTML = output +
    `<hr><p><strong>Total Room Cost:</strong> ₹${totalCost.toFixed(2)}</p>
     <p><strong>Total Room Weight:</strong> ${totalWeight.toFixed(2)} kg</p>`;
}

function calculateAll() {
  const areaSummary = {};
  let grandTotalAmount = 0;
  let grandTotalWeight = 0;
  let grandTotalArea = 0;

  document.querySelectorAll(".area-section").forEach(areaSection => {
    const areaName = areaSection.querySelector("h3").textContent.trim();
    let areaTotalAmount = 0;
    let areaTotalWeight = 0;
    let areaTotalArea = 0;

    areaSection.querySelectorAll(".room-section").forEach(roomSection => {
      const output = roomSection.querySelector(".output-details");
      if (output && output.innerHTML.trim() !== "") {
        const areaMatch = output.innerHTML.match(/Total Area:\s([\d.]+)\s*sq\.ft/i);
        if (areaMatch) areaTotalArea += parseFloat(areaMatch[1]);

        const costMatch = output.innerHTML.match(/Total Room Cost:<\/strong>\s*₹([\d.]+)/i);
        if (costMatch) areaTotalAmount += parseFloat(costMatch[1]);

        const weightMatch = output.innerHTML.match(/Total Room Weight:<\/strong>\s*([\d.]+)\s*kg/i);
        if (weightMatch) areaTotalWeight += parseFloat(weightMatch[1]);
      }
    });

    if (areaTotalAmount > 0 || areaTotalWeight > 0 || areaTotalArea > 0) {
      areaSummary[areaName] = {
        totalAmount: areaTotalAmount,
        totalWeight: areaTotalWeight,
        totalArea: areaTotalArea
      };

      grandTotalAmount += areaTotalAmount;
      grandTotalWeight += areaTotalWeight;
      grandTotalArea += areaTotalArea;
    }
  });

  const summaryDiv = document.getElementById("summaryContent");
  summaryDiv.innerHTML = "";
  for (const [area, data] of Object.entries(areaSummary)) {
    summaryDiv.innerHTML += `
      <h3>${area}</h3>
      <p><strong>Total Area:</strong> ${data.totalArea.toFixed(2)} sq.ft</p>
      <p><strong>Total Weight:</strong> ${data.totalWeight.toFixed(2)} kg</p>
      <p><strong>Total Amount:</strong> ₹${data.totalAmount.toFixed(2)}</p>
      <hr>
    `;
  }

  summaryDiv.innerHTML += `
    <h3>Grand Total</h3>
    <p><strong>Total Area:</strong> ${grandTotalArea.toFixed(2)} sq.ft</p>
    <p><strong>Total Weight:</strong> ${grandTotalWeight.toFixed(2)} kg</p>
    <p><strong>Total Payable Amount:</strong> ₹${grandTotalAmount.toFixed(2)}</p>
  `;

  document.getElementById("finalSummary").style.display = "block";
}

function printSummary() {
  const summaryElement = document.getElementById("finalSummary");
  if (!summaryElement) {
    alert("Final summary not found.");
    return;
  }

  const summaryContent = summaryElement.outerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding:20px; }
          h2 { margin-top:0; }
          div { border:1px solid #ccc; padding:1em; background:#fff; }
        </style>
      </head>
      <body>
        ${summaryContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
