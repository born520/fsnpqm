async function fetchAndCacheData() {
  try {
    const pagePath = window.location.pathname;
    const cacheKey = `cachedTableData_${pagePath}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      clearTable();
      renderTable(JSON.parse(cachedData));
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('data-table').style.display = '';
      return;
    }

    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    clearTable();
    renderTable(result);
    localStorage.setItem(cacheKey, JSON.stringify(result));

    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = '';
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error fetching data. Please try again later.</td></tr>";
  }
}

function clearTable() {
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // 기존 테이블 내용만 삭제, 스타일 유지
}

function renderTable(data) {
  const table = document.getElementById('data-table');
  const fragment = document.createDocumentFragment();

  data.tableData.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cellData => {
      const td = document.createElement('td');
      td.textContent = typeof cellData === 'object' ? cellData.text : cellData;
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });

  table.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', fetchAndCacheData);
