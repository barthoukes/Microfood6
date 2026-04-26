// src/app/services/menu-item-remote.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItemServiceClient } from '../generated/sql_menu_item.client';
import { GetMenuItemsRequest, MenuItemList } from '../generated/sql_menu_item';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ConfigRemoteService } from './config-remote.service';
//import { GrpcTransportService } from './grpc-transport.service';
import { GrpcClientFactory } from './grpc-client-factory.service';

@Injectable({ providedIn: 'root' })
export class MenuItemRemoteService 
{
  private client: MenuItemServiceClient;

  constructor(private config: ConfigRemoteService,
    private grpcFactory: GrpcClientFactory)
  {
    // Instead of using the URL string, we pass the established transport mechanism.
    this.client = this.grpcFactory.createMenuItemServiceClient();
  }
  getMenuItemsFromPage(menuCardId: number, menuPageId: number): Observable<MenuItemList> {
    const request = GetMenuItemsRequest.create({
      menuCardId: menuCardId,
      menuPageId: menuPageId
    });
    
    return new Observable((observer) => {
      this.client.getMenuItemsFromPage(request)
        .then((response) => {
          observer.next(response.response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}