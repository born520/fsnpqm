async function fetchDataAndRender() {
  const cacheKey = 'cachedTableData';

  // 로컬 스토리지에서 캐시된 데이터를 가져오기
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    renderTable(JSON.parse(cachedData));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
  }

  // 최신 데이터를 비동기적으로 가져오기
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderTable(data);

    // 데이터 캐시에 저장
    localStorage.setItem(cacheKey, JSON.stringify(data));
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable(data) {
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // 테이블 초기화

  const mergeMap = {}; // 셀 병합 정보를 저장

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
      tr.style.height = data.rowHeights[rowIndex]
