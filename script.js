let totalFloorData = null;

const tileSpecs = {
  "1x1_9": { pcs: 9, weight: 10.5, w: 1, h: 1, coverage: 9 },
  "4x2_3": { pcs: 3, weight: 39, w: 4, h: 2, coverage: 24 },
   "1": { pcs: 8, weight: 12.5, w: 1, h: 1, coverage: 8 },
  "2.25": { pcs: 5, weight: 19, w: 1.5, h: 1.5, coverage: 8.9 },
  "4": { pcs: 4, weight: 26, w: 2, h: 2, coverage: 16 },
  "8": { pcs: 2, weight: 26, w: 4, h: 2, coverage: 16 },
  "1.25": { pcs: 8, weight: 9, w: 1.25, h: 0.83, coverage: 8.33 },
  "1.5": { pcs: 6, weight: 10.5, w: 1.5, h: 1, coverage: 9 },
  "2": { pcs: 5, weight: 12.5, w: 2, h: 1, coverage: 10 },
  "2.75x5.25": { pcs: 2, weight: 52, w: 2.75, h: 5.25, coverage: 28 }
};

function confirmAreaSelection() {
  const allCheckboxes = Array.from(document.querySelectorAll('#checkboxAreaSelector input[type="checkbox"]'));
  const roomInputs = document.getElementById('roomInputs');

  // Always hide the Total Floor section first
  document.getElementById('totalFloorInputs').style.display = 'none';

  // Remove any dynamically created sections for unchecked areas
  allCheckboxes.forEach(cb => {
    const area = cb.value;
    const areaId = `section-${area.replaceAll(' ', '')}`;
    const section = document.getElementById(areaId);
    if (!cb.checked && section) {
      section.remove();
    }
  });

  // Create sections or show the Total Floor Only input
  allCheckboxes.forEach(cb => {
    if (cb.checked) {
      const area = cb.value;
      const cleanArea = area.replaceAll(' ', '');
      const sectionId = `section-${cleanArea}`;

      if (area === "Total Floor Only") {
        // Just show the dedicated Total Floor input area
        document.getElementById('totalFloorInputs').style.display = 'block';
      } else {
        // Create dynamic sections for other areas
        if (!document.getElementById(sectionId)) {
          const section = document.createElement('div');
          section.classList.add('area-section');
          section.id = sectionId;

          section.innerHTML = `
            <h3>${area}</h3>
            <div class="input-group">
              <label><strong>Number of ${area}:</strong></label>
              <input type="number" min="1" value="1" onchange="generateRooms('${area}', this.value)">
            </div>
            <div id="${sectionId}-rooms"></div>
          `;
          roomInputs.appendChild(section);

          // Generate 1 room initially
          generateRooms(area, 1);
        }
      }
    }
  });
}

function generateRooms(area, count) {
  const cleanArea = area.replaceAll(' ', '');
  const roomContainer = document.getElementById(`section-${cleanArea}-rooms`);
  roomContainer.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room-section');

    // Build the tile type checkboxes
    let tileCheckboxes = `
      <label><input type="checkbox" value="Floor" onchange="toggleTileInputs(this)"> Floor Tile</label>
      <label><input type="checkbox" value="Wall" onchange="toggleTileInputs(this)"> Wall Tile</label>
    `;

    // If Kitchen, add Highlight checkbox too
    if (area.toLowerCase() === "kitchen") {
      tileCheckboxes += `
        <label><input type="checkbox" value="Highlight" onchange="toggleTileInputs(this)"> Highlight Tile</label>
      `;
    }

    roomDiv.innerHTML = `
      <h4>${area} - ${i}</h4>

      <div class="input-group">
        <label><strong>Select Tile Type(s):</strong></label><br>
        ${tileCheckboxes}
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
          <option value="1x1_9">1 x 1 (9)</option> <!-- NEW -->
  <option value="4x2_3">4 x 2 (3)</option> <!-- NEW -->
        </select>
        <input type="number" class="floor-price" placeholder="Price per Sq.ft (₹)">
<div class="design-number-wrapper">
    <label for="floorDesignNumber">Design Number</label>
    <input type="text" class="floor-design-number design-number" placeholder="Enter Floor Design Number (optional)">
  </div>
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
        <div class="design-number-wrapper">
    <label for="wallDesignNumber">Design Number</label>
    <input type="text" class="wall-design-number design-number" placeholder="Enter Wall Design Number (optional)">
  </div>
      </div>

      <div class="highlight-tile-inputs" style="display:none;">
        <h5>Highlight Tile Details</h5>
        <select class="highlight-tileSize">
          <option value="1.25">15 x 10</option>
          <option value="1.5">18 x 12</option>
          <option value="2">2 x 1</option>
        </select>
        <input type="number" class="highlight-count" placeholder="Number of Tiles">
        <input type="number" class="highlight-price" placeholder="Price per sq.feet ">
        <div class="design-number-wrapper">
    <label for="highlightDesignNumber">Design Number</label>
    <input type="text" class="highlight-design-number design-number" placeholder="Enter Highlight Design Number (optional)">
  </div>
      </div>

      <button onclick="calculateRoomDetails(this)">📋 Room ${i} Calculation</button>
      <div class="output-details"></div>
    `;
    roomContainer.appendChild(roomDiv);
  }
}

