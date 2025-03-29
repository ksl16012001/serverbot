const tg = window.Telegram.WebApp;
tg.expand(); // Mở rộng WebApp

const initData = tg.initDataUnsafe;
document.getElementById("user-info").innerText = `Xin chào, ${initData.user?.first_name}`;

document.getElementById("payButton").addEventListener("click", () => {
    tg.sendData(JSON.stringify({
        action: "pay",
        amount: 100 // Gửi 100 XTR
    }));
});
