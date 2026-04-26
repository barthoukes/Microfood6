// src/app/services/menu.service.ts (REPLACED with real gRPC)

import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { MenuItemServiceClient } from '../generated/sql_menu_item.client';
import { GetMenuItemsRequest } from '../generated/sql_menu_item';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.interface';
import { SkipInvisible, SKIP_INVISIBILITY_MAP } from '../models/skip-invisible.enum';
import { toTaxType } from '../models/tax-type.enum'
import { MENU_ITEM_ORDER_LEVEL, MenuItemLevel, toMenuItemLevel } from '../models/menu-item-level.type';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private transport = inject(GrpcWebFetchTransport);
  private client = new MenuItemServiceClient(this.transport);
  
getMenuItemsFromPage(
  menuCardId: number, 
  menuPageId: number,
  skipInvisible: SkipInvisible = 'true'
): Observable<MenuItem[]> {
  console.log('🎯 REAL gRPC method called!');
  console.log('📊 Parameters:', { menuCardId, menuPageId, skipInvisible });
  
  const request: GetMenuItemsRequest = {
    menuCardId: menuCardId,
    menuPageId: menuPageId,
    isVertical: false,
    skipInvisible: SKIP_INVISIBILITY_MAP[skipInvisible].numericValue
  };
  
  console.log('📤 gRPC Request:', request);
  
  return new Observable(subscriber => {
    this.client.getMenuItemsFromPage(request)
      .then(response => {
        console.log('📥 gRPC Response received:', response);
        const items = response.response.items?.map(grpcItem => ({
          menu_item_id: grpcItem.menuItemId,
          alias: grpcItem.alias,
          local_name: grpcItem.localName,
          chinese_name: grpcItem.chineseName,
          restaurant_price: grpcItem.restaurantPrice,
          takeaway_price: grpcItem.takeawayPrice,
          order_level: toMenuItemLevel(grpcItem.level),
          is_visible: grpcItem.isVisible,
          takeaway_tax: toTaxType(grpcItem.takeawayTax),
          restaurant_tax: toTaxType(grpcItem.restaurantTax),
          colour_text: grpcItem.colourText,
          colour_back: grpcItem.colourBack,
          colour_selected_text: grpcItem.colourSelectedText,
          colour_selected_back: grpcItem.colourSelectedBack,
          colour_back2: grpcItem.colourBack2,
          colour_selected_back2: grpcItem.colourSelectedBack2
        })) || [];
        console.log(`✅ Converted ${items.length} items`);
        subscriber.next(items);
        subscriber.complete();
      })
      .catch(error => {
        console.error('❌ gRPC Error:', error);
        subscriber.error(error);
      });
  });
}

}
