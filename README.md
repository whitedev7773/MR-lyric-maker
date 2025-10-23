# MR Lyric Maker

Adobe After Effects용 MR 가사 제작 스크립트입니다.

## 사전 요구 사항

- [After Effects CC 2025](https://www.adobe.com/kr/products/aftereffects.html) - 최소 2024 이상 권장
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## 설치

프로젝트 종속성을 설치하려면 다음 명령을 실행하세요

```bash
npm install
```

## 빌드

프로젝트를 빌드하려면 다음 명령을 실행하세요.  
이 명령은 `src/` 디렉토리의 TypeScript 파일을 컴파일하고 `dist/script.jsx`에 출력 파일을 생성합니다.

```bash
npm run build
```

## 실행 방법

1.  `npm run build`를 실행하여 `dist/script.jsx` 파일을 생성합니다.
2.  생성된 `script.jsx` 파일을 After Effects에서 실행합니다.
3.  표시되는 안내에 따라 올바른 값을 입력합니다.
4.  After Effects의 메뉴에서 스크립트를 찾아 실행할 수 있습니다.
