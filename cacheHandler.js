async function fetchDataAndRenderTable() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwSQwQH5mUA9bTW8VP09eR_uO-MroUDvQy29COsAZ51hYx6_InNu14liAJs8HtXcU9xlA/exec');
    const jsonData = await response.json();
    renderTable(jsonData);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function renderTable(data) {
  const table = document.getElementById('dataTable');
  
  // 확인: dataTable 요소가 존재하는지 확인
  if (!table) {
    console.error('Table element with id "dataTable" not found.');
    return;
  }

  table.innerHTML = ''; // Clear existing table content

  // Loop through each row of data
  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cell, cellIndex) => {
      const td = document.createElement('td');

      // Set cell text and style
      td.textContent = cell.text;
      td.style.backgroundColor = data.backgrounds[rowIndex][cellIndex];
      td.style.color = data.fontColors[rowIndex][cellIndex];
      td.style.textAlign = data.horizontalAlignments[rowIndex][cellIndex];
      td.style.verticalAlign = data.verticalAlignments[rowIndex][cellIndex];
      td.style.fontWeight = data.fontWeights[rowIndex][cellIndex];
      td.style.fontStyle = data.fontStyles[rowIndex][cellIndex];
      td.style.fontSize = `${data.fontSizes[rowIndex][cellIndex]}px`;
      td.style.border = '1px solid #000'; // Adjust as necessary

      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  // Apply merged cells
  data.mergedCells.forEach((merge) => {
    mergeCells(table, merge.row, merge.column, merge.numRows, merge.numColumns);
  });
}

function mergeCells(table, startRow, startCol, numRows, numCols) {
  const startCell = table.rows[startRow].cells[startCol];
  startCell.rowSpan = numRows;
  startCell.colSpan = numCols;

  for (let r = startRow; r < startRow + numRows; r++) {
    for (let c = startCol; c < startCol + numCols; c++) {
      if (r === startRow && c === startCol) continue;
      table.rows[r].deleteCell(startCol);
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchDataAndRenderTable);
