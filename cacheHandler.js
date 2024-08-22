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

    const mergeTracker = {}; // 병합된 셀 추적

    data.tableData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            const cellId = `${rowIndex}-${cellIndex}`;

            // 병합된 셀의 경우, 이미 출력된 병합 범위를 건너뜀
            if (mergeTracker[cellId]) {
                return;
            }

            if (cell) {
                const td = document.createElement('td');
                td.innerText = cell.text || '';
                td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
                td.style.color = data.fontColors[rowIndex][cellIndex];
                td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
                td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];

                if (cell.rowSpan && cell.rowSpan > 1) {
                    td.rowSpan = cell.rowSpan;

                    // 병합된 셀의 나머지 범위를 추적
                    for (let i = 1; i < cell.rowSpan; i++) {
                        mergeTracker[`${rowIndex + i}-${cellIndex}`] = true;
                    }
                }

                if (cell.colSpan && cell.colSpan > 1) {
                    td.colSpan = cell.colSpan;

                    // 병합된 셀의 나머지 범위를 추적
                    for (let i = 1; i < cell.colSpan; i++) {
                        mergeTracker[`${rowIndex}-${cellIndex + i}`] = true;
                    }
                }

                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });

    console.log("Table rendering completed.");
}

fetchDataAndRender();
