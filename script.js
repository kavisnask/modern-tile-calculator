// ✅ Tile specifications with fixed coverage per box (sq.ft per box from your shop)
const tileSpecs = {
  "1": { pcs: 8, weight: 12.5, w: 1, h: 1, coverage: 8 },
  "2.25": { pcs: 6, weight: 19, w: 1.5, h: 1.5, coverage: 8.9 },
  "4": { pcs: 4, weight: 26, w: 2, h: 2, coverage: 16 },
  "8": { pcs: 2, weight: 26, w: 4, h: 2, coverage: 16 },
  "1.25": { pcs: 8, weight: 9, w: 1.25, h: 0.83, coverage: 8.33 },
  "1.5": { pcs: 6, weight: 10.5, w: 1.5, h: 1, coverage: 9 },
  "2": { pcs: 5, weight: 12.5, w: 2, h: 1, coverage: 10 },
  "2.75x5.25": { pcs: 2, weight: 52, w: 2.75, h: 5.25, coverage: 28 }
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
          <pre>_______________</pre>
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
            <pre>_______________</pre>
            <p>Price per Sq.ft: ₹${p.toFixed(2)}</p>
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
            <pre>_______________</pre>
            <p>Price per Sq.ft: ₹${p.toFixed(2)}</p>
            <p>Total Cost: ₹${cost.toFixed(2)}</p>
            <p>Total Weight: ${(totalBoxes * spec.weight).toFixed(2)} kg</p>
          `;
        }

        output += `<pre>_______________</pre>`;
      }
    }
  });

  room.querySelector('.output-details').innerHTML = output +
    `<p><strong>Total Room Cost:</strong> ₹${totalCost.toFixed(2)}</p>
     <p><strong>Total Room Weight:</strong> ${totalWeight.toFixed(2)} kg</p>`;
}

function finalSummaryCalculation() {
  let grandTotalArea = 0;
  let grandTotalCost = 0;
  let grandTotalWeight = 0;
  let printTables = '';

  const customerData = JSON.parse(localStorage.getItem('customerData')) || {};

  const customerDetails = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <div>
        <div><strong>CUSTOMER NAME:</strong> ${customerData.name || ""}</div>
        <div><strong>CUSTOMER ADDRESS:</strong> ${customerData.address || ""}</div>
        <div><strong>CUSTOMER NUMBER:</strong> ${customerData.mobile || ""}</div>
      </div>
      <div>
        <div><strong>ATTENDER NAME:</strong> ${customerData.attender || ""}</div>
        <div><strong>ATTENDER NUMBER:</strong> ${customerData.attenderMobile || ""}</div>
      </div>
    </div>`;

  const allRooms = document.querySelectorAll(".room-section");
  allRooms.forEach(room => {
    let roomCost = 0;
    let roomWeight = 0;
    let roomArea = 0;
    const roomTitle = room.querySelector('h4')?.innerText || "";
    let floorContent = '', wallContent = '';

    ["floor", "wall"].forEach(type => {
      const box = room.querySelector(`.${type}-tile-inputs`);
      if (box && box.style.display !== 'none') {
        const w = parseFloat(box.querySelector(`.${type}-width`)?.value);
        const h = parseFloat(box.querySelector(`.${type}-height`)?.value);
        const tileKey = box.querySelector(`.${type}-tileSize`)?.value;
        const p = parseFloat(box.querySelector(`.${type}-price`)?.value);
        if (!isNaN(w) && !isNaN(h) && !isNaN(p)) {
          const spec = tileSpecs[tileKey];
          const tilesPerRow = Math.ceil(w / spec.w);
          const rows = Math.ceil(h / spec.h);
          const totalTiles = tilesPerRow * rows;
          const area = w * h;
          roomArea += area;

          if (type === "wall") {
            const dark = parseInt(box.querySelector(`.${type}-dark`)?.value) || 0;
            const highlight = parseInt(box.querySelector(`.${type}-highlight`)?.value) || 0;
            const lightInput = box.querySelector(`.${type}-light`)?.value;
            const light = lightInput !== "" ? parseInt(lightInput) : Math.max(0, rows - (dark + highlight));
            const darkBoxes = Math.ceil((dark * tilesPerRow) / spec.pcs);
            const highlightBoxes = Math.ceil((highlight * tilesPerRow) / spec.pcs);
            const lightBoxes = Math.ceil((light * tilesPerRow) / spec.pcs);
            const totalBoxes = darkBoxes + highlightBoxes + lightBoxes;
            const totalSqFt = totalBoxes * spec.coverage;
            const cost = totalSqFt * p;
            wallContent = `
              <tr><td>Tile along Width</td><td>${tilesPerRow}</td></tr>
              <tr><td>Tile along Length</td><td>${rows}</td></tr>
              <tr><td>Dark Tile</td><td>Boxes: ${darkBoxes}</td></tr>
              <tr><td>Highlight Tile</td><td>Boxes: ${highlightBoxes}</td></tr>
              <tr><td>Light Tile</td><td>Boxes: ${lightBoxes}</td></tr>
              <tr><td>Total Box</td><td>${totalBoxes}</td></tr>
              <tr><td>Price Per Box</td><td>₹${p.toFixed(2)}</td></tr>
              <tr><td>Total Cost</td><td>₹${cost.toFixed(2)}</td></tr>`;
            roomCost += cost;
            roomWeight += totalBoxes * spec.weight;
          } else {
            const totalBoxes = Math.ceil(totalTiles / spec.pcs);
            const totalSqFt = totalBoxes * spec.coverage;
            const cost = totalSqFt * p;
            floorContent = `
              <tr><td>Tile along Width</td><td>${tilesPerRow}</td></tr>
              <tr><td>Tile along Length</td><td>${rows}</td></tr>
              <tr><td>Total Box</td><td>${totalBoxes}</td></tr>
              <tr><td>Price Per Box</td><td>₹${p.toFixed(2)}</td></tr>
              <tr><td>Total Cost</td><td>₹${cost.toFixed(2)}</td></tr>`;
            roomCost += cost;
            roomWeight += totalBoxes * spec.weight;
          }
        }
      }
    });

    if (floorContent || wallContent) {
      let sectionTable = `
  <table border="1" style="width:100%; border-collapse: collapse;">
    <thead><tr><th colspan="2">AREA - ${roomTitle}</th></tr></thead>
    <tbody>`;

if (floorContent) {
  sectionTable += `
    <tr><td colspan="2">Floor Tile</td></tr>
    ${floorContent}`;
}

if (wallContent) {
  sectionTable += `
    <tr><td colspan="2">Wall Tile</td></tr>
    ${wallContent}`;
}

sectionTable += `</tbody></table><br>`;
printTables += sectionTable;

      grandTotalArea += roomArea;
      grandTotalCost += roomCost;
      grandTotalWeight += roomWeight;
    }
  });

  const weightRatePerKg = 2.2;
  let weightCost = Math.ceil((grandTotalWeight * weightRatePerKg) / 10) * 10;
  grandTotalCost += weightCost;

  const grandTable = `
    <table border="1" style="width:100%; border-collapse: collapse;">
      <thead><tr><th colspan="2">GRAND TOTAL</th></tr></thead>
      <tbody>
        <tr><td>Total Area</td><td>${grandTotalArea.toFixed(2)} sq.ft</td></tr>
        <tr><td>Total Weight</td><td>${grandTotalWeight.toFixed(2)} kg</td></tr>
        <tr><td>Total Weight Cost</td><td>₹${weightCost.toFixed(2)}</td></tr>
        <tr><td>Total Customer Amount</td><td>₹${grandTotalCost.toFixed(2)}</td></tr>
      </tbody>
    </table>`;

  const finalOutput = `
    <h2 style="text-align:center;">ESTIMATE</h2>
    ${customerDetails}
    ${printTables}
    ${grandTable}`;

  document.getElementById("grandSummaryOutput").innerHTML = finalOutput;
}

