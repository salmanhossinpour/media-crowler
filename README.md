# MediaCrawler API & Live Studio 🎬🎵

موتور قدرتمند، پرسرعت و متن‌باز خزش وب (Web Crawler)، استخراج‌کننده متاداده، لینک‌های مستقیم دانلود و وب‌سرویس جامع RESTful برای **فیلم و سریال (Darknama & Cenamaflix)**، **موزیک، دیسکوگرافی و متن شعر رادیو جوان (Radio Javan)**، به همراه پنل فرانت‌اند مدرن، استودیوی پخش موزیک آنلاین و کنسول تست زنده API.

---

## ✨ ویژگی‌های کلیدی (Key Features)

### 🎬 ۱. بخش فیلم و سریال (Movies & TV Shows)
- **جستجوی همگام یا مجزا**: جستجو در آرشیو دارک‌نما (`darknama.pages.dev`) و سینمافلیکس (`cenamaflix.ir`).
- **استخراج کیفیت‌های دانلود**: دریافت لینک‌های مستقیم 1080p, 720p, 480p به همراه نسخه زیرنویس چسبیده و صوت دوبله.
- **پشتیبانی کامل از سریال‌ها**: استخراج دسته‌بندی‌شده تمامی فصل‌ها و اپیزودهای سریال‌ها همراه با لینک مستقیم هر قسمت.
- **استخراج از پست‌های سینمافلیکس**: کرول زنده پست‌های `cenamaflix.ir`، استخراج لینک‌های ویدیو (`data-video`)، لینک‌های دانلود و متاداده IMDb.

### 🎵 ۲. استودیو موزیک رادیو جوان (Radio Javan Music Studio)
- **جستجوی جامع**: تفکیک نتایج بر اساس آهنگ‌ها، آرتیست‌ها و پلی‌لیست‌ها.
- **لینک‌های مستقیم با بالاترین کیفیت**: دریافت لینک‌های مستقیم `MP3 320kbps`، `MP3 256kbps`، `MP3 128kbps` و نسخه اورجینال `AAC / M4A`.
- **استخراج متن ترانه (Lyrics)**: دسترسی مستقیم به متن شعر آهنگ‌ها.
- **پروفایل و دیسکوگرافی خواننده‌ها**: آمار شنوندگان (Plays)، دنبال‌کنندگان، عکس پروفایل، بنر، و لیست کامل آهنگ‌ها و آلبوم‌های خواننده.
- **پلیر آنلاین پیوسته**: پخش آنلاین استریم آهنگ‌ها با قابلیت Seek و کنترل صدا.

### 🌐 ۳. کرولر آنی و همه‌منظوره (Universal On-Demand Scraper)
- امکان ارسال هر آدرس URL و استخراج خودکار فایل‌های صوتی (`.mp3`), ویدیویی (`.mp4`, `.mkv`), زیرنویس‌ها (`.srt`), تگ‌های OpenGraph، متاداده و تصاویر به فرمت ساختاریافته JSON.

### 💻 ۴. کنسول تست زنده و تولید کد برای وب‌سایت شما (API Docs & Code Generator)
- محیط آزمایش تعاملی برای اجرای زنده اندپوینت‌ها و مشاهده پاسخ JSON و زمان تأخیر (Latency).
- تولید خودکار کدهای آماده کپی در ۴ زبان و محیط پرکاربرد:
  - **JavaScript / TypeScript (Fetch API)**
  - **PHP / cURL** (جهت قالب‌های وردپرس و اسکریپت‌های PHP)
  - **Python (Requests)**
  - **cURL CLI**

---

## 🚀 فهرست وب‌سرویس‌ها (API Endpoints)

تمامی پاسخ‌ها به صورت `application/json` با هدرهای استاندارد CORS ارائه می‌شوند.

