import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRippleModule],
  template: `
    <div class="flex-1 p-6 md:p-8 overflow-y-auto select-none scrollbar-thin">
      <div class="max-w-3xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Workspace Settings</h2>
          <p class="text-xs text-gray-550 dark:text-gray-500 mt-1">
            Manage your personal profile, generation defaults, and billing subscriptions.
          </p>
        </div>

        <div class="space-y-8">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl p-6 shadow-sm dark:shadow-md">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 tracking-wider uppercase">Profile Details</h3>
            <div class="flex flex-col md:flex-row gap-6 items-start">
              <!-- Avatar Upload Area -->
              <div class="relative group flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="Avatar large"
                  class="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-studioBorder group-hover:brightness-50 transition-all cursor-pointer shadow-sm"
                />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              </div>

              <!-- Inputs -->
              <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-bold text-gray-500">FULL NAME</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.name"
                    class="px-3.5 py-2.5 bg-slate-50 dark:bg-studioBg/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-studioBorder rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-bold text-gray-500">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    [(ngModel)]="profile.email"
                    class="px-3.5 py-2.5 bg-slate-50 dark:bg-studioBg/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-studioBorder rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div class="flex flex-col gap-1.5 sm:col-span-2">
                  <label class="text-[10px] font-bold text-gray-500">BIO</label>
                  <textarea
                    rows="2"
                    [(ngModel)]="profile.bio"
                    class="px-3.5 py-2.5 bg-slate-50 dark:bg-studioBg/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-studioBorder rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Defaults and Studio Engine Card -->
          <div class="bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl p-6 shadow-sm dark:shadow-md">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 tracking-wider uppercase">Generation Preferences</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Default Model -->
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-bold text-gray-500">DEFAULT MODEL ENGINE</label>
                <select
                  [(ngModel)]="preferences.model"
                  class="px-3 py-2.5 bg-slate-50 dark:bg-studioBg/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-studioBorder rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="mirage-ugc-v2">Mirage UGC Talking Head (v2.1)</option>
                  <option value="mirage-cinema-v1">Mirage Cinematic Motion (v1.0)</option>
                  <option value="mirage-image-v3">Mirage Ultra HD Image (v3.5)</option>
                </select>
              </div>

              <!-- Default Resolution -->
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-bold text-gray-500">DEFAULT ASPECT RATIO</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (ratio of ['16:9', '9:16', '1:1']; track ratio) {
                    <button
                      (click)="preferences.aspectRatio = ratio"
                      matRipple
                      class="py-2.5 rounded-lg border text-xs font-semibold transition-all"
                      [class.bg-indigo-50]="preferences.aspectRatio === ratio"
                      [class.dark:bg-indigo-950]="preferences.aspectRatio === ratio"
                      [class.border-indigo-550]="preferences.aspectRatio === ratio"
                      [class.dark:border-indigo-500]="preferences.aspectRatio === ratio"
                      [class.text-indigo-650]="preferences.aspectRatio === ratio"
                      [class.dark:text-indigo-400]="preferences.aspectRatio === ratio"
                      [class.border-gray-200]="preferences.aspectRatio !== ratio"
                      [class.dark:border-studioBorder]="preferences.aspectRatio !== ratio"
                      [class.text-gray-500]="preferences.aspectRatio !== ratio"
                      [class.dark:text-gray-400]="preferences.aspectRatio !== ratio"
                    >
                      {{ ratio }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- API Access Token -->
          <div class="bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl p-6 shadow-sm dark:shadow-md">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase">API Integrations</h3>
              <button
                (click)="toggleApiKey()"
                class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {{ showApiKey() ? 'Hide Key' : 'Reveal Key' }}
              </button>
            </div>
            <div class="flex gap-2">
              <input
                [type]="showApiKey() ? 'text' : 'password'"
                readonly
                [value]="apiKey"
                class="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-studioBg/50 text-gray-550 dark:text-gray-450 font-mono border border-gray-200 dark:border-studioBorder rounded-lg text-xs focus:outline-none"
              />
              <button
                (click)="copyApiKey()"
                matRipple
                class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-studioCardHover dark:hover:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-studioBorder text-xs font-semibold rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <!-- Billing Plan summary -->
          <div class="bg-white dark:bg-studioCard border border-gray-200 dark:border-studioBorder rounded-xl p-6 shadow-sm dark:shadow-md flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-gray-900 dark:text-white">Creator Pro Plan</span>
                <span class="text-[10px] text-gray-500 mt-0.5">Billing cycle renews on August 1st, 2026 ($29/mo)</span>
              </div>
            </div>
            <button 
              matRipple
              class="px-3.5 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/5 dark:hover:bg-indigo-600/10 text-indigo-605 dark:text-indigo-400 text-xs font-semibold transition-all"
            >
              Manage Billing
            </button>
          </div>

          <!-- Form Buttons -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              (click)="reset()"
              matRipple
              class="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-studioBorder text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-studioCardHover transition-all font-semibold"
            >
              Reset Defaults
            </button>
            <button
              (click)="save()"
              matRipple
              class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-glow-primary hover:shadow-indigo-500/25 border border-indigo-500/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private notificationService = inject(NotificationService);

  profile = {
    name: 'Kannan Asokan',
    email: 'kannan.asokan@yorosis.com',
    bio: 'Lead creative director producing social campaigns and AI experiments.'
  };

  preferences = {
    model: 'mirage-ugc-v2',
    aspectRatio: '16:9'
  };

  apiKey = 'ms_live_45a0b73c2efd109f257aef92a83bd12e58c89b275';
  showApiKey = signal<boolean>(false);

  toggleApiKey() {
    this.showApiKey.set(!this.showApiKey());
  }

  copyApiKey() {
    navigator.clipboard.writeText(this.apiKey).then(() => {
      this.notificationService.success('API Key copied to clipboard!');
    });
  }

  save() {
    this.notificationService.success('Settings saved successfully!');
  }

  reset() {
    this.profile = {
      name: 'Kannan Asokan',
      email: 'kannan.asokan@yorosis.com',
      bio: 'Lead creative director producing social campaigns and AI experiments.'
    };
    this.preferences = {
      model: 'mirage-ugc-v2',
      aspectRatio: '16:9'
    };
    this.notificationService.info('Preferences reset to defaults.');
  }
}
