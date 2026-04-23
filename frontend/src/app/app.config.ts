// src/app/app.config.ts

import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ConfigService } from './services/config.service';

export function initializeApp(configService: ConfigService)
{
  return () => configService.loadAllConfigs();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: GrpcWebFetchTransport,
      useFactory: (config: ConfigService) =>
      {
        const url = config.getGrpcServerUrl();
        console.log(`🔌 Creating GrpcWebFetchTransport for: ${url}`);
        return new GrpcWebFetchTransport({
          baseUrl: url
        });
      },
      deps: [ConfigService]
    }
  ]
};
