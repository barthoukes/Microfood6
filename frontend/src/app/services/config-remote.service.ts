import { Injectable } from '@angular/core';
import { DatabaseServiceClient } from '../generated/sql_database.client';
import { Empty } from '../generated/common_types';
import { ConfigurationItemList } from '../generated/sql_database';
import { GrpcTransportService } from './grpc-transport.service';

@Injectable({ providedIn: 'root' })
export class ConfigRemoteService 
{
  private client: DatabaseServiceClient;
  private configCache: { 
    main: Map<string, string> | null, 
    user: Map<string, string> | null, 
    font: Map<string, string> | null, 
    colour: Map<string, string> | null 
  } = { 
    main: null,
    user: null, 
    font: null, 
    colour: null 
  };

  constructor(private grpcTransport: GrpcTransportService)
  {
    this.client = new DatabaseServiceClient(this.grpcTransport.getTransport());
  }

  async loadAllConfigs(): Promise<void>
  {
    // 1. Check cache first
    if (this.configCache.main && this.configCache.user && 
        this.configCache.font && this.configCache.colour) {
      console.log('✅ Configurations loaded from cache.');
      return;
    }

    // 2. Load from backend and store in cache
    try {
      const [mainMap, userMap, fontMap, colourMap] = await Promise.all([
        this.getConfigurationList(),
        this.getUserConfigurationList(),
        this.getFontConfigurationList(),
        this.getColourConfigurationList()
      ]);
      
      // Store in cache (already done in individual getters, but ensure it's there)
      this.configCache.main = mainMap;
      this.configCache.user = userMap;
      this.configCache.font = fontMap;
      this.configCache.colour = colourMap;
      
      console.log('✅ All configurations loaded from backend');
      console.log(`👤 User config: ${this.configCache.user?.size || 0} entries`);
      
      // Log important settings
      console.log('🍽️ menu_card_sitin:', this.getMenuCardSitin());
      console.log('🍽️ menu_card_takeaway:', this.getMenuCardTakeaway());
      console.log('🍽️ menu_card_delivery:', this.getMenuCardDelivery());
      
    } catch (error) {
      console.error('❌ Failed to load configurations:', error);
      // Set empty maps to prevent repeated failed attempts
      this.configCache.main = this.configCache.main || new Map();
      this.configCache.user = this.configCache.user || new Map();
      this.configCache.font = this.configCache.font || new Map();
      this.configCache.colour = this.configCache.colour || new Map();
    }
  }
 
  async getConfigurationList(): Promise<Map<string, string>>
  {
    // Check cache
    if (this.configCache.main) {
      return this.configCache.main;
    }

    const request: Empty = {};
    try {
      const response = (await this.client.getConfigurationList(request)).response;
      const map = this.convertToMap(response);
      this.configCache.main = map;
      return map;
    } catch (error) {
      console.error('❌ Failed to get configuration:', error);
      return new Map();
    }
  }
  
  async getUserConfigurationList(): Promise<Map<string, string>>
  {
    // Check cache
    if (this.configCache.user) {
      return this.configCache.user;
    }

    const request: Empty = {};
    try {
      const response = (await this.client.getUserConfigurationList(request)).response;
      const map = this.convertToMap(response);
      this.configCache.user = map;
      return map;
    } catch (error) {
      console.error('❌ Failed to get user configuration:', error);
      return new Map();
    }
  }
  
  async getFontConfigurationList(): Promise<Map<string, string>>
  {
    // Check cache
    if (this.configCache.font) {
      return this.configCache.font;
    }

    const request: Empty = {};
    try {
      const response = (await this.client.getFontConfigurationList(request)).response;
      const map = this.convertToMap(response);
      this.configCache.font = map;
      return map;
    } catch (error) {
      console.error('❌ Failed to get font configuration:', error);
      return new Map();
    }
  }
  
  async getColourConfigurationList(): Promise<Map<string, string>>
  {
    // Check cache
    if (this.configCache.colour) {
      return this.configCache.colour;
    }

    const request: Empty = {};
    try {
      const response = (await this.client.getColourConfigurationList(request)).response;
      const map = this.convertToMap(response);
      this.configCache.colour = map;
      return map;
    } catch (error) {
      console.error('❌ Failed to get colour configuration:', error);
      return new Map();
    }
  }
  
  // ============================================
  // User config getters (from user configuration)
  // ============================================
  
  getUserOption(name: string, defaultValue: string = ''): string
  {
    return this.configCache.user?.get(name) || defaultValue;
  }
  
  getUserOptionNumber(name: string, defaultValue: number = 0): number
  {
    const value = this.getUserOption(name, '');
    return value ? parseInt(value, 10) : defaultValue;
  }
  
  getUserOptionBool(name: string, defaultValue: boolean = false): boolean
  {
    const value = this.getUserOption(name, '');
    return value === '1' || value === 'true' || value === 'yes';
  }
  
  // ============================================
  // Menu card getters from USER configuration
  // ============================================
  
  getMenuCardSitin(): number
  {
    return this.getUserOptionNumber('menu_card_sitin', 1);
  }

  getMenuCardTakeaway(): number
  {
    return this.getUserOptionNumber('menu_card_takeaway', 1);
  }

  getMenuCardDelivery(): number
  {
    return this.getUserOptionNumber('menu_card_delivery', 1);
  }
  
  // ============================================
  // Display settings from USER configuration
  // ============================================
  
  // Add to ConfigRemoteService if not already there

  getDisplayGroupsVertical(): number
  {
      const total = this.getDisplayGroups();
      const horizontal = this.getDisplayGroupsHorizontal();
      return Math.ceil(total / horizontal);  // 18 / 6 = 3
  }

  getDisplayGroups(): number
  {
    return this.getUserOptionNumber('display_groups', 18);
  }
  
  getDisplayGroupsHorizontal(): number
  {
    return this.getUserOptionNumber('display_groups_horizontal', 6);
  }
  
  // ============================================
  // Helper methods
  // ============================================
  
  private convertToMap(configList: ConfigurationItemList): Map<string, string>
  {
    const map = new Map<string, string>();
    for (const item of configList.item || [])
    {
      const value = new TextDecoder().decode(item.value);
      map.set(item.configuration, value);
    }
    console.log(`📦 Converted ${map.size} configuration items`);
    return map;
  }
  
  // Check if cache is ready
  isReady(): boolean
  {
    return this.configCache.user !== null;
  }
}