// item-grid.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, 
         ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
    selector: 'app-item-grid',
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    templateUrl: './item-grid.component.html',
    styleUrls: ['./item-grid.component.css']
})
export class ItemGridComponent implements OnInit, OnChanges {
    @Input() menuItems: MenuItem[] = [];
    @Input() isVerticalOrientation: boolean = true;
    @Output() itemClicked = new EventEmitter<MenuItem>();
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    
    columns: number[] = [];
    rows: number[] = [];
    gridTemplateColumns: string = '';
    gridTemplateRows: string = '';
    gridWidth: string = '';
    gridHeight: string = '';
    containerHeight: string = '';
    containerWidth: string = '';
    gridColumns: number = 1;
    gridRows: number = 1;
    widthPerItem: number = 8;
    heightPerItem: number = 8;

    ngOnInit(): void {
        this.calculateGrid();
        this.setContainerSize();
    }
    
    ngOnChanges(trigger: SimpleChanges): void {
        if (trigger['menuItems'] || trigger['isVerticalOrientation']) {
            this.calculateGrid();
            this.setContainerSize();
        }
    }
    
    calculateGrid(): void {
        if (!this.menuItems || this.menuItems.length === 0) return;
        
        const uniqueX = [...new Set(this.menuItems.map(item => item.position_x))];
        const uniqueY = [...new Set(this.menuItems.map(item => item.position_y))];
        
        this.columns = uniqueX.sort((a, b) => a - b);
        this.rows = uniqueY.sort((a, b) => a - b);
        
        this.widthPerItem = this.menuItems[0].position_width*8
        this.heightPerItem = this.menuItems[0].position_height*8

        for (const item of this.menuItems)
        {
            item.grid_column = this.columns.indexOf(item.position_x)
            item.grid_row = this.rows.indexOf(item.position_y)
        }

        // Use 1fr for flexible sizing
        this.gridTemplateColumns = `repeat(${this.columns.length}, 1fr)`;
        this.gridTemplateRows = `repeat(${this.rows.length}, 1fr)`;
        
        // Fill container
        this.gridWidth = '100%';
        this.gridHeight = '100%';
        
        this.gridColumns = this.columns.length
        this.gridRows = this.rows.length
    }
    
    setContainerSize(): void {
        // Approximate cell size for scroll container calculation
        
        if (this.isVerticalOrientation) {
            const visibleHeight = this.gridRows * this.heightPerItem;
            this.containerHeight = `${visibleHeight + 32}px`;
            this.containerWidth = '100%';
        } else {
            const visibleWidth = this.gridColumns * this.widthPerItem;
            this.containerWidth = `${visibleWidth + 32}px`;
            this.containerHeight = '100%';
        }
    }
    
    onItemClick(item: MenuItem): void {
        this.itemClicked.emit(item);
    }
}