| متد | اندپوینت | پارامترها | توضیحات |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies/search` | `q` (الزامی), `source` (`all` \| `darknama` \| `cenamaflix`) | جستجوی فیلم و سریال بر اساس عنوان با لینک‌های دانلود مستقیم استخراج‌شده یکجا |
| `GET` | `/api/movies/latest` | `type` (`movie` \| `serie`), `source` (`all` \| `darknama` \| `cenamaflix`), `count` (پیش‌فرض ۲۰) | آخرین عناوین اضافه شده از هر دو منبع همراه با لینک‌های دانلود مستقیم تمام کیفیت‌ها |
| `GET` | `/api/movies/cenamaflix-latest` | `type` (`movie` \| `serie`), `count` (پیش‌فرض ۱۶) | دریافت یکجای عناوین جدید سینمافلیکس با لینک‌های مستقیم تمام کیفیت‌ها (مشابه دارک‌نما) |
| `GET` | `/api/movies/seasons` | `id` (شناسه عددی سریال در دارک‌نما) | دریافت تمام فصل‌ها و اپیزودهای سریال با لینک دانلود مستقیم هر قسمت |
| `GET` | `/api/movies/cenamaflix-post` | `url` (آدرس کامل پست در سینمافلیکس) | استخراج جزئیات کامل، لینک‌های کیفیت‌های مختلف و پلیر آنلاین یک پست |
| `GET` | `/api/music/latest-songs` | `count` (پیش‌فرض ۴۰) | **جدیدترین آهنگ‌های رادیو جوان** با لینک مستقیم ۳۲۰، ۲۵۶ و ۱۲۸ و اطلاعات پخش |
| `GET` | `/api/music/latest-playlists` | `count` (پیش‌فرض ۳۰) | **جدیدترین پلی‌لیست‌های رادیو جوان** مرتب‌شده بر اساس تاریخ بروزرسانی و تعداد ترک‌ها |
| `GET` | `/api/music/latest` | `type` (`songs` \| `playlists` \| `all`), `count` | دریافت عناوین جدید موزیک (آهنگ‌ها یا پلی‌لیست‌ها) با کش خودکار سرور |
| `GET` | `/api/music/search` | `q` (نام آهنگ یا خواننده) | جستجوی آهنگ، خواننده و پلی‌لیست در رادیو جوان |
| `GET` | `/api/music/song` | `id` (آیدی یا اسلاگ آهنگ) | دریافت لینک‌های 320/128، کاور و متن کامل شعر |
| `GET` | `/api/music/artist` | `name` (نام انگلیسی خواننده) | پروفایل کامل خواننده، بنر، آمار و تمام آهنگ‌ها |
| `GET` | `/api/music/playlists` | - | لیست پلی‌لیست‌های برگزیده و ترند رادیو جوان |
| `GET` | `/api/music/playlist` | `id` (شناسه پلی‌لیست) | ترک‌های داخل یک پلی‌لیست با لینک مستقیم |
| `GET / POST` | `/api/crawler/scrape` | `url` (آدرس اینترنتی هدف) | کرول زنده هر صفحه وب و استخراج مدیا و لینک‌ها |

---

## 🛠️ نحوه نصب و راه‌اندازی (Getting Started)

### پیش‌نیازها
- **Node.js** نسخه 18 یا بالاتر
- **npm** یا **pnpm** یا **yarn**

### ۱. کلون کردن مخزن
```bash
git clone https://github.com/your-username/mediacrawler-api.git
cd mediacrawler-api
```

### ۲. نصب پکیج‌ها
```bash
npm install
```

### ۳. اجرای محیط توسعه (Development)
```bash
npm run dev
```
اپلیکیشن در آدرس `http://localhost:3000` در دسترس خواهد بود. هم فرانت‌اند React و هم میدل‌ور وب‌سرویس `/api` به صورت خودکار فعال هستند.

### ۴. بیلد و اجرای پروداکشن (Production)
```bash
# بیلد فرانت‌اند
npm run build

# اجرای سرور Node.js مستقل
npm run start
```

---

## 💻 نمونه کدهای اتصال به وب‌سرویس (Usage Examples)

