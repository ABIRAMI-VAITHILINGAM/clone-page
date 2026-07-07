import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RightPanelComponent } from '../../components/right-panel/right-panel.component';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RightPanelComponent],
  template: `
    <div class="flex flex-1 h-full overflow-hidden">
      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto min-w-0 select-none scrollbar-thin">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Viewing History</h2>
            <p class="text-xs text-gray-550 dark:text-gray-500 mt-1">
              Keep track of all the items you've inspected in your studio sessions.
            </p>
          </div>

          @if (history().length > 0) {
            <button
              (click)="clearHistory()"
              class="px-4 py-2 bg-white dark:bg-studioCard hover:bg-slate-50 dark:hover:bg-studioCardHover text-gray-750 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white border border-gray-200 dark:border-studioBorder rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Clear History</span>
            </button>
          }
        </div>

        @if (history().length > 0) {
          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of history(); track product.id) {
              <app-product-card
                [product]="product"
                [isSelected]="selectedId() === product.id"
              ></app-product-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-center h-80 text-center border border-dashed border-gray-250 dark:border-studioBorder rounded-xl bg-slate-100/50 dark:bg-studioCard/20 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-full bg-white dark:bg-studioCard flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-studioBorder mb-4 shadow-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">No viewing history</h3>
            <p class="text-xs text-gray-555 dark:text-gray-400 max-w-xs mt-1 mx-auto leading-relaxed">
              Items you select and view details for on the Dashboard or library pages will appear here.
            </p>
          </div>
        }
      </main>

      <!-- Right Side Panel -->
      <app-right-panel class="h-full flex-shrink-0"></app-right-panel>
    </div>
  `
})
export class HistoryComponent {
  productService = inject(ProductService);

  history = this.productService.historyProducts;
  selectedId = this.productService.selectedProductId;

  clearHistory() {
    if (confirm('Are you sure you want to clear your viewing history?')) {
      this.productService.clearHistory();
    }
  }
}
