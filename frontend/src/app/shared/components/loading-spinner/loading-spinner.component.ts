import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <span *ngIf="message" class="message">{{message}}</span>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }
    .message {
      margin-top: 10px;
      color: rgba(0, 0, 0, 0.54);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() overlay = false;
  @Input() message?: string;
} 