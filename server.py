import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập API

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

# Lưu thông tin người dùng
user_info = {}

@app.route('/webhook', methods=['POST'])
def webhook():
    """Nhận dữ liệu từ Telegram và lưu thông tin người dùng"""
    data = request.json
    if 'message' in data:
        chat_id = data['message']['chat']['id']
        user = data['message']['from']

        user_info[chat_id] = {
            "id": user["id"],
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
            "username": user.get("username", ""),
        }

        # Phản hồi lại người dùng trên Telegram
        message = f"Xin chào {user.get('first_name', '')}, dữ liệu của bạn đã được lưu! ✅"
        requests.post(f"{TELEGRAM_API_URL}/sendMessage", json={"chat_id": chat_id, "text": message})

    return jsonify({"status": "ok"}), 200

@app.route('/get-user-data', methods=['POST'])  # ⚠️ Đổi tên route này
def get_user_data():
    """Nhận dữ liệu người dùng từ WebApp"""
    user_data = request.json
    if not user_data:
        return jsonify({"error": "No user data received"}), 400
    return jsonify(user_data), 200

@app.route('/get-user/<chat_id>', methods=['GET'])
def get_user_by_id(chat_id):  
    """API để lấy thông tin người dùng từ WebApp"""
    if int(chat_id) in user_info:
        return jsonify(user_info[int(chat_id)])
    return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
