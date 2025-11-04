import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  console.log("📨 Request received:", req.method, req.url);

  // ВАЖНО: Telegram проверяет вебхук GET запросом
  if (req.method === "GET") {
    console.log("✅ GET request - webhook check");
    return new Response(JSON.stringify({ status: "OK", method: "GET" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Обрабатываем POST запросы от Telegram
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
    
    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Для всех остальных методов
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
});

console.log("🚀 Deno server running...");
