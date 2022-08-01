import _ from "lodash";

const NEWS_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=keyword&page=pageNum&sort=newest&api-key=FdwAiEGYCwpc9manUy55RoDgPUtMOWtX";
let inputTimeId;
let newsData; // api로 받아온 데이터
let pageNum = 1;
let searchHistory = []; // 최근 검색어 최대 5개 저장
let keyword; // 검색어
let articleItemsList; // 기사 리스트들
let starBtnsList; // 별 버튼 리스트들
let newsHtmlList = []; // 추가할 html 문자열 리스트
let bookmarkTrigger = false;

const inputEl = document.querySelector("#keyword");
const formEl = document.querySelector(".search-form");
const articleEl = document.querySelector(".article");
const searchBtnEl = document.querySelector("#btn-search");
const keywordBodyEl = document.querySelector(".keyword-body");
const keywordWrapEl = document.querySelector(".keyword-wrap");
const toggleBookmarkEl = document.querySelector(".toggle-bookmark");

/* api호출하여 data 반환하는 함수 */
function getData(url) {
  const response = fetch(url);
  return response.then((res) => res.json());
}

/* article에 뉴스기사 html 추가하는 함수 */
async function addArticleHtml() {
  newsData = await getData(
    NEWS_URL.replace("keyword", keyword.trim()).replace("pageNum", pageNum)
  ); // 키워드에 대한 뉴스 데이터 받아옴
  newsHtmlList = [];
  for (let i = 0; i < 10; i++) {
    newsHtmlList.push(`
        <div class="article-item">
            <div class="article-header">
              <a href="${
                newsData.response.docs[i].web_url
              }" class="title" target="_blank">
                ${newsData.response.docs[i].headline.main}
              </a>
              <button class="toggle-star">
                <span class="material-icons"> grade </span>
              </button>
            </div>
            <div class="article-body">
              <p>${newsData.response.docs[i].abstract}</p>
            </div>
            <div class="article-footer">
              <span class="date">${newsData.response.docs[i].pub_date.slice(
                0,
                10
              )} ${newsData.response.docs[i].pub_date.slice(11, 19)}</span>
            </div>
          </div>
        `);
  }
}

/* 새로운 검색 시 기사 추가하는 함수 */
async function keywordSearch() {
  await addArticleHtml();
  articleEl.innerHTML = newsHtmlList.join("");
  articleItemsList = document.querySelectorAll(".article-item");
  starBtnsList = document.querySelectorAll(".toggle-star");

  if (window.innerHeight > document.body.scrollHeight && pageNum === 1) {
    // 첫페이지가 화면의 높이를 모두 채우지 못한 경우 다음 페이지 api요청
    ++pageNum;
    scrollEndArticleHtml();
  }
}

/* 스크롤 바닥일때 기사 추가하는 함수 */
async function scrollEndArticleHtml() {
  await addArticleHtml();
  const template = document.createElement("template");
  template.innerHTML = newsHtmlList.join("");
  const newListNode = template.content.children;
  for (let i = 0; i < newListNode.length; i++) {
    articleEl.appendChild(newListNode[i]);
  }
  articleItemsList = document.querySelectorAll(".article-item");
  starBtnsList = document.querySelectorAll(".toggle-star");
}

/* keywordBody에 최근 검색어 html 추가하는 함수 */
function addkeywordHistoryHtml() {
  searchHistory.reverse();
  const keywordList = [];
  keywordList.push("<ul>");
  for (let i = 0; i < searchHistory.length; i++) {
    keywordList.push(`
      <li>${searchHistory[i]}</li>
    `);
  }
  keywordList.push("</ul>");
  keywordBodyEl.innerHTML = keywordList.join("");
}

/* 검색어 searchHistory에 저장하는 함수 */
function addSearchHistory(keyword) {
  searchHistory.reverse();
  // 검색어 최대 5개까지 저장
  if (searchHistory.length < 5) {
    searchHistory[searchHistory.length] = keyword;
  } else {
    searchHistory.shift();
    searchHistory = [...searchHistory, keyword];
  }
  addkeywordHistoryHtml();
}

/* Search Button 클릭 시 api호출하는 핸들러 함수 */
const clickBtnHandler = () => {
  if (inputEl.value !== "") {
    keyword = inputEl.value;
    pageNum = 1;
    keywordSearch();
    addSearchHistory(inputEl.value);
  } else {
    alert("검색어를 입력하세요.");
  }
};

/* 0.5초 동안 추가입력이 없으면 api호출하는 핸들러 함수 */
const unchangedHendler = (e) => {
  clearTimeout(inputTimeId);
  inputTimeId = setTimeout(() => {
    if (e.target.value !== "") {
      keyword = e.target.value;
      pageNum = 1;
      keywordSearch();
      addSearchHistory(e.target.value);
      keywordWrapEl.style.display = "block";
    }
  }, 2000);
};

formEl.addEventListener("submit", (e) => {
  // 재로딩 방지
  e.preventDefault();
});

searchBtnEl.addEventListener("click", clickBtnHandler);
inputEl.addEventListener("keyup", unchangedHendler);

inputEl.addEventListener("focus", () => {
  if (searchHistory.length !== 0) {
    keywordWrapEl.style.display = "block";
  }
});
inputEl.addEventListener("blur", () => {
  keywordWrapEl.style.display = "none";
});

window.addEventListener(
  "scroll",
  _.throttle(() => {
    let windowHeight = window.innerHeight; // 스크린 창
    let fullHeight = document.body.offsetHeight;

    // header 높이: 190px
    // 스크롤이 바닥에 닿을 경우
    if (windowHeight + scrollY - 190 >= fullHeight && !bookmarkTrigger) {
      console.log("스크롤 바닥!!!!");
      ++pageNum;
      scrollEndArticleHtml();
    }
  }, 1000)
);
articleEl.addEventListener("click", (e) => {
  e.target.parentNode.classList.toggle("active");
});

toggleBookmarkEl.addEventListener("click", (e) => {
  const isActive = e.target.parentNode.classList.toggle("active");

  if (isActive) {
    // 북마크 활성화
    articleEl.innerHTML = ""; // reset
    for (let i = 0; i < starBtnsList.length; i++) {
      if (starBtnsList[i].classList.contains("active")) {
        articleEl.appendChild(starBtnsList[i].parentNode.parentNode);
      }
    }
    bookmarkTrigger = true;
  } else {
    // 북마크 비활성화
    articleEl.innerHTML = ""; // reset
    [...articleItemsList].forEach((articleItem) => {
      articleEl.appendChild(articleItem);
    });
    bookmarkTrigger = false;
  }
});
