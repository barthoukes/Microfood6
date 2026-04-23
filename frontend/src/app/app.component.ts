import { Component } from '@angular/core';
import { PosLayoutComponent } from './components/pos-layout/pos-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PosLayoutComponent], // <-- Add MenuService here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  title = 'frontend';
}
