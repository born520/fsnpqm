document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec';

    // 테이블 데이터 렌더링 함수
    function renderTable(data) {
        const table = document.getElementById('data-table');
        table.innerHTML = ''; // 기존 테이블 초기화
        table.style.display = 'table'; // 테이블 표시

        data.tableData.forEach((rowData, rowIndex) => {
            const row = document.createElement('tr');
            rowData.forEach((cellData, cellIndex) => {
                const cell = document.createElement('td');
                cell.textContent = cellData.text;
                cell.colSpan = cellData.colSpan || 1;
                cell.rowSpan = cellData.rowSpan || 1;
                
                // 셀 스타일 적용
                cell.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
                cell.style.color = data.fontColors[rowIndex][cellIndex];
                cell.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
                cell.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
                cell.style.fontSize = data.fontSizes[rowIndex][cellIndex] + 'px';
                cell.style.fontStyle = data.fontStyles[rowIndex][cellIndex];
                cell.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
                
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        // 병합 셀 처리
        data.mergedCells.forEach(merge => {
            const startCell = table.rows[merge.startRow].cells[merge.startCol];
            startCell.colSpan = merge.colSpan;
            startCell.rowSpan = merge.rowSpan;
            startCell.classList.add('merged-cell');

            for (let i = merge.startRow; i <= merge.endRow; i++) {
                for (let j = merge.startCol; j <= merge.endCol; j++) {
                    if (i === merge.startRow && j === merge.startCol) continue;
                    table.rows[i].deleteCell(j);
                }
            }
        });
    }

    // API 호출 및 테이블 렌더링 함수
    function fetchDataAndRender() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                renderTable(data);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    }

    fetchDataAndRender();
});
