import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'images', 
    loadComponent: () => import('./pages/images/images.component').then(m => m.ImagesComponent) 
  },
  { 
    path: 'videos', 
    loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent) 
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent) 
  },
  { 
    path: 'history', 
    loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) 
  },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