function toggleTileInputs(checkbox) {
  const room = checkbox.closest('.room-section');
  room.querySelector(`.${checkbox.value.toLowerCase()}-tile-inputs`).style.display = checkbox.checked ? 'block' : 'none';
}

function calculateRoomDetails(button) {
  const room = button.closest('.room-section');
  let output = '';
  let totalCost = 0;
  let totalWeight = 0;
  let totalArea = 0;

  ["floor", "wall", "highlight"].forEach(type => {
    const box = room.querySelector(`.${type}-tile-inputs`);
    if (box && box.style.display !== 'none') {
      const tileKey = box.querySelector(`.${type}-tileSize`)?.value;
      const spec = tileSpecs[tileKey];
      if (!spec) return;

      if (type === "highlight") {
        const numTiles = parseInt(box.querySelector('.highlight-count')?.value);
        const pricePerSqft = parseFloat(box.querySelector('.highlight-price')?.value);

        if (!isNaN(numTiles) && !isNaN(pricePerSqft)) {
          const tilesPerBox = spec.pcs;
          const coveragePerBox = spec.coverage;
          const weightPerBox = spec.weight;

          const area = (numTiles / tilesPerBox) * coveragePerBox;
          const cost = area * pricePerSqft;
          const weight = numTiles * (weightPerBox / tilesPerBox);

          totalCost += cost;
          totalWeight += weight;
          totalArea += area;

          output += `
            <h5>🌟 Highlight Tiles</h5>
            <p>Number of Tiles: ${numTiles}</p>
            <p>Total Sq.ft: ${area.toFixed(2)} sq.ft</p>
            <p>Price per Sq.ft: ₹${pricePerSqft.toFixed(2)}</p>
            <p>Total Cost: ₹${cost.toFixed(2)}</p>
            <p>Total Weight: ${weight.toFixed(2)} kg</p>
          `;
        }
      } else {
        const w = parseFloat(box.querySelector(`.${type}-width`)?.value);
        const h = parseFloat(box.querySelector(`.${type}-height`)?.value);
        const p = parseFloat(box.querySelector(`.${type}-price`)?.value);

        if (!isNaN(w) && !isNaN(h) && !isNaN(p)) {
          let tilesPerRow, rows;
         if (tileKey === "2.25") {
  tilesPerRow = Math.ceil((w * 12) / 16);
  rows = Math.ceil((h * 12) / 16);
} else if (tileKey === "2.75x5.25") {
  tilesPerRow = Math.ceil((w * 12) / 63);
  rows = Math.ceil((h * 12) / 31.5);
} else {
  tilesPerRow = Math.ceil(w / spec.w);
  rows = Math.ceil(h / spec.h);
}

          const displayWidth = tileKey === "2.75x5.25" ? rows : tilesPerRow;
          const displayLength = tileKey === "2.75x5.25" ? tilesPerRow : rows;
          const totalTiles = tilesPerRow * rows;

          if (type === "wall") {
            const dark = parseInt(box.querySelector('.wall-dark')?.value) || 0;
            const highlight = parseInt(box.querySelector('.wall-highlight')?.value) || 0;
            const lightInput = box.querySelector('.wall-light')?.value;
            const light = lightInput !== "" ? parseInt(lightInput) : Math.max(0, rows - (dark + highlight));

            const darkBoxes = Math.ceil((dark * tilesPerRow) / spec.pcs);
            const highlightBoxes = Math.ceil((highlight * tilesPerRow) / spec.pcs);
            const lightBoxes = Math.ceil((light * tilesPerRow) / spec.pcs);
            const totalBoxes = darkBoxes + highlightBoxes + lightBoxes;
            const totalWallSqFt = totalBoxes * spec.coverage;
            const cost = totalWallSqFt * p;
            const weight = totalBoxes * spec.weight;

            totalCost += cost;
            totalWeight += weight;
            totalArea += totalWallSqFt;

            output += `
              <h5>🧱 Wall Tile</h5>
              <p>Tiles along Width: ${displayWidth}</p>
              <p>Tiles along Length: ${displayLength}</p>
              <p>Dark Tile Rows: ${dark} → Boxes: ${darkBoxes}</p>
              <p>Highlight Tile Rows: ${highlight} → Boxes: ${highlightBoxes}</p>
              <p>Light Tile Rows: ${light} → Boxes: ${lightBoxes}</p>
              <p>Total Boxes: ${totalBoxes}</p>
              <pre>_______________</pre>
              <p>Total Sq.ft: ${totalWallSqFt.toFixed(2)} sq.ft</p>
              <p>Price per Sq.ft: ₹${p.toFixed(2)}</p>
              <p>Total Cost: ₹${cost.toFixed(2)}</p>
              <p>Total Weight: ${weight.toFixed(2)} kg</p>
            `;
          } else {
            const totalBoxes = Math.ceil(totalTiles / spec.pcs);
            const totalSqFt = totalBoxes * spec.coverage;
            const cost = totalSqFt * p;
            const weight = totalBoxes * spec.weight;

            totalCost += cost;
            totalWeight += weight;
            totalArea += totalSqFt;

            output += `
              <h5>🧱 Floor Tile</h5>
              <p>Tiles along Width: ${displayWidth}</p>
              <p>Tiles along Length: ${displayLength}</p>
              <p>Total Boxes: ${totalBoxes}</p>
              <pre>_______________</pre>
              <p>Total Sq.ft: ${totalSqFt.toFixed(2)} sq.ft</p>
              <p>Price per Sq.ft: ₹${p.toFixed(2)}</p>
              <p>Total Cost: ₹${cost.toFixed(2)}</p>
              <p>Total Weight: ${weight.toFixed(2)} kg</p>
              <pre>_______________</pre>
            `;
          }
        }
      }
    }
  });

  const manualFloorBox = room.querySelector('.manual-floor-inputs');
  if (manualFloorBox) {
    const manualArea = parseFloat(manualFloorBox.querySelector('.manual-floor-area')?.value);
    const manualPrice = parseFloat(manualFloorBox.querySelector('.manual-floor-price')?.value);

    if (!isNaN(manualArea) && !isNaN(manualPrice)) {
      const manualCost = manualArea * manualPrice;
      totalCost += manualCost;
      totalArea += manualArea;

      output += `
        <h5>➕ Additional Floor (Manual Entry)</h5>
        <p>Total Area: ${manualArea.toFixed(2)} sq.ft</p>
        <p>Price per Sq.ft: ₹${manualPrice.toFixed(2)}</p>
        <p>Total Cost: ₹${manualCost.toFixed(2)}</p>
        <p>(Weight not counted)</p>
      `;
    }
  }

  room.querySelector('.output-details').innerHTML = output +
    `<p><strong>Total Room Area:</strong> ${totalArea.toFixed(2)} sq.ft</p>
     <p><strong>Total Room Cost:</strong> ₹${totalCost.toFixed(2)}</p>
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
    let roomCost = 0, roomWeight = 0, roomArea = 0;
    const roomTitle = room.querySelector('h4')?.innerText || "";
    let floorContent = '', wallContent = '', highlightContent = '';

    ["floor", "wall"].forEach(type => {
      const box = room.querySelector(`.${type}-tile-inputs`);
      if (box && box.style.display !== 'none') {
        const w = parseFloat(box.querySelector(`.${type}-width`)?.value);
        const h = parseFloat(box.querySelector(`.${type}-height`)?.value);
        const tileKey = box.querySelector(`.${type}-tileSize`)?.value;
        const p = parseFloat(box.querySelector(`.${type}-price`)?.value);
        const designNumber = box.querySelector(`.${type}-design-number`)?.value || "";

        if (!isNaN(w) && !isNaN(h) && !isNaN(p)) {
          const spec = tileSpecs[tileKey];
          let tilesPerRow, rows;

          if (tileKey === "2.25") {
  tilesPerRow = Math.ceil((w * 12) / 16);
  rows = Math.ceil((h * 12) / 16);
} else if (tileKey === "2.75x5.25") {
  tilesPerRow = Math.ceil((w * 12) / 63);
  rows = Math.ceil((h * 12) / 31.5);
} else {
  tilesPerRow = Math.ceil(w / spec.w);
  rows = Math.ceil(h / spec.h);
}


          const displayWidth = tileKey === "2.75x5.25" ? rows : tilesPerRow;
          const displayLength = tileKey === "2.75x5.25" ? tilesPerRow : rows;
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
              <tr><td colspan="2" style="text-align: center; font-weight: bold;">          ( Design Number : ${designNumber} )</td></tr>
              <tr><td>Tile Width</td><td>${w}</td></tr>
              <tr><td>Tile Length</td><td>${h}</td></tr>
              <tr><td><b>Dark Tile</b></td><td><b>Boxes: ${darkBoxes}</b></td></tr>
              <tr><td><b>Highlight Tile</b></td><td><b>Boxes: ${highlightBoxes}</b></td></tr>
              <tr><td><b>Light Tile</b></td><td><b>Boxes: ${lightBoxes}</b></td></tr>
              <tr><td>Total Box</td><td>${totalBoxes}</td></tr>
              <tr><td>Price Per Sqft</td><td>₹${p.toFixed(2)}</td></tr>
              <tr><td>Total Cost</td><td>₹${cost.toFixed(2)}</td></tr>`;

            roomCost += cost;
            roomWeight += totalBoxes * spec.weight;
          } else {
            const totalBoxes = Math.ceil(totalTiles / spec.pcs);
            const totalSqFt = totalBoxes * spec.coverage;
            const cost = totalSqFt * p;

            floorContent = `
              <tr><td colspan="2" style="text-align: center; font-weight: bold;">          ( Design Number : ${designNumber} )</td></tr>
              <tr><td>Tile Width</td><td>${w}</td></tr>
              <tr><td>Tile Length</td><td>${h}</td></tr>
              <tr><td>Total Box</td><td>${totalBoxes}</td></tr>
              <tr><td>Price Per SqFt</td><td>₹${p.toFixed(2)}</td></tr>
              <tr><td>Total Cost</td><td>₹${cost.toFixed(2)}</td></tr>`;

            roomCost += cost;
            roomWeight += totalBoxes * spec.weight;
          }
        }
      }
    });

    const highlightBox = room.querySelector(".highlight-tile-inputs");
    if (highlightBox && highlightBox.style.display !== 'none') {
      const tileKey = highlightBox.querySelector('.highlight-tileSize')?.value;
      const spec = tileSpecs[tileKey];
      const numTiles = parseInt(highlightBox.querySelector('.highlight-count')?.value);
      const pricePerSqft = parseFloat(highlightBox.querySelector('.highlight-price')?.value);
      const designNumber = highlightBox.querySelector('.highlight-design-number')?.value || "";

      if (!isNaN(numTiles) && !isNaN(pricePerSqft) && spec) {
        const area = (numTiles / spec.pcs) * spec.coverage;
        const cost = area * pricePerSqft;
        const weight = numTiles * (spec.weight / spec.pcs);

        highlightContent = `
          <tr><td colspan="2" style="text-align: center; font-weight: bold;">          ( Design Number : ${designNumber} )</td></tr>
          <tr><td>Number of Tiles</td><td>${numTiles}</td></tr>
          <tr><td>Total Sq.ft</td><td>${area.toFixed(2)}</td></tr>
          <tr><td>Price per Sq.ft</td><td>₹${pricePerSqft.toFixed(2)}</td></tr>
          <tr><td>Total Cost</td><td>₹${cost.toFixed(2)}</td></tr>`;

        roomArea += area;
        roomCost += cost;
        roomWeight += weight;
      }
    }

    if (floorContent || wallContent || highlightContent) {
      let sectionTable = `
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead><tr><th colspan="2">AREA - ${roomTitle}</th></tr></thead>
          <tbody>`;
      if (floorContent) sectionTable += `<tr><td colspan="2"><b>Floor Tile</b></td></tr>${floorContent}`;
      if (wallContent) sectionTable += `<tr><td colspan="2"><b>Wall Tile</b></td></tr>${wallContent}`;
      if (highlightContent) sectionTable += `<tr><td colspan="2"><b>Highlight Tiles</b></td></tr>${highlightContent}`;
      sectionTable += `</tbody></table><br>`;
      printTables += sectionTable;

      grandTotalArea += roomArea;
      grandTotalCost += roomCost;
      grandTotalWeight += roomWeight;
    }
  });

  // ✅ Include Total Floor Calculation Output in Final Summary
  if (window.totalFloorData) {
    const t = window.totalFloorData;
    const floorTable = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead><tr><th colspan="2">AREA - Total Floor</th></tr></thead>
        <tbody>
          <tr><td>Total Area</td><td>${t.area.toFixed(2)} sq.ft</td></tr>
          <tr><td>Total Boxes</td><td>${t.totalBoxes}</td></tr>
          <tr><td>Price per Sq.ft</td><td>₹${t.price.toFixed(2)}</td></tr>
          <tr><td>Total Cost</td><td>₹${t.cost.toFixed(2)}</td></tr>
        </tbody>
      </table><br>`;
    printTables += floorTable;

    grandTotalArea += t.area;
    grandTotalCost += t.cost;
    grandTotalWeight += t.weight;
  }

  // ✅ Side Cutting (Already Correct)
  if (window.sideCuttingData) {
    const s = window.sideCuttingData;
    const sideTable = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead><tr><th colspan="2">AREA - Side Cutting</th></tr></thead>
        <tbody>
          <tr><td>Running Feet</td><td>${s.runningFeet}</td></tr>
          <tr><td>Total Boxes</td><td>${s.totalBoxes}</td></tr>
          <tr><td>Total Sq.Ft</td><td>${s.totalSqFt.toFixed(2)}</td></tr>
          <tr><td>Price per Sq.ft</td><td>₹${s.price.toFixed(2)}</td></tr>
          <tr><td>Total Cost</td><td>₹${s.cost.toFixed(2)}</td></tr>
        </tbody>
      </table><br>`;
    printTables += sideTable;

    grandTotalArea += s.totalSqFt;
    grandTotalCost += s.cost;
    grandTotalWeight += s.weight;
  }

  // ✅ Grand Total with Loading Charges
  const weightRatePerKg = 0.22;
  const weightCost = Math.ceil((grandTotalWeight * weightRatePerKg) / 10) * 10;
  const tileOnlyCost = grandTotalCost;
  const customerTotal = tileOnlyCost + weightCost;
  const roundedTotal = Math.round(customerTotal);

  const grandTable = `
    <table border="1" style="width:100%; border-collapse: collapse;">
      <thead><tr><th colspan="2">GRAND TOTAL</th></tr></thead>
      <tbody>
        <tr><td>Total Area</td><td>${grandTotalArea.toFixed(2)} sq.ft</td></tr>
        <tr><td>Total Weight</td><td>${grandTotalWeight.toFixed(2)} kg</td></tr>
        <tr><td>Total Tile Cost</td><td>₹${tileOnlyCost.toFixed(2)}</td></tr>
        <tr><td>Loading Charges</td><td>₹${weightCost.toFixed(2)}</td></tr>
        <tr><td>Total Customer Amount</td><td><b>₹${roundedTotal}</b></td></tr>
      </tbody>
    </table>`;

  document.getElementById("grandSummaryOutput").innerHTML = `
    <h2 style="text-align:center;">ESTIMATE</h2>
    ${customerDetails}
    ${printTables}
    ${grandTable}`;
}



