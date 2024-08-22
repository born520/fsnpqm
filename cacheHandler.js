document.addEventListener("DOMContentLoaded", function() {
    const tableElement = document.getElementById("data-table");
    
    // 웹앱에서 JSON 데이터를 가져오는 함수
    function fetchDataAndRender() {
        fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
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

    // 테이블 렌더링 함수
    function renderTable(data) {
        const { tableData, backgrounds, fontColors, horizontalAlignments, verticalAlignments, mergedCells } = data;

        // 테이블을 클리어하고 새로운 데이터를 렌더링
        tableElement.innerHTML = '';
        tableElement.style.display = 'table';

        tableData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cell, colIndex) => {
                const td = document.createElement('td');
                td.innerText = cell.text;

                // 스타일 적용
                td.style.backgroundColor = backgrounds[rowIndex][colIndex];
                td.style.color = fontColors[rowIndex][colIndex];
                td.style.textAlign = horizontalAlignments[rowIndex][colIndex];
                td.style.verticalAlign = verticalAlignments[rowIndex][colIndex];
                td.style.fontSize = `${cell.fontSize}px`;

                tr.appendChild(td);
            });
            tableElement.appendChild(tr);
        });

        // 병합된 셀 처리
        mergedCells.forEach(({ row, column, numRows, numColumns }) => {
            const cell = tableElement.rows[row].cells[column];
            cell.rowSpan = numRows;
            cell.colSpan = numColumns;

            for (let i = row; i < row + numRows; i++) {
                for (let j = column; j < column + numColumns; j++) {
                    if (i !== row || j !== column) {
                        tableElement.rows[i].deleteCell(j);
                    }
                }
            }
        });
    }

    // 데이터를 가져와서 테이블 렌더링
    fetchDataAndRender();
});
