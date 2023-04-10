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
                const deleteBtnId = `delete-btn-${word.english}`; // 生成獨特的ID
                
                row.innerHTML = `
                    <td scope="row">${word.english}</td>
                    <td scope="row">${word.chinese}</td>
                    <td scope="row">${word.count}</td>
                    <td scope="row">${word.notes}</td>
                    <td scope="row"><img id="${deleteBtnId}" src="../icons/delete.png" ></td>
                `;
                wordTable.appendChild(row);
                
                //綁定刪除事件N個
                const deleteBtn = document.getElementById(deleteBtnId);
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`確定要刪除${word.english}嗎`)) {
                    chrome.storage.sync.get('wordList', ({ wordList }) => {
                        let index = wordList.findIndex(item => item.english === word.english);
                        wordList.splice(index,1);
                        chrome.storage.sync.set({wordList});    
                        row.remove(); //刪除整行
                    });
                    }
                });

            });
        }
    });
}