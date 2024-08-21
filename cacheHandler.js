const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec';

async function fetchDataAndRender() {
  const cacheKey = 'cachedTableData';
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    console.log('Using cached data:', JSON.parse(cachedData));
    renderTable(JSON.parse(cachedData));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    renderTable(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function renderTable(data) {
  console.log("Rendering table...");
  const table = document.getElementById('data-table');
  table.innerHTML = '';

  const mergeMap = {};

  if (data.mergedCells) {
    data.mergedCells.forEach(cell => {
      for (let i = 0; i < cell.numRows; i++) {
        for (let j = 0; j < cell.numColumns; j++) {
          const key = `${cell.row + i}-${cell.column + j}`;
          mergeMap[key] = {
            masterRow: cell.row,
            masterColumn: cell.column,
            rowspan: cell.numRows,
            colspan: cell.numColumns
          };
        }
      }
    });
  }

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    if (data.rowHeights && data.rowHeights[rowIndex]) {
      tr.style.height = data.rowHeights[rowIndex] + 'px';
    }

    row.forEach((cellData, colIndex) => {
      const cellKey = `${rowIndex}-${colIndex}`;
      const mergeInfo = mergeMap[cellKey];

      if (!mergeInfo || (mergeInfo.masterRow === rowIndex && mergeInfo.masterColumn === colIndex)) {
        const td = document.createElement('td');

        if (mergeInfo) {
          if (mergeInfo.rowspan > 1) td.rowSpan = mergeInfo.rowspan;
          if (mergeInfo.colspan > 1) td.colSpan = mergeInfo.colspan;
        }

        td.innerHTML = cellData.text || '';

        td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
        td.style.color = data.fontColors[rowIndex][colIndex] || '';
        td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
        td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
        td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';
        td.style.fontFamily = 'Arial, sans-serif';

        if (data.fontWeights[rowIndex][colIndex] && data.fontWeights[rowIndex][colIndex] === 'bold') {
          td.style.fontWeight = 'bold';
        }
        if (data.fontStyles[rowIndex][colIndex] && data.fontStyles[rowIndex][colIndex] === 'italic') {
          td.style.fontStyle = 'italic';
        }
        if (data.strikethroughs[rowIndex][colIndex]) {
          td.style.textDecoration = 'line-through';
        }

        if (data.columnWidths && data.columnWidths[colIndex]) {
          td.style.width = data.columnWidths[colIndex] + 'px';
        }

        tr.appendChild(td);
      }
    });

    table.appendChild(tr);
  });
  console.log("Table rendering completed.");
}

document.addEventListener('DOMContentLoaded', fetchDataAndRender);
