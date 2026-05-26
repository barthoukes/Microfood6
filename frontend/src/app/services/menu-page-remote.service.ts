// src/app/services/menu-page-remote.service.ts

import { Injectable } from '@angular/core';
import { MenuPageServiceClient } from '../generated/sql_menu_page.client';
import { MenuCardId } from '../generated/common_types';
import { MenuPage } from '../models/menu-page.interface';
import { GrpcClientFactory } from './grpc-client-factory.service';

@Injectable({ providedIn: 'root' })
export class MenuPageRemoteService 
{
    private client: MenuPageServiceClient;
    
    constructor(private grpcFactory: GrpcClientFactory)
    {
        this.client = this.grpcFactory.createMenuPageServiceClient();
    }
    
    async findAllPages(menuCardId: number): Promise<MenuPage[]>
    {
        const request: MenuCardId = { menuCardId: menuCardId };
        const response = (await this.client.findAllPages(request)).response;
        return response.menuPages || [];
    }
    
    async findPage(menuCardId: number, menuPageId: number): Promise<MenuPage | null>
    {
        const pages = await this.findAllPages(menuCardId);
        const page = pages.find(p => p.menuPageId === menuPageId);
        return page || null;
    }
}