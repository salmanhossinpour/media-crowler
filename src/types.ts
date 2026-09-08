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

export interface CenamaflixItem {
  title: string;
  url: string;
  image?: string;
  imdb?: string;
  snippet?: string;
  source: string;
}

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
  header?: string;
  followers?: number | string;
  total_plays?: string;
  monthly_plays?: string;
  rank?: number;
  songs_count?: number;
  songs?: RJSong[];
  albums?: any[];
  videos?: any[];
  similar_artists?: any[];
}

export interface RJPlaylist {
  id: string;
  title: string;
  photo?: string;
  followers?: number;
  items_count?: number;
  share_link?: string;
  tracks?: RJSong[];
}

export interface ApiDocEndpoint {
  endpoint: string;
  method: string;
  category: string;
  title: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example: string;
  }[];
  responseExample?: any;
}
