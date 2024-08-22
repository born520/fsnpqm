async function fetchDataAndRender() {
    const cacheKey = 'cachedTableData';
  
    // 로컬 스토리지에서 캐시된 데이터를 가져오기
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        console.log('Using cached data:', JSON.parse(cachedData));
        renderTable(JSON.parse(cachedData));
        return;
    }
  
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
      
        const data = await response.json();
        console.log('Fetched data:', data);
        renderTable(data);
      
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to fetch data:', error);
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

                td.innerHTML = cellData.text || '';

                td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
                td.style.color = data.fontColors[rowIndex][colIndex] || '';
                td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
                td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
                td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';

                tr.appendChild(td);
            }
        });

        table.appendChild(tr);
    });
    table.style.display = 'table'; // 테이블 표시
}

document.addEventListener('DOMContentLoaded', fetchDataAndRender);