### ۱. جاوااسکریپت (JavaScript Fetch برای فرانت‌اند وب‌سایت شما)
```javascript
// دریافت لینک‌های دانلود فیلم یا آهنگ
async function searchMedia(query) {
  try {
    const response = await fetch(`http://localhost:3000/api/movies/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('نتایج فیلم‌ها:', data.results);
    }
  } catch (error) {
    console.error('خطا در فراخوانی API:', error);
  }
}

searchMedia('Inception');
```

### ۲. پی‌اچ‌پی (PHP / قالب وردپرس)
```php
<?php
// استفاده در functions.php یا فایل قالب وردپرس
function get_movie_downloads($movie_title) {
    $api_url = "http://localhost:3000/api/movies/search?q=" . urlencode($movie_title);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    return $data['results'] ?? [];
}
?>
```

### ۳. پایتون (Python Requests)
```python
import requests

url = "http://localhost:3000/api/music/song"
params = {"id": "shadmehr-aghili-tajrobeh-kon"}

response = requests.get(url, params=params)
if response.status_code == 200:
    song_data = response.json()
    print("نام ترانه:", song_data['song']['title'])
    print("لینک دانلود 320:", song_data['song']['download_links']['mp3_320'])
    print("متن شعر:\n", song_data['song']['lyrics'])
```

### ۴. ترمینال (cURL)
```bash
curl -X GET "http://localhost:3000/api/music/search?q=Ebi" \
  -H "Accept: application/json"
```

---

## 🏗️ ساختار پروژه (Project Architecture)

```text
├── server/
│   ├── apiHandler.ts      # کنترلر اصلی و مسیریابی تمام اندپوینت‌های /api
│   ├── scraper.ts         # موتور کرولر، پارسر Cheerio و منطق استخراج مدیا
│   └── radioJavan.ts      # سرویس اختصاصی رادیو جوان (جستجو، آهنگ، آرتیست، پلی‌لیست)
├── src/
│   ├── components/
│   │   ├── Header.tsx         # هدر اصلی و منوی جابجایی بین تب‌ها
│   │   ├── MovieExplorer.tsx  # کاوشگر فیلم و سریال دارک‌نما و سینمافلیکس
│   │   ├── MusicStudio.tsx    # استودیوی جامع رادیو جوان، لیست‌ها و بیوگرافی
│   │   ├── AudioPlayer.tsx    # پلیر صوتی شناور و مداوم با کنترل‌های پیشرفته
│   │   ├── CrawlerSandbox.tsx # محیط سندباکس جهت کرول زنده هر آدرس دلخواه
│   │   └── ApiDocs.tsx        # مستندات تعاملی، کنسول تست زنده و تولید کد
│   ├── types.ts           # تعاریف کامل تایپ‌های تایپ‌اسکریپت
│   ├── App.tsx            # کامپوننت اصلی برنامه
│   └── index.css          # استایل‌های مدرن با Tailwind CSS
├── server.ts              # سرور Express مستقل جهت محیط پروداکشن
├── vite.config.ts         # پیکربندی Vite به همراه پلاگین اجرای درونی API
├── package.json           # اسکریپت‌ها و وابستگی‌های پروژه
└── README.md              # راهنمای جامع پروژه
```

---

## 📦 استک فنی (Tech Stack)

- **Backend Runtime**: Node.js, Express 4, TypeScript
- **Web Crawling & Parsing**: Cheerio, Native Fetch
- **Frontend Framework**: React 19, Vite 6
- **Styling**: Tailwind CSS v4, Motion (Animations)
- **Icons**: Lucide React
- **Architecture**: Full-Stack Unified Dev/Prod Server

---

## ⚖️ سلب مسئولیت (Disclaimer)

این پروژه برای اهداف آموزشی، پژوهشی و یکپارچه‌سازی وب‌سرویس‌ها توسعه داده شده است. تمامی محتواها، حقوق کپی‌رایت آهنگ‌ها، فیلم‌ها و نشان‌های تجاری متعلق به دارندگان اصلی آن‌ها می‌باشد.
