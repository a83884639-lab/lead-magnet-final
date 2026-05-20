const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'noreply@sayeondaesam.com';
const PDF_LINK = 'https://drive.google.com/file/d/1AkbPcfVKPnE2OCP2FANS9qjDXBrM60Ti/view?usp=sharing';

async function sendWelcomeEmail(name, email) {
  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: '✨ 당신을 위한 감정 케어 가이드 (PDF 다운로드 링크)',
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #E63946; color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">감사합니다.</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">${name}님</p>
  </div>
  <div style="background-color: #f9f9f9; padding: 40px 20px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
      당신의 구독을 환영합니다.
    </p>
    <p style="font-size: 16px; color: #333; margin: 0 0 30px 0;">
      아래 버튼을 클릭해서 감정 케어 가이드 PDF를 다운로드하세요.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${PDF_LINK}" style="background-color: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; display: inline-block;">
        PDF 다운로드하기
      </a>
    </div>
    <p style="font-size: 14px; color: #666; margin: 30px 0 0 0; line-height: 1.6;">
      이 가이드는 당신의 감정을 이해하고<br>
      일상 속 위로를 찾기 위해 준비했습니다.
    </p>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
      <p style="font-size: 16px; color: #333; margin: 0; font-style: italic;">
        ✨ 당신의 오늘도, 내일도 응원합니다. ✨
      </p>
    </div>
  </div>
</div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: '이메일이 발송되었습니다.' };
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '유효한 이메일을 입력해주세요.' });
    }

    await sendWelcomeEmail(name, email);

    return res.status(200).json({
      success: true,
      message: '가입이 완료되었습니다! 이메일을 확인해주세요.',
    });
  } catch (error) {
    console.error('폼 제출 오류:', error);
    return res.status(500).json({
      success: false,
      error: '처리 중 오류가 발생했습니다. 다시 시도해주세요.',
    });
  }
}
