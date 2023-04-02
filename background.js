// 創建上下文菜單項
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'addWord',
        title: '添加到生詞本',
        contexts: ['selection']
    });
});

// 監聽上下文菜單項被點擊的事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addWord') {
        const selectedText = info.selectionText.trim();
        if (selectedText) {
            addToWordList(selectedText);
        }
    }
});

// 添加選擇的單詞到生詞本
async function addToWordList(word) {
    chrome.storage.sync.get('wordList', async ({ wordList }) => {
        if (!wordList) {
            wordList = [];
        }

        const existingWord = wordList.find(item => item.english === word);

        if (existingWord) {
            existingWord.count++;
        } else {
            const chineseTranslation = await translateWord(word); // 獲取翻譯

            wordList.push({
                english: word,
                chinese: chineseTranslation, // 添加翻譯結果
                count: 1,
                notes: ''
            });
        }

        chrome.storage.sync.set({ wordList }, () => {
            console.log(`成功添加單詞：${word}`);
        });
    });
}

//串接DeepL的API
async function translateWord(word) {
    const { apiKey } = await new Promise((resolve) => chrome.storage.sync.get('apiKey', resolve));
  
    if (!apiKey) {
      console.error('API Key is not set. Please set it in the extension options.');
      return;
    }
  
    const url = `https://api.deepl.com/v2/translate?target_lang=ZH&auth_key=${apiKey}&text=${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.translations[0].text;
}