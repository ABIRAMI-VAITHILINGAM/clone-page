import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRippleModule
  ],
  template: `
    <div class="flex-1 p-6 md:p-8 overflow-y-auto select-none scrollbar-thin">
      <div class="max-w-2xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-white tracking-wide">Upload Creative Asset</h2>
          <p class="text-xs text-gray-500 mt-1">
            Publish customized items into your workspace gallery. Uploaded assets will support search, sorting, and details preview.
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-studioCard border border-studioBorder rounded-2xl p-6 md:p-8 shadow-lg">
          <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="space-y-5">
            
            <!-- Title -->
            <div class="flex flex-col">
              <mat-form-field appearance="fill" class="studio-form-field w-full">
                <mat-label>TITLE</mat-label>
                <input matInput formControlName="title" placeholder="e.g. Neon Cybernetic Face Portrait" />
                @if (uploadForm.get('title')?.hasError('required')) {
                  <mat-error>Title is required</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Price and Category Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Price Field -->
              <div>
                <mat-form-field appearance="fill" class="studio-form-field w-full">
                  <mat-label>PRICE (\$)</mat-label>
                  <input matInput type="number" formControlName="price" placeholder="e.g. 59.99" />
                  @if (uploadForm.get('price')?.hasError('required')) {
                    <mat-error>Price is required</mat-error>
                  }
                  @if (uploadForm.get('price')?.hasError('min')) {
                    <mat-error>Price must be positive</mat-error>
                  }
                </mat-form-field>
              </div>

              <!-- Category Field -->
              <div>
                <mat-form-field appearance="fill" class="studio-form-field w-full">
                  <mat-label>CATEGORY</mat-label>
                  <input matInput formControlName="category" placeholder="e.g. AI Avatar, Concept Art" />
                  @if (uploadForm.get('category')?.hasError('required')) {
                    <mat-error>Category is required</mat-error>
                  }
                </mat-form-field>
              </div>
            </div>

            <!-- Media Type Selector & Choose File Picker -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Media Type Toggle -->
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold text-gray-500 tracking-wider">MEDIA TYPE *</label>
                <div class="flex bg-studioBg/60 p-1 border border-studioBorder rounded-lg h-[46px] items-center">
                  <button
                    type="button"
                    (click)="setMediaType('image')"
                    matRipple
                    class="w-1/2 h-full rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                    [class.bg-indigo-600]="mediaType === 'image'"
                    [class.text-white]="mediaType === 'image'"
                    [class.text-gray-400]="mediaType !== 'image'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Image</span>
                  </button>
                  <button
                    type="button"
                    (click)="setMediaType('video')"
                    matRipple
                    class="w-1/2 h-full rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                    [class.bg-indigo-600]="mediaType === 'video'"
                    [class.text-white]="mediaType === 'video'"
                    [class.text-gray-400]="mediaType !== 'video'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Video</span>
                  </button>
                </div>
              </div>

              <!-- Drag/Drop File Upload Picker -->
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold text-gray-500 tracking-wider">CHOOSE FILE *</label>
                <div
                  class="relative border border-dashed rounded-lg p-2.5 flex flex-col items-center justify-center bg-studioBg/30 transition-all min-h-[46px]"
                  [class.border-indigo-500]="isDragging"
                  [class.bg-indigo-950]="isDragging"
                  [class.border-studioBorder]="!isDragging"
                  [class.border-red-500]="showFileError"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave()"
                  (drop)="onDrop($event)"
                >
                  <!-- Hidden file input -->
                  <input
                    type="file"
                    id="fileInput"
                    (change)="onFileSelected($event)"
                    [accept]="mediaType === 'image' ? 'image/*' : 'video/*'"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  @if (!selectedFile) {
                    <!-- File Picker View -->
                    <div class="flex items-center gap-2 pointer-events-none text-center">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <span class="text-[11px] text-gray-400">
                        Drag file here or <span class="text-indigo-400 underline">browse</span>
                      </span>
                    </div>
                  } @else {
                    <!-- File Selected Preview View -->
                    <div class="flex items-center gap-3 w-full">
                      <!-- Mini Thumbnail -->
                      @if (mediaType === 'image' && filePreviewUrl) {
                        <img [src]="filePreviewUrl" class="w-9 h-7 rounded object-cover border border-studioBorder flex-shrink-0" />
                      } @else {
                        <div class="w-9 h-7 rounded bg-studioCard flex items-center justify-center text-indigo-400 border border-studioBorder flex-shrink-0">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      }

                      <div class="flex-1 min-w-0 text-left">
                        <p class="text-[10px] font-semibold text-white truncate">{{ selectedFile.name }}</p>
                        <p class="text-[9px] text-gray-500">{{ formatBytes(selectedFile.size) }}</p>
                      </div>

                      <button
                        type="button"
                        (click)="clearFile($event)"
                        class="p-1 rounded bg-studioCard hover:bg-studioCardHover text-gray-400 hover:text-white border border-studioBorder transition-all flex-shrink-0"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
                @if (showFileError) {
                  <span class="text-[10px] text-red-500 font-medium">Please select a file to upload.</span>
                }
              </div>
            </div>

            <!-- Description -->
            <div>
              <mat-form-field appearance="fill" class="studio-form-field w-full">
                <mat-label>DESCRIPTION</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Briefly describe the asset composition..."></textarea>
                @if (uploadForm.get('description')?.hasError('required')) {
                  <mat-error>Description is required</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- AI Prompt (Optional) -->
            <div>
              <mat-form-field appearance="fill" class="studio-form-field w-full font-mono">
                <mat-label>AI GENERATION PROMPT (OPTIONAL)</mat-label>
                <textarea matInput formControlName="prompt" rows="3" placeholder="Paste the text prompt used to generate this media..."></textarea>
              </mat-form-field>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-studioBorder/40">
              <button
                type="button"
                (click)="cancel()"
                matRipple
                class="px-5 py-2.5 rounded-lg border border-studioBorder text-xs text-gray-400 hover:text-white hover:bg-studioCardHover transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!uploadForm.valid || !selectedFile"
                matRipple
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-lg shadow-glow-primary hover:shadow-indigo-500/25 border border-indigo-500/30 transition-all"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Styling rules to override Material input defaults inside dark studio */
    ::ng-deep .studio-form-field .mdc-text-field--filled {
      background-color: #111827 !important;
      border-radius: 8px !important;
      border: 1px solid #1f2937 !important;
    }
    ::ng-deep .studio-form-field .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
      color: #f3f4f6 !important;
      font-size: 13px !important;
    }
    ::ng-deep .studio-form-field .mdc-floating-label {
      color: #9ca3af !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.05em !important;
    }
    ::ng-deep .studio-form-field .mdc-text-field--focused .mdc-floating-label {
      color: #6366f1 !important;
    }
    ::ng-deep .studio-form-field .mdc-line-ripple {
      display: none !important; /* Hide default line ripple for solid custom borders */
    }
    ::ng-deep .studio-form-field .mdc-text-field--focused {
      border-color: #6366f1 !important;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.15) !important;
    }
  `]
})
export class UploadComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);

  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  
  isDragging = false;
  showFileError = false;

  get mediaType() {
    return this.uploadForm?.get('type')?.value || 'image';
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.revokePreviewUrl();
  }

  private initForm() {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      price: [19.99, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      prompt: [''],
      type: ['image', Validators.required]
    });
  }

  setMediaType(type: 'image' | 'video') {
    this.uploadForm.get('type')?.setValue(type);
    
    // Clear previous file in case they switch media type (to prevent wrong file extension matching)
    this.selectedFile = null;
    this.revokePreviewUrl();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files[0]);
    }
  }

  setFile(file: File) {
    this.selectedFile = file;
    this.showFileError = false;

    this.revokePreviewUrl();

    if (this.mediaType === 'image') {
      this.filePreviewUrl = URL.createObjectURL(file);
    }
  }

  clearFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    this.revokePreviewUrl();
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Drag-and-drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  formatBytes(bytes: number, decimals = 1) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  onSubmit() {
    if (!this.uploadForm.valid || !this.selectedFile) {
      if (!this.selectedFile) {
        this.showFileError = true;
      }
      return;
    }

    const formValues = this.uploadForm.value;
    const localUrl = URL.createObjectURL(this.selectedFile);

    // Save as custom product in ProductService
    this.productService.addCustomProduct({
      title: formValues.title,
      price: formValues.price,
      category: formValues.category,
      description: formValues.description,
      type: formValues.type,
      image: formValues.type === 'image' ? localUrl : 'https://images.unsplash.com/photo-1618005198143-e528346ddfcd?w=800', // thumbnail overlay
      videoUrl: formValues.type === 'video' ? localUrl : undefined,
      prompt: formValues.prompt || undefined,
      duration: formValues.type === 'video' ? '0:10' : undefined,
      size: this.formatBytes(this.selectedFile.size)
    });

    // Reset and return
    this.uploadForm.reset({
      price: 19.99,
      type: 'image'
    });
    this.selectedFile = null;
    this.revokePreviewUrl();

    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  private revokePreviewUrl() {
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
      this.filePreviewUrl = null;
    }
  }
}
