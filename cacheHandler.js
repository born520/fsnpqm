function fetchDataAndRender() {
    fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); // 데이터를 확인합니다.
            renderTable(data);
        })
        .catch(error => {
            console.error("Failed to fetch data:", error);
        });
}

function renderTable(data) {
    const table = document.getElementById('data-table');
    table.style.display = 'table';
    table.innerHTML = ''; // 기존의 테이블 내용을 비웁니다.

    data.tableData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            if (cell) {
                const td = document.createElement('td');
                td.innerText = cell.text || '';
                td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
                td.style.color = data.fontColors[rowIndex][cellIndex];
                td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
                td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];

                if (cell.rowSpan && cell.rowSpan > 1) {
                    td.rowSpan = cell.rowSpan;
                }

                if (cell.colSpan && cell.colSpan > 1) {
                    td.colSpan = cell.colSpan;
                }

                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });

    console.log("Table rendering completed.");
}

fetchDataAndRender();
