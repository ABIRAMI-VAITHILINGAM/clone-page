import { Component, inject, Input, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SortField, SortOrder } from '../../models/product.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, MatRippleModule],
  template: `
    <div class="flex flex-col h-full overflow-hidden select-none">
      
      <!-- Gallery Toolbar: Toggles, Filters, Sorting -->
      <div class="flex flex-col gap-4 mb-6 flex-shrink-0">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-wide">{{ title }}</h2>
            <p class="text-xs text-gray-550 dark:text-gray-500 mt-1">
              @if (loading()) {
                Analyzing workspace assets...
              } @else if (error()) {
                Error loading assets
              } @else {
                Displaying {{ filteredItems().length }} of {{ totalCount() }} items
              }
            </p>
          </div>

          <!-- Sliding Toggle for Type (Images / Videos / All) -->
          @if (showToggle) {
            <div class="relative flex items-center p-1 bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl w-72 h-11 shadow-sm dark:shadow-none">
              <!-- Background Slider Overlay -->
              <div
                class="absolute top-1 bottom-1 rounded-lg bg-indigo-600 transition-all duration-300 ease-out shadow-md"
                [style.width]="'calc(33.33% - 4px)'"
                [style.transform]="activeType() === 'all' ? 'translateX(0)' : activeType() === 'image' ? 'translateX(100%)' : 'translateX(200%)'"
              ></div>

              <!-- All Button -->
              <button
                (click)="setTypeFilter('all')"
                class="relative z-10 w-1/3 h-full text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors duration-200"
                [class.text-white]="activeType() === 'all'"
                [class.text-gray-550]="activeType() !== 'all'"
                [class.dark:text-gray-400]="activeType() !== 'all'"
              >
                All
              </button>

              <!-- Image Button -->
              <button
                (click)="setTypeFilter('image')"
                class="relative z-10 w-1/3 h-full text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors duration-200"
                [class.text-white]="activeType() === 'image'"
                [class.text-gray-550]="activeType() !== 'image'"
                [class.dark:text-gray-400]="activeType() !== 'image'"
              >
                Images
              </button>

              <!-- Video Button -->
              <button
                (click)="setTypeFilter('video')"
                class="relative z-10 w-1/3 h-full text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors duration-200"
                [class.text-white]="activeType() === 'video'"
                [class.text-gray-550]="activeType() !== 'video'"
                [class.dark:text-gray-400]="activeType() !== 'video'"
              >
                Videos
              </button>
            </div>
          }
        </div>

        <!-- Filtering & Sorting Sub-Bar -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-studioCard/50 p-3 rounded-xl border border-gray-200 dark:border-studioBorder/50 text-xs shadow-sm dark:shadow-none">
          <!-- Category Filter -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-550 dark:text-gray-500 font-semibold uppercase">Category</label>
            <select
              [ngModel]="selectedCategory()"
              (ngModelChange)="onCategoryChange($event)"
              class="px-2 py-2 bg-slate-50 dark:bg-studioBg/60 border border-gray-200 dark:border-studioBorder rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              @for (cat of categories(); track cat) {
                <option [value]="cat">{{ cat === 'all' ? 'All Categories' : cat }}</option>
              }
            </select>
          </div>

          <!-- Price Range Filter -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-550 dark:text-gray-500 font-semibold uppercase">Price Range (\$)</label>
            <div class="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                [ngModel]="minPrice()"
                (ngModelChange)="onMinPriceChange($event)"
                class="w-1/2 px-2 py-2 bg-slate-50 dark:bg-studioBg/60 border border-gray-200 dark:border-studioBorder rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
              />
              <span class="text-gray-400 dark:text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                [ngModel]="maxPrice()"
                (ngModelChange)="onMaxPriceChange($event)"
                class="w-1/2 px-2 py-2 bg-slate-50 dark:bg-studioBg/60 border border-gray-200 dark:border-studioBorder rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
              />
            </div>
          </div>

          <!-- Sorting Column -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-550 dark:text-gray-500 font-semibold uppercase">Sort By</label>
            <select
              [ngModel]="sortField()"
              (ngModelChange)="onSortFieldChange($event)"
              class="px-2 py-2 bg-slate-50 dark:bg-studioBg/60 border border-gray-200 dark:border-studioBorder rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="newest">Creation Date</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>

          <!-- Sort Order & Reset -->
          <div class="flex items-end gap-2">
            <button
              (click)="toggleSortOrder()"
              class="flex items-center justify-center w-10 h-8.5 bg-slate-50 dark:bg-studioBg/60 hover:bg-gray-100 dark:hover:bg-studioCardHover text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-studioBorder rounded-lg transition-colors"
              [title]="sortOrder() === 'asc' ? 'Ascending Order' : 'Descending Order'"
            >
              @if (sortOrder() === 'asc') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>
              }
            </button>

            <button
              (click)="resetFilters()"
              class="flex-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-studioBg/60 dark:hover:bg-indigo-650 text-indigo-600 dark:text-indigo-400 dark:hover:text-white border border-gray-200 dark:border-indigo-900/30 dark:hover:border-indigo-600 rounded-lg transition-colors font-semibold text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Main Contents Area (Loading, Error, Empty, Grid) -->
      <div class="flex-1 overflow-y-auto pr-1 pb-6 scrollbar-thin">
        
        <!-- LOADING EXPERIENCE: SKELETON LOADER -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (skele of [1, 2, 3, 4, 5, 6, 7, 8]; track skele) {
              <div class="bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl overflow-hidden flex flex-col h-[280px] animate-pulse">
                <div class="aspect-video bg-slate-200 dark:bg-studioBg/80 w-full"></div>
                <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="h-4 bg-slate-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>
                  <div class="h-3 bg-slate-200 dark:bg-gray-800 rounded w-full"></div>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-studioBorder/30 mt-4">
                    <div class="h-2.5 bg-slate-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div class="h-2.5 bg-slate-200 dark:bg-gray-800 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- ERROR STATE: RETRY OPTION -->
        @else if (error()) {
          <div class="flex flex-col items-center justify-center h-80 text-center border border-dashed border-red-300 dark:border-red-900/40 rounded-xl bg-red-50 dark:bg-red-950/10 p-8 max-w-xl mx-auto my-10 shadow-sm">
            <div class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex items-center justify-center text-red-500 mb-4 animate-bounce">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Asset Catalog Error</h3>
            <p class="text-xs text-red-650 dark:text-red-400 mt-1 max-w-md mx-auto leading-relaxed">
              {{ error() }}
            </p>
            <button
              (click)="retryLoad()"
              class="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-505 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition-colors shadow-lg shadow-red-900/20 border border-red-500/20"
            >
              Retry Connection
            </button>
          </div>
        }

        <!-- EMPTY STATE -->
        @else if (filteredItems().length === 0) {
          <div class="flex flex-col items-center justify-center h-80 text-center border border-dashed border-gray-200 dark:border-studioBorder rounded-xl bg-white dark:bg-studioCard/20 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-studioCard flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-studioBorder mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">No products found</h3>
            <p class="text-xs text-gray-500 max-w-xs mt-1 mx-auto leading-relaxed">
              We couldn't find any products matching your search filters. Try clearing filters or resetting the price range.
            </p>
            <button
              (click)="resetFilters()"
              class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-studioCard dark:hover:bg-studioCardHover text-indigo-650 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-white border border-gray-200 dark:border-studioBorder rounded-lg text-xs font-semibold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        }

        <!-- ACTUAL PRODUCTS GRID -->
        @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of filteredItems(); track product.id) {
              <app-product-card
                [product]="product"
                [isSelected]="selectedProduct()?.id === product.id"
              ></app-product-card>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class GalleryComponent implements OnInit {
  @Input() title: string = 'Studio Gallery';
  @Input() showToggle: boolean = true;
  @Input() forcedType: 'image' | 'video' | null = null;

  productService = inject(ProductService);

  // Expose signals from service
  loading = this.productService.loading;
  error = this.productService.error;
  categories = this.productService.categories;
  filteredItems = this.productService.filteredProducts;
  selectedProduct = this.productService.selectedProduct;
  
  // Filtering & sorting parameters bound to service
  activeType = this.productService.selectedType;
  selectedCategory = this.productService.selectedCategory;
  minPrice = this.productService.minPrice;
  maxPrice = this.productService.maxPrice;
  sortField = this.productService.sortField;
  sortOrder = this.productService.sortOrder;

  totalCount = computed(() => this.productService.allProducts().length);

  ngOnInit() {
    if (this.forcedType) {
      this.productService.selectedType.set(this.forcedType);
    }
  }

  setTypeFilter(type: 'image' | 'video' | 'all') {
    this.productService.selectedType.set(type);
  }

  onCategoryChange(cat: string) {
    this.productService.selectedCategory.set(cat);
  }

  onMinPriceChange(val: number | null) {
    this.productService.minPrice.set(val === null || val === undefined || isNaN(val) ? null : val);
  }

  onMaxPriceChange(val: number | null) {
    this.productService.maxPrice.set(val === null || val === undefined || isNaN(val) ? null : val);
  }

  onSortFieldChange(field: SortField) {
    this.productService.sortField.set(field);
  }

  toggleSortOrder() {
    this.productService.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
  }

  resetFilters() {
    this.productService.resetFilters();
    if (this.forcedType) {
      this.productService.selectedType.set(this.forcedType);
    }
  }

  retryLoad() {
    this.productService.loadProducts();
  }
}
