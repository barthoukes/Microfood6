// src/app/app.config.ts

import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ConfigRemoteService } from './services/config-remote.service';

export function initializeApp(configService: ConfigRemoteService)
{
  return () => configService.loadAllConfigs();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigRemoteService],
      multi: true
    },
    {
      provide: GrpcWebFetchTransport,
      useFactory: (config: ConfigRemoteService) =>
      {
        const url = 'http://localhost:8080';
        console.log(`🔌 Creating GrpcWebFetchTransport for: ${url}`);
        return new GrpcWebFetchTransport({
          baseUrl: url
        });
      },
      deps: [ConfigRemoteService]
    }
  ]
};
