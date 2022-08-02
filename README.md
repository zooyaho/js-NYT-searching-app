# Toy Project

> react-NYT-searching-app : React기반의 NYT 뉴스기사 검색 홈페이지

## 👾 결과 화면

![](https://velog.velcdn.com/images/zooyaho/post/601fe647-b1d4-42d8-b50d-6dcd7e87dd57/image.gif)

## ✅ 요구사항 수행 확인 체크 리스트

### 📎 clip 부분

- [x] : clip 버튼을 클릭하여 clip을 추가하고,
      "clip한 기사만 보기" 버튼 클릭시 확인가능한가
- [x] : unclip 버튼 클릭시 "clip한 기사만 보기" 상태에서 노출되지 않는가
- [x] : clip 버튼과 unclip 버튼이 토글 가능한가

### 📎 search 부분

- [x] : 검색 시 search history가 잘 추가되는가
- [x] : search history가 존재하는 경우만 노출하는가
- [x] : nput에 focus중일 때만 search history를 노출하는가
- [x] : search history는 최대 5개까지만 저장되는가

### 📎 news 부분

- [x] : news 리스트가 잘 렌더되는가
- [x] : 각각의 news 카드는 타이틀,날짜,clip하기버튼, 자세히 보기 버튼을 포함하는가
- [x] : input에서 enter나 검색 버튼을 누르지 않아도 api를 호출하는가
- [x] : 자세히보기 버튼 클릭 시 해당 기사를 새탭에서 open하는가
- [x] : 뉴스를 추가로 불러올 수 있는가 (button을 클릭해서라도)

### 📎 프로젝트 완성도

- [x] : scroll을 내리는 경우 추가로 뉴스를 불러오는가
- [x] : input 입력 후 0.5초동안 추가입력이 없는 경우에만 api를 호출하는가
- [x] : input value가 있는 경우만 api를 호출하였는가
- [x] : 새 탭에서 외부 url을 open하는 경우,
      보안 및 최적화를 위한 attribute를 추가하였는가
- [x] : 각 작업에 대하여 commit message를 잘 작성하였는가
