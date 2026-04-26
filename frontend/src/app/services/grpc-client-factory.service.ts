// src/app/services/grpc-client-factory.service.ts

import { Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { DatabaseServiceClient } from '../generated/sql_database.client';
import { MenuItemServiceClient } from '../generated/sql_menu_item.client';
import { MenuPageServiceClient } from '../generated/sql_menu_page.client';
// Import other clients as needed

@Injectable({ providedIn: 'root' })
export class GrpcClientFactory 
{
  private transport: GrpcWebFetchTransport;
  
  constructor()
  {
    const url = 'http://localhost:8080';  // Could also come from static config
    console.log(`🔌 Creating gRPC transport factory for: ${url}`);
    
    this.transport = new GrpcWebFetchTransport({
      baseUrl: url,
      format: 'text'
    });
  }
  
  // Factory methods for each client
  createDatabaseServiceClient(): DatabaseServiceClient
  {
    return new DatabaseServiceClient(this.transport);
  }
  
  createMenuItemServiceClient(): MenuItemServiceClient
  {
    return new MenuItemServiceClient(this.transport);
  }
  
  createMenuPageServiceClient(): MenuPageServiceClient
  {
    return new MenuPageServiceClient(this.transport);
  }
  
  // Add more clients as needed
}