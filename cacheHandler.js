document.addEventListener("DOMContentLoaded", function() {
    const tableDataEndpoint = "https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec";

    fetch(tableDataEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error("Failed to fetch data:", error);
            renderCachedData();
        });
    
    function renderCachedData() {
        // 캐시 데이터를 사용한 테이블 렌더링
        const cachedData = {
            tableData: [
                // ...여기에 캐시된 데이터 추가
            ],
            backgrounds: [],
            fontColors: [],
            horizontalAlignments: [],
            verticalAlignments: [],
            mergedCells: [], // 병합 셀에 대한 정보 추가
            // 기타 데이터
        };
        renderTable(cachedData);
    }

    function renderTable(data) {
        const table = document.getElementById("data-table");
        table.style.display = "table"; // 테이블 표시
        const tbody = document.createElement("tbody");

        data.tableData.forEach((rowData, rowIndex) => {
            const tr = document.createElement("tr");
            rowData.forEach((cellData, cellIndex) => {
                const td = document.createElement("td");
                td.textContent = cellData.text;
                // 병합 셀 처리
                const mergedCell = data.mergedCells.find(cell => cell.row === rowIndex && cell.col === cellIndex);
                if (mergedCell) {
                    td.rowSpan = mergedCell.rowSpan || 1;
                    td.colSpan = mergedCell.colSpan || 1;
                }
                // 스타일 및 병합 데이터 처리
                td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
                td.style.color = data.fontColors[rowIndex][cellIndex];
                td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
                td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }
});
