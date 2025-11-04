// main.ts - СУПЕР ПРОСТОЙ ВЕБХУК
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  console.log("📨 Request received:", req.method);
  
  // ВАЖНО: сразу отвечаем OK для Telegram
  const response = new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // Асинхронно обрабатываем POST запросы
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("Body:", body);
      
      if (body.message?.text === "/start") {
        const chatId = body.message.chat.id;
        const userName = body.message.from.first_name || "User";
        
        console.log(`🎯 /start from ${userName} (${chatId})`);
        
        // Отвечаем в Telegram
        const telegramResponse = await fetch(
          "https://api.telegram.org/bot6691235654:AAFsKfPaN3N5qAcGBT7NLdIZDHeMH5s61aE/sendMessage",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `✅ Привет, ${userName}!\\n🚀 Deno Deploy работает!\\n📞 Твой ID: <code>${chatId}</code>`,
              parse_mode: "HTML",
            }),
          }
        );
        
        if (telegramResponse.ok) {
          console.log("✅ Ответ отправлен в Telegram");
        } else {
          console.log("❌ Ошибка отправки в Telegram");
        }
      }
    } catch (error) {
      console.log("❌ Error processing request:", error);
    }
  }

  return response;
});

console.log("🚀 Deno server running...");
