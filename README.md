# 사연더샘 리드 자석 (Lead Magnet) 이메일 시스템

시니어 감정 사연을 통해 조용한 위로를 전달하는 사연더샘의 자동 이메일 마케팅 시스템입니다.

## 구성 요소

### 1. 랜딩 페이지 (`landing-page.html`)
- 이름, 전화번호, 이메일 수집
- 시니어 여성 친화적인 디자인
- 실시간 폼 검증

### 2. 감사 페이지 (`thank-you.html`)
- 구독 감사 메시지
- Google Drive PDF 다운로드 링크
- 따뜻한 마무리 인사

### 3. 서버 (`server.js`)
- Express.js 기반 Node.js 애플리케이션
- SendGrid API로 자동 이메일 발송
- 기본 포트: 3000

### 4. 설정 파일
- `package.json`: 의존성 정의
- `.env`: 환경 변수 (SendGrid API Key)

## 배포

이 시스템은 Vercel에 배포되어 있습니다.

### 시작하기

1. 저장소 클론
```bash
git clone https://github.com/[your-username]/lead-magnet.git
cd lead-magnet
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정 (.env 파일 확인)
```
SENDGRID_API_KEY=your_key_here
```

4. 로컬에서 실행
```bash
npm start
```

5. 브라우저에서 접속
```
http://localhost:3000/landing-page.html
```

## 이메일 플로우

1. 사용자가 폼 입력 및 제출
2. 서버에서 유효성 검사
3. SendGrid API를 통해 이메일 자동 발송
4. 사용자를 감사 페이지로 리다이렉트

## 이메일 내용

- 발신자: noreply@sayeondaesam.com
- 제목: 사연더샘 무료 가이드
- 내용: Google Drive PDF 링크 포함

## 주의사항

- SendGrid API Key는 절대 공개하지 마세요
- .env 파일을 .gitignore에 추가하세요
- 환경 변수는 배포 플랫폼에서 별도로 설정하세요

## 라이선스

개인 사용용
