import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  template: `
    <div
      (click)="onSelect()"
      matRipple
      [matRippleColor]="'rgba(99, 102, 241, 0.08)'"
      class="group relative flex flex-col bg-white dark:bg-studioCard border rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-glow-primary transition-all duration-300 ease-out active:scale-[0.98] h-full shadow-sm dark:shadow-none"
      [class.border-indigo-600]="isSelected"
      [class.ring-2]="isSelected"
      [class.ring-indigo-600]="isSelected"
      [class.border-gray-200]="!isSelected"
      [class.dark:border-studioBorder]="!isSelected"
    >
      <!-- Thumbnail Area -->
      <div class="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-studioBg/80 flex-shrink-0">
        @if (product.type === 'image') {
          <img
            [src]="product.image"
            [alt]="product.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        } @else {
          <video
            #videoPlayer
            [src]="product.videoUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loop
            muted
            playsinline
            (mouseenter)="playVideo(videoPlayer)"
            (mouseleave)="pauseVideo(videoPlayer)"
          ></video>
          <!-- Play Overlay Indicator -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/30 group-hover:bg-transparent transition-colors duration-300">
            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-studioBg/85 border border-gray-200 dark:border-studioBorder text-gray-800 dark:text-white group-hover:scale-110 group-hover:bg-indigo-600 group-hover:border-transparent group-hover:text-white transition-all duration-200 shadow-md">
              <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>
          </div>
          <!-- Video Duration Badge -->
          <span class="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-black/60 rounded-md text-white border border-white/10">
            {{ product.duration || '0:10' }}
          </span>
        }

        <!-- Selection Checkmark Overlay -->
        @if (isSelected) {
          <div class="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center shadow-lg">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        }

        <!-- Category Tag Overlay -->
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-full text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/50 backdrop-blur-sm">
          {{ product.category }}
        </span>
        
        <!-- Controls Overlay (Favorites & Delete) -->
        <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <!-- Favorite Button -->
          <button
            (click)="onToggleFavorite($event)"
            class="p-1.5 rounded-lg bg-white dark:bg-studioBg/85 hover:bg-slate-50 dark:hover:bg-studioCardHover border border-gray-200 dark:border-studioBorder backdrop-blur-sm transition-all shadow-sm"
            [class.text-rose-500]="product.isFavorite"
            [class.text-gray-500]="!product.isFavorite"
            [class.dark:text-gray-400]="!product.isFavorite"
            [title]="product.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
          >
            <svg class="w-3.5 h-3.5" [class.fill-current]="product.isFavorite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          <!-- Delete Button -->
          <button
            (click)="onDelete($event)"
            class="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/85 hover:bg-red-650 hover:text-white dark:hover:bg-red-600 text-red-505 dark:text-red-400 border border-red-200 dark:border-red-900/50 backdrop-blur-sm transition-all shadow-sm"
            title="Delete asset"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        <!-- Video Badge -->
        @if (product.type === 'video') {
          <span class="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 backdrop-blur-sm text-[8px] font-bold uppercase tracking-wider">
            <span class="w-1 h-1 rounded-full bg-emerald-505 dark:bg-emerald-400 animate-ping"></span>
            Video
          </span>
        }
      </div>

      <!-- Text Info -->
      <div class="p-4 flex flex-col flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {{ product.title }}
          </h3>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            \${{ product.price.toFixed(2) }}
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed flex-1">
          {{ product.description }}
        </p>
        <!-- Card Footer: Created Date / Resolution -->
        <div class="flex items-center justify-between pt-3.5 mt-4 border-t border-gray-100 dark:border-studioBorder/50 text-[10px] text-gray-400 dark:text-gray-500">
          <span class="truncate">{{ formatDate(product.createdAt) }}</span>
          <span>{{ product.resolution || '1920x1080' }}</span>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() isSelected: boolean = false;

  private productService = inject(ProductService);

  onSelect() {
    this.productService.selectProduct(this.product.id);
  }

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.productService.toggleFavorite(this.product.id);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.product.title}"?`)) {
      this.productService.deleteProduct(this.product.id);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  playVideo(video: HTMLVideoElement) {
    try {
      video.play().catch(() => {});
    } catch {}
  }

  pauseVideo(video: HTMLVideoElement) {
    try {
      video.pause();
      video.currentTime = 0;
    } catch {}
  }
}
