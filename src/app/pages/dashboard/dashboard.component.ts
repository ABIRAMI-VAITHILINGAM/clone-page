import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  template: `
    <div class="flex flex-1 h-full overflow-hidden">
      <!-- Main Content Area with Gallery -->
      <main class="flex-1 p-8 overflow-hidden min-w-0">
        <app-gallery title="Studio Gallery" [showToggle]="true"></app-gallery>
      </main>
    </div>
  `
})
export class DashboardComponent {}
