async function fetchDataAndRender() {
  const cacheKey = 'cachedTableData';

  // 로컬 스토리지에서 캐시된 데이터를 가져오기
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    console.log('Using cached data:', JSON.parse(cachedData)); // 캐시된 데이터 출력
    renderTable(JSON.parse(cachedData));
    return;
  }

  // 최신 데이터를 비동기적으로 가져오기
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data); // 가져온 데이터 출력
    renderTable(data);

    // 데이터 캐시에 저장
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable(data) {
    console.log("Rendering table...");

    const table = document.getElementById('data-table');
    table.innerHTML = ''; // 테이블 초기화

    const mergeMap = {};

    // 셀 병합 정보 처리
    if (data.mergedCells) {
        console.log("Processing merged cells...", data.mergedCells); 
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

                console.log(`Rendering cell [${rowIndex}, ${colIndex}]:`, cellData);

                // 셀 데이터 및 스타일 적용
                td.innerHTML = (cellData.richText || cellData.text || '');

                td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
                td.style.color = data.fontColors[rowIndex][colIndex] || '';
                td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
                td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
                td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';
                td.style.fontFamily = 'Arial, sans-serif';

                if (data.fontWeights[rowIndex][colIndex] === 'bold') {
                    td.style.fontWeight = 'bold';
                }
                if (data.fontStyles[rowIndex][colIndex] === 'italic') {
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
    table.style.display = 'block';
    document.getElementById('loading-indicator').style.display = 'none';
}

// DOMContentLoaded 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', fetchDataAndRender);
