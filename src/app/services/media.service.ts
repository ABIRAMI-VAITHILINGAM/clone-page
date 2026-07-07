import { Injectable, signal, computed } from '@angular/core';

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  category: string;
  description: string;
  url: string;
  createdAt: string;
  resolution: string;
  size: string;
  prompt?: string;
  duration?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  // Store the list of media items in a signal
  private mediaItems = signal<MediaItem[]>([
    // IMAGES
    {
      id: 'img-1',
      title: 'Sophia - AI UGC Influencer',
      type: 'image',
      category: 'AI Avatar',
      description: 'Hyper-realistic virtual influencer portrait with subtle neon holographics.',
      url: 'assets/ai_avatar.jpg',
      createdAt: '2026-07-07',
      resolution: '1536x1024',
      size: '245 KB',
      prompt: 'A photorealistic cinematic portrait of a beautiful futuristic AI female influencer with subtle holographic lines on her face, cyberpunk style, glowing neon background, ultra detailed'
    },
    {
      id: 'img-2',
      title: 'Neon Cybernetic Nexus',
      type: 'image',
      category: 'Concept Art',
      description: 'Abstract concept of a developer interface inside a cyberspace neural network.',
      url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800',
      createdAt: '2026-07-06',
      resolution: '1920x1080',
      size: '412 KB',
      prompt: 'A programmer coding inside a neural network, glowing lines of code floating, cybernetic hands, high-tech screen, cinematic lighting, 8k resolution'
    },
    {
      id: 'img-3',
      title: 'Aetheric Flow',
      type: 'image',
      category: '3D Render',
      description: 'Sleek glassmorphic curves with iridescent reflections and subtle particles.',
      url: 'https://images.unsplash.com/photo-1618005198143-e528346ddfcd?w=800',
      createdAt: '2026-07-05',
      resolution: '2048x1536',
      size: '320 KB',
      prompt: '3d render of abstract flowing waves made of iridescent glass, pastel violet and cyan color scheme, soft lighting, detailed texture, depth of field'
    },
    {
      id: 'img-4',
      title: 'Kyoto 2099',
      type: 'image',
      category: 'Anime Scene',
      description: 'Stylized cyber-street scene featuring neon signs and an augmented-reality overlay.',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
      createdAt: '2026-07-04',
      resolution: '1280x720',
      size: '185 KB',
      prompt: 'An anime style street in Kyoto at night in 2099, neon billboards, rain reflections on pavement, futuristic vending machines, high detailed cell shading'
    },
    // VIDEOS
    {
      id: 'vid-1',
      title: 'Cosmic Warp Gate',
      type: 'video',
      category: 'Cinematic',
      description: 'Beautiful high-speed travel through a starfield galaxy loop.',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      createdAt: '2026-07-07',
      resolution: '1920x1080',
      size: '8.4 MB',
      prompt: 'Hyperspace jump through stars, glowing warp tunnel, galactic flight path, seamless looping, 4k cinematic render',
      duration: '0:12'
    },
    {
      id: 'vid-2',
      title: 'Neo Tokyo Lights',
      type: 'video',
      category: 'Motion Graphics',
      description: 'Glowing pink neon tubes illuminating a skyscraper facade.',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-in-a-night-city-40742-large.mp4',
      createdAt: '2026-07-06',
      resolution: '1080x1920',
      size: '5.1 MB',
      prompt: 'Abstract neon sign on side of futuristic building, magenta glowing light tubes, looping cyberpunk asset',
      duration: '0:08'
    },
    {
      id: 'vid-3',
      title: 'Cyber Grid Tunnel',
      type: 'video',
      category: 'Sci-Fi Loop',
      description: 'Grid-based digital landscape with glowing cyan laser scanlines.',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41852-large.mp4',
      createdAt: '2026-07-03',
      resolution: '1920x1080',
      size: '12.3 MB',
      prompt: '3d wireframe digital retro grid tunnel, infinite loop, laser scanlines, blue neon lights, synthwave vibe',
      duration: '0:15'
    }
  ]);

  // Current filters
  searchQuery = signal<string>('');
  selectedType = signal<'image' | 'video' | 'all'>('all');

  // Currently selected media item for the Right Side Panel
  private selectedItemId = signal<string | null>('img-1'); // Default select the first item

  // Computed properties
  selectedItem = computed(() => {
    const id = this.selectedItemId();
    return this.mediaItems().find(item => item.id === id) || null;
  });

  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    
    return this.mediaItems().filter(item => {
      const matchesType = type === 'all' || item.type === type;
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query);
      return matchesType && matchesQuery;
    });
  });

  // Actions
  selectItem(id: string) {
    this.selectedItemId.set(id);
  }

  deselectItem() {
    this.selectedItemId.set(null);
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt' | 'resolution' | 'size'>) {
    const newItem: MediaItem = {
      ...item,
      id: `${item.type === 'image' ? 'img' : 'vid'}-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      resolution: item.type === 'image' ? '1920x1080' : '1280x720',
      size: item.type === 'image' ? '350 KB' : '6.2 MB'
    };

    this.mediaItems.update(items => [newItem, ...items]);
    this.selectedItemId.set(newItem.id); // Auto-select the newly added item
  }

  deleteMediaItem(id: string) {
    this.mediaItems.update(items => items.filter(item => item.id !== id));
    if (this.selectedItemId() === id) {
      const remaining = this.mediaItems();
      this.selectedItemId.set(remaining.length > 0 ? remaining[0].id : null);
    }
  }
}
