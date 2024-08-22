document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndRenderTable();
});

function fetchDataAndRenderTable() {
  fetch("https://script.google.com/macros/s/AKfycbw0NE9hOXBO2-M8xC4KBNa3QasFUvnvey3ODAnl9cRQmS6Snb5yly_3xJmYOIpE4DixnQ/exec")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      renderTable(data);
    })
    .catch((error) => {
      console.error("Failed to fetch data:", error);
    });
}

function renderTable(data) {
  const table = document.getElementById("dataTable");

  // Clear existing table contents
  table.innerHTML = "";

  data.tableData.forEach((rowData, rowIndex) => {
    const row = table.insertRow();
    rowData.forEach((cellData, cellIndex) => {
      const cell = row.insertCell();
      cell.innerHTML = cellData.richText || cellData.text || "";

      // Apply styling
      cell.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
      cell.style.color = data.fontColors[rowIndex][cellIndex];
      cell.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
      cell.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
      cell.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
      cell.style.fontStyle = data.fontStyles[rowIndex][cellIndex];
      cell.style.fontSize = data.fontSizes[rowIndex][cellIndex] + "px";
    });
  });

  mergeCells(data.mergedCells);
}

function mergeCells(mergedCells) {
  mergedCells.forEach((mergeInfo) => {
    const { row, column, numRows, numColumns } = mergeInfo;
    const table = document.getElementById("dataTable");

    // Get the first cell
    const firstCell = table.rows[row].cells[column];

    // Set rowSpan and colSpan
    firstCell.rowSpan = numRows;
    firstCell.colSpan = numColumns;

    // Delete the other cells that are merged into the first cell
    for (let r = row; r < row + numRows; r++) {
      for (let c = column + (r === row ? 1 : 0); c < column + numColumns; c++) {
        table.rows[r].deleteCell(column + (r === row ? 1 : 0));
      }
    }
  });
}
