async function fetchAndCacheData() {
  try {
    const pagePath = window.location.pathname;
    const cacheKey = `cachedTableData_${pagePath}`;
    const hashKey = `dataHash_${pagePath}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      renderTable(JSON.parse(cachedData), false);
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('data-table').style.display = '';
      return;
    }

    const response = await fetch('https://script.google.com/macros/s/AKfycbxlWGaTrXFykS1al6avOG4L3rq2SxCg5TEXEspr3x99x5a6HcNZkGMgbiPDB-lWFn1ptQ/exec');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const currentHash = hashData(result.tableData);
    const previousHash = localStorage.getItem(hashKey);

    if (currentHash !== previousHash) {
      renderTable(result, true);
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(hashKey, currentHash);
    }

    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('data-table').style.display = '';
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('data-table').innerHTML = "<tr><td>Error fetching data. Please try again later.</td></tr>";
  }
}

function hashData(data) {
  return JSON.stringify(data).length;
}

document.addEventListener('DOMContentLoaded', fetchAndCacheData);
