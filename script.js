import _ from "lodash";

const NEWS_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=keyword&page=pageNum&sort=newest&api-key=FdwAiEGYCwpc9manUy55RoDgPUtMOWtX";
let inputTimeId;
let keyword;
let newsData; // api로 받아온 데이터
let pageNum = 1;

const inputEl = document.querySelector("#keyword");
const formEl = document.querySelector(".search-form");
const articleEl = document.querySelector(".article");
const searchBtnEl = document.querySelector("#btn-search");

/* api호출하여 data 반환하는 함수 */
function getData(url) {
  const response = fetch(url);
  return response.then((res) => res.json());
}

/* article에 뉴스기사 html 추가하는 함수 */
async function addArticleHtml(pageNumber) {
  const newsList = [];

  for (let j = 0; j < pageNumber; j++) {
    newsData = await getData(
      NEWS_URL.replace("keyword", keyword.trim()).replace("pageNum", j + 1)
    ); // 키워드에 대한 뉴스 데이터 받아옴
    for (let i = 0; i < 10; i++) {
      newsList.push(`
        <div class="article-item">
            <div class="article-header">
              <a href="${newsData.response.docs[i].web_url}" class="title" target="_blank">
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
              <span class="date">${newsData.response.docs[i].pub_date}</span>
            </div>
          </div>
        `);
    }
  }

  articleEl.innerHTML = newsList.join("");
}

/* Search Button 클릭 시 api호출하는 핸들러 함수 */
const clickBtnHandler = () => {
  if (inputEl.value !== "") {
    keyword = inputEl.value;
    pageNum = 1;
    addArticleHtml(pageNum);
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
      addArticleHtml(pageNum);
      console.log(e.target.value);
    }
  }, 1000);
};

inputEl.addEventListener("keyup", unchangedHendler);
searchBtnEl.addEventListener("click", clickBtnHandler);
formEl.addEventListener("submit", (e) => {
  // 재로딩 방지
  e.preventDefault();
});
window.addEventListener(
  "scroll",
  _.throttle(() => {
    let windowHeight = window.innerHeight; // 스크린 창
    let fullHeight = document.body.offsetHeight;

    // header 높이: 190px
    // 스크롤이 바닥에 닿을 경우
    if (windowHeight + scrollY - 190 >= fullHeight) {
      console.log("스크롤 바닥!!!!");
      ++pageNum;
      addArticleHtml(pageNum);
    }
  }, 1000)
);
