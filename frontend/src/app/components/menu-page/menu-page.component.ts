// menu-page.component.ts

import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-page',
  standalone: true,

  template: `
    @if (loading) {
    <div class="spinner">Loading...</div>
    }

    @if (error) {
    <div class="error">{{ error }}</div>
    }

    @if (!loading && !error) {
      <div class="menu-grid">
      @for (item of menuItems; track item.menu_item_id) {
        <app-menu-item 
          [menuItem]="item"
          (itemClicked)="onItemClicked($event)">
        </app-menu-item>
      }
      </div>
    } `,
  styles: [`
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      padding: 16px;
    }
    .spinner, .error {
      text-align: center;
      padding: 50px;
      font-size: 1.2em;
    }
    .error {
      color: red;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule]
})
export class MenuPageComponent implements OnInit {
  @Input() menuCardId!: number;
  @Input() menuPageId!: number;
  
  menuItems: MenuItem[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(private menuService: MenuService) { }
  
  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    
    this.menuService.getMenuItemsFromPage(this.menuCardId, this.menuPageId)
      .subscribe({
        next: (items) => {
          this.menuItems = items;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load menu';
          this.loading = false;
          console.error(err);
        }
      });
  }
  
  onItemClicked(event: Event): void {
    
    const item = (event.target as any) as MenuItem;
    console.log('Item clicked:', item.local_name);
    // TODO: Add to order
  }
}