// 🔘 Add Print Button beside Final Summary Button
document.addEventListener('DOMContentLoaded', () => {
  const finalBtn = document.querySelector('button[onclick="finalSummaryCalculation()"]');
  const printBtn = document.createElement('button');
  printBtn.innerText = '🖨️ Print Estimate';
  printBtn.style = 'margin-left: 10px; padding:10px 20px;font-size:16px;cursor:pointer;background:#4CAF50;color:white;border:none;border-radius:5px;';
  printBtn.onclick = () => {
    const content = document.getElementById("grandSummaryOutput").innerHTML;

    // ✅ Fixed: second copy added
    const twoCopies = `<div style="page-break-after: always;">${content}</div><div>${content}</div>`;

    const printWindow = window.open('', '', 'width=800,height=1000');
    printWindow.document.write(`
  <html>
    <head><title>. </title></head>
    <body>
      ${twoCopies}
      <script>
        window.onload = function() {
          window.print();
          localStorage.removeItem("customerData");
        }
      </script>
    </body>
  </html>
`);
    printWindow.document.close();
  };
  finalBtn.insertAdjacentElement('afterend', printBtn);
});

function calculateTotalFloor() {
  const useDirect = document.getElementById("useDirectSqftCheckbox").checked;

  const directSqft = parseFloat(document.getElementById("directTotalSqft").value);
  const directTileKey = document.getElementById("directSqftTileSize").value;
  const directPrice = parseFloat(document.getElementById("directSqftPrice").value);

  const length = parseFloat(document.getElementById("totalFloorLength").value);
  const width = parseFloat(document.getElementById("totalFloorWidth").value);
  const tileKey = document.getElementById("floorTileSize").value;
  const price = parseFloat(document.getElementById("floorPrice").value);

  const sideFeet = parseFloat(document.getElementById("sideCuttingRunningFeet").value);
  const sideTileKey = document.getElementById("sideTileSize").value;
  const sidePrice = parseFloat(document.getElementById("sidePrice").value);

  let output = '';
  let totalCost = 0;
  let totalArea = 0;
  let totalWeight = 0;
  let totalBoxes = 0;

  // ✅ DIRECT Sq.Ft MODE
  if (useDirect && !isNaN(directSqft) && !isNaN(directPrice)) {
    const spec = tileSpecs[directTileKey];
    const boxes = spec ? Math.ceil(directSqft / spec.coverage) : 0;
    const weight = spec ? boxes * spec.weight : 0;
    const cost = directSqft * directPrice;

    output += `<h4>🧱 Direct Total Sq.Ft</h4>
               <p>Total Area: ${directSqft.toFixed(2)} sq.ft</p>
               <p>Total Boxes: ${boxes}</p>
               <p>Price per Sq.ft: ₹${directPrice.toFixed(2)}</p>
               <p>Total Cost: ₹${cost.toFixed(2)}</p>
               <p>Total Weight: ${weight.toFixed(2)} kg</p>`;

    totalArea = directSqft;
    totalBoxes = boxes;
    totalWeight = weight;
    totalCost = cost;

    window.totalFloorData = {
      mode: "direct",
      area: directSqft,
      totalBoxes: boxes,
      price: directPrice,
      cost,
      weight
    };
  }

  // ✅ LENGTH × WIDTH MODE
  else if (!useDirect && !isNaN(length) && !isNaN(width) && !isNaN(price)) {
    const area = length * width;
    const spec = tileSpecs[tileKey];
    const boxes = Math.ceil(area / spec.coverage);
    const cost = area * price;
    const weight = boxes * spec.weight;

    output += `<h4>🧱 Floor (Length × Width)</h4>
               <p>Area: ${area.toFixed(2)} sq.ft</p>
               <p>Total Boxes: ${boxes}</p>
               <p>Price per Sq.ft: ₹${price.toFixed(2)}</p>
               <p>Total Cost: ₹${cost.toFixed(2)}</p>
               <p>Total Weight: ${weight.toFixed(2)} kg</p>`;

    totalArea = area;
    totalBoxes = boxes;
    totalWeight = weight;
    totalCost = cost;

    window.totalFloorData = {
      mode: "lengthWidth",
      area,
      totalBoxes: boxes,
      price,
      cost,
      weight
    };
  }

  // ✅ SIDE CUTTING — CORRECTED LOGIC ✅
  if (!isNaN(sideFeet) && !isNaN(sidePrice) && sideTileKey) {
    const spec = tileSpecs[sideTileKey];
    const sideBoxes = Math.ceil(sideFeet / 40);
    const sideSqFt = sideBoxes * spec.coverage;
    const sideCost = sideSqFt * sidePrice;
    const sideWeight = sideBoxes * spec.weight;

    output += `<h4>✂️ Side Cutting</h4>
               <p>Running Feet: ${sideFeet}</p>
               <p>Total Boxes: ${sideBoxes}</p>
               <p>Total Area: ${sideSqFt.toFixed(2)} sq.ft</p>
               <p>Price per Sq.ft: ₹${sidePrice.toFixed(2)}</p>
               <p>Total Cost: ₹${sideCost.toFixed(2)}</p>
               <p>Total Weight: ${sideWeight.toFixed(2)} kg</p>`;

    totalCost += sideCost;
    totalWeight += sideWeight;

    window.sideCuttingData = {
      runningFeet: sideFeet,
      totalBoxes: sideBoxes,
      totalSqFt: sideSqFt,
      price: sidePrice,
      cost: sideCost,
      weight: sideWeight
    };
  }

  output += `<hr>
             <p><strong>Total Floor Weight:</strong> ${totalWeight.toFixed(2)} kg</p>
             <p><strong>Total Floor Cost:</strong> ₹${totalCost.toFixed(2)}</p>`;

  document.getElementById("totalFloorOutput").innerHTML = output;
}
function toggleTotalFloorInputs() {
  const floorInputs = document.getElementById("floorInputs");
  const sideCuttingInputs = document.getElementById("sideCuttingInputs");

  const floorCheckbox = document.getElementById("floorCheckbox");
  const sideCuttingCheckbox = document.getElementById("sideCuttingCheckbox");
  const directSqftCheckbox = document.getElementById("useDirectSqftCheckbox");

  // If Total Sq.Ft checkbox is checked, auto-uncheck Floor
  if (directSqftCheckbox.checked && floorCheckbox.checked) {
    floorCheckbox.checked = false;
  }

  // Toggle visibility
  floorInputs.style.display = floorCheckbox.checked ? "block" : "none";
  sideCuttingInputs.style.display = sideCuttingCheckbox.checked ? "block" : "none";

  // Clear values if unchecked
  if (!floorCheckbox.checked) {
    document.getElementById("totalFloorLength").value = "";
    document.getElementById("totalFloorWidth").value = "";
    document.getElementById("floorPrice").value = "";
    document.getElementById("floorTileSize").selectedIndex = 0;
  }

  if (!sideCuttingCheckbox.checked) {
    document.getElementById("sideCuttingRunningFeet").value = "";
    document.getElementById("sidePrice").value = "";
    document.getElementById("sideTileSize").selectedIndex = 0;
    delete window.sideCuttingData;
  }

  if (!directSqftCheckbox.checked) {
    document.getElementById("directTotalSqft").value = "";
    document.getElementById("directSqftPrice").value = "";
    document.getElementById("directSqftTileSize").selectedIndex = 0;
  }

  // Clear output if all unchecked
  if (!floorCheckbox.checked && !sideCuttingCheckbox.checked && !directSqftCheckbox.checked) {
    document.getElementById("totalFloorOutput").innerHTML = "";
    delete window.totalFloorData;
  }

  // Adjust dropdown options based on side cutting
  const tileSizeSelect = document.getElementById("floorTileSize");
  if (sideCuttingCheckbox.checked) {
    tileSizeSelect.innerHTML = `
      <option value="4">2 x 2</option>
      <option value="8">2 x 4</option>
    `;
  } else {
    tileSizeSelect.innerHTML = `
      <option value="1">1 x 1</option>
      <option value="1x1_9">1 x 1 (9)</option>
      <option value="4x2_3">4 x 2 (3)</option>
      <option value="2.25">16 x 16</option>
      <option value="4">2 x 2</option>
      <option value="8">4 x 2</option>
      <option value="2.75x5.25">2.75 x 5.25</option>
    `;
  }
}

function toggleTotalSqftInputs() {
  const isChecked = document.getElementById("useDirectSqftCheckbox").checked;
  document.getElementById("floorInputs").style.display = isChecked ? "none" : "block";
  document.getElementById("directSqftInputs").style.display = isChecked ? "block" : "none";
}