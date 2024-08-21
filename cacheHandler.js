const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1시간
const CACHE_KEY = 'cachedTableData';
const API_ENDPOINT = 'YOUR_API_ENDPOINT';

// 캐시 관련 함수
function isCacheValid(timestamp) {
    return (Date.now() - timestamp) < CACHE_EXPIRATION_MS;
}

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (isCacheValid(timestamp)) {
            return data;
        }
    }
    return null;
}

function setCachedData(key, data) {
    localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
    }));
}

// 로딩 인디케이터 관리
function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// 데이터 로딩 및 렌더링
async function fetchDataAndRender() {
    showLoadingIndicator();

    let data = getCachedData(CACHE_KEY);

    if (data) {
        console.log('Using cached data:', data);
    } else {
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
            data = await response.json();
            setCachedData(CACHE_KEY, data);
            console.log('Fetched data:', data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            hideLoadingIndicator();
            return;
        }
    }

    renderTable(data);
    hideLoadingIndicator();
}

// 테이블 렌더링
function renderTable(data) {
    console.log('Rendering table...');

    const table = document.getElementById('data-table');
    table.innerHTML = '';
    table.style.display = 'table';

    const { tableData, backgrounds, fontColors, horizontalAlignments, verticalAlignments, fontSizes, fontFamilies, fontWeights, fontStyles, strikethroughs, mergedCells, rowHeights, columnWidths } = data;

    const mergeMap = {};

    // 병합 셀 처리
    if (mergedCells) {
        mergedCells.forEach(cell => {
            const { row, column, numRows, numColumns } = cell;
            mergeMap[`${row}-${column}`] = { rowspan: numRows, colspan: numColumns };
        });
    }

    tableData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        if (rowHeights?.[rowIndex]) {
            tr.style.height = `${rowHeights[rowIndex]}px`;
        }

        row.forEach((cellData, colIndex) => {
            const td = document.createElement('td');
            td.classList.add('table-cell');

            // 병합 셀 적용
            const mergeKey = `${rowIndex}-${colIndex}`;
            if (mergeMap[mergeKey]) {
                const { rowspan, colspan } = mergeMap[mergeKey];
                if (rowspan > 1) td.rowSpan = rowspan;
                if (colspan > 1) td.colSpan = colspan;
            } else if (Object.values(mergeMap).some(merge => 
                rowIndex > merge.row && rowIndex < merge.row + merge.rowspan &&
                colIndex > merge.column && colIndex < merge.column + merge.colspan
            )) {
                // 병합된 셀 내부의 중복 셀은 스킵
                return;
            }

            // 셀 내용 설정
            td.innerHTML = (typeof cellData === 'object' && cellData !== null) ? (cellData.text || cellData.richText || '') : (cellData || '');

            // 스타일 적용
            td.style.backgroundColor = backgrounds?.[rowIndex]?.[colIndex] || '#ffffff';
            td.style.color = fontColors?.[rowIndex]?.[colIndex] || '#000000';
            td.style.textAlign = horizontalAlignments?.[rowIndex]?.[colIndex] || 'left';
            td.style.verticalAlign = verticalAlignments?.[rowIndex]?.[colIndex] || 'top';
            td.style.fontSize = `${fontSizes?.[rowIndex]?.[colIndex] || 14}px`;
            td.style.fontFamily = fontFamilies?.[rowIndex]?.[colIndex] || 'Arial, sans-serif';
            if (fontWeights?.[rowIndex]?.[colIndex] === 'bold') td.style.fontWeight = 'bold';
            if (fontStyles?.[rowIndex]?.[colIndex] === 'italic') td.style.fontStyle = 'italic';
            if (strikethroughs?.[rowIndex]?.[colIndex]) td.style.textDecoration = 'line-through';
            if (columnWidths?.[colIndex]) td.style.width = `${columnWidths[colIndex]}px`;

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    console.log('Table rendering completed.');
}

// 초기화
document.addEventListener('DOMContentLoaded', fetchDataAndRender);
