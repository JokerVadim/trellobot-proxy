// api/webhook.js - для Netlify Functions
export default async function handler(req, res) {
  console.log('🟢 Webhook called');
  
  // СРАЗУ отвечаем OK
  res.status(200).json({ status: 'OK' });
  
  // Асинхронно обрабатываем
  if (req.body && req.body.message?.text === '/start') {
    const chatId = req.body.message.chat.id;
    
    try {
      await fetch('https://api.telegram.org/bot6691235654:AAFsKfPaN3N5qAcGBT7NLdIZDHeMH5s61aE/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🚀 GitHub + Netlify работает! Мгновенно!',
          parse_mode: 'HTML'
        })
      });
      console.log('✅ Ответ отправлен в Telegram');
    } catch (error) {
      console.log('❌ Ошибка Telegram:', error.message);
    }
  }
}
