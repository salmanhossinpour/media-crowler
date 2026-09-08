import * as cheerio from 'cheerio';

// Radio Javan Config & Constants
const RJ_BASE = 'https://rj-deskcloud.com/api2';
const RJ_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'x-rj-user-agent': 'Radio Javan/5.0.0 (Desktop) com.radioJavan.rj.desktop',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) RadioJavan/5.2.0 Chrome/130.0.6723.118 Electron/33.2.0 Safari/537.36'
};

// Darknama Config & Constants
const DARKNAMA_API_BASE = 'https://server-hi-speed-iran.info/api/';
const DARKNAMA_API_KEY = '4F5A9C3D9A86FA54EACEDDD635185';
const DARKNAMA_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*'
};

// Cenamaflix Headers
const CENAMAFLIX_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7'
};

// ==========================================
// 1. RADIO JAVAN CRAWLER / API
// ==========================================

export interface RJSong {
  id: number | string;
  title: string;
  artist: string;
  song: string;
  artist_farsi?: string;
  song_farsi?: string;
  photo: string;
  thumbnail: string;
  photo_player?: string;
  download_links: {
    mp3_320?: string;
    mp3_256?: string;
    mp3_128?: string;
    hq_m4a?: string;
    lq_m4a?: string;
    hls?: string;
  };
  duration?: string | number;
  plays?: string | number;
  downloads?: string | number;
  likes?: number;
  lyrics?: string;
  album?: string;
  release_date?: string;
  share_link?: string;
}

export interface RJArtist {
  name: string;
  name_farsi?: string;
  photo?: string;
  thumbnail?: string;
  followers?: number | string;
  plays?: string;
  monthly_plays?: string;
  rank?: number;
  songs_count?: number;
  songs?: any[];
  albums?: any[];
  videos?: any[];
  playlists?: any[];
}

export interface RJPlaylist {
  id: string;
  title: string;
  photo?: string;
  followers?: number;
  items_count?: number;
  tracks: any[];
}

export async function searchRadioJavan(query: string) {
  if (!query || !query.trim()) return { success: false, error: 'Query is required', query, results: [] };
  try {
    const url = `${RJ_BASE}/search?query=${encodeURIComponent(query.trim())}`;
    const res = await fetch(url, { headers: RJ_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`RJ Search HTTP ${res.status}`);
    const data = await res.json();

    const songs = (data.mp3s || []).map((item: any) => formatRJSong(item));
    const artists = (data.artists || []).map((item: any) => ({
      name: item.name || item.query,
      name_farsi: item.name_farsi || item.artist_farsi,
      photo: item.photo,
      thumbnail: item.thumbnail,
      followers: item.followers,
      share_link: item.share_link,
      query: item.query
    }));
    const playlists = (data.playlists || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      photo: item.photo,
      followers: item.followers,
      items_count: item.items_count || item.count,
      share_link: item.share_link
    }));

    return {
      success: true,
      source: 'Radio Javan (play.radiojavan.com)',
      query,
      counts: {
        songs: songs.length,
        artists: artists.length,
        playlists: playlists.length
      },
      results: {
        top: data.top || [],
        songs,
        artists,
        playlists
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message, query, results: [] };
  }
}

