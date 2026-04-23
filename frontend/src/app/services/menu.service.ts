// src/app/services/menu.service.ts (REPLACED with real gRPC)
import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { MenuItemServiceClient } from '../generated/sql_menu_item.client';
import { GetMenuItemsRequest } from '../generated/sql_menu_item';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.interface';
import { SkipInvisible, SKIP_INVISIBILITY_MAP } from '../models/skip-invisible.enum';
import { toTaxType } from '../models/tax-type.enum'

@Injectable({ providedIn: 'root' })
export class MenuService {
  private transport = inject(GrpcWebFetchTransport);
  private client = new MenuItemServiceClient(this.transport);
  
  // src/app/services/menu.service.ts - temporary mock
  getDummyMenuItemsFromPage(menuCardId: number, menuPageId: number): Observable<MenuItem[]>
  {
    console.log('🔧 Using MOCK data for menu items');
    
    const mockItems: MenuItem[] = [
      {
        menu_item_id: 1,
        alias: 'FR001',
        local_name: 'Fried Rice',
        chinese_name: '炒饭',
        restaurant_price: 1299,
        takeaway_price: 1199,
        restaurant_tax: toTaxType(2),
        takeaway_tax: toTaxType(2),
        order_level_numeric: 2,
        is_visible: 86
      },
      {
        menu_item_id: 2,
        alias: 'SR002',
        local_name: 'Spring Rolls',
        chinese_name: '春卷',
        restaurant_price: 699,
        takeaway_price: 599,
        restaurant_tax: toTaxType(1),
        takeaway_tax: toTaxType(1),
        order_level_numeric: 2,
        is_visible: 86
      },
      {
        menu_item_id: 3,
        alias: 'PD003',
        local_name: 'Peking Duck',
        chinese_name: '北京烤鸭',
        restaurant_price: 3899,
        takeaway_price: 3599,
        restaurant_tax: toTaxType(2),
        takeaway_tax: toTaxType(2),
        order_level_numeric: 13,  // out-of-stock
        is_visible: 86
      }
    ];
    
    return of(mockItems);
  }

  // src/app/services/menu.service.ts
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
          order_level_numeric: grpcItem.level,
          is_visible: grpcItem.isVisible,
          takeaway_tax: toTaxType(grpcItem.takeawayTax),
          restaurant_tax: toTaxType(grpcItem.restaurantTax)
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

  getNewMenuItemsFromPage(
    menuCardId: number, 
    menuPageId: number,
    skipInvisible: SkipInvisible = 'true'
  ): Observable<MenuItem[]> {
    const request: GetMenuItemsRequest = {
      menuCardId: menuCardId,
      menuPageId: menuPageId,
      isVertical: false,
      skipInvisible: SKIP_INVISIBILITY_MAP[skipInvisible].numericValue
    };
    
    return new Observable(subscriber => 
    {
      console.log('⏳ Waiting for gRPC response...');
    
      // Add timeout
      const timeoutId = setTimeout(() => {
          console.error('❌ gRPC timeout after 10 seconds');
          subscriber.error(new Error('gRPC timeout'));
      }, 10000);

      this.client.getMenuItemsFromPage(request).then(response => 
      {
        clearTimeout(timeoutId);
        // Convert gRPC response to your MenuItem interface
        const items = response.response.items?.map(grpcItem => ({
          menu_item_id: grpcItem.menuItemId,
          alias: grpcItem.alias,
          local_name: grpcItem.localName,
          chinese_name: grpcItem.chineseName,
          restaurant_price: grpcItem.restaurantPrice,
          takeaway_price: grpcItem.takeawayPrice,
          order_level_numeric: grpcItem.level,
          is_visible: grpcItem.isVisible,
          takeaway_tax: toTaxType(grpcItem.takeawayTax),
          restaurant_tax: toTaxType(grpcItem.restaurantTax)
        })) || [];
        subscriber.next(items);
        subscriber.complete();
      }).catch(error => {
        subscriber.error(error);
      });
    });
  }
}
