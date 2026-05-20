const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// FROM_EMAIL을 환경 변수로 설정하고, 없으면 기본값 사용
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'a83884639@gmail.com';
const PDF_LINK = 'https://drive.google.com/file/d/1AkbPcfVKPnE20CP2FANS9qjDXBrM60Ti/view?usp=sharing';

// 향상된 로깅을 위한 헬퍼 함수
function logWithTimestamp(message, data = '') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, data);
}

async function sendWelcomeEmail(name, email) {
      try {
              logWithTimestamp('이메일 발송 시작:', { name, email, fromEmail: FROM_EMAIL });
              logWithTimestamp('API 키 로드 상태:', !!process.env.SENDGRID_API_KEY ? '로드됨' : '없음');

        const msg = {
                  to: email,
                  from: FROM_EMAIL,
                  subject: '무료 가이드를 받으셨습니다 | 사연더샘',
                  html: `
                          <div style="background-color: #E63946; color: white; padding: 40px 20px; text-align: center; max-width: 600px; margin: 0 auto;">
                                    <h1 style="margin: 0; font-size: 28px; font-family: Arial, sans-serif;">사연더샘</h1>
                                              <p style="margin: 10px 0 0 0; font-size: 14px;">당신의 마음을 위로합니다</p>
                                                      </div>

                                                                      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                                                                <h2 style="color: #333; font-size: 20px;">안녕하세요, ${name}님</h2>

                                                                                                    <p>감사합니다! 무료 가이드가 준비되었습니다.</p>
                                                                                                              
                                                                                                                        <p style="text-align: center; margin: 30px 0;">
                                                                                                                                    <a href="${PDF_LINK}" style="background-color: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">가이드 다운로드</a>
                                                                                                                                              </p>
                                                                                                                                                        
                                                                                                                                                                  <p>가이드에는 60대 이상 시니어 여성분들을 위한 공감과 회복의 이야기가 담겨있습니다.</p>
                                                                                                                                                                            
                                                                                                                                                                                      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
                                                                                                                                                                                                  <p style="margin: 0;">당신의 오늘도, 내일도 응원합니다.</p>
                                                                                                                                                                                                              <p style="margin: 5px 0 0 0; font-weight: bold;">사연더샘</p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                      `
        };

        logWithTimestamp('메시지 객체 생성 완료');

        const result = await sgMail.send(msg);
              logWithTimestamp('이메일 발송 성공:', { statusCode: result[0].statusCode });

        return result;
      } catch (error) {
              logWithTimestamp('이메일 발송 실패 - 에러 타입:', error.constructor.name);
              logWithTimestamp('에러 메시지:', error.message);
              logWithTimestamp('에러 상태:', error.code || error.statusCode || '알 수 없음');

        if (error.response) {
                  logWithTimestamp('응답 상태 코드:', error.response.statusCode);
                  logWithTimestamp('응답 본문:', JSON.stringify(error.response.body));
        }

        throw error;
      }
}

async function handler(req, res) {
      logWithTimestamp('요청 수신:', { method: req.method, path: req.url });

  if (req.method !== 'POST') {
          logWithTimestamp('지원하지 않는 메서드:', req.method);
          return res.status(405).json({ success: false, message: '지원하지 않는 메서드입니다' });
  }

  const { name, phone, email } = req.body;

  // 필수 필드 검증
  if (!name || !phone || !email) {
          logWithTimestamp('필수 필드 누락:', { name: !!name, phone: !!phone, email: !!email });
          return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요' });
  }

  logWithTimestamp('폼 데이터 유효성 확인 완료:', { name, phone, email });

  try {
          await sendWelcomeEmail(name, email);
          logWithTimestamp('응답 전송: 성공');
          return res.status(200).json({ success: true, message: '이메일이 발송되었습니다' });
  } catch (error) {
          logWithTimestamp('핸들러 에러 처리:', error.message);
          return res.status(500).json({ 
                                            success: false, 
                    message: '메일 발송 실패: ' + error.message 
          });
  }
}

module.exports = handler;
