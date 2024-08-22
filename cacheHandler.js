// 데이터 가져오기
async function fetchDataAndRenderTable() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw0NE9hOXBO2-M8xC4KBNa3QasFUvnvey3ODAnl9cRQmS6Snb5yly_3xJmYOIpE4DixnQ/exec');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

// 테이블 렌더링
function renderTable(data) {
    const table = document.getElementById('dataTable'); // id를 dataTable로 수정
    
    if (!table) {
        console.error("Table element with id 'dataTable' not found.");
        return;
    }

    const tableData = data.tableData;
    const mergedCells = data.mergedCells;

    // 테이블 셀 추가
    tableData.forEach((row, rowIndex) => {
        const tr = table.insertRow();
        row.forEach((cell, cellIndex) => {
            const td = tr.insertCell();
            td.innerHTML = cell.text || '';
            td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
            td.style.color = data.fontColors[rowIndex][cellIndex];
            td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
            td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
            td.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
            td.style.fontStyle = data.fontStyles[rowIndex][cellIndex];
            td.style.fontSize = `${data.fontSizes[rowIndex][cellIndex]}px`;
            td.style.border = '1px solid black'; // 테두리 스타일 추가
        });
    });

    // 셀 병합
    mergedCells.forEach(merge => {
        for (let i = 0; i < merge.numRows; i++) {
            for (let j = 0; j < merge.numColumns; j++) {
                if (i !== 0 || j !== 0) {
                    table.rows[merge.row + i].deleteCell(merge.column);
                }
            }
        }
        const cell = table.rows[merge.row].cells[merge.column];
        cell.rowSpan = merge.numRows;
        cell.colSpan = merge.numColumns;
    });
}

// 페이지가 로드되면 데이터 가져오기 및 테이블 렌더링
document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);
