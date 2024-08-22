document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec';
    
    function renderTable(tableData) {
        const table = document.getElementById('data-table');
        table.innerHTML = ''; // 초기화
        
        // 테이블 데이터 렌더링
        for (let i = 0; i < tableData.length; i++) {
            const row = document.createElement('tr');
            
            for (let j = 0; j < tableData[i].length; j++) {
                const cellData = tableData[i][j];
                const cell = document.createElement(cellData.type === 'th' ? 'th' : 'td');
                
                cell.textContent = cellData.text || '';
                cell.colSpan = cellData.colSpan || 1;
                cell.rowSpan = cellData.rowSpan || 1;
                
                if (cellData.classes) {
                    cell.className = cellData.classes.join(' ');
                }
                
                row.appendChild(cell);
            }
            
            table.appendChild(row);
        }
    }
    
    function fetchDataAndRender() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                renderTable(data.tableData);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    }
    
    fetchDataAndRender();
});
