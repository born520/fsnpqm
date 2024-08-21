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

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    row.forEach((cellData, colIndex) => {
      const td = document.createElement('td');

      if (typeof cellData === 'object') {
        td.innerHTML = cellData.richText || cellData.text || '';
        td.style.backgroundColor = cellData.backgroundColor || '';
        td.style.color = cellData.textColor || '';
        td.style.textAlign = cellData.horizontalAlignment || 'center';
        td.style.verticalAlign = cellData.verticalAlignment || 'middle';
        td.style.fontWeight = cellData.bold ? 'bold' : 'normal';
        td.style.fontSize = (cellData.fontSize || 14) + 'px';
        td.style.fontFamily = cellData.fontFamily || 'Arial, sans-serif';
      } else {
        td.textContent = cellData;
      }

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}
