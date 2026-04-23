// config.service.ts

// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ConfigItem 
{
  name: string;
  value: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService 
{
  // Maps to store configuration values (like m_items in your C++ code)
  private mainConfig: Map<string, string> = new Map();
  private colourConfig: Map<string, string> = new Map();
  private fontConfig: Map<string, string> = new Map();
  private userConfig: Map<string, string> = new Map();
  private sepaConfig: Map<string, string> = new Map();
  
  constructor(private http: HttpClient) {}
  
  async loadAllConfigs(): Promise<void> {
    await Promise.all([
      this.loadConfig('/.restaurant/configuration_zhongcan.xml', this.mainConfig),
      this.loadConfig('/.restaurant/colours_zhongcan.xml', this.colourConfig),
      this.loadConfig('/.restaurant/font_zhongcan.xml', this.fontConfig),
      this.loadConfig('/.restaurant/user_options.xml', this.userConfig),
      this.loadConfig('/.restaurant/sepa_zhongcan.xml', this.sepaConfig)
    ]);
    
    console.log('✅ All configurations loaded');
    console.log('📁 Main config:', Object.fromEntries(this.mainConfig));
  }
  
  private async loadConfig(filename: string, targetMap: Map<string, string>): Promise<void> {
    try {
      const xmlString = await firstValueFrom(
        this.http.get(filename, { responseType: 'text' })
      );
      this.parseXml(xmlString, targetMap);
    } catch (error) {
      console.warn(`⚠️ Could not load ${filename}:`, error);
    }
  }
  
  private parseXml(xmlString: string, targetMap: Map<string, string>): void 
  {
    console.log(`📄 Parsing XML, length: ${xmlString.length} characters`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Parse all item elements (matches your C++ XML structure)
    const items = xmlDoc.querySelectorAll('item');
    items.forEach(item => {
      const name = item.getAttribute('name');
      const value = item.textContent;
      if (name && value) 
      {
        targetMap.set(name, value);
      }
    });
  }
  
  // Main config getters (mirroring your C++ CFG macro)
  getOption(name: string, defaultValue: string = ''): string 
  {
    return this.mainConfig.get(name) || defaultValue;
  }
  
  getOptionNumber(name: string, defaultValue: number = 0): number 
  {
    const value = this.mainConfig.get(name);
    return value ? parseInt(value, 10) : defaultValue;
  }
  
  // Colour config getters (mirroring COLOUR macro)
  getColour(name: string): number 
  {
    const value = this.colourConfig.get(name);
    if (!value) return 0;
    // Parse hex colour (e.g., "0x00FF0000" or "#FF0000")
    if (value.startsWith('0x')) {
      return parseInt(value, 16);
    }
    if (value.startsWith('#')) {
      return parseInt(value.slice(1), 16);
    }
    return parseInt(value, 10);
  }
  
  getColourString(name: string): string 
  {
    return this.colourConfig.get(name) || '0x00000000';
  }
  
  // Font config getters
  getFontString(name: string): string 
  {
    return this.fontConfig.get(name) || '';
  }
  
  getFontSize(name: string): number {
    const value = this.fontConfig.get(name);
    return value ? parseInt(value, 10) : 16;
  }
  
  // User config getters
  getUserOption(name: string, defaultValue: number = 0): number {
    const value = this.userConfig.get(name);
    return value ? parseInt(value, 10) : defaultValue;
  }
  
  getUserOptionString(name: string, defaultValue: string = ''): string {
    return this.userConfig.get(name) || defaultValue;
  }
  
  // SEPA config getters
  getSepaOption(name: string): string {
    return this.sepaConfig.get(name) || '';
  }
  
  getSepaNumber(name: string, defaultValue: number = 0): number {
    const value = this.sepaConfig.get(name);
    return value ? parseInt(value, 10) : defaultValue;
  }
  
  // Convenience methods for common POS settings
  getGrpcHost(): string {
    return this.getOption('grpc_server', 'localhost');
  }
  
  getGrpcServerUrl(): string
  {
    // TEMPORARY: Force 127.0.0.1 to avoid security warnings
    return 'http://127.0.0.1:50051';
    // Your original code below...
  }

  getGrpcPort(): number {
    return this.getOptionNumber('grpc_server_port', 50051);
  }
  
  getMenuCardSitin(): number {
    return this.getOptionNumber('menu_card_sitin', 1);
  }
  
  getMenuCardTakeaway(): number {
    return this.getOptionNumber('menu_card_takeaway', 1);
  }
  
  getMenuCardDelivery(): number {
    return this.getOptionNumber('menu_card_delivery', 1);
  }
  
  getDisplayGroups(): number {
    return this.getOptionNumber('display_groups', 18);
  }
  
  isMaster(): boolean {
    const host = this.getGrpcHost();
    return host === 'localhost' || host === '127.0.0.1';
  }
  
 // getGrpcServerUrl(): string
 // {
 //   const host = this.getOption('test_grpc_host', 'localhost');
 //   const port = this.getOptionNumber('test_grpc_port', 50051);
 //   return `http://${host}:${port}`;
 // }

}