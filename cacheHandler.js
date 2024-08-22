function fetchDataAndRenderTable() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Failed to fetch data:', error));
}

function renderTable(data) {
    const table = document.createElement('table');
    let skipCells = {}; // 병합된 셀로 인해 건너뛰어야 할 셀들 추적

    data.tableData.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        
        rowData.forEach((cellData, colIndex) => {
            if (skipCells[`${rowIndex}-${colIndex}`]) return; // 건너뛰기
            
            const cell = document.createElement('td');
            let merged = false;

            data.mergedCells.forEach(merge => {
                if (merge.row === rowIndex && merge.column === colIndex) {
                    cell.rowSpan = merge.numRows;
                    cell.colSpan = merge.numColumns;
                    merged = true;
                    // 병합 범위 내의 셀들을 건너뛰도록 설정
                    for (let r = rowIndex; r < rowIndex + merge.numRows; r++) {
                        for (let c = colIndex; c < colIndex + merge.numColumns; c++) {
                            if (!(r === rowIndex && c === colIndex)) {
                                skipCells[`${r}-${c}`] = true;
                            }
                        }
                    }
                }
            });

            cell.innerText = cellData.text;
            cell.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
            cell.style.color = data.fontColors[rowIndex][colIndex];
            cell.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
            cell.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];
            cell.style.fontWeight = data.fontWeights[rowIndex][colIndex];
            cell.style.fontStyle = data.fontStyles[rowIndex][colIndex];
            cell.style.fontSize = data.fontSizes[rowIndex][colIndex] + 'px';
            if (data.strikethroughs[rowIndex][colIndex]) {
                cell.style.textDecoration = 'line-through';
            }

            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    document.body.appendChild(table);
}

// 페이지가 로드될 때 데이터를 가져오고 테이블을 렌더링
document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);
