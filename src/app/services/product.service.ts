import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { Product, ProductFilters, SortField, SortOrder } from '../models/product.model';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private notificationService = inject(NotificationService);

  private readonly API_URL = 'https://fakestoreapi.com/products';
  private readonly FAVORITES_KEY = 'mirage_favorites';
  private readonly HISTORY_KEY = 'mirage_history';
  private readonly CUSTOM_PRODUCTS_KEY = 'mirage_custom_products';

  // State Signals
  private apiProducts = signal<Product[]>([]);
  private customProducts = signal<Product[]>(this.storageService.getItem<Product[]>(this.CUSTOM_PRODUCTS_KEY, []));
  
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Filter and Sort Signals
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  selectedType = signal<'image' | 'video' | 'all'>('all');
  
  sortField = signal<SortField>('newest');
  sortOrder = signal<SortOrder>('desc');

  // Interactive Signals
  private favoriteIds = signal<number[]>(this.storageService.getItem<number[]>(this.FAVORITES_KEY, []));
  private viewHistoryIds = signal<number[]>(this.storageService.getItem<number[]>(this.HISTORY_KEY, []));
  selectedProductId = signal<number | null>(null);

  // List of high-quality sample video URLs to attach to video items
  private sampleVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-in-a-night-city-40742-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41852-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-glowing-lines-41856-large.mp4'
  ];

  constructor() {
    this.loadProducts();
  }

  // Load products from API with retry and error handling
  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any[]>(this.API_URL).pipe(
      retry(2), // Retry twice before failing
      map(items => this.transformApiProducts(items)),
      catchError(err => this.handleError(err))
    ).subscribe({
      next: (products) => {
        this.apiProducts.set(products);
        this.loading.set(false);
        // Default select the first product if none is selected
        if (products.length > 0 && this.selectedProductId() === null) {
          this.selectedProductId.set(products[0].id);
        }
      },
      error: (errMsg) => {
        this.error.set(errMsg);
        this.loading.set(false);
        this.notificationService.error(`Failed to load gallery items: ${errMsg}`);
      }
    });
  }

  // Combine API products and custom uploaded products
  allProducts = computed(() => {
    const apiList = this.apiProducts();
    const customList = this.customProducts();

    // Map favorites state
    const favs = this.favoriteIds();
    return [...customList, ...apiList].map(p => ({
      ...p,
      isFavorite: favs.includes(p.id)
    }));
  });

  // Extract list of unique categories
  categories = computed(() => {
    const products = this.allProducts();
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  });

  // Compute selected product detail
  selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (id === null) return null;
    return this.allProducts().find(p => p.id === id) || null;
  });

  // Compute filtered and sorted list of products
  filteredProducts = computed(() => {
    let list = this.allProducts();
    const search = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const min = this.minPrice();
    const max = this.maxPrice();
    const type = this.selectedType();
    const sortBy = this.sortField();
    const order = this.sortOrder();

    // 1. Filter by Search Query (Title, Category, Description)
    if (search) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // 2. Filter by Category
    if (cat !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    // 3. Filter by Media Type
    if (type !== 'all') {
      list = list.filter(p => p.type === type);
    }

    // 4. Filter by Price Range
    if (min !== null) {
      list = list.filter(p => p.price >= min);
    }
    if (max !== null) {
      list = list.filter(p => p.price <= max);
    }

    // 5. Apply Sorting
    list.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'newest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'oldest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return list;
  });

  // Computed list of favorites
  favoriteProducts = computed(() => {
    return this.allProducts().filter(p => p.isFavorite);
  });

  // Computed list of history products
  historyProducts = computed(() => {
    const historyIds = this.viewHistoryIds();
    const products = this.allProducts();
    // Return them in the order they were viewed (newest first)
    return historyIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is any => p !== undefined) as Product[];
  });

  // Actions
  selectProduct(id: number): void {
    this.selectedProductId.set(id);
    this.addToHistory(id);
  }

  deselectProduct(): void {
    this.selectedProductId.set(null);
  }

  // Toggle Favorite
  toggleFavorite(id: number): void {
    let currentFavs = [...this.favoriteIds()];
    const index = currentFavs.indexOf(id);
    
    if (index > -1) {
      currentFavs.splice(index, 1);
      this.notificationService.info('Removed from Favorites');
    } else {
      currentFavs.push(id);
      this.notificationService.success('Added to Favorites');
    }

    this.favoriteIds.set(currentFavs);
    this.storageService.setItem(this.FAVORITES_KEY, currentFavs);
  }

  // Add upload custom item
  addCustomProduct(item: Omit<Product, 'id' | 'createdAt' | 'resolution' | 'size' | 'isFavorite'> & { size?: string }): void {
    const timestamp = Date.now();
    const newProduct: Product = {
      ...item,
      id: timestamp, // positive integer ID
      createdAt: new Date().toISOString(),
      resolution: item.type === 'image' ? '1920x1080' : '1280x720',
      size: item.size || (item.type === 'image' ? '420 KB' : '7.8 MB')
    };

    const currentCustom = [newProduct, ...this.customProducts()];
    this.customProducts.set(currentCustom);
    this.storageService.setItem(this.CUSTOM_PRODUCTS_KEY, currentCustom);
    
    // Auto select the new item
    this.selectedProductId.set(newProduct.id);
    this.notificationService.success(`"${item.title}" added to gallery successfully!`);
  }

  // Delete product
  deleteProduct(id: number): void {
    const isCustom = this.customProducts().some(p => p.id === id);
    if (isCustom) {
      const updated = this.customProducts().filter(p => p.id !== id);
      this.customProducts.set(updated);
      this.storageService.setItem(this.CUSTOM_PRODUCTS_KEY, updated);
      this.notificationService.success('Asset deleted successfully');
    } else {
      // For API products, we filter them out of the current API products list in-memory
      const updated = this.apiProducts().filter(p => p.id !== id);
      this.apiProducts.set(updated);
      this.notificationService.success('API Asset hidden in-memory');
    }

    // Clean up favorites and history references
    if (this.favoriteIds().includes(id)) {
      this.favoriteIds.set(this.favoriteIds().filter(favId => favId !== id));
      this.storageService.setItem(this.FAVORITES_KEY, this.favoriteIds());
    }

    if (this.viewHistoryIds().includes(id)) {
      this.viewHistoryIds.set(this.viewHistoryIds().filter(histId => histId !== id));
      this.storageService.setItem(this.HISTORY_KEY, this.viewHistoryIds());
    }

    // Adjust selected product
    if (this.selectedProductId() === id) {
      const remaining = this.filteredProducts();
      this.selectedProductId.set(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  // Reset Filters
  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.selectedType.set('all');
    this.sortField.set('newest');
    this.sortOrder.set('desc');
    this.notificationService.info('Filters have been reset');
  }

  clearHistory(): void {
    this.viewHistoryIds.set([]);
    this.storageService.removeItem(this.HISTORY_KEY);
    this.notificationService.info('View history cleared');
  }

  // Private helpers
  private addToHistory(id: number): void {
    let currentHistory = [...this.viewHistoryIds()];
    // Remove if already in history, so we can re-add it at the top
    currentHistory = currentHistory.filter(histId => histId !== id);
    // Add to the front
    currentHistory.unshift(id);
    // Limit history size to 30 items
    if (currentHistory.length > 30) {
      currentHistory.pop();
    }
    this.viewHistoryIds.set(currentHistory);
    this.storageService.setItem(this.HISTORY_KEY, currentHistory);
  }

  // Transform raw API products into rich Mirage items
  private transformApiProducts(rawItems: any[]): Product[] {
    return rawItems.map((item, index) => {
      // Map half of the items as videos (e.g. electronics, jewelery) or based on index
      const isVideo = item.category === 'electronics' || item.category === 'jewelery' || index % 3 === 0;
      const videoUrl = isVideo ? this.sampleVideos[index % this.sampleVideos.length] : undefined;
      const duration = isVideo ? `0:${(10 + (index % 15)).toString().padStart(2, '0')}` : undefined;
      
      // Generate standard properties
      const resolutions = ['1920x1080', '1536x1024', '2048x1536', '1280x720'];
      const resolution = resolutions[index % resolutions.length];
      const size = isVideo 
        ? `${(4.5 + (index * 0.7)).toFixed(1)} MB` 
        : `${(180 + (index * 24))} KB`;

      // Generate a mock date within the past week
      const date = new Date();
      date.setDate(date.getDate() - (index % 7));
      const createdAt = date.toISOString().split('T')[0];

      // Formulate a beautiful generative prompt
      const prompts = [
        `Cinematic render of ${item.title}, sleek aesthetic, rich texture details, photorealistic lighting, octane render, 8k resolution`,
        `Commercial studio lighting for ${item.title}, minimal glassmorphic showcase pedestal, neon backlight, digital art style`,
        `Stylized concept model of ${item.title}, high contrast cybernetic lines, deep dark cyber themes, futuristic blueprint view`,
        `Abstract high-fashion presentation of ${item.title}, flowing silk waves in cyan and violet, soft ambient occlusion shadows`
      ];
      const prompt = prompts[index % prompts.length];

      return {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        rating: item.rating,
        type: isVideo ? 'video' : 'image',
        videoUrl,
        createdAt,
        resolution,
        size,
        prompt,
        duration
      };
    });
  }

  // Robust error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server error (Code ${error.status}): ${error.message || error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
