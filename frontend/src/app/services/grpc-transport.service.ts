// src/app/services/grpc-base.service.ts
import { Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

@Injectable({ providedIn: 'root' })
export class GrpcTransportService 
{
  private transport: GrpcWebFetchTransport;
  
  constructor()
  {
    const url = 'http://localhost:8080';
    console.log(`🔌 Creating gRPC transport for: ${url}`);
    
    // ✅ Simple options first
    this.transport = new GrpcWebFetchTransport({
      baseUrl: url,
      format: 'text'
    });
  }
    
  getTransport(): GrpcWebFetchTransport
  {
    return this.transport;
  }
}