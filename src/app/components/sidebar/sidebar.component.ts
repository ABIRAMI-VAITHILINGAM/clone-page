import { Component, signal, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatRippleModule],
  template: `
    <aside 
      class="flex flex-col h-screen bg-white dark:bg-studioCard border-r border-gray-200 dark:border-studioBorder text-gray-700 dark:text-gray-300 select-none transition-all duration-300 ease-in-out z-30"
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
    >
      <!-- Logo Section -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-gray-200 dark:border-studioBorder overflow-hidden flex-shrink-0 justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shadow-glow-primary flex-shrink-0">
            <svg class="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <div class="flex flex-col transition-opacity duration-200" [class.opacity-0]="isCollapsed()" [class.w-0]="isCollapsed()">
            <span class="text-sm font-bold tracking-wider text-gray-900 dark:text-white">MIRAGE</span>
            <span class="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold tracking-widest uppercase -mt-1">STUDIO</span>
          </div>
        </div>
        
        <!-- Toggle button inside logo section on desktop -->
        <button 
          (click)="toggleCollapse()"
          class="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-studioCardHover text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-studioBorder transition-all"
        >
          <svg 
            class="w-4 h-4 transition-transform duration-300"
            [class.rotate-180]="isCollapsed()"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        @for (item of menuItems; track item.label) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-500/5 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500 font-medium shadow-glow-primary/5"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            matRipple
            [matRippleColor]="'rgba(99, 102, 241, 0.08)'"
            class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-studioCardHover border-l-4 border-transparent transition-all duration-200 group relative cursor-pointer"
            [title]="isCollapsed() ? item.label : ''"
          >
            <!-- SVG Icon -->
            <span class="transition-transform duration-200 group-hover:scale-115 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex-shrink-0" [innerHTML]="item.icon"></span>
            <span class="transition-opacity duration-200 truncate" [class.opacity-0]="isCollapsed()" [class.w-0]="isCollapsed()">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom Profile / Status -->
      <div class="p-4 border-t border-gray-200 dark:border-studioBorder bg-gray-50 dark:bg-studioBg/30 flex-shrink-0">
        <!-- Credits (Only visible when expanded) -->
        <div 
          class="p-3 rounded-lg bg-white dark:bg-studioCard/50 border border-gray-200 dark:border-studioBorder/50 mb-4 transition-all duration-200"
          [class.hidden]="isCollapsed()"
          [class.opacity-0]="isCollapsed()"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-semibold text-gray-400 uppercase">CREDITS</span>
            <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">840 / 1,000</span>
          </div>
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 84%"></div>
          </div>
        </div>

        <div class="flex items-center gap-3" [class.justify-center]="isCollapsed()">
          <div class="relative flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-studioBorder" />
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-studioCard rounded-full"></div>
          </div>
          <div class="flex flex-col overflow-hidden transition-all duration-200" [class.opacity-0]="isCollapsed()" [class.w-0]="isCollapsed()">
            <span class="text-xs font-semibold text-gray-900 dark:text-white truncate">Kannan Asokan</span>
            <span class="text-[9px] text-gray-400 dark:text-gray-500 truncate">Creator Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  isCollapsed = signal<boolean>(false);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      `
    },
    {
      label: 'Images',
      route: '/images',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      `
    },
    {
      label: 'Videos',
      route: '/videos',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      `
    },
    {
      label: 'Upload',
      route: '/upload',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
      `
    },
    {
      label: 'Favorites',
      route: '/favorites',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      `
    },
    {
      label: 'History',
      route: '/history',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `
    },
    {
      label: 'Settings',
      route: '/settings',
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      `
    }
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isCollapsed.set(true); // Auto collapse on mobile
    }
  }
}
