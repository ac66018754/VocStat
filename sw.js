//當page載入完成後，
chrome.runtime.onInstalled.addListener(() => {
    //1.創建上下文菜單項
    chrome.contextMenus.create({
        id: 'addWord',
        title: '添加到生詞本',
        contexts: ['selection'],
        type:'checkbox'
    });
	chrome.contextMenus.create({
        id: 'translate',
        title: '翻譯',
        contexts: ['selection'],
		type: 'checkbox'
    });
});

// 監聽上下文菜單項被點擊的事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    //如果點擊的是我們extension設置的，也就是id=addWord的話
    if (info.menuItemId === 'addWord') {
        //讀取出選中的文字，並去頭尾空白，並送往我們定義的addToWordList()函數
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

//串接Azure的API
async function translateWord(word) {
    const { apiKey } = await new Promise((resolve) =>
      chrome.storage.sync.get('apiKey', resolve)
    );
  
    if (!apiKey) {
      console.error('API Key is not set. Please set it in the extension options.');
      return;
    }
  
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const location = 'eastasia'; // 請將此替換為您的資源所在位置，例如：'eastus'。
  
    const url = `${endpoint}/translate?api-version=3.0&to=zh-Hant&textType=plain&includeAlignment=false&includeSentenceLength=false&profanityAction=NoAction&from=en`;
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Ocp-Apim-Subscription-Key', apiKey);
    headers.append('Ocp-Apim-Subscription-Region', location);
  
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ Text: word }]),
    });
  
    if (!response.ok) {
      console.error(`Azure Translator API returned an error: ${response.status}`);
      return;
    }
  
    try {
      const data = await response.json();
      return data[0].translations[0].text;
    } catch (error) {
      console.error('Error parsing JSON data from Azure Translator API:', error);
    }
  }
  
