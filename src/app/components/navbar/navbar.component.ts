import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { ProductService } from '../../services/product.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatRippleModule],
  template: `
    <header class="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 h-16 bg-white/95 dark:bg-studioCard/90 backdrop-blur-md border-b border-gray-200 dark:border-studioBorder text-gray-800 dark:text-white select-none">
      
      <!-- Left side: Search bar -->
      <div class="flex items-center w-64 md:w-96 relative">
        <span class="absolute left-3.5 text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input
          type="text"
          [value]="productService.searchQuery()"
          (input)="onSearchChange($event)"
          placeholder="Search items by title, category..."
          class="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-100 dark:bg-studioBg/60 text-gray-900 dark:text-gray-200 placeholder-gray-500 border border-gray-200 dark:border-studioBorder rounded-lg focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all duration-200"
        />
      </div>

      <!-- Right side: Actions -->
      <div class="flex items-center gap-2 md:gap-4">
        
        <!-- Add Button (replaces 'Generate') -->
        <button
          (click)="navigateToAdd()"
          matRipple
          class="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs md:text-sm font-semibold rounded-lg shadow-glow-primary transition-all duration-200 hover:shadow-indigo-500/25 border border-indigo-500/30 group"
        >
          <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span class="hidden sm:inline">Add</span>
        </button>

        <!-- Theme Toggle -->
        <button 
          (click)="toggleTheme()"
          matRipple
          class="p-1.5 md:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-studioCardHover rounded-lg transition-all duration-200"
          [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          @if (themeService.isDarkMode()) {
            <!-- Sun Icon for Light Mode Option -->
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 6.364A9 9 0 115.636 5.636m12.728 12.728A9 9 0 015.636 5.636"></path>
            </svg>
          } @else {
            <!-- Moon Icon for Dark Mode Option -->
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          }
        </button>

        <!-- Notification Bell -->
        <button 
          (click)="toggleNotifications()"
          matRipple
          class="relative p-1.5 md:p-2 text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-studioCardHover rounded-lg transition-all duration-200"
          title="Notifications"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          @if (unreadCount() > 0) {
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-studioCard animate-pulse"></span>
          }
        </button>

        <!-- Notification Dropdown -->
        @if (showNotifications()) {
          <div class="absolute right-16 top-14 w-80 bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl shadow-2xl p-4 z-40 text-left">
            <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-studioBorder/50 mb-2">
              <span class="text-xs font-bold text-gray-800 dark:text-white uppercase">Notifications</span>
              <button (click)="clearNotifications()" class="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline">Clear all</button>
            </div>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              @for (notif of notifications(); track notif.id) {
                <div class="p-2 hover:bg-slate-50 dark:hover:bg-studioBg/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-studioBorder/50 transition-all text-xs">
                  <div class="flex justify-between items-start">
                    <span class="font-semibold text-gray-900 dark:text-gray-200">{{ notif.title }}</span>
                    <span class="text-[9px] text-gray-400 dark:text-gray-500">{{ notif.time }}</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 text-[11px] mt-0.5">{{ notif.message }}</p>
                </div>
              } @empty {
                <div class="text-center py-6 text-xs text-gray-500">No new notifications</div>
              }
            </div>
          </div>
        }

        <!-- Vertical Divider -->
        <div class="w-[1px] h-6 bg-gray-200 dark:bg-studioBorder"></div>

        <!-- User Settings Profile -->
        <a 
          routerLink="/settings"
          matRipple
          class="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-studioCardHover rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-studioBorder transition-all"
          title="View Settings"
        >
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Avatar" class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-studioBorder" />
          <span class="hidden lg:inline text-xs font-semibold text-gray-750 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white truncate max-w-[80px]">Kannan A.</span>
        </a>
      </div>
    </header>
  `
})
export class NavbarComponent {
  productService = inject(ProductService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  showNotifications = signal<boolean>(false);
  unreadCount = signal<number>(2);

  notifications = signal([
    { id: 1, title: 'Render Finished', message: 'Hyper-realistic virtual influencer portrait was successfully added.', time: '2m ago' },
    { id: 2, title: 'System Update', message: 'Mirage Studio v2.5 engine is now live. Faster processing.', time: '1h ago' }
  ]);

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.productService.searchQuery.set(input.value);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
  }

  clearNotifications() {
    this.notifications.set([]);
    this.unreadCount.set(0);
  }

  navigateToAdd() {
    this.router.navigate(['/upload']);
  }
}
