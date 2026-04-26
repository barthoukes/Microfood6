// menu-item.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemLevel, MENU_ITEM_ORDER_LEVEL, toMenuItemLevel } from '../../models/menu-item-level.type';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})

export class MenuItemComponent {
  @Input() menuItem!: MenuItem;
  @Output() itemClicked = new EventEmitter<MenuItem>();
  
  /**
   * Convert number color to hex string
   * Supports formats: 0xRRGGBB or 0xAARRGGBB
   */
  private numberToHexColor(colorNum: number | undefined): string {
    if (!colorNum) return '#f9f9f9';
    
    // Remove alpha channel if present (0xAARRGGBB -> 0xRRGGBB)
    const rgb = colorNum & 0x00FFFFFF;
    return '#' + rgb.toString(16).padStart(6, '0');
  }
  
  /**
   * Get vertical gradient background (bottom to top)
   * colour_back2 at bottom, colour_back at top
   */
  getBackgroundGradient(): string {
    const topColor = this.numberToHexColor(this.menuItem.colour_back);
    const bottomColor = this.numberToHexColor(this.menuItem.colour_back2);
    
    // If colors are the same or bottom color missing, use solid color
    if (topColor === bottomColor || !this.menuItem.colour_back2) {
      return topColor;
    }
    
    // Vertical gradient: bottom to top (0% at bottom, 100% at top)
    return `linear-gradient(to top, ${bottomColor}, ${topColor})`;
  }
  
  /**
   * Get text color (light or dark based on background)
   */
  getTextColor(): string {
    if (this.menuItem.colour_text) {
      return this.numberToHexColor(this.menuItem.colour_text);
    }
    // Default to dark text
    return '#333333';
  }
  
  /**
   * Get price color (can be different from text color)
   */
  getPriceColor(): string {
    if (this.menuItem.colour_selected_text) {
      return this.numberToHexColor(this.menuItem.colour_selected_text);
    }
    // Default to green for price
    return '#2e7d32';
  }
  
  isOutOfStock(): boolean {
    return this.menuItem.order_level === 'out-of-stock';
  }
  
  onClick(): void {
    if (!this.isOutOfStock()) {
      this.itemClicked.emit(this.menuItem);
    }
  }
}