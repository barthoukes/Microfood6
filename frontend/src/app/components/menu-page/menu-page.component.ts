import { Component, Input, OnInit, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, MenuItemComponent], 
  templateUrl: './menu-page.component.html',
  styleUrls: [ './menu-page.component.css' ]
})
export class MenuPageComponent implements OnInit {
  @Input() menuCardId!: number;
  @Input() menuPageId!: number;
  
  @Output() itemClicked = new EventEmitter<MenuItem>();
  
  menuItems: MenuItem[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(private menuService: MenuService) { }
  
  ngOnInit(): void {
      console.log('🔵 MenuPageComponent initialized');
      console.log('📥 Inputs - menuCardId:', this.menuCardId, 'menuPageId:', this.menuPageId);
    
      this.loading = true;
      this.error = null;
    
      this.menuService.getMenuItemsFromPage(this.menuCardId, this.menuPageId)
      .subscribe({
        next: (items) => {
          console.log('✅ Menu items received:', items?.length);
          this.menuItems = items;
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error loading menu:', err);
          this.error = 'Failed to load menu';
          this.loading = false;
        }
      });
  }

  onItemClicked(item: MenuItem): void {
    console.log('🍽️ Item clicked:', item.local_name);
    this.itemClicked.emit(item);
  }
}