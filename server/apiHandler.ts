import type { IncomingMessage, ServerResponse } from 'http';
import {
  searchRadioJavan,
  getRadioJavanSong,
  getRadioJavanArtist,
  getRadioJavanPlaylists,
  getRadioJavanPlaylistDetail,
  searchDarknama,
  getDarknamaLatest,
  getDarknamaSeriesSeasons,
  searchCenamaflix,
  getCenamaflixPostDetail,
  universalCrawler
} from './crawler.ts';

export const API_DOCS = [
  {
    endpoint: '/api/movies/search',
    method: 'GET',
    category: 'Movies & Series',
    title: 'جستجوی فیلم و سریال',
    description: 'جستجوی عنوان فیلم و سریال در دیتابیس دارک‌نما و سینمافلیکس همراه با پوستر، امتیاز IMDb و لینک‌های دانلود',
    parameters: [
      { name: 'q', type: 'string', required: true, description: 'عبارت جستجو (فارسی یا انگلیسی)', example: 'Batman' },
      { name: 'source', type: 'string', required: false, description: 'منبع جستجو: darknama, cenamaflix, all', example: 'all' }
    ],
    responseExample: {
      success: true,
      query: 'Batman',
      results: [
        {
          id: 14853,
          title: 'The Batman',
          type: 'movie',
          year: 2022,
          imdb: 8.3,
          duration: '176 min',
          sources: [
            { quality: '1080 زیرنویس', url: 'http://.../The.Batman.1080p.mkv' },
            { quality: '720 زیرنویس', url: 'http://.../The.Batman.720p.mkv' }
          ]
        }
      ]
    }
  },
  {
    endpoint: '/api/movies/latest',
    method: 'GET',
    category: 'Movies & Series',
    title: 'آخرین فیلم‌ها و سریال‌ها',
    description: 'دریافت جدیدترین عناوین اضافه شده همراه با کیفیت‌ها و اطلاعات کامل',
    parameters: [
      { name: 'type', type: 'string', required: false, description: 'نوع: movie یا serie', example: 'movie' },
      { name: 'count', type: 'number', required: false, description: 'تعداد نتایج (پیش‌فرض 20)', example: '20' }
    ]
  },
  {
    endpoint: '/api/movies/seasons',
    method: 'GET',
    category: 'Movies & Series',
    title: 'فصل‌ها و قسمت‌های سریال',
    description: 'دریافت تمام فصل‌ها و اپیزودهای یک سریال به همراه لینک دانلود مستقیم هر قسمت',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'شناسه سریال', example: '11901' }
    ]
  },
  {
    endpoint: '/api/movies/cenamaflix-post',
    method: 'GET',
    category: 'Movies & Series',
    title: 'استخراج لینک‌های پست سینمافلیکس',
    description: 'دریافت لینک‌های دانلود با کیفیت‌های مختلف و پخش آنلاین از آدرس پست cenamaflix.ir',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'آدرس پست در سینمافلیکس', example: 'https://cenamaflix.ir/batman-the-dark-knight-returns-part-1-2012-bluray/' }
    ]
  },
  {
    endpoint: '/api/music/search',
    method: 'GET',
    category: 'Radio Javan Music',
    title: 'جستجوی آهنگ، خواننده و پلی‌لیست',
    description: 'جستجوی جامع در رادیو جوان با تفکیک آهنگ‌ها، خواننده‌ها و پلی‌لیست‌ها',
    parameters: [
      { name: 'q', type: 'string', required: true, description: 'نام خواننده یا آهنگ', example: 'Shadmehr' }
    ],
    responseExample: {
      success: true,
      query: 'Shadmehr',
      results: {
        songs: [{ id: 63660, title: 'Tajrobeh Kon', artist: 'Shadmehr Aghili', photo: 'https://...' }],
        artists: [{ name: 'Shadmehr Aghili', photo: 'https://...' }],
        playlists: [{ id: '09385e59d4df', title: 'Summer Time' }]
      }
    }
  },
  {
    endpoint: '/api/music/song',
    method: 'GET',
    category: 'Radio Javan Music',
    title: 'اطلاعات کامل آهنگ و دانلود',
    description: 'دریافت لینک دانلود با کیفیت‌های 320 و 128 و m4a، کاور باکیفیت و متن کامل ترانه (شعر)',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'شناسه آهنگ یا اسلاگ صفحه', example: 'shadmehr-aghili-tajrobeh-kon' }
    ]
  },
  {
    endpoint: '/api/music/artist',
    method: 'GET',
    category: 'Radio Javan Music',
    title: 'صفحه کامل آرتیست / خواننده',
    description: 'بیوگرافی، آمار شنوندگان، عکس پروفایل و بنر، لیست کامل آهنگ‌ها، آلبوم‌ها و موزیک ویدیوها',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'نام خواننده', example: 'Shadmehr Aghili' }
    ]
  },
  {
    endpoint: '/api/music/playlists',
    method: 'GET',
    category: 'Radio Javan Music',
    title: 'دسته‌بندی پلی‌لیست‌های برگزیده',
    description: 'دریافت لیست پلی‌لیست‌های ترند و دسته‌بندی‌های رادیو جوان',
    parameters: []
  },
  {
    endpoint: '/api/music/playlist',
    method: 'GET',
    category: 'Radio Javan Music',
    title: 'ترک‌های پلی‌لیست با لینک دانلود',
    description: 'مشاهده تمام آهنگ‌های داخل یک پلی‌لیست همراه با اطلاعات و لینک‌های دانلود مستقیم',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'شناسه پلی‌لیست', example: '09385e59d4df' }
    ]
  },
  {
    endpoint: '/api/crawler/scrape',
    method: 'GET / POST',
    category: 'Universal Crawler',
    title: 'کرولر هوشمند و اختصاصی هر آدرس',
    description: 'استخراج خودکار مدیا، فایل‌های ویدیویی (mp4/mkv)، صوتی (mp3)، زیرنویس‌ها (.srt) و متاداده از هر لینک وب‌سایت',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'آدرس صفحه مدنظر برای کرول و استخراج', example: 'https://darknama.pages.dev/' }
    ]
  }
];

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    // 1. Health check
    if (pathname === '/api/health') {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString(), service: 'MediaCrawler API' }));
      return;
    }

    // 2. Endpoints directory
    if (pathname === '/api/docs/endpoints') {
      res.statusCode = 200;
      res.end(JSON.stringify({
        name: 'MediaCrawler REST API',
        version: '1.0.0',
        description: 'موتور وب‌سرویس و کرولر اختصاصی فیلم، سریال، زیرنویس و موزیک',
        endpoints: API_DOCS
      }, null, 2));
      return;
    }

    // 3. Movies Search
    if (pathname === '/api/movies/search') {
      const q = searchParams.get('q') || '';
      const source = searchParams.get('source') || 'all';

      if (!q.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Query parameter "q" is required' }));
        return;
      }

      let darknamaResults: any = { results: [] };
      let cenamaflixResults: any = { results: [] };

      if (source === 'darknama' || source === 'all') {
        darknamaResults = await searchDarknama(q);
      }
      if (source === 'cenamaflix' || source === 'all') {
        cenamaflixResults = await searchCenamaflix(q);
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        query: q,
        source,
        total: (darknamaResults.results?.length || 0) + (cenamaflixResults.results?.length || 0),
        darknama: darknamaResults.results || [],
        cenamaflix: cenamaflixResults.results || []
      }));
      return;
    }

    // 4. Movies Latest
    if (pathname === '/api/movies/latest') {
      const type = (searchParams.get('type') === 'serie' ? 'serie' : 'movie') as 'movie' | 'serie';
      const count = parseInt(searchParams.get('count') || '20', 10);
      const data = await getDarknamaLatest(type, count);
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // 5. TV Series Seasons
    if (pathname === '/api/movies/seasons') {
      const id = searchParams.get('id');
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "id" is required' }));
        return;
      }
      const data = await getDarknamaSeriesSeasons(id);
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // 6. Cenamaflix Post Crawler
    if (pathname === '/api/movies/cenamaflix-post') {
      const postUrl = searchParams.get('url');
      if (!postUrl) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "url" is required' }));
        return;
      }
      const data = await getCenamaflixPostDetail(postUrl);
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // 7. Music Search
    if (pathname === '/api/music/search') {
      const q = searchParams.get('q');
      if (!q) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Query parameter "q" is required' }));
        return;
      }
      const data = await searchRadioJavan(q);
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // 8. Music Song Details & Lyrics & Downloads
    if (pathname === '/api/music/song') {
      const id = searchParams.get('id');
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "id" is required' }));
        return;
      }
      const data = await getRadioJavanSong(id);
      res.statusCode = data.success ? 200 : 404;
      res.end(JSON.stringify(data));
      return;
    }

    // 9. Music Artist
    if (pathname === '/api/music/artist') {
      const name = searchParams.get('name') || searchParams.get('query');
      if (!name) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "name" is required' }));
        return;
      }
      const data = await getRadioJavanArtist(name);
      res.statusCode = data.success ? 200 : 404;
      res.end(JSON.stringify(data));
      return;
    }

    // 10. Music Playlists List
    if (pathname === '/api/music/playlists') {
      const data = await getRadioJavanPlaylists();
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // 11. Music Playlist Detail
    if (pathname === '/api/music/playlist') {
      const id = searchParams.get('id');
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "id" is required' }));
        return;
      }
      const data = await getRadioJavanPlaylistDetail(id);
      res.statusCode = data.success ? 200 : 404;
      res.end(JSON.stringify(data));
      return;
    }

    // 12. Universal Scrape / Crawler (GET & POST)
    if (pathname === '/api/crawler/scrape') {
      let targetUrl = searchParams.get('url');

      if (req.method === 'POST') {
        const bodyText = await readBody(req);
        try {
          const bodyJson = JSON.parse(bodyText);
          if (bodyJson.url) targetUrl = bodyJson.url;
        } catch (e) {}
      }

      if (!targetUrl) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Parameter "url" is required in query or body' }));
        return;
      }

      const data = await universalCrawler(targetUrl);
      res.statusCode = data.success ? 200 : 500;
      res.end(JSON.stringify(data));
      return;
    }

    // Unknown endpoint
    res.statusCode = 404;
    res.end(JSON.stringify({
      success: false,
      error: 'Endpoint not found',
      hint: 'Visit /api/docs/endpoints to see all available API endpoints'
    }));
  } catch (error: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }));
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
  });
}