export async function getRadioJavanSong(songIdOrSlug: string) {
  if (!songIdOrSlug) return { success: false, error: 'Song ID or slug is required' };
  try {
    // Try via API2 endpoint
    const url = `${RJ_BASE}/mp3?id=${encodeURIComponent(songIdOrSlug.trim())}`;
    const res = await fetch(url, { headers: RJ_HEADERS, signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.title || data.song)) {
        return {
          success: true,
          source: 'Radio Javan (play.radiojavan.com)',
          song: formatRJSong(data)
        };
      }
    }

    // Fallback: Scrape song page on play.radiojavan.com
    const pageUrl = songIdOrSlug.startsWith('http') 
      ? songIdOrSlug 
      : `https://play.radiojavan.com/song/${encodeURIComponent(songIdOrSlug)}`;
    const pageRes = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000)
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      // Look for JSON-LD lyrics
      let lyrics = '';
      const lyricMatch = html.match(/"lyrics":\[\{[^}]*"text":"([^"]+)"/);
      if (lyricMatch) {
        lyrics = lyricMatch[1].replace(/\\n/g, '\n');
      }

      // Look for playContext
      const playContextMatch = html.match(/"playContext":\{"items":\[([\s\S]*?)\]\}/);
      if (playContextMatch) {
        try {
          const item = JSON.parse(playContextMatch[1]);
          const song = formatRJSong(item);
          if (lyrics && !song.lyrics) song.lyrics = lyrics;
          return {
            success: true,
            source: 'Radio Javan (play.radiojavan.com - Web Scrape)',
            song
          };
        } catch (e) {}
      }
    }

    return { success: false, error: 'Song not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRadioJavanArtist(artistNameOrQuery: string) {
  if (!artistNameOrQuery) return { success: false, error: 'Artist query is required' };
  try {
    const url = `${RJ_BASE}/artist?query=${encodeURIComponent(artistNameOrQuery.trim())}`;
    const res = await fetch(url, { headers: RJ_HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`RJ Artist HTTP ${res.status}`);
    const data = await res.json();

    const songs = (data.mp3s || []).map((item: any) => formatRJSong(item));
    const albums = (data.albums || []).map((item: any) => ({
      id: item.id,
      title: item.album || item.title,
      artist: item.artist,
      photo: item.photo,
      year: item.release_year || item.year,
      tracks_count: item.tracks_count || item.count,
      share_link: item.share_link
    }));
    const videos = (data.videos || []).map((item: any) => ({
      id: item.id,
      title: item.title || item.song,
      photo: item.photo,
      link: item.link,
      views: item.views || item.plays
    }));

    return {
      success: true,
      source: 'Radio Javan (play.radiojavan.com)',
      artist: {
        name: data.artist || artistNameOrQuery,
        name_farsi: data.artist_farsi,
        photo: data.photo,
        thumbnail: data.photo_thumb,
        header: data.background || data.photo_player,
        followers: data.followers?.count || 0,
        total_plays: data.followers?.plays || 'N/A',
        monthly_plays: data.followers?.plays_monthly || 'N/A',
        rank: data.followers?.rank || 0,
        songs_count: songs.length,
        songs,
        albums,
        videos,
        similar_artists: (data.similar || []).map((s: any) => ({
          name: s.name,
          name_farsi: s.name_farsi,
          photo: s.photo
        }))
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRadioJavanPlaylists() {
  try {
    const url = `${RJ_BASE}/playlists_dash`;
    const res = await fetch(url, { headers: RJ_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`RJ Playlists HTTP ${res.status}`);
    const data = await res.json();

    const categories = (data.mp3s?.categories || []).map((cat: any) => ({
      name: cat.name,
      id: cat.id,
      playlists: (cat.playlists || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        photo: p.photo,
        followers: p.followers,
        items_count: p.items_count || p.count,
        share_link: p.share_link,
        updated_at: p.last_updated_at
      }))
    }));

    return {
      success: true,
      source: 'Radio Javan (play.radiojavan.com)',
      categories_count: categories.length,
      categories
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRadioJavanPlaylistDetail(playlistId: string) {
  if (!playlistId) return { success: false, error: 'Playlist ID is required' };
  try {
    const cleanId = playlistId.replace(/^.*\/playlist\//, '').trim();
    const url = `${RJ_BASE}/mp3_playlist_with_items?id=${encodeURIComponent(cleanId)}`;
    const res = await fetch(url, { headers: RJ_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`RJ Playlist Detail HTTP ${res.status}`);
    const data = await res.json();

    const tracks = (data.items || []).map((item: any) => formatRJSong(item));

    return {
      success: true,
      source: 'Radio Javan (play.radiojavan.com)',
      playlist: {
        id: data.id || cleanId,
        title: data.title,
        photo: data.photo,
        followers: data.followers,
        tracks_count: tracks.length,
        share_link: data.share_link,
        tracks
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function formatRJSong(item: any): RJSong {
  const baseLink = item.link || '';
  // Generate 320k, 256k, 128k variations
  let mp3_320 = baseLink;
  let mp3_256 = baseLink;
  let mp3_128 = baseLink;
  if (baseLink.includes('/mp3-256/')) {
    mp3_320 = baseLink.replace('/mp3-256/', '/mp3-320/');
    mp3_128 = baseLink.replace('/mp3-256/', '/mp3-128/');
  }

  return {
    id: item.id,
    title: item.title || `${item.artist} - ${item.song}`,
    artist: item.artist,
    song: item.song,
    artist_farsi: item.artist_farsi,
    song_farsi: item.song_farsi,
    photo: item.photo,
    thumbnail: item.thumbnail,
    photo_player: item.photo_player,
    download_links: {
      mp3_320,
      mp3_256,
      mp3_128,
      hq_m4a: item.hq_link,
      lq_m4a: item.lq_link,
      hls: item.hls_link
    },
    duration: item.duration,
    plays: item.plays,
    downloads: item.downloads,
    likes: item.likes,
    lyrics: item.lyric || item.lyrics,
    album: item.album,
    release_date: item.date || item.created_at,
    share_link: item.share_link
  };
}

// ==========================================
// 2. DARKNAMA MOVIES & SERIES CRAWLER
// ==========================================

export interface MovieItem {
  id: number | string;
  title: string;
  type: 'movie' | 'serie';
  year?: number | string;
  imdb?: number | string;
  rating?: number | string;
  duration?: string;
  description?: string;
  image?: string;
  cover?: string;
  genres?: string[];
  country?: string[];
  sources?: {
    id?: number;
    quality: string;
    type: string;
    url: string;
    size?: string;
  }[];
  subtitles?: {
    language: string;
    url: string;
  }[];
}

export async function searchDarknama(query: string) {
  if (!query || !query.trim()) return { success: false, error: 'Query is required', results: [] };
  try {
    const url = `${DARKNAMA_API_BASE}search/${encodeURIComponent(query.trim())}/${DARKNAMA_API_KEY}`;
    const res = await fetch(url, { headers: DARKNAMA_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Darknama API HTTP ${res.status}`);
    const data = await res.json();

    const posters = (data.posters || []).map((p: any) => formatDarknamaItem(p));

    return {
      success: true,
      source: 'Darknama (darknama.pages.dev)',
      query,
      count: posters.length,
      results: posters
    };
  } catch (error: any) {
    return { success: false, error: error.message, results: [] };
  }
}

export async function getDarknamaLatest(type: 'movie' | 'serie' = 'movie', count: number = 20) {
  try {
    const url = `${DARKNAMA_API_BASE}${type}/by/filtres/0/created/0/${DARKNAMA_API_KEY}?count=${count}`;
    const res = await fetch(url, { headers: DARKNAMA_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Darknama Latest HTTP ${res.status}`);
    const data = await res.json();

    const items = (Array.isArray(data) ? data : []).map((p: any) => formatDarknamaItem(p));

    return {
      success: true,
      source: 'Darknama (darknama.pages.dev)',
      type,
      count: items.length,
      results: items
    };
  } catch (error: any) {
    return { success: false, error: error.message, results: [] };
  }
}

export async function getDarknamaSeriesSeasons(serieId: number | string) {
  try {
    const url = `${DARKNAMA_API_BASE}season/by/serie/${serieId}/${DARKNAMA_API_KEY}`;
    const res = await fetch(url, { headers: DARKNAMA_HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Darknama Seasons HTTP ${res.status}`);
    const seasons = await res.json();

    const formattedSeasons = (Array.isArray(seasons) ? seasons : []).map((s: any) => ({
      id: s.id,
      title: s.title,
      episodes_count: s.episodes?.length || 0,
      episodes: (s.episodes || []).map((ep: any) => ({
        id: ep.id,
        title: ep.title,
        download_links: (ep.sources || []).map((src: any) => ({
          quality: src.quality || 'Standard',
          type: src.type || 'mp4',
          url: src.url
        }))
      }))
    }));

    return {
      success: true,
      source: 'Darknama (darknama.pages.dev)',
      serie_id: serieId,
      seasons_count: formattedSeasons.length,
      seasons: formattedSeasons
    };
  } catch (error: any) {
    return { success: false, error: error.message, seasons: [] };
  }
}

function formatDarknamaItem(p: any): MovieItem {
  return {
    id: p.id,
    title: p.title,
    type: p.type === 'serie' ? 'serie' : 'movie',
    year: p.year,
    imdb: p.imdb,
    rating: p.rating,
    duration: p.duration,
    description: p.description,
    image: p.image,
    cover: p.cover,
    genres: (p.genres || []).map((g: any) => (typeof g === 'string' ? g : g.title)),
    country: (p.country || []).map((c: any) => (typeof c === 'string' ? c : c.title)),
    sources: (p.sources || []).map((s: any) => ({
      id: s.id,
      quality: s.quality || 'Direct Link',
      type: s.type || 'mkv',
      url: s.url,
      size: s.size
    })),
    subtitles: (p.subtitles || []).map((sub: any) => ({
      language: sub.language || 'Persian',
      url: sub.url
    }))
  };
}

// ==========================================
// 3. CENAMAFLIX CRAWLER (cenamaflix.ir)
// ==========================================

export async function searchCenamaflix(query: string) {
  if (!query || !query.trim()) return { success: false, error: 'Query is required', results: [] };
  try {
    const url = `https://cenamaflix.ir/?s=${encodeURIComponent(query.trim())}`;
    const res = await fetch(url, { headers: CENAMAFLIX_HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`Cenamaflix HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const items: any[] = [];
    const seenUrls = new Set<string>();

    $('article, .main-articles article, .item, .post-item').each((_, el) => {
      const linkEl = $(el).find('a').first();
      const href = linkEl.attr('href') || $(el).attr('href');
      if (!href || seenUrls.has(href)) return;
      if (href.includes('/category/') || href.includes('/tag/') || href.includes('/page/')) return;

      const title = $(el).find('.title, h2, h3, a').text().trim();
      const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const imdb = $(el).find('.imdb, .score, .rating, span:contains("IMDb")').text().replace(/[^0-9.]/g, '').trim();
      const desc = $(el).find('.desc, .story, p').text().trim();

      if (title && href) {
        seenUrls.add(href);
        items.push({
          title,
          url: href,
          image: img,
          imdb: imdb || undefined,
          snippet: desc ? desc.slice(0, 200) : undefined,
          source: 'Cenamaflix (cenamaflix.ir)'
        });
      }
    });

    // If container selectors were not found, fallback to anchor scan
    if (items.length === 0) {
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (!href || seenUrls.has(href)) return;
        if (!href.startsWith('https://cenamaflix.ir/')) return;
        if (href.includes('/category/') || href.includes('/tag/') || href.includes('/page/') || href === 'https://cenamaflix.ir/') return;

        const title = $(el).text().trim() || $(el).attr('title');
        const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
        if (title && title.length > 3 && !title.includes('اشتراک') && !title.includes('خانه')) {
          seenUrls.add(href);
          items.push({
            title,
            url: href,
            image: img,
            source: 'Cenamaflix (cenamaflix.ir)'
          });
        }
      });
    }

    return {
      success: true,
      source: 'Cenamaflix (cenamaflix.ir)',
      query,
      count: items.length,
      results: items
    };
  } catch (error: any) {
    return { success: false, error: error.message, results: [] };
  }
}

export async function getCenamaflixPostDetail(postUrl: string) {
  if (!postUrl || !postUrl.startsWith('http')) {
    return { success: false, error: 'Valid Cenamaflix post URL is required' };
  }
  try {
    const res = await fetch(postUrl, { headers: CENAMAFLIX_HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`Cenamaflix Detail HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h1.title, h1, .post-title, .single-title').first().text().trim();
    const poster = $('.poster img, .movie-poster img, .single-header img, article img').first().attr('src') ||
                   $('.poster img, .movie-poster img, .single-header img, article img').first().attr('data-src');
    
    // Synopsis & Info
    const synopsis = $('.story, .synopsis, .description, .content p, .plot').text().trim() ||
                     $('meta[name="description"]').attr('content');
    
    // IMDb & Meta
    let imdb = '';
    const imdbText = $('.imdb, .score, .rating, :contains("IMDb"), :contains("امتیاز")').text();
    const imdbMatch = imdbText.match(/(\d\.\d)/);
    if (imdbMatch) imdb = imdbMatch[1];

    // Download Links & Online Player
    const downloadLinks: any[] = [];
    const onlineStreams: any[] = [];

    // Extract data-video online player
    $('[data-video]').each((_, el) => {
      const vUrl = $(el).attr('data-video');
      if (vUrl) {
        onlineStreams.push({
          type: 'online_stream',
          url: vUrl
        });
      }
    });

    // Extract links in download sections
    $('.my-download-section a, .download-box a, .dl-box a, a[href*=".mp4"], a[href*=".mkv"], a[href*="upera.tv"]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim() || $(el).attr('title') || 'دانلود مستقیم';
      if (href && (href.includes('upera.tv') || href.endsWith('.mp4') || href.endsWith('.mkv') || href.includes('/dl/'))) {
        let quality = 'کیفیت اصلی';
        if (text.includes('1080') || href.includes('1080')) quality = '1080p';
        else if (text.includes('720') || href.includes('720')) quality = '720p';
        else if (text.includes('480') || href.includes('480')) quality = '480p';
        else if (text.includes('4k') || href.includes('2160')) quality = '4K';

        downloadLinks.push({
          label: text,
          quality,
          url: href
        });
      }
    });

    // Subtitle links
    const subtitleLinks: any[] = [];
    $('a[href*=".srt"], a[href*=".zip"], a[href*="sub"], a:contains("زیرنویس")').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim() || 'زیرنویس فارسی';
      if (href && !href.includes('/category/') && !href.includes('upera.tv')) {
        subtitleLinks.push({
          label: text,
          url: href
        });
      }
    });

    return {
      success: true,
      source: 'Cenamaflix (cenamaflix.ir)',
      url: postUrl,
      post: {
        title: title || 'Cenamaflix Title',
        poster,
        imdb: imdb || undefined,
        synopsis,
        online_streams: onlineStreams,
        download_links: downloadLinks,
        subtitle_links: subtitleLinks
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// 4. UNIVERSAL ON-DEMAND SCRAPER / CRAWLER
// ==========================================

export async function universalCrawler(targetUrl: string) {
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return { success: false, error: 'Target URL must start with http:// or https://' };
  }

  const urlObj = new URL(targetUrl);
  const host = urlObj.hostname.toLowerCase();

  // Route to specialized crawler if matched
  if (host.includes('radiojavan.com') || host.includes('rj.app')) {
    if (targetUrl.includes('/song/')) {
      const slug = targetUrl.split('/song/')[1]?.split('?')[0];
      return await getRadioJavanSong(slug);
    } else if (targetUrl.includes('/artist/')) {
      const artist = targetUrl.split('/artist/')[1]?.split('?')[0];
      return await getRadioJavanArtist(decodeURIComponent(artist));
    } else if (targetUrl.includes('/playlist/')) {
      const plId = targetUrl.split('/playlist/')[1]?.split('?')[0];
      return await getRadioJavanPlaylistDetail(plId);
    }
  } else if (host.includes('cenamaflix.ir')) {
    return await getCenamaflixPostDetail(targetUrl);
  }

  // Generic universal HTML scraper
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(12000)
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('title').text().trim();
    const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');

    // Extract all media download links (mp4, mkv, mp3, flac, zip, srt)
    const mediaLinks: any[] = [];
    const subtitles: any[] = [];

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (!href) return;

      const fullUrl = href.startsWith('http') ? href : new URL(href, targetUrl).toString();
      const lower = fullUrl.toLowerCase();

      if (lower.endsWith('.mp4') || lower.endsWith('.mkv') || lower.includes('/dl/') || lower.includes('download')) {
        mediaLinks.push({
          type: 'video',
          label: text || 'Video Download',
          url: fullUrl
        });
      } else if (lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.flac')) {
        mediaLinks.push({
          type: 'audio',
          label: text || 'Audio Download',
          url: fullUrl
        });
      } else if (lower.endsWith('.srt') || lower.endsWith('.vtt') || text.includes('زیرنویس')) {
        subtitles.push({
          label: text || 'Subtitle File',
          url: fullUrl
        });
      }
    });

    return {
      success: true,
      source: 'Universal Crawler',
      url: targetUrl,
      metadata: {
        title,
        description: metaDesc,
        image: ogImage,
        media_count: mediaLinks.length,
        subtitles_count: subtitles.length
      },
      media_links: mediaLinks.slice(0, 50),
      subtitles: subtitles.slice(0, 20)
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
