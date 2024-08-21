async function fetchAndCacheData() {
  try {
    console.log("Starting data fetch process");

    const pagePath = window.location.pathname;
    const cacheKey = `cachedTableData_${pagePath}`;
    const hashKey = `dataHash_${pagePath}`;

    console.log("Checking for cached data");
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log("Cached data found, rendering table");
      renderTable(JSON.parse(cachedData), false);
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('data-table').style.display = '';
      return;
    }

    console.log("No cached data found, fetching new data");
    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');

    if (!response.ok) {
      console.error(`Failed to fetch data, status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Data fetch successful, parsing data");
    const result = await response.json();
    console.log("Data parsed successfully:", result);

    const currentHash = hashData(result.tableData);
    const previousHash = localStorage.getItem(hashKey);

    if (currentHash !== previousHash) {
      console.log("Data has changed, updating cache and rendering table");
      renderTable(result, true);
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(hashKey, currentHash);
    }

    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = '';
  } catch (error) {
    console.error('Error during data fetch process:', error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error fetching data. Please try again later.</td></tr>";
  }
}

function renderTable(data, isUpdate) {
  if (data.error) {
    console.error('Error in data:', data.error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error in data</td></tr>";
    return;
  }

  // 테이블 내용을 초기화
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // 기존 테이블 내용 삭제

  const fragment = document.createDocumentFragment();
  const columnWidths = data.columnWidths || [];

  const mergeMap = {};
  data.mergedCells.forEach(cell => {
    for (let i = 0; i < cell.numRows; i++) {
      for (let j = 0; i < cell.numColumns; j++) {
        const key = `${cell.row + i}-${cell.column + j}`;
        mergeMap[key] = { masterRow: cell.row, masterColumn: cell.column };
      }
    }
  });

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    if (data.rowHeights && data.rowHeights[rowIndex]) {
      tr.style.height = data.rowHeights[rowIndex] + 'px';
    }

    row.forEach((cellData, colIndex) => {
      const cellKey = `${rowIndex + 1}-${colIndex + 1}`;
      const mergeInfo = mergeMap[cellKey];

      if (!mergeInfo || (mergeInfo.masterRow === rowIndex + 1 && mergeInfo.masterColumn === colIndex + 1)) {
        const td = document.createElement('td');

        if (typeof cellData === 'object') {
          td.innerHTML = cellData.richText || cellData.text || '';
        } else {
          td.innerHTML = cellData;
        }

        applyStyles(td, rowIndex, colIndex, data);

        if (data.columnWidths && data.columnWidths[colIndex]) {
          td.style.width = data.columnWidths[colIndex] + 'px';
        }

        if (mergeInfo) {
          const mergedCell = data.mergedCells.find(cell => cell.row === mergeInfo.masterRow && cell.column === mergeInfo.masterColumn);
          if (mergedCell) {
            td.rowSpan = mergedCell.numRows;
            td.colSpan = mergedCell.numColumns;
          }
        }

        td.style.whiteSpace = 'pre-wrap';
        tr.appendChild(td);
      }
    });

    fragment.appendChild(tr);
  });

  table.appendChild(fragment); // 새로 만든 테이블을 추가
}

function hashData(data) {
  return JSON.stringify(data).length;
}

document.addEventListener('DOMContentLoaded', fetchAndCacheData);
