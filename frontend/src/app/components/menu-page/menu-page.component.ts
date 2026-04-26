import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemComponent } from "../menu-item/menu-item.component";

@Component({
    selector: 'app-menu-page',
    standalone: true,
    imports: [CommonModule, MenuItemComponent], 
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit, OnChanges {
    @Input() menuCardId!: number;
    @Input() menuPageId!: number;
    
    @Output() itemClicked = new EventEmitter<MenuItem>();
    
    menuItems: MenuItem[] = [];
    loading: boolean = true;
    error: string | null = null;
    private isFirstLoad: boolean = true;
    
    constructor(
        private menuService: MenuService,
        private cdr: ChangeDetectorRef
    ) { }
    
    ngOnInit(): void {
        console.log('🔵 MenuPageComponent initialized');
        // Only load if this is the first load and inputs are valid
        if (this.isFirstLoad && this.menuCardId && this.menuPageId) {
            this.isFirstLoad = false;
            this.loadItems();
        }
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        console.log('🔄 ngOnChanges:', changes);
        // Skip the first load (handled by ngOnInit)
        if (this.isFirstLoad) {
            return;
        }
        // Reload when inputs change
        if ((changes['menuCardId'] && !changes['menuCardId'].firstChange) ||
            (changes['menuPageId'] && !changes['menuPageId'].firstChange)) {
            console.log(`🔄 Input changed, reloading...`);
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
        this.cdr.detectChanges();
        
        this.menuService.getMenuItemsFromPage(this.menuCardId, this.menuPageId)
            .subscribe({
                next: (items) => {
                    console.log(`✅ Received ${items?.length} items`);
                    this.menuItems = items;
                    this.loading = false;
                    this.cdr.detectChanges();
                    console.log(`✅ loading=false, view updated`);
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.error = 'Failed to load menu';
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
    }
    
    onItemClicked(item: MenuItem): void {
        console.log('🍽️ Item clicked:', item.local_name);
        this.itemClicked.emit(item);
    }
}