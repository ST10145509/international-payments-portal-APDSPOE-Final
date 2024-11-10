import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-container" *ngIf="message">
      <mat-icon>error</mat-icon>
      <span>{{message}}</span>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      padding: 8px;
      border-radius: 4px;
      background-color: rgba(244, 67, 54, 0.1);
      margin: 8px 0;
    }
    mat-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message?: string;
} 