async function fetchData() {
  try {
    // 현재 페이지의 경로를 고유 식별자로 사용
    const pageIdentifier = window.location.pathname;
    console.log(`Fetching data for page: ${pageIdentifier}`);

    // 페이지별 캐시된 데이터를 가져오기
    const cachedData = localStorage.getItem(`cachedTableData_${pageIdentifier}`);
    
    if (cachedData) {
      console.log('Using cached data:', cachedData);
      renderTable(JSON.parse(cachedData), false);
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('data-table').style.display = '';
      return; // 캐시된 데이터를 사용하면 여기서 종료
    }

    console.log('No cached data, fetching from Google Sheets...');
    const response = await fetch('https://script.google.com/macros/s/AKfycbwJh55eAwKMubOUmq0N0NtIZ83N4EthpC4hC_QNKwpx2vF8PyLrm05ffwgLYfTSxSA/exec');

    console.log('Fetch response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Fetched data:', result);

    // 데이터 유효성 검사
    if (!result || !result.tableData || !Array.isArray(result.tableData)) {
      throw new Error("Invalid data format");
    }

    const currentHash = hashData(result.tableData);
    const previousHash = localStorage.getItem(`dataHash_${pageIdentifier}`);
    
    if (currentHash !== previousHash) {
      console.log('Data has changed, updating table.');
      renderTable(result, true);
      localStorage.setItem(`cachedTableData_${pageIdentifier}`, JSON.stringify(result));
      localStorage.setItem(`dataHash_${pageIdentifier}`, currentHash);
    } else {
      console.log('Data has not changed, using cached table.');
    }

    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = '';
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error fetching data. Please try again later.</td></tr>";
  }
}

function hashData(data) {
  return JSON.stringify(data).length;
}

function renderTable(data, isUpdate) {
  console.log('Rendering table with data:', data);

  if (data.error) {
    console.error('Error in data:', data.error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error in data</td></tr>";
    return;
  }

  if (isUpdate) {
    const table = document.getElementById('data-table');
    table.innerHTML = ''; // 테이블 초기화
  }

  const fragment = document.createDocumentFragment();
  const columnWidths = data.columnWidths || [];

  // 병합된 셀 데이터가 있는지 확인
  const mergeMap = {};
  if (data.mergedCells && Array.isArray(data.mergedCells)) {
    data.mergedCells.forEach(cell => {
      for (let i = 0; i < cell.numRows; i++) {
        for (let j = 0; j < cell.numColumns; j++) {
          const key = `${cell.row + i}-${cell.column + j}`;
          mergeMap[key] = { masterRow: cell.row, masterColumn: cell.column };
        }
      }
    });
  }

  // 테이블 데이터 생성
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

  document.getElementById('data-table').appendChild(fragment);
}

function applyStyles(td, rowIndex, colIndex, data) {
  td.style.backgroundColor = data.backgrounds ? data.backgrounds[rowIndex][colIndex] || '' : '';
  td.style.color = data.fontColors ? data.fontColors[rowIndex][colIndex] || '' : '';
  td.style.textAlign = data.horizontalAlignments ? data.horizontalAlignments[rowIndex][colIndex] || 'center' : 'center';
  td.style.verticalAlign = data.verticalAlignments ? data.verticalAlignments[rowIndex][colIndex] || 'middle' : 'middle';
  td.style.fontWeight = data.fontWeights ? data.fontWeights[rowIndex][colIndex] || 'normal' : 'normal';
  td.style.fontSize = (data.fontSizes ? data.fontSizes[rowIndex][colIndex] || 12 : 12) + 'px';
}

document.addEventListener('DOMContentLoaded', fetchData);
