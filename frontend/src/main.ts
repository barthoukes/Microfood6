// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';  // ← IMPORT your config!
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)  // ← USE your config!
  .catch(err => console.error(err));