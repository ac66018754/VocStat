document.addEventListener('DOMContentLoaded', () => {
    loadWordList();
});

function loadWordList() {
    chrome.storage.sync.get('wordList', ({ wordList }) => {
        if (wordList) {
            const wordTable = document.getElementById('wordList');
            wordTable.innerHTML = ''; // 清除表格內容

            wordList.sort((a, b) => b.count - a.count); // 依據被記錄次數降序排列

            wordList.forEach(word => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${word.english}</td>
                    <td>${word.chinese}</td>
                    <td>${word.count}</td>
                    <td>${word.notes}</td>
                `;
                wordTable.appendChild(row);
            });
        }
    });
}