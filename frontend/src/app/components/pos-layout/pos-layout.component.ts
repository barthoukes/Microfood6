// src/app/components/pos-layout/pos-layout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MenuPageComponent } from '../menu-page/menu-page.component';
import { MenuItem } from '../../models/menu-item.interface';
import { Transaction } from '../../models/transaction.interface';
import { TransactionType, TRANSACTION_TYPE_MAP } from '../../models/transaction.type';
import { DeletedStatus } from '../../models/deleted-status.type';

@Component({
    selector: 'app-pos-layout',
    standalone: true,
    imports: [CommonModule, MenuPageComponent],
    templateUrl: './pos-layout.component.html',
    styleUrls: ['./pos-layout.component.css']
})
export class PosLayoutComponent implements OnInit {
    customerName: string = 'Guest';
    menuCardId: number = 1;
    currentPageId: number = 1;
    transaction: Transaction | null = null;
    total: number = 0;
    subtotal: number = 0;
    taxTotal: number = 0;
    transactionType: TransactionType = 'sit-in';

    transactionTypes = Object.entries(TRANSACTION_TYPE_MAP).map(([key, value]) => ({
        type: key as TransactionType,
        displayName: value.displayName
    }));
    
    pages = [
        { id: 1, name: 'Soup' },
        { id: 2, name: 'Snacks' },
        { id: 3, name: 'Main Courses' },
        { id: 4, name: 'Desserts' }
    ];
  
    constructor(private cartService: CartService) {}

    ngOnInit(): void
    {
    console.log('🔵 PosLayoutComponent initialized');
    console.log('📦 Getting transaction from cartService...');

    this.transaction = this.cartService.getTransaction();
    console.log('✅ Transaction:', this.transaction);

    this.updateTotals();
    console.log('💰 Totals - Subtotal:', this.subtotal, 'Tax:', this.taxTotal, 'Total:', this.total);
    }
  
    setTransactionType(type: TransactionType): void
    {
        console.log('🔄 Changing transaction type to:', type);
        this.transactionType = type;
        this.cartService.setTransactionType(type);
        this.updateTotals();
    }

    onItemAdded(item: MenuItem): void  // ← Make sure parameter type is MenuItem
    {
        console.log('➕ Adding item:', item.local_name);
        this.cartService.addMenuItem(item, 1);
        this.transaction = this.cartService.getTransaction();
        this.updateTotals();
    }
  
    removeItem(itemId: number): void
    {
        this.cartService.removeItem(itemId);
        this.transaction = this.cartService.getTransaction();
        this.updateTotals();
    }
  
    selectPage(pageId: number): void
    {
        this.currentPageId = pageId;
    }
    
    private updateTotals(): void
    {
        if (this.transaction)
        {
            this.subtotal = this.cartService.getSubtotal();
            this.taxTotal = this.cartService.getTaxTotal();
            this.total = this.cartService.getTotal();
            console.log('💰 Updated totals:', { subtotal: this.subtotal, taxTotal: this.taxTotal, total: this.total });
        }
    }
    
    getActiveItems(): any[]
    {
        if (!this.transaction) return [];
        return this.transaction.items.filter(i => i.deleted_status === DeletedStatus.DELETE_NOT);
    }
}
