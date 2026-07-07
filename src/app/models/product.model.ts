export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: Rating;
  
  // Custom additions for the Mirage Studio features
  type: 'image' | 'video';
  videoUrl?: string; // High-quality looping video if type is video
  createdAt: string; // ISO date string or YYYY-MM-DD
  isFavorite?: boolean;
  resolution?: string; // e.g. '1920x1080'
  size?: string; // e.g. '245 KB' or '8.4 MB'
  prompt?: string; // Generation prompt
  duration?: string; // Video duration if type is video
}

export interface ProductFilters {
  searchQuery: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  type: 'image' | 'video' | 'all';
}

export type SortField = 'price' | 'title' | 'category' | 'newest' | 'oldest';
export type SortOrder = 'asc' | 'desc';
