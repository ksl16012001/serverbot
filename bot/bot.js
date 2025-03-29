const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = "YOUR_BOT_TOKEN";
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        "Nhấn vào nút bên dưới để mở WebApp:",
        Markup.keyboard([
            Markup.button.webApp("Mở WebApp", "https://your-webapp.com")
        ])
    );
});

bot.on("web_app_data", (ctx) => {
    const data = JSON.parse(ctx.webAppData.data);

    if (data.action === "pay") {
        ctx.sendInvoice({
            title: "Giao dịch Telegram Stars",
            description: `Thanh toán ${data.amount} XTR`,
            payload: "stars_payment",
            provider_token: "", // Telegram xử lý nội dung số, không cần token
            currency: "XTR",
            prices: [{ label: "XTR", amount: data.amount }],
            start_parameter: "buy_xtr"
        });
    }
});

bot.on("pre_checkout_query", (ctx) => {
    if (ctx.preCheckoutQuery.payload !== "stars_payment") {
        ctx.answerPreCheckoutQuery(false, "Lỗi giao dịch!");
    } else {
        ctx.answerPreCheckoutQuery(true);
    }
});

bot.on("successful_payment", (ctx) => {
    ctx.reply(`Thanh toán thành công! Bạn đã dùng ${ctx.message.successful_payment.total_amount / 100} XTR 🌟`);
});

bot.launch();
console.log("Bot đang chạy...");