// 🔘 Attach Print Button beside Final Summary button
document.addEventListener('DOMContentLoaded', () => {
  const finalBtn = document.querySelector('button[onclick="finalSummaryCalculation()"]');
  const printBtn = document.createElement('button');
  printBtn.innerText = '🖨️ Print Estimate';
  printBtn.style = 'margin-left: 10px; padding:10px 20px;font-size:16px;cursor:pointer;background:#4CAF50;color:white;border:none;border-radius:5px;';
  printBtn.onclick = () => {
    const content = document.getElementById("grandSummaryOutput").innerHTML;
    const twoCopies = `<div style="page-break-after: always;">${content}</div><div>${content}</div>`;
    const printWindow = window.open('', '', 'width=800,height=1000');
    printWindow.document.write('<html><head><title>Print Estimate</title></head><body>' + twoCopies + '<script>window.onload = function(){ window.print(); localStorage.removeItem("customerData"); }</script></body></html>');
    printWindow.document.close();
  };
  finalBtn.insertAdjacentElement('afterend', printBtn);
});

function printEstimate() {
  const content = document.getElementById("grandSummaryOutput").innerHTML;
  const twoCopies = `<div style="page-break-after: always;">${content}</div><div>${content}</div>`;
  const printWindow = window.open('', '', 'width=800,height=1000');
  printWindow.document.write(`
    <html>
    <head><title>Print Estimate</title></head>
    <body>${twoCopies}
    <script>window.onload = function(){ window.print(); }</script>
    </body>
    </html>`);
  printWindow.document.close();
}

