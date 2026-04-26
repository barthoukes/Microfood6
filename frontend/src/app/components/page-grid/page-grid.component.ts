import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRemoteService } from '../../services/config-remote.service';
import { MenuPageServiceClient } from '../../generated/sql_menu_page.client';
import { MenuPage } from '../../generated/sql_menu_page';
import { GrpcClientFactory } from '../../services/grpc-client-factory.service';

@Component({
    selector: 'app-page-grid',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-grid.component.html',
    styleUrls: ['./page-grid.component.css']
})
export class PageGridComponent implements OnInit 
{
    @Input() menuCardId: number = 1;
    @Input() selectedPageId: number = 1;
    @Output() pageSelected = new EventEmitter<number>();
    
    pages: MenuPage[] = [];
    columns: number = 6;
    rows: number = 3;
    private menuPageService: MenuPageServiceClient
    
    constructor(
        private configRemote: ConfigRemoteService,
        private grpcFactory: GrpcClientFactory) 
    {
        // ✅ Create client in constructor - guaranteed to be ready
        this.menuPageService = this.grpcFactory.createMenuPageServiceClient();
    }
    
    ngOnInit(): void
    {
        this.columns = this.configRemote.getDisplayGroupsHorizontal();
        this.loadPages();
    }
    
    async loadPages(): Promise<void>
    {
        console.log('📞 Calling findAllPages for menuCardId:', this.menuCardId);
        
        try {
            const request = { menuCardId: this.menuCardId };
            console.log('📤 Request:', request);
            
            const result = await this.menuPageService.findAllPages(request);
            console.log('📥 Full result:', result);
            console.log('📥 result.response:', result?.response);
            
            // ✅ Only use result.response.menuPages (not result.menuPages)
            this.pages = result?.response?.menuPages ?? [];
            
            console.log(`📑 Loaded ${this.pages.length} pages`);
            
            // Log each page's properties
            if (this.pages.length > 0) {
                console.log('🔍 First page keys:', Object.keys(this.pages[0]));
                console.log('🔍 First page:', this.pages[0]);
            }
            
            this.pages.forEach((page, i) => {
                console.log(`  Page ${i + 1}:`, page);
            });
            
            this.rows = Math.ceil(this.pages.length / this.columns);
            
        } catch (error) {
            console.error('Failed to load pages:', error);
            this.pages = [];
        }
    }

    getPageDisplayName(page: MenuPage): string
    {
        // Log every call to see what's being returned
        // console.log('🔍 getPageDisplayName called with:', page);
        // console.log('  - menuPageId:', page.menuPageId);
        // console.log('  - page.localName:', (page as any).localName);
        // console.log('  - page.local_name:', (page as any).local_name);
        // console.log('  - page.chineseName:', (page as any).chineseName);
        // console.log('  - page.chinese_name:', (page as any).chinese_name);
        
        // Try to find a name
        const chineseName = (page as any).chineseName || (page as any).chinese_name;
        const localName = (page as any).localName || (page as any).local_name;
        
        // console.log('  - Extracted chineseName:', chineseName);
        // console.log('  - Extracted localName:', localName);
        
        if (chineseName && chineseName.trim()) {
            //console.log('  ✅ Returning Chinese name:', chineseName);
            return chineseName;
        }
        if (localName && localName.trim()) {
            //console.log('  ✅ Returning local name:', localName);
            return localName;
        }
        
        const fallback = `Page ${page.menuPageId}`;
        //console.log('  ⚠️ No name found, returning fallback:', fallback);
        return fallback;
    }

    selectPage(pageId: number): void
    {
        this.selectedPageId = pageId;
        this.pageSelected.emit(pageId);
    }
}