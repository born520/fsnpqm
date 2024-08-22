document.addEventListener('DOMContentLoaded', function() {
    const tableElement = document.getElementById('data-table');

    fetchDataAndRender();

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

    function renderTable(data) {
        tableElement.style.display = 'table';
        let tableHTML = '';
        
        data.tableData.forEach((row, rowIndex) => {
            tableHTML += '<tr>';
            row.forEach((cell, colIndex) => {
                let rowspan = data.rowspans[rowIndex][colIndex] || 1;
                let colspan = data.colspans[rowIndex][colIndex] || 1;
                let cellType = (rowspan > 1 || colspan > 1) ? 'th' : 'td';

                tableHTML += `<${cellType} rowspan="${rowspan}" colspan="${colspan}" style="background-color: ${data.backgrounds[rowIndex][colIndex]}; color: ${data.fontColors[rowIndex][colIndex]}; text-align: ${data.horizontalAlignments[rowIndex][colIndex]}; vertical-align: ${data.verticalAlignments[rowIndex][colIndex]};">${cell}</${cellType}>`;
            });
            tableHTML += '</tr>';
        });
        
        tableElement.innerHTML = tableHTML;
    }
});
