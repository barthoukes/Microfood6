import { Component } from '@angular/core';
import { MenuPageComponent } from './components/menu-page/menu-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuPageComponent],
  template: `
    <h1>Microfood POS</h1>
    <app-menu-page [menuCardId]="1" [menuPageId]="1"></app-menu-page>
  `,
  styles: [`
    h1 {
      text-align: center;
      color: #2c7da0;
      margin: 20px 0;
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
