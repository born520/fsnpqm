async function fetchDataAndRender() {
  const cacheKey = 'cachedTableData';

  // 로컬 스토리지에서 캐시된 데이터를 가져오기
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    renderTable(JSON.parse(cachedData));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
    return; // 캐시된 데이터가 있으면 여기서 종료
  }

  // 최신 데이터를 비동기적으로 가져오기
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderTable(data);

    // 데이터 캐시에 저장
    localStorage.setItem(cacheKey, JSON.stringify(data));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable(data) {
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // 테이블 초기화

  const mergeMap = {}; // 셀 병합 정보를 저장

  // 셀 병합 정보 처리
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

        if (typeof cellData === 'object') {
          // 셀 스타일 적용
          td.innerHTML = cellData.richText || cellData.text || '';
          td.style.backgroundColor = cellData.backgroundColor || '';
          td.style.color = cellData.textColor || '';
          td.style.textAlign = cellData.horizontalAlignment || 'center';
          td.style.verticalAlign = cellData.verticalAlignment || 'middle';
          td.style.fontWeight = cellData.bold ? 'bold' : 'normal';
          td.style.fontSize = (cellData.fontSize || 14) + 'px';
          td.style.fontFamily = cellData.fontFamily || 'Arial, sans-serif';

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
      }
    });

    table.appendChild(tr);
  });
}

// DOMContentLoaded 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', fetchDataAndRender);
