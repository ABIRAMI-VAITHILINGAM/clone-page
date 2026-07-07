import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { RightPanelComponent } from '../../components/right-panel/right-panel.component';

@Component({
  selector: 'app-images-page',
  standalone: true,
  imports: [CommonModule, GalleryComponent, RightPanelComponent],
  template: `
    <div class="flex flex-1 h-full overflow-hidden">
      <!-- Main Content Area: Forced to Image only, no toggle -->
      <main class="flex-1 p-8 overflow-hidden min-w-0">
        <app-gallery title="Image Library" [showToggle]="false" forcedType="image"></app-gallery>
      </main>

      <!-- Right Side Inspector Panel -->
      <app-right-panel class="h-full flex-shrink-0"></app-right-panel>
    </div>
  `
})
export class ImagesComponent {}
