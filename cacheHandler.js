async function fetchDataAndRenderTable() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzsR3KoRpG4c8EunHjLFDgtRswLe9rxJRnRmwfC7OLdjOYGOoPMPuN9IhFguBTcYOF3/exec');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    if (!table) {
        console.error("Table element with id 'dataTable' not found.");
        return;
    }

    const tableData = data.tableData;
    const mergedCells = data.mergedCells;

    // Clear existing table content
    table.innerHTML = '';

    // Create table rows and cells
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
            td.style.border = '1px solid black'; // Add border styling
        });
    });

    // Merge cells based on the data provided
    mergedCells.forEach(merge => {
        const startCell = table.rows[merge.row].cells[merge.column];
        if (startCell) {
            startCell.rowSpan = merge.numRows;
            startCell.colSpan = merge.numColumns;
        }

        for (let i = 0; i < merge.numRows; i++) {
            for (let j = 0; j < merge.numColumns; j++) {
                if (i === 0 && j === 0) continue; // Skip the starting cell
                const rowIndex = merge.row + i;
                const cellIndex = merge.column + j;
                if (table.rows[rowIndex] && table.rows[rowIndex].cells[cellIndex]) {
                    table.rows[rowIndex].deleteCell(cellIndex);
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);
