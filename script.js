import _ from "lodash";
import API_KEY from "./token";

const NEWS_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=keyword&page=pageNum&sort=newest&api-key=${API_KEY}`;
let inputTimeId; // input의 timeout id
let newsData; // api로 받아온 데이터
let pageNum = 1; // 호출할 page
let searchHistory = []; // 최근 검색어 최대 5개 저장
let keyword; // 검색어
let articleItemsList; // 기사 리스트들
let starBtnsList; // 별 버튼 리스트들
let newsHtmlList = []; // 추가할 html 문자열 리스트
let bookmarkTrigger = false; // 스크롤 이벤트 방지

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
              }" class="title" target="_blank" rel="noopener noreferrer">
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
  await addArticleHtml(); // api 호출
  articleEl.innerHTML = newsHtmlList.join(""); // articleEl에 기사 리스트 추가
  articleItemsList = document.querySelectorAll(".article-item"); // articleItemsList 업데이트
  starBtnsList = document.querySelectorAll(".toggle-star"); // starBtnsList 업데이트

  if (window.innerHeight > document.body.scrollHeight && pageNum === 1) {
    // 첫페이지가 화면의 높이를 모두 채우지 못한 경우 다음 페이지 api요청
    ++pageNum;
    scrollEndArticleHtml();
  }
}

/* 스크롤 바닥일때 기사 추가하는 함수 */
async function scrollEndArticleHtml() {
  await addArticleHtml(); // api 호출

  // template요소를 사용하여 문자열을 노드객체로 변환
  const template = document.createElement("template");
  template.innerHTML = newsHtmlList.join("");
  const newListNode = template.content.children;

  for (let i = 0; i < newListNode.length; i++) {
    // 추가 페이지의 뉴스기사 리스트 출력
    articleEl.appendChild(newListNode[i]);
  }
  articleItemsList = document.querySelectorAll(".article-item"); // articleItemsList 업데이트
  starBtnsList = document.querySelectorAll(".toggle-star"); // starBtnsList 업데이트
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
    keywordSearch(); // 키워드 검색
    addSearchHistory(inputEl.value); // 키워드 저장
  } else {
    // 검색어가 빈값일 경우
    alert("검색어를 입력하세요.");
  }
};

/* 0.5초 동안 추가입력 없으면 api호출하는 핸들러 함수 */
const unchangedHendler = (e) => {
  clearTimeout(inputTimeId);
  inputTimeId = setTimeout(() => {
    if (e.target.value !== "") {
      keyword = e.target.value;
      pageNum = 1;
      keywordSearch(); // 키워드 검색
      addSearchHistory(e.target.value); // 키워드 저장
      keywordWrapEl.style.display = "block"; // 최근 검색어 영역 활성화
    }
  }, 500);
};

formEl.addEventListener("submit", (e) => {
  // 재로딩 방지
  e.preventDefault();
});

/* 검색 버튼 클릭 시 api호출 */
searchBtnEl.addEventListener("click", clickBtnHandler);
/* 키보드로 검색 시 api호출 */
inputEl.addEventListener("keyup", unchangedHendler);
/* 검색 input focus일 경우 */
inputEl.addEventListener("focus", () => {
  if (searchHistory.length !== 0) {
    keywordWrapEl.style.display = "block"; // 최근 검색어 영역 활성화
  }
});
/* 검색 input blur일 경우 */
inputEl.addEventListener("blur", () => {
  keywordWrapEl.style.display = "none"; // 최근 검색어 영역 비활성화
});

/* 스크롤 감지 이벤트함수 */
window.addEventListener(
  "scroll",
  _.throttle(() => {
    let windowHeight = window.innerHeight; // 스크린 창
    let fullHeight = document.body.offsetHeight;

    // header 높이: 190px
    // 스크롤이 바닥에 닿을 경우, 북마크 비활성화 시 api호출
    if (windowHeight + scrollY - 190 >= fullHeight && !bookmarkTrigger) {
      ++pageNum;
      scrollEndArticleHtml(); // api호출
    }
  }, 1000)
);

/* 즐겨찾기 토글 버튼 기능 */
articleEl.addEventListener("click", (e) => {
  e.target.parentNode.classList.toggle("active");
});

/* 북마크 토글 버튼 기능 */
toggleBookmarkEl.addEventListener("click", (e) => {
  const isActive = e.target.parentNode.classList.toggle("active");

  if (isActive) {
    // 북마크 활성화
    articleEl.innerHTML = ""; // reset
    for (let i = 0; i < starBtnsList.length; i++) {
      if (starBtnsList[i].classList.contains("active")) {
        // 즐겨찾기 버튼이 활성화된 기사들만 출력
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
