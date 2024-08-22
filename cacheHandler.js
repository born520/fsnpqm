document.addEventListener("DOMContentLoaded", function() {
    fetchDataAndRenderTable();
});

function fetchDataAndRenderTable() {
    fetch("https://script.google.com/macros/s/AKfycbzsR3KoRpG4c8EunHjLFDgtRswLe9rxJRnRmwfC7OLdjOYGOoPMPuN9IhFguBTcYOF3/exec")
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Failed to fetch data:', error));
}

function renderTable(data) {
    const table = document.getElementById("dataTable");
    const tableData = data.tableData;
    const mergedCells = data.mergedCells;

    // Create table rows and cells
    tableData.forEach((row, rowIndex) => {
        const tr = table.insertRow();
        row.forEach((cell, colIndex) => {
            const td = tr.insertCell();
            td.innerHTML = cell.text;

            // Apply styles
            td.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
            td.style.color = data.fontColors[rowIndex][colIndex];
            td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
            td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];
            td.style.fontSize = cell.fontSize + "px";
            td.style.fontWeight = data.fontWeights[rowIndex][colIndex];
            td.style.fontStyle = data.fontStyles[rowIndex][colIndex];
        });
    });

    // Handle merged cells
    mergedCells.forEach(merge => {
        const row = merge.row;
        const column = merge.column;
        const numRows = merge.numRows;
        const numColumns = merge.numColumns;

        const td = table.rows[row].cells[column];
        td.rowSpan = numRows;
        td.colSpan = numColumns;

        // Remove cells that were merged
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numColumns; j++) {
                if (i !== 0 || j !== 0) {
                    const targetRow = table.rows[row + i];
                    if (targetRow && targetRow.cells[column]) {
                        targetRow.deleteCell(column);
                    }
                }
            }
        }
    });
}
