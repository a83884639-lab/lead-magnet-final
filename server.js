const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// SendGrid 설정
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'noreply@sayeondaesam.com';
const PDF_LINK = 'https://drive.google.com/file/d/1AkbPcfVKPnE2OCP2FANS9qjDXBrM60Ti/view?usp=sharing';

// 이메일 발송 함수
async function sendWelcomeEmail(name, email) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          color: #E63946;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .greeting {
          color: #333;
          font-size: 18px;
          font-weight: 500;
          margin: 20px 0;
        }
        .content {
          color: #555;
          line-height: 1.8;
          font-size: 16px;
          margin: 20px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #E63946;
          color: white;
          padding: 14px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        .cta-button:hover {
          background-color: #c92a35;
        }
        .signature {
          color: #E63946;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">사연더샘</div>
        </div>
        
        <div class="greeting">안녕하세요, ${name}님.</div>
        
        <div class="content">
          감정 사연을 통해 조용한 위로를 전하는 사연더샘입니다.
          <br><br>
          당신의 소중한 구독을 감사드립니다.
          <br><br>
          아래 버튼을 클릭하면 무료 가이드를 다운로드할 수 있습니다.
        </div>
        
        <center>
          <a href="${PDF_LINK}" class="cta-button">무료 가이드 받기</a>
        </center>
        
        <div class="signature">
          ✨ 당신의 오늘도, 내일도 응원합니다. ✨
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: '사연더샘 무료 가이드 - 당신의 마음을 위로합니다',
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`이메일 발송 완료: ${email}`);
    return true;
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    return false;
  }
}

// 폼 제출 엔드포인트
app.post('/api/submit-form', async (req, res) => {
  const { name, phone, email } = req.body;

  // 입력값 검증
  if (!name || !phone || !email) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: '유효한 이메일을 입력해주세요.' });
  }

  // 이메일 발송
  const emailSent = await sendWelcomeEmail(name, email);

  if (emailSent) {
    res.json({ 
      success: true, 
      message: '감사합니다! 이메일을 확인해주세요.' 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: '이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.' 
    });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`랜딩 페이지: http://localhost:${PORT}/landing-page.html`);
});
