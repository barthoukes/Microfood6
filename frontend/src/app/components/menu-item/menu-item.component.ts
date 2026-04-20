// menu-item.component.ts

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
 import { CommonModule } from '@angular/common'; 
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemLevel, MENU_ITEM_ORDER_LEVEL } from '../../models/menu-item-level.type';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  template: `
    <div class="menu-item" [class.out-of-stock]="isOutOfStock()" (click)="onClick()">
      <h3>{{ menuItem.local_name }}</h3>
      <p class="chinese">{{ menuItem.chinese_name }}</p>
      <p class="price" *ngIf="!isOutOfStock()">€{{ menuItem.restaurant_price / 100 }}</p>
      <p class="sold-out" *ngIf="isOutOfStock()">SOLD OUT</p>
    </div>
  `,
  styles: [`
    .menu-item {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      text-align: center;
    }
    .menu-item.out-of-stock {
      opacity: 0.5;
      background-color: #f0f0f0;
    }
    .sold-out {
      color: red;
      font-weight: bold;
    }
    .price {
      color: green;
      font-weight: bold;
    }
    .chinese {
      color: #666;
      font-size: 0.9em;
    }
  `],
  imports: [CommonModule]
})
export class MenuItemComponent {
  @Input() menuItem!: MenuItem;
  @Output() itemClicked = new EventEmitter<MenuItem>();
  
  getLevel(): MenuItemLevel | undefined {
    const entry = Object.entries(MENU_ITEM_ORDER_LEVEL)
      .find(([_, value]) => value.numericValue === this.menuItem.order_level_numeric);
    return entry ? (entry[0] as MenuItemLevel) : undefined;
  }
  
  isOutOfStock(): boolean {
    const level = this.getLevel();
    return level === 'out-of-stock';
  }
  
  getLevelDisplayName(): string {
    const level = this.getLevel();
    if (!level) return 'Unknown';
    return MENU_ITEM_ORDER_LEVEL[level].displayName;
  }
  
  onClick(): void {
    if (!this.isOutOfStock()) {
      this.itemClicked.emit(this.menuItem);
    }
  }
}