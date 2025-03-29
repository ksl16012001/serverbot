const express = require("express");
const app = express();
app.use(express.json());

app.post("/verify-payment", (req, res) => {
    const { user_id, stars, payload, payment_result } = req.body;
    
    if (payment_result && stars > 0) {
        res.json({ verified: true });
    } else {
        res.json({ verified: false });
    }
});

app.listen(3000, () => console.log("Server đang chạy trên cổng 3000"));
