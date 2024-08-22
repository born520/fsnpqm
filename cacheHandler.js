document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);

function fetchDataAndRenderTable() {
    const cachedData = getCachedData();
    if (cachedData) {
        renderTable(cachedData);
    } else {
        fetch('https://script.google.com/macros/s/AKfycbzsR3KoRpG4c8EunHjLFDgtRswLe9rxJRnRmwfC7OLdjOYGOoPMPuN9IhFguBTcYOF3/exec')
            .then(response => response.json())
            .then(data => {
                setCachedData(data);
                renderTable(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

function getCachedData() {
    return JSON.parse(localStorage.getItem('cachedData'));
}

function setCachedData(data) {
    localStorage.setItem('cachedData', JSON.stringify(data));
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear the table before rendering

    // Render the table rows and cells
    data.tableData.forEach((row, rowIndex) => {
        const tr = table.insertRow();
        row.forEach((cell, cellIndex) => {
            const td = tr.insertCell();
            td.textContent = cell.text;
            td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
            td.style.color = data.fontColors[rowIndex][cellIndex];
            td.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
            td.style.fontStyle = data.fontStyles[rowIndex][cellIndex];
            td.style.fontSize = data.fontSizes[rowIndex][cellIndex] + 'px';
            td.style.textDecoration = data.strikethroughs[rowIndex][cellIndex] ? 'line-through' : 'none';
            td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
            td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
        });
    });

    // Handle merged cells
    data.mergedCells.forEach(merge => {
        const startCell = table.rows[merge.row].cells[merge.column];
        startCell.rowSpan = merge.numRows;
        startCell.colSpan = merge.numColumns;

        for (let i = 0; i < merge.numRows; i++) {
            for (let j = 0; j < merge.numColumns; j++) {
                if (i === 0 && j === 0) continue;
                const cell = table.rows[merge.row + i].cells[merge.column + j];
                if (cell) table.rows[merge.row + i].deleteCell(merge.column + j);
            }
        }
    });
}
