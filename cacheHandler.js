async function fetchAndCacheData() {
  try {
    console.log("Starting data fetch process...");

    const pagePath = window.location.pathname;
    const cacheKey = `cachedTableData_${pagePath}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log("Cached data found. Rendering table...");
      clearTable();
      renderTable(JSON.parse(cachedData));
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('data-table').style.display = 'block'; // 테이블 표시
      return;
    }

    console.log("Fetching new data...");
    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Data fetched successfully. Rendering table...");
    clearTable();
    renderTable(result);
    localStorage.setItem(cacheKey, JSON.stringify(result));

    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block'; // 테이블 표시
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error fetching data. Please try again later.</td></tr>";
    document.getElementById('data-table').style.display = 'block'; // 테이블 표시 (에러 상태)
  }
}

function clearTable() {
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // 기존 테이블 내용만 삭제, 스타일 유지
}

function renderTable(data) {
  console.log("Rendering table...");
  const table = document.getElementById('data-table');
  const fragment = document.createDocumentFragment();

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    if (data.rowHeights && data.rowHeights[rowIndex]) {
      tr.style.height = data.rowHeights[rowIndex] + 'px';
    }

    row.forEach((cellData, colIndex) => {
      const td = document.createElement('td');

      // 셀 스타일 적용
      if (typeof cellData === 'object') {
        td.innerHTML = cellData.richText || cellData.text || '';

        // 배경색, 글자색, 텍스트 정렬, 글꼴 크기 등 스타일 적용
        td.style.backgroundColor = cellData.backgroundColor || '';
        td.style.color = cellData.textColor || '';
        td.style.textAlign = cellData.horizontalAlignment || 'center';
        td.style.verticalAlign = cellData.verticalAlignment || 'middle';
        td.style.fontWeight = cellData.bold ? 'bold' : 'normal';
        td.style.fontSize = (cellData.fontSize || 14) + 'px';
        td.style.fontFamily = cellData.fontFamily || 'Arial, sans-serif';

        // 추가 스타일 적용
        if (cellData.italic) {
          td.style.fontStyle = 'italic';
        }

        if (cellData.underline) {
          td.style.textDecoration = 'underline';
        }

        if (cellData.strikethrough) {
          td.style.textDecoration = td.style.textDecoration ? `${td.style.textDecoration} line-through` : 'line-through';
        }
      } else {
        td.textContent = cellData;
      }

      // 셀 너비 적용
      if (data.columnWidths && data.columnWidths[colIndex]) {
        td.style.width = data.columnWidths[colIndex] + 'px';
      }

      tr.appendChild(td);
    });

    fragment.appendChild(tr);
  });

  table.appendChild(fragment);
  console.log("Table rendered.");
}

document.addEventListener('DOMContentLoaded', fetchAndCacheData);
