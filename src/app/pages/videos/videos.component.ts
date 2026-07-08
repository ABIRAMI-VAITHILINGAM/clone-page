import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  selector: 'app-videos-page',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  template: `
    <div class="flex flex-1 h-full overflow-hidden">
      <!-- Main Content Area: Forced to Video only, no toggle -->
      <main class="flex-1 p-8 overflow-hidden min-w-0">
        <app-gallery title="Video Library" [showToggle]="false" forcedType="video"></app-gallery>
      </main>
    </div>
  `
})
export class VideosComponent {}
