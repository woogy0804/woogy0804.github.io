# Eito Security Lab

GitHub Pages용 Jekyll 블로그입니다. 현재 저장소의 Chirpy 빌드 환경은 유지하면서 화면은 `_layouts/eito_*`, `assets/css/eito.css`, `assets/js/eito.js`로 구성했습니다.

## 게시하기

이 폴더의 파일을 `woogy0804/woogy0804.github.io` 저장소 루트에 올립니다. GitHub Actions의 **Build and Deploy** 작업이 완료되면 `https://woogy0804.github.io`에서 확인할 수 있습니다. Pages 설정의 배포 소스는 **GitHub Actions**여야 합니다.

## 새 글 쓰기

`_posts/YYYY-MM-DD-title.md` 파일을 추가합니다. 예:

```markdown
---
title: 첫 번째 기록
date: 2026-11-06 19:00:00 +0900
categories: [개발]
tags: [jekyll, github-pages]
---

본문을 Markdown으로 작성합니다.
```

게시된 글은 Archive에 날짜 역순으로 자동 추가됩니다. `tags`에 적은 태그는 Tags 페이지와 글 링크에 자동 반영됩니다. 글 목록은 이미지 없이 표시합니다. 미래 날짜의 글은 Jekyll 기본 설정에 따라 공개되지 않으므로 날짜와 시간대를 확인하세요.

카테고리는 다음 여섯 이름 중 하나를 그대로 사용하세요: `개발`, `CTF/Wargame`, `Bug Bounty`, `블로그/기술문서`, `논문/컨퍼런스`, `공모전/자격증`. 메뉴의 이름과 번역은 `_data/eito_categories.yml`에서 관리합니다.

KR/JP 전환은 메뉴와 안내 문구에 적용됩니다. 게시글 본문과 제목은 원문으로 표시됩니다. 일본어 글을 원하면 별도로 일본어 게시글을 작성하세요.

## 확인할 곳

- Archive: 글 목록, 태그 링크, 제목·본문·태그 검색
- Tags: 태그별 글 목록
- Categories: 여섯 분야별 글 목록
- About: 소개와 GitHub 링크
- 글 본문: Markdown, 날짜, 카테고리, 태그

GitHub Pages 배포는 `.github/workflows/pages-deploy.yml`이 담당합니다.
