// cacheHandler.js
document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);

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
    
    // Clear existing content
    table.innerHTML = '';

    data.tableData.forEach((rowData, rowIndex) => {
        const row = table.insertRow(-1);

        rowData.forEach((cellData, colIndex) => {
            // Check if this cell is within any merged cell area
            const isMerged = data.mergedCells.some(cell => 
                rowIndex >= cell.row &&
                rowIndex < cell.row + cell.numRows &&
                colIndex >= cell.column &&
                colIndex < cell.column + cell.numColumns
            );
            
            if (!isMerged || (rowIndex === data.mergedCells.find(cell => cell.row === rowIndex && cell.column === colIndex)?.row && colIndex === data.mergedCells.find(cell => cell.row === rowIndex && cell.column === colIndex)?.column)) {
                const cell = row.insertCell(-1);
                cell.innerHTML = cellData.text;

                // Apply styling
                cell.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
                cell.style.color = data.fontColors[rowIndex][colIndex];
                cell.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
                cell.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];
                cell.style.fontWeight = data.fontWeights[rowIndex][colIndex];
                cell.style.fontStyle = data.fontStyles[rowIndex][colIndex];
                cell.style.fontSize = data.fontSizes[rowIndex][colIndex] + 'px';

                // Handle merged cells
                const mergeInfo = data.mergedCells.find(cell => cell.row === rowIndex && cell.column === colIndex);
                if (mergeInfo) {
                    if (mergeInfo.numRows > 1) {
                        cell.rowSpan = mergeInfo.numRows;
                    }
                    if (mergeInfo.numColumns > 1) {
                        cell.colSpan = mergeInfo.numColumns;
                    }
                }
            }
        });
    });

    // Set row heights and column widths
    data.rowHeights.forEach((height, index) => {
        table.rows[index].style.height = height + 'px';
    });

    data.columnWidths.forEach((width, index) => {
        table.querySelectorAll('tr').forEach(row => {
            row.cells[index].style.width = width + 'px';
        });
    });
}
