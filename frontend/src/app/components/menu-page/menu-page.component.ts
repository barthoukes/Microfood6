import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MenuPage } from '../../models/menu-page.interface';
import { ItemGridComponent } from '../menu-item/item-grid.component';
import { MenuPageRemoteService } from '../../services/menu-page-remote.service';

@Component({
    selector: 'app-menu-page',
    standalone: true,
    imports: [CommonModule, ItemGridComponent],  // ← Use ItemGridComponent
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit, OnChanges {
    @Input() menuCardId!: number;
    @Input() menuPageId!: number;
    @Input() isVerticalOrientation: boolean = true;
    @Output() itemClicked = new EventEmitter<MenuItem>();
    // It's an input, we get the itemWidth from another class and we can pass data to child.
    @Input() itemWidth: number = 0;
    @Input() itemHeight: number = 0;

    menuItems: MenuItem[] = [];
    loading: boolean = true;
    error: string | null = null;
    private isFirstLoad: boolean = true;
    private menuPage: MenuPage | null = null;

    constructor(
        private menuService: MenuService,
        private menuPageService: MenuPageRemoteService,
        private cdr: ChangeDetectorRef
    ) { }
    
    ngOnInit(): void {
        console.log('🔵 MenuPageComponent initialized');
        if (this.isFirstLoad && this.menuCardId && this.menuPageId) 
        {
            this.isFirstLoad = false;
            this.loadPageConfig().then(() => 
            { 
                // <-- Call config loading FIRST
                this.loadItems();
            });
        }
    }
    
    async ngOnChanges(changes: SimpleChanges): Promise<void> 
    {

        console.log('🔄 ngOnChanges:', changes);
        if (this.isFirstLoad) 
        {
            return;
        }
        if ((changes['menuCardId'] && !changes['menuCardId'].firstChange) ||
            (changes['menuPageId'] && !changes['menuPageId'].firstChange)) 
        {
            // Clear immediately
            this.menuItems = [];
            this.loading = true;
            
            console.log(`🔄 Input changed, reloading...`);
            await this.loadPageConfig();
            this.loadItems();
        }
    }
    
    async ngOnChanges2(changes: SimpleChanges): Promise<void> {
    if (changes['menuCardId'] || changes['menuPageId']) {
        // Clear immediately
        this.menuItems = [];
        this.loading = true;
        
        // First load page config, then load items
        await this.loadPageConfig();
        this.loadItems();
    }
    }

    loadItems(): void {
        if (!this.menuCardId || !this.menuPageId) {
            console.warn('⚠️ Missing inputs, skipping load');
            return;
        }
        
        console.log(`📞 Loading: card=${this.menuCardId}, page=${this.menuPageId}`);
        this.loading = true;
        this.error = null;
        this.menuItems = []
        
        this.menuService.getMenuItemsFromPage(this.menuCardId, this.menuPageId)
            .subscribe({
                next: (items) => {
                    console.log(`✅ Received ${items?.length} items`);
                    this.menuItems = items;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.error = 'Failed to load menu';
                    this.loading = false;
                }
            });
    }
   
    async loadPageConfig(): Promise<void> 
    {
        // This function is now expected to run first in ngOnInit/ngOnChanges
        try 
        {
            this.menuPage = await this.menuPageService.findPage(this.menuCardId, this.menuPageId);
            if (this.menuPage != null) 
            {
                // pageButtonSize determines item size (e.g., 1,2,4,8 items per dimension)
                // Calculate pixel size from button size
                this.itemWidth = this.getPageWidth(this.menuPage);
                this.itemHeight = this.getPageHeight(this.menuPage);  // Square items
                this.isVerticalOrientation = this.menuPage.isVerticalOrientation;
                console.log(`📐 Page config: buttonSize=${this.itemWidth} ${this.itemHeight}, orientation=${this.isVerticalOrientation}`);
            }
        } 
        catch (error) 
        {
            console.error('Failed to load page config:', error);
        }
    }

    // Helper functions
    getPageWidth(page: MenuPage): number
    {
        if (!page || !page.pageButtonSize) return 0;
        return page.pageButtonSize % 1000;
    }

    getPageHeight(page: MenuPage): number 
    {
        if (!page || !page.pageButtonSize) return 0;
        return Math.floor(page.pageButtonSize / 1000);
    }

    onItemClicked(item: MenuItem): void 
    {
        console.log('🍽️ Item clicked:', item.local_name);
        this.itemClicked.emit(item);
    }

    // ngAfterViewChecked(): void {
    //     // If data has been loaded and viewed, force change detection once to stabilize state
    //     if (!this.loading && this.menuItems.length > 0 && this.error === null) {
    //         this.cdr.detectChanges();
    //     }
    // }

    ngAfterViewInit(): void 
    {
        // ✅ Runs once after view initializes
        console.log('MenuPageComponent view initialized');
    }
}
