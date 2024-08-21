function renderTable(data) {
  console.log("Rendering table...");

  const table = document.getElementById('data-table');
  table.innerHTML = '';

  const mergeMap = {};

  // 셀 병합 정보 처리
  if (data.mergedCells) {
    console.log("Processing merged cells...", data.mergedCells); // 병합 셀 디버깅
    data.mergedCells.forEach(cell => {
      for (let i = 0; i < cell.numRows; i++) {
        for (let j = 0; j < cell.numColumns; j++) {
          const key = `${cell.row + i}-${cell.column + j}`;
          mergeMap[key] = {
            masterRow: cell.row,
            masterColumn: cell.column,
            rowspan: cell.numRows,
            colspan: cell.numColumns
          };
        }
      }
    });
  }

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    if (data.rowHeights && data.rowHeights[rowIndex]) {
      tr.style.height = data.rowHeights[rowIndex] + 'px';
    }

    row.forEach((cellData, colIndex) => {
      const cellKey = `${rowIndex}-${colIndex}`;
      const mergeInfo = mergeMap[cellKey];

      if (!mergeInfo || (mergeInfo.masterRow === rowIndex && mergeInfo.masterColumn === colIndex)) {
        const td = document.createElement('td');

        if (mergeInfo) {
          if (mergeInfo.rowspan > 1) td.rowSpan = mergeInfo.rowspan;
          if (mergeInfo.colspan > 1) td.colSpan = mergeInfo.colspan;
        }

        console.log(`Rendering cell [${rowIndex}, ${colIndex}]:`, cellData); // 셀 데이터 디버깅
        td.innerHTML = cellData || '';

        td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
        td.style.color = data.fontColors[rowIndex][colIndex] || '';
        td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
        td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
        td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';
        td.style.fontFamily = 'Arial, sans-serif';

        if (data.fontWeights[rowIndex][colIndex] && data.fontWeights[rowIndex][colIndex] === 'bold') {
          td.style.fontWeight = 'bold';
        }
        if (data.fontStyles[rowIndex][colIndex] && data.fontStyles[rowIndex][colIndex] === 'italic') {
          td.style.fontStyle = 'italic';
        }
        if (data.strikethroughs[rowIndex][colIndex]) {
          td.style.textDecoration = 'line-through';
        }

        if (data.columnWidths && data.columnWidths[colIndex]) {
          td.style.width = data.columnWidths[colIndex] + 'px';
        }

        tr.appendChild(td);
      }
    });

    table.appendChild(tr);
  });

  console.log("Table rendering completed.");
}
