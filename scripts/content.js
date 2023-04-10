//使用 document.querySelector 函數選擇第一個 <article> 元素，並把這個元素儲存在 article 變數中。
const article = document.querySelector("article");

//檢查 article 是否為空，如果不是則進行下一步，否則跳過整個程式碼塊。
if (article) {
    
  //從 article 元素中取得文本內容，並儲存在 text 變數中。
  const text = article.textContent;

  //創建一個正則表達式來匹配所有單詞。這個正則表達式會匹配所有非空白字符，並把它們全部找出來。把正則表達式儲存在 wordMatchRegExp 變數中。
  const wordMatchRegExp = /[^\s]+/g; // 

  //使用 text.matchAll(wordMatchRegExp) 函數來在文本中找到所有匹配的單詞。這個函數會返回一個迭代器，其中每個項目都包含一個匹配的單詞。把迭代器轉換成陣列，並儲存在 words 變數中。
  const words = text.matchAll(wordMatchRegExp);
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 100);

  //創建一個新的 <p> 元素，並把它的文本內容設置為文章的閱讀時間，並添加一個鐘形圖示。然後添加兩個 CSS 類名，這些類名會設置元素的顏色和字體大小。
  const badge = document.createElement("p");
  badge.classList.add("my-badge");
  badge.textContent = `⏱️ ${readingTime} min read`;
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("content.css");
  link.rel = "stylesheet";
  document.head.appendChild(link);

  //在文章標題和日期之後插入這個新的元素(badge)。如果 article 元素中包含日期，則插入在日期元素之後；否則插入在標題元素之後。
  const date = document.querySelector("h1");
  date.insertAdjacentElement("afterend", badge);
}