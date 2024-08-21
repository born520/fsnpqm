async function fetchDataAndRender() {
    const cacheKey = 'cachedTableData';

    // 로컬 스토리지에서 캐시된 데이터를 가져오기
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        console.log('Using cached data:', JSON.parse(cachedData)); // 캐시된 데이터 출력
        renderTable(JSON.parse(cachedData));
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('data-table').style.display = 'block';
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
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('data-table').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    console.log("Rendering table...");  // 이 로그가 출력되는지 확인합니다.

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

                // 셀 스타일 적용
                td.innerHTML = cellData || ''; // 셀에 표시할 데이터

                // 각 스타일 적용
                td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
                td.style.color = data.fontColors[rowIndex][colIndex] || '';
                td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
                td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
                td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';
                td.style.fontFamily = 'Arial, sans-serif';

                // 폰트 스타일 (굵기, 기울임, 취소선 등)
                if (data.fontWeights[rowIndex][colIndex] && data.fontWeights[rowIndex][colIndex] === 'bold') {
                    td.style.fontWeight = 'bold';
                }
                if (data.fontStyles[rowIndex][colIndex] && data.fontStyles[rowIndex][colIndex] === 'italic') {
                    td.style.fontStyle = 'italic';
                }
                if (data.strikethroughs[rowIndex][colIndex]) {
                    td.style.textDecoration = 'line-through';
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

    applyAdditionalStyles(); // 테이블 렌더링 후 추가 스타일 적용
    console.log("Table rendering completed.");
}

function applyAdditionalStyles() {
    const table = document.getElementById('data-table');
    
    // 예: 첫 번째 열을 굵게 표시
    const firstColumnCells = table.querySelectorAll('td:first-child');
    firstColumnCells.forEach(cell => {
        cell.style.fontWeight = 'bold';
        cell.style.backgroundColor = '#e0e0e0';
    });

    // 예: 셀 병합된 경우 배경색 변경
    const mergedCells = table.querySelectorAll('td[rowspan], td[colspan]');
    mergedCells.forEach(cell => {
        cell.classList.add('merged-cell');
    });
}

// DOMContentLoaded 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', fetchDataAndRender);
