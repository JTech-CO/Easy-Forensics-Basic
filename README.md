# Easy Forensics Basic

> 브라우저 기반 이미지 조작 분석 도구 (기본 버전)

<img width="2550" height="1526" alt="image" src="https://i.imgur.com/pMMyuZG.png" />

## 1. 소개 (Introduction)

Easy Forensics Basic은 웹 브라우저에서 실행되는 이미지 조작 분석 도구입니다. 별도의 소프트웨어 설치 없이 브라우저만으로 이미지의 조작 여부를 검증할 수 있습니다. 모든 처리는 클라이언트 측에서 이루어지며, 이미지 데이터는 외부로 전송되지 않습니다.

**주요 기능**
- **ELA (Error Level Analysis) 분석**: 이미지의 압축 레벨을 시각화하여 조작 여부를 확인
- **메타데이터 (EXIF) 분석**: 이미지에 포함된 EXIF 정보를 추출하여 촬영 정보 확인
- **돋보기 기능**: 마우스 커서 위치의 이미지를 2배 확대하여 세부 확인
- **결과 저장**: 분석 결과를 PNG 형식으로 저장
- **원본 비교**: 캔버스 클릭 시 원본 이미지와 비교 가능

## 2. 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **외부 라이브러리**: exif-js (EXIF 데이터 추출)
- **Deployment**: GitHub Pages

## 3. 설치 및 실행 (Quick Start)

이 프로젝트는 정적 웹사이트이므로 별도의 빌드 과정 없이 바로 실행할 수 있습니다.

**요구 사항**: 최신 브라우저 (Chrome, Firefox, Edge, Safari)

1. **로컬 실행**
   - `index.html` 파일을 브라우저로 열기 [실행하기](<https://jtech-co.github.io/Easy-Forensics-Basic/index.html>)
   - 또는 로컬 웹 서버 사용:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (http-server 설치 필요)
     npx http-server
     ```

2. **GitHub Pages 배포**
   - 레포지토리 Settings > Pages에서 소스 브랜치 선택
   - `/Basic` 폴더를 루트로 설정하거나 `/` 루트에서 `/Basic/index.html`로 접근

## 4. 폴더 구조 (Structure)

```
Basic/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css         # 스타일시트
├── js/
│   └── main.js            # 메인 JavaScript 로직
└── README.md
```

## 5. 사용 방법 (Usage)

1. **이미지 업로드**: "원본 이미지 업로드" 버튼을 클릭하여 분석할 이미지 선택
2. **ELA 분석**: ELA 분석 버튼을 클릭하여 압축 오차율 분석 실행
   - 균일한 노이즈: 원본일 확률 높음
   - 높은 대비/불규칙성: 조작 가능성 있음
3. **메타데이터 확인**: 메타데이터 버튼을 클릭하여 EXIF 정보 확인
4. **돋보기 사용**: 캔버스 위에서 마우스를 이동하면 해당 위치가 2배 확대되어 표시
5. **원본 비교**: 분석 중인 이미지에서 마우스를 클릭하면 원본을 확인 가능
6. **결과 저장**: 결과 저장 버튼을 클릭하여 현재 화면을 PNG로 저장

## 6. 정보 (Info)

- **License**: MIT
- **Version**: Basic
- **Browser Support**: 최신 브라우저 권장 (Canvas API, FileReader API 지원 필요)



