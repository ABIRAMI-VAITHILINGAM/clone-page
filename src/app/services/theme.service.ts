import { Injectable, signal, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageService = inject(StorageService);
  private readonly THEME_KEY = 'mirage_theme_mode';

  // Signal for theme mode, default to 'dark' to fit the premium low-light dashboard theme
  themeMode = signal<ThemeMode>(this.storageService.getItem<ThemeMode>(this.THEME_KEY, 'dark'));

  constructor() {
    // Automatically apply theme changes using an effect
    effect(() => {
      const currentTheme = this.themeMode();
      this.applyTheme(currentTheme);
      this.storageService.setItem(this.THEME_KEY, currentTheme);
    });
  }

  toggleTheme(): void {
    this.themeMode.update(current => current === 'dark' ? 'light' : 'dark');
  }

  isDarkMode(): boolean {
    return this.themeMode() === 'dark';
  }

  private applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
}
