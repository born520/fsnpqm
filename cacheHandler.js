function renderTable(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';

    // 행 데이터 추가
    data.tableData.forEach((rowData, rowIndex) => {
        const row = table.insertRow();
        rowData.forEach((cellData, colIndex) => {
            const cell = row.insertCell();
            cell.innerText = cellData.text || '';
            cell.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
            cell.style.color = data.fontColors[rowIndex][colIndex];
            cell.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
            cell.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];
            cell.style.fontWeight = data.fontWeights[rowIndex][colIndex];
            cell.style.fontStyle = data.fontStyles[rowIndex][colIndex];
            cell.style.fontSize = data.fontSizes[rowIndex][colIndex] + 'px';
        });
    });

    // 병합 셀 처리
    data.mergedCells.forEach(merge => {
        for (let i = 0; i < merge.numRows; i++) {
            for (let j = 0; j < merge.numColumns; j++) {
                const row = table.rows[merge.row + i];
                if (row && (merge.column + j) < row.cells.length) {
                    if (i > 0 || j > 0) {
                        row.deleteCell(merge.column + j);
                    } else {
                        row.cells[merge.column].rowSpan = merge.numRows;
                        row.cells[merge.column].colSpan = merge.numColumns;
                    }
                }
            }
        }
    });

    table.style.display = '';
}

function fetchDataAndRender() {
    fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
        });
}

document.addEventListener('DOMContentLoaded', fetchDataAndRender);
