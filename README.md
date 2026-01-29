# 인테리어 포트폴리오 웹사이트

디자인청춘 레퍼런스 기반의 인테리어/공간 디자인 포트폴리오 웹사이트입니다.

## 🌐 Live Demo

GitHub Pages: [https://your-username.github.io/designyouth](https://your-username.github.io/designyouth)

## 🎨 Features

- 반응형 디자인 (모바일/태블릿/데스크톱)
- 카테고리별 프로젝트 필터링
- 풀스크린 프로젝트 상세 갤러리
- 문의 폼
- 미니멀 & 모던 UI

## 📂 Structure

```
├── index.html          # 메인 페이지
├── projects.html       # 프로젝트 리스트
├── project-detail.html # 프로젝트 상세
├── contact.html        # 문의 페이지
├── css/                # 스타일시트
├── js/                 # JavaScript
└── data/               # 프로젝트 데이터 (JSON)
```

## 🔧 프로젝트 관리

새 프로젝트 추가: `data/projects.json` 파일 수정

```json
{
  "id": "project-xxx",
  "title": "프로젝트명",
  "category": "cafe",
  "location": "서울",
  "area": "100㎡",
  "year": "2024",
  "thumbnail": "이미지URL",
  "images": ["이미지1", "이미지2"],
  "description": "설명",
  "featured": true
}
```

## 📄 License

MIT License
