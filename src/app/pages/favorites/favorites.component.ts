import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RightPanelComponent } from '../../components/right-panel/right-panel.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RightPanelComponent],
  template: `
    <div class="flex flex-1 h-full overflow-hidden">
      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto min-w-0 select-none scrollbar-thin">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Favorites</h2>
          <p class="text-xs text-gray-550 dark:text-gray-500 mt-1">
            Your curated collection of saved images and videos from the Mirage Studio catalog.
          </p>
        </div>

        @if (favorites().length > 0) {
          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of favorites(); track product.id) {
              <app-product-card
                [product]="product"
                [isSelected]="selectedId() === product.id"
              ></app-product-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-center h-80 text-center border border-dashed border-gray-250 dark:border-studioBorder rounded-xl bg-slate-100/50 dark:bg-studioCard/20 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-full bg-white dark:bg-studioCard flex items-center justify-center text-rose-505 dark:text-rose-500 border border-gray-200 dark:border-studioBorder mb-4 shadow-sm">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">No favorites yet</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1 mx-auto leading-relaxed">
              Click the heart icon on any card in the gallery to save your favorite assets here.
            </p>
          </div>
        }
      </main>

      <!-- Right Side Panel -->
      <app-right-panel class="h-full flex-shrink-0"></app-right-panel>
    </div>
  `
})
export class FavoritesComponent {
  productService = inject(ProductService);

  favorites = this.productService.favoriteProducts;
  selectedId = this.productService.selectedProductId;
}
