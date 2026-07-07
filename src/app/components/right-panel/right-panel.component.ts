import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  template: `
    <!-- Right Panel Container -->
    <aside class="w-full lg:w-80 h-full bg-white dark:bg-studioCard border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-studioBorder flex flex-col text-gray-700 dark:text-gray-300 overflow-hidden select-none flex-shrink-0">
      
      @if (selectedProduct(); as item) {
        <!-- Selected Item Detail View -->
        <div class="flex-1 flex flex-col overflow-y-auto p-5 space-y-5 scrollbar-thin">
          <!-- Heading -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-400 tracking-wide uppercase">Asset Details</span>
            <button
              (click)="deselect()"
              class="p-1 hover:bg-slate-100 dark:hover:bg-studioCardHover hover:text-gray-900 dark:hover:text-white rounded-md text-gray-400 dark:text-gray-500 transition-colors"
              title="Close panel"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Large Media Preview -->
          <div class="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-studioBg border border-gray-200 dark:border-studioBorder relative group/preview">
            @if (item.type === 'image') {
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover" />
            } @else {
              <video
                [src]="item.videoUrl"
                controls
                autoplay
                muted
                loop
                class="w-full h-full object-cover"
              ></video>
            }
          </div>

          <!-- Title and Info -->
          <div>
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 text-[10px] font-semibold text-indigo-650 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-full">
                {{ item.category }}
              </span>
              <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                \${{ item.price.toFixed(2) }}
              </span>
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white mt-2 leading-tight">{{ item.title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{{ item.description }}</p>
          </div>

          <!-- Divider -->
          <div class="h-[1px] bg-gray-200 dark:bg-studioBorder/60"></div>

          <!-- Generation Prompt Section -->
          @if (item.prompt) {
            <div class="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-studioBg/50 rounded-lg border border-gray-200 dark:border-studioBorder/50">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-semibold text-gray-400 tracking-wider">GENERATION PROMPT</span>
                <button
                  (click)="copyPrompt(item.prompt)"
                  class="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  @if (copied()) {
                    <svg class="w-3.5 h-3.5 text-green-505 dark:text-green-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-green-600 dark:text-green-400">Copied!</span>
                  } @else {
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    <span>Copy Prompt</span>
                  }
                </button>
              </div>
              <p class="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed font-mono select-all bg-gray-100 dark:bg-black/10 p-2 rounded max-h-24 overflow-y-auto">
                "{{ item.prompt }}"
              </p>
            </div>
          }

          <!-- Metadata Grid -->
          <div class="space-y-2">
            <span class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">File Info</span>
            <div class="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs bg-slate-50 dark:bg-studioBg/30 p-3 rounded-lg border border-gray-200 dark:border-studioBorder/50">
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-405 dark:text-gray-500">TYPE</span>
                <span class="font-medium text-gray-900 dark:text-white capitalize">{{ item.type }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-405 dark:text-gray-500">SIZE</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ item.size || '350 KB' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-405 dark:text-gray-500">RESOLUTION</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ item.resolution || '1920x1080' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-405 dark:text-gray-500">CREATED AT</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 pt-2 pb-4">
            <!-- Favorite Action -->
            <button
              (click)="toggleFavorite(item.id)"
              matRipple
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 border"
              [class.bg-rose-550]="item.isFavorite"
              [class.text-rose-500]="item.isFavorite"
              [class.border-rose-955]="item.isFavorite"
              [class.bg-studioCardHover]="!item.isFavorite"
              [class.text-white]="!item.isFavorite"
              [class.border-studioBorder]="!item.isFavorite"
            >
              <svg class="w-4 h-4" [class.fill-current]="item.isFavorite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{{ item.isFavorite ? 'Saved in Favorites' : 'Add to Favorites' }}</span>
            </button>

            <!-- Download Action -->
            <button
              (click)="mockDownload(item)"
              matRipple
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-studioCardHover dark:hover:bg-gray-800 text-gray-800 dark:text-white font-semibold text-sm rounded-lg border border-gray-250 dark:border-studioBorder transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12"></path>
              </svg>
              <span>Download Asset</span>
            </button>

            <!-- Delete Action -->
            <button
              (click)="deleteItem(item)"
              matRipple
              class="w-full flex items-center justify-center gap-2 py-2 px-4 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-550 font-semibold text-sm rounded-lg border border-rose-200 dark:border-rose-955/30 hover:border-rose-450 dark:hover:border-rose-900/50 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Delete Asset</span>
            </button>
          </div>
        </div>
      } @else {
        <!-- Empty State View (No Asset Selected) -->
        <div class="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-slate-50 dark:bg-studioBg border border-gray-200 dark:border-studioBorder flex items-center justify-center text-gray-500 animate-pulse shadow-sm dark:shadow-none">
            <svg class="w-7 h-7 text-indigo-650 dark:text-indigo-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-800 dark:text-white">No Asset Selected</h4>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
              Click on any media card in the library to view details, parameters, and download options.
            </p>
          </div>

          <!-- Studio Quick Stats Widget -->
          <div class="w-full bg-slate-50 dark:bg-studioBg/50 border border-gray-200 dark:border-studioBorder/50 rounded-xl p-4 text-left space-y-3.5 shadow-sm dark:shadow-none">
            <h5 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Studio Summary</h5>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Tier:</span>
                <span class="font-semibold text-indigo-600 dark:text-indigo-400">Creator Pro</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Storage Used:</span>
                <span class="font-semibold text-gray-900 dark:text-white">18.4 MB / 10 GB</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Total Runs:</span>
                <span class="font-semibold text-gray-900 dark:text-white">124 generations</span>
              </div>
            </div>
            <!-- Tip -->
            <div class="pt-2 text-[10px] text-indigo-600 dark:text-indigo-300 italic border-t border-gray-200 dark:border-studioBorder/30">
              Tip: Hover over video cards to preview animations instantly.
            </div>
          </div>
        </div>
      }
    </aside>
  `
})
export class RightPanelComponent {
  productService = inject(ProductService);
  copied = signal<boolean>(false);

  selectedProduct = this.productService.selectedProduct;

  deselect() {
    this.productService.deselectProduct();
  }

  toggleFavorite(id: number) {
    this.productService.toggleFavorite(id);
  }

  copyPrompt(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  mockDownload(item: Product) {
    alert(`Starting download for: ${item.title}\nSource Image: ${item.image}`);
  }

  deleteItem(item: Product) {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.productService.deleteProduct(item.id);
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
}
