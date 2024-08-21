function renderTable(data) {
  console.log("Rendering table...");

  const table = document.getElementById('data-table');
  table.innerHTML = '';

  const mergeMap = {};

  // 셀 병합 정보 처리
  if (data.mergedCells) {
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

        // 셀 스타일 적용
        td.innerHTML = cellData || '';

        // 각 스타일 적용
        td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
        td.style.color = data.fontColors[rowIndex][colIndex] || '';
        td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'center';
        td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'middle';
        td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 14) + 'px';
        td.style.fontFamily = 'Arial, sans-serif';

        // 폰트 스타일 (굵기, 기울임, 취소선 등)
        if (data.fontWeights[rowIndex][colIndex] && data.fontWeights[rowIndex][colIndex] === 'bold') {
          td.style.fontWeight = 'bold';
        }
        if (data.fontStyles[rowIndex][colIndex] && data.fontStyles[rowIndex][colIndex] === 'italic') {
          td.style.fontStyle = 'italic';
        }
        if (data.strikethroughs[rowIndex][colIndex]) {
          td.style.textDecoration = 'line-through';
        }

        // 셀 너비 적용
        if (data.columnWidths && data.columnWidths[colIndex]) {
          td.style.width = data.columnWidths[colIndex] + 'px';
        }

        tr.appendChild(td);
      }
    });

    table.appendChild(tr);
  });
}
