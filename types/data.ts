export interface Video {
  id: string | number;
  title: string;
  thumbnail: string;
  uploader: string;
  views: string | number;
  uploadDate: string;
  description: string;
  platform: string;
  category: string;
  likes: string | number;
  comments: string | number;
  url: string;
  duration?: string;
  watchDate?: string; // Added for history tracking
}

export interface MovieCategory {
  title: string;
  videos: Video[];
  type: 'horizontal' | 'featured' | 'language' | 'small';
  showMore?: boolean;
  label?: string;
}
