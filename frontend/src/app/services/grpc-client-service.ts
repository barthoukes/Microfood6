// src/app/services/grpc-client.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItemServiceClient } from '../generated/sql_menu_item.client';
import { GetMenuItemsRequest, MenuItemList } from '../generated/sql_menu_item';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class GrpcClientService {
  private client: MenuItemServiceClient;
  
    constructor(private config: ConfigService)
  {
    const url = config.getGrpcServerUrl();
    console.log(`🔌 gRPC Client connecting to: ${url}`);
    
    const transport = new GrpcWebFetchTransport({
      baseUrl: url
    });

    // Pass the transport to the client
    this.client = new MenuItemServiceClient(transport);
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