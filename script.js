const tileBoxData = {
  "1": { pcs: 8, weight: 12.5 },
  "2.25": { pcs: 6, weight: 13 },
  "4": { pcs: 4, weight: 26 },
  "8": { pcs: 2, weight: 26 },
  "1.25": { pcs: 8, weight: 9 },
  "1.5": { pcs: 6, weight: 10.5 },
  "2": { pcs: 5, weight: 12.5 }
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
        <label>Number of Rooms in ${area}:</label>
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
      <h4>${area} - Room ${i}</h4>

      <div class="input-group">
        <label>Select Tile Type(s):</label>
        <label><input type="checkbox" value="Floor" onchange="toggleTileInputs(this)"> Floor Tile</label>
        <label><input type="checkbox" value="Wall" onchange="toggleTileInputs(this)"> Wall Tile</label>
      </div>

      <div class="floor-tile-inputs" style="display:none;">
        <h5>Floor Tile Details</h5>
        <input type="number" class="floor-width" placeholder="Floor Width (ft)">
        <input type="number" class="floor-height" placeholder="Floor Height (ft)">
        <select class="floor-tileSize">
          <option value="1">1 x 1 ft (8 pcs - 12.5kg)</option>
          <option value="2.25">1.5 x 1.5 ft (6 pcs - 13kg)</option>
          <option value="4">2 x 2 ft (4 pcs - 26kg)</option>
          <option value="8">4 x 2 ft (2 pcs - 26kg)</option>
        </select>
        <input type="number" class="floor-price" placeholder="Price per Sq.ft (₹)">
        <input type="number" class="floor-dark" placeholder="Dark Tile Rows">
        <input type="number" class="floor-highlight" placeholder="Highlight Tile Rows">
        <input type="number" class="floor-light" placeholder="Light Tile Rows (optional)">
      </div>

      <div class="wall-tile-inputs" style="display:none;">
        <h5>Wall Tile Details</h5>
        <input type="number" class="wall-width" placeholder="Wall Width (ft)">
        <input type="number" class="wall-height" placeholder="Wall Height (ft)">
        <select class="wall-tileSize">
          <option value="1.25">15" x 10" (8 pcs - 9kg)</option>
          <option value="1.5">18" x 12" (6 pcs - 10.5kg)</option>
          <option value="2">24" x 12" (5 pcs - 12.5kg)</option>
        </select>
        <input type="number" class="wall-price" placeholder="Price per Sq.ft (₹)">
        <input type="number" class="wall-dark" placeholder="Dark Tile Rows">
        <input type="number" class="wall-highlight" placeholder="Highlight Tile Rows">
        <input type="number" class="wall-light" placeholder="Light Tile Rows (optional)">
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
  const floorInputs = room.querySelector('.floor-tile-inputs');
  const wallInputs = room.querySelector('.wall-tile-inputs');
  let output = '';
  let totalCost = 0;
  let totalWeight = 0;

  ["floor", "wall"].forEach(type => {
    const box = room.querySelector(`.${type}-tile-inputs`);
    if (box && box.style.display !== 'none') {
      const w = parseFloat(box.querySelector(`.${type}-width`)?.value);
      const h = parseFloat(box.querySelector(`.${type}-height`)?.value);
      const tile = box.querySelector(`.${type}-tileSize`)?.value;
      const p = parseFloat(box.querySelector(`.${type}-price`)?.value);
      if (!isNaN(w) && !isNaN(h) && !isNaN(p)) {
        const area = w * h;
        const tileArea = parseFloat(tile);
        const count = Math.ceil(area / tileArea);
        const boxData = tileBoxData[tile] || { pcs: 1, weight: 0 };
        const boxes = Math.ceil(count / boxData.pcs);
        const cost = area * p;
        totalCost += cost;
        totalWeight += boxes * boxData.weight;

        const dark = parseInt(box.querySelector(`.${type}-dark`)?.value) || 0;
        const highlight = parseInt(box.querySelector(`.${type}-highlight`)?.value) || 0;
        const light = parseInt(box.querySelector(`.${type}-light`)?.value);
        const tilesPerRow = Math.ceil(w / Math.sqrt(tileArea));
        const rows = Math.ceil(h / Math.sqrt(tileArea));
        const calculatedLight = isNaN(light) ? Math.max(0, rows - (dark + highlight)) : light;

        const darkTiles = dark * tilesPerRow;
        const highlightTiles = highlight * tilesPerRow;
        const lightTiles = calculatedLight * tilesPerRow;

        const darkBoxes = Math.ceil(darkTiles / boxData.pcs);
        const highlightBoxes = Math.ceil(highlightTiles / boxData.pcs);
        const lightBoxes = Math.ceil(lightTiles / boxData.pcs);

        output += `<h5>${type === 'floor' ? '🧱 Floor Tile' : '🧱 Wall Tile'}</h5>
          <p>Total Area: ${area.toFixed(2)} sq.ft</p>
          <p>Tiles Required: ${count}</p>
          <p>Tile Size: ${tile} sq.ft</p>
          <p>Tiles along Width: ${tilesPerRow}</p>
          <p>Tiles along Height: ${rows}</p>
          <p>Each Box Contains: ${boxData.pcs} tiles</p>
          <p>Total Boxes: ${boxes}</p>
          <p>Total Tile Area: ${(count * tileArea).toFixed(2)} sq.ft</p>
          <p>Total Cost: ₹${cost.toFixed(2)}</p>
          <p>Total Weight: ${(boxes * boxData.weight).toFixed(2)} kg</p>`;

        if (dark + highlight + calculatedLight > 0) {
          output += `<hr>
            <p><strong>Dark Tile Rows:</strong> ${dark} → Tiles: ${darkTiles} → Boxes: ${darkBoxes}</p>
            <p><strong>Highlight Tile Rows:</strong> ${highlight} → Tiles: ${highlightTiles} → Boxes: ${highlightBoxes}</p>
            <p><strong>Light Tile Rows:</strong> ${calculatedLight} → Tiles: ${lightTiles} → Boxes: ${lightBoxes}</p>`;
        }
      }
    }
  });

  room.querySelector('.output-details').innerHTML = output +
    `<hr><p><strong>Total Room Cost:</strong> ₹${totalCost.toFixed(2)}</p>
     <p><strong>Total Room Weight:</strong> ${totalWeight.toFixed(2)} kg</p>`;
}

function calculateAll() {
  alert("Final Summary logic can be added later — currently under development.");
}
