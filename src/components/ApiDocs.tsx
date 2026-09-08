import React, { useState } from 'react';
import { 
  Code2, Terminal, Copy, Check, Play, Globe, Film, Music, 
  ExternalLink, Layers, CheckCircle2, ChevronRight, RefreshCw, Send
} from 'lucide-react';

interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  example: string;
}

interface EndpointDoc {
  id: string;
  category: 'movies' | 'music' | 'crawler';
  method: 'GET' | 'POST' | 'GET / POST';
  path: string;
  title: string;
  description: string;
  params: EndpointParam[];
  sampleResponse?: any;
}

export const ApiDocs: React.FC = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  const baseUrl = `${origin}/api`;

  const endpoints: EndpointDoc[] = [
    {
      id: 'movie_search',
      category: 'movies',
      method: 'GET',
      path: '/api/movies/search',
      title: 'جستجوی فیلم و سریال',
      description: 'جستجوی فیلم و سریال بر اساس عنوان (فارسی یا انگلیسی) در هر دو دیتابیس دارک‌نما و سینمافلیکس همراه با کیفیت‌ها و پوسترها',
      params: [
        { name: 'q', type: 'string', required: true, description: 'عبارت جستجو (فارسی یا انگلیسی)', example: 'Batman' },
        { name: 'source', type: 'string', required: false, description: 'منبع جستجو: all | darknama | cenamaflix', example: 'all' }
      ]
    },
    {
      id: 'movie_latest',
      category: 'movies',
      method: 'GET',
      path: '/api/movies/latest',
      title: 'آخرین عناوین اضافه شده',
      description: 'واکشی جدیدترین فیلم‌ها یا سریال‌های آپلود شده همراه با اطلاعات کامل و لینک‌های دانلود مستقیم',
      params: [
        { name: 'type', type: 'string', required: false, description: 'نوع محتوا: movie یا serie', example: 'movie' },
        { name: 'count', type: 'number', required: false, description: 'تعداد عناوین درخواستی', example: '20' }
      ]
    },
    {
      id: 'movie_seasons',
      category: 'movies',
      method: 'GET',
      path: '/api/movies/seasons',
      title: 'فصل‌ها و اپیزودهای سریال',
      description: 'دریافت تمام فصل‌ها و اپیزودهای یک سریال به تفکیک کیفیت با لینک مستقیم دانلود هر قسمت',
      params: [
        { name: 'id', type: 'string', required: true, description: 'شناسه عددی سریال در دارک‌نما', example: '14853' }
      ]
    },
    {
      id: 'cenamaflix_post',
      category: 'movies',
      method: 'GET',
      path: '/api/movies/cenamaflix-post',
      title: 'استخراج لینک‌های پست سینمافلیکس',
      description: 'کرول مستقیم صفحه پست سینمافلیکس جهت استخراج لینک‌های دانلود کیفیت‌های 1080p, 720p, 480p و پلیر آنلاین',
      params: [
        { name: 'url', type: 'string', required: true, description: 'آدرس کامل صفحه پست در cenamaflix.ir', example: 'https://cenamaflix.ir/batman-the-dark-knight-returns-part-1-2012-bluray/' }
      ]
    },
    {
      id: 'music_search',
      category: 'music',
      method: 'GET',
      path: '/api/music/search',
      title: 'جستجوی رادیو جوان (آهنگ، آرتیست، پلی‌لیست)',
      description: 'جستجوی پیشرفته در آرشیو رادیو جوان با تفکیک آهنگ‌ها، خواننده‌ها و پلی‌لیست‌های متناظر',
      params: [
        { name: 'q', type: 'string', required: true, description: 'نام آهنگ یا خواننده', example: 'Shadmehr Aghili' }
      ]
    },
    {
      id: 'music_latest_songs',
      category: 'music',
      method: 'GET',
      path: '/api/music/latest-songs',
      title: 'جدیدترین آهنگ‌های رادیو جوان (Latest Songs)',
      description: 'دریافت تازه‌ترین آهنگ‌های منتشر شده با لینک‌های مستقیم ۳۲۰، ۲۵۶، ۱۲۸، اطلاعات پخش و ترانه',
      params: [
        { name: 'count', type: 'number', required: false, description: 'تعداد آهنگ‌های درخواستی (پیش‌فرض ۴۰)', example: '30' }
      ]
    },
    {
      id: 'music_latest_playlists',
      category: 'music',
      method: 'GET',
      path: '/api/music/latest-playlists',
      title: 'جدیدترین پلی‌لیست‌های رادیو جوان (Latest Playlists)',
      description: 'دریافت جدیدترین و به‌روزترین پلی‌لیست‌های رادیو جوان مرتب‌شده بر اساس تاریخ به‌روزرسانی (updated_at) با کاور و آمار',
      params: [
        { name: 'count', type: 'number', required: false, description: 'تعداد پلی‌لیست‌ها (پیش‌فرض ۳۰)', example: '24' }
      ]
    },
    {
      id: 'music_latest',
      category: 'music',
      method: 'GET',
      path: '/api/music/latest',
      title: 'عناوین جدید موزیک (آهنگ‌ها یا پلی‌لیست‌ها)',
      description: 'دریافت یکجای جدیدترین آهنگ‌ها و/یا جدیدترین پلی‌لیست‌ها با فیلتر نوع',
      params: [
        { name: 'type', type: 'string', required: false, description: 'نوع محتوا: songs یا playlists یا all', example: 'songs' },
        { name: 'count', type: 'number', required: false, description: 'تعداد موارد', example: '30' }
      ]
    },
    {
      id: 'music_song',
      category: 'music',
      method: 'GET',
      path: '/api/music/song',
      title: 'اطلاعات کامل آهنگ، لینک‌های مستقیم و متن ترانه (شعر)',
      description: 'دریافت کاور باکیفیت، لینک دانلود 320، 128 و m4a، آمار شنوندگان و لایک‌ها، و متن کامل ترانه',
      params: [
        { name: 'id', type: 'string', required: true, description: 'اسلاگ یا آیدی آهنگ', example: 'shadmehr-aghili-tajrobeh-kon' }
      ]
    },
    {
      id: 'music_artist',
      category: 'music',
      method: 'GET',
      path: '/api/music/artist',
      title: 'صفحه کامل آرتیست / خواننده',
      description: 'دریافت عکس پروفایل و بنر، آمار فالوورها و پلی‌ها، و دیسکوگرافی کامل (تمام آهنگ‌ها، آلبوم‌ها و موزیک‌ویدیوها)',
      params: [
        { name: 'name', type: 'string', required: true, description: 'نام خواننده', example: 'Shadmehr Aghili' }
      ]
    },
    {
      id: 'music_playlists',
      category: 'music',
      method: 'GET',
      path: '/api/music/playlists',
      title: 'لیست پلی‌لیست‌های برگزیده رادیو جوان',
      description: 'دریافت دسته‌بندی‌های پلی‌لیست‌های ترند، فصلی و برگزیده با کاور و آمار دنبال‌کنندگان',
      params: []
    },
    {
      id: 'music_playlist_items',
      category: 'music',
      method: 'GET',
      path: '/api/music/playlist',
      title: 'ترک‌های داخل یک پلی‌لیست با لینک‌های دانلود',
      description: 'دریافت تمامی آهنگ‌های موجود درون یک پلی‌لیست همراه با کاور و لینک‌های مستقیم MP3',
      params: [
        { name: 'id', type: 'string', required: true, description: 'شناسه پلی‌لیست', example: '09385e59d4df' }
      ]
    },
    {
      id: 'crawler_scrape',
      category: 'crawler',
      method: 'GET / POST',
      path: '/api/crawler/scrape',
      title: 'کرولر هوشمند آنی برای هر آدرس اینترنتی',
      description: 'ارسال هر URL از دارک‌نما، سینمافلیکس، رادیو جوان یا سایت‌های دیگر و دریافت فایل‌های صوتی، ویدیویی، زیرنویس‌ها و متاداده به صورت JSON',
      params: [
        { name: 'url', type: 'string', required: true, description: 'آدرس صفحه وب هدف', example: 'https://darknama.pages.dev/' }
      ]
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(endpoints[0]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    q: 'Batman',
    source: 'all',
    type: 'movie',
    count: '20',
    id: '14853',
    name: 'Shadmehr Aghili',
    url: 'https://cenamaflix.ir/batman-the-dark-knight-returns-part-1-2012-bluray/'
  });

  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'js' | 'python' | 'php' | 'curl'>('js');

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const constructRequestUrl = (ep: EndpointDoc) => {
    let url = `${origin}${ep.path}`;
    const queryParams: string[] = [];
    ep.params.forEach((p) => {
      const val = paramValues[p.name] !== undefined ? paramValues[p.name] : p.example;
      if (val) {
        queryParams.push(`${p.name}=${encodeURIComponent(val)}`);
      }
    });
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    return url;
  };

  const executeLiveTest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    setTestStatus(null);
    const start = performance.now();

    try {
      const targetUrl = constructRequestUrl(selectedEndpoint);
      const res = await fetch(targetUrl);
      setTestStatus(res.status);
      const data = await res.json();
      setTestLatency(Math.round(performance.now() - start));
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ success: false, error: err.message });
      setTestStatus(500);
    } finally {
      setTestLoading(false);
    }
  };

  const generateCodeSnippet = (lang: 'js' | 'python' | 'php' | 'curl') => {
    const fullUrl = constructRequestUrl(selectedEndpoint);

    switch (lang) {
      case 'js':
        return `// JavaScript / TypeScript (Fetch API for your website)
async function fetchMediaData() {
  try {
    const response = await fetch('${fullUrl}');
    const data = await response.json();
    console.log('Results:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
  }
}

// Call on button click or page load
fetchMediaData();`;

      case 'python':
        return `# Python (requests library)
import requests

url = "${fullUrl}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("API Response:", data)
else:
    print("Error:", response.status_code, response.text)`;

      case 'php':
        return `<?php
// PHP (cURL for WordPress or custom PHP site)
$url = "${fullUrl}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $data = json_decode($response, true);
    // Use data in your theme or templates:
    print_r($data);
} else {
    echo "Error fetching data: " . $http_code;
}
?>`;

      case 'curl':
        return `# cURL CLI
curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Docs Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>مستندات RESTful API و کنسول تست زنده برای سایت شما</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              تمام داده‌ها و لینک‌های دانلود استخراج شده به صورت وب‌سرویس استاندارد JSON آماده پیاده‌سازی در سایت شخصی، وردپرس یا اپلیکیشن شما هستند.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-slate-400">Base URL:</span>
            <code className="text-cyan-300 font-bold">{baseUrl}</code>
            <button
              onClick={() => copyCode(baseUrl, 'base')}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              {copiedCode === 'base' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Endpoints Directory & Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar: Endpoints list */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-wider">
            فهرست وب‌سرویس‌ها ({endpoints.length})
          </div>

          <div className="space-y-1.5">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    setTestResponse(null);
                    setTestStatus(null);
                  }}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex items-start justify-between gap-2 group ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/60">
                        {ep.method}
                      </span>
                      <span className="font-bold text-xs text-white truncate">{ep.title}</span>
                    </div>
                    <code className="text-[11px] font-mono text-slate-400 block truncate dir-ltr text-left">
                      {ep.path}
                    </code>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 mt-1 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Console: Selected Endpoint details, params, live executor & code generator */}
        <div className="lg:col-span-8 space-y-6">

          {/* Endpoint Specification Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60">
                    {selectedEndpoint.method}
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedEndpoint.title}</h3>
                </div>
                <code className="text-xs font-mono text-cyan-300 dir-ltr block text-left">
                  {constructRequestUrl(selectedEndpoint)}
                </code>
              </div>

              <button
                onClick={() => copyCode(constructRequestUrl(selectedEndpoint), 'url')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors font-medium"
              >
                {copiedCode === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی آدرس کامل</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedEndpoint.description}
            </p>

            {/* Parameter Inputs */}
            {selectedEndpoint.params.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  پارامترهای ورودی (Query Parameters):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEndpoint.params.map((p) => (
                    <div key={p.name} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-cyan-300">{p.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {p.required ? 'الزامی' : 'اختیاری'} • {p.type}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={paramValues[p.name] !== undefined ? paramValues[p.name] : p.example}
                        onChange={(e) => handleParamChange(p.name, e.target.value)}
                        placeholder={`مثال: ${p.example}`}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono dir-ltr text-left"
                      />
                      <p className="text-[10px] text-slate-400">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Execute Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={executeLiveTest}
                disabled={testLoading}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
              >
                {testLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>ارسال درخواست و تست زنده (Execute)</span>
              </button>

              {testStatus && (
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      testStatus >= 200 && testStatus < 300
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/80'
                    }`}
                  >
                    HTTP {testStatus}
                  </span>
                  {testLatency && (
                    <span className="text-slate-400 font-mono">{testLatency} ms</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Response Box if executed */}
          {testResponse && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-300 flex items-center gap-1.5 font-semibold">
                  <Terminal className="w-4 h-4" />
                  پاسخ زنده از سرور (Live Server Response)
                </span>
                <button
                  onClick={() => copyCode(JSON.stringify(testResponse, null, 2), 'resp')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedCode === 'resp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>کپی JSON</span>
                </button>
              </div>

              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Code Generator Snippets */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>کد آماده جهت اتصال به سایت شما (Code Snippets)</span>
                </h4>
                <p className="text-xs text-slate-400">کد زیر را کپی کرده و مستقیماً در فایل‌های فرانت‌اند یا بک‌اند سایت خود استفاده کنید.</p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
                <button
                  onClick={() => setCodeLanguage('js')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    codeLanguage === 'js' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JavaScript (Fetch)
                </button>
                <button
                  onClick={() => setCodeLanguage('php')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    codeLanguage === 'php' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PHP (WordPress)
                </button>
                <button
                  onClick={() => setCodeLanguage('python')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    codeLanguage === 'python' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setCodeLanguage('curl')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    codeLanguage === 'curl' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
              <button
                onClick={() => copyCode(generateCodeSnippet(codeLanguage), 'snippet')}
                className="absolute top-3 left-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors z-10"
              >
                {copiedCode === 'snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی کد</span>
              </button>

              <pre className="p-4 pt-10 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed dir-ltr text-left">
                {generateCodeSnippet(codeLanguage)}
              </pre>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
