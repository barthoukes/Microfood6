// menu.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.interface';

@Injectable({ providedIn: 'root' })
export class MenuService {
  
  // Mock data for learning
  private mockItems: MenuItem[] = [
    { 
      menu_item_id: 1, 
      local_name: 'Fried Rice', 
      chinese_name: '炒饭', 
      restaurant_price: 1299,
      takeaway_price: 1199,
      alias: 'FR001',
      order_level_numeric: 2,  // LEVEL_ITEM
      is_visible: 86
    },
    { 
      menu_item_id: 2, 
      local_name: 'Spring Rolls', 
      chinese_name: '春卷', 
      restaurant_price: 699,
      takeaway_price: 599,
      alias: 'SR002',
      order_level_numeric: 2,  // LEVEL_ITEM
      is_visible: 86
    },
    { 
      menu_item_id: 3, 
      local_name: 'Peking Duck', 
      chinese_name: '北京烤鸭', 
      restaurant_price: 3899,
      takeaway_price: 3599,
      alias: 'PD003',
      order_level_numeric: 13,  // LEVEL_OUTOFSTOCK
      is_visible: 86
    }
  ];
  
  getMenuItemsFromPage(menuCardId: number, menuPageId: number): Observable<MenuItem[]> {
    // Mock: filter by page (simplified)
    return of(this.mockItems);
  }
}
