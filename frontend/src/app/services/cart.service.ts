// src/app/services/cart.service.ts

// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item.interface';
import { TransactionItem } from '../models/transaction-item.interface';
import { Transaction } from '../models/transaction.interface';
import { TransactionType, TRANSACTION_TYPE_MAP } from '../models/transaction.type';
import { DeletedStatus } from '../models/deleted-status.type';
import { TaxType } from '../models/tax-type.enum';

@Injectable({ providedIn: 'root' })
export class CartService {
  private currentTransaction: Transaction = {
    transaction_id: 0,
    table_id: 0,
    customer_name: 'Guest',
    transaction_type: 'sit-in',
    trans_type_value: TRANSACTION_TYPE_MAP['sit-in'].numericValue,
    status: 1,
    items: [],
    created_at: new Date(),
    updated_at: new Date()
  };
  
  private nextSequence: number = 1;
  
  getTransaction(): Transaction
  {
    return this.currentTransaction; 
  }
  
  setTransactionType(type: TransactionType): void
  {
    this.currentTransaction.transaction_type = type;
    this.currentTransaction.trans_type_value = TRANSACTION_TYPE_MAP[type].numericValue;
  }

  getTransactionType(): TransactionType
  {
    return this.currentTransaction.transaction_type;
  }
  
  addMenuItem(item: MenuItem, quantity: number = 1): void
  {
    let unitPrice: number;
    let taxType: TaxType;
    
    switch (this.currentTransaction.transaction_type)
    {
      case 'takeaway':
      case 'takeaway-phone':
        unitPrice = item.takeaway_price;
        taxType = item.takeaway_tax;
        break;
      case 'delivery':
        unitPrice = item.takeaway_price;
        taxType = item.takeaway_tax;
        break;
      default:
        unitPrice = item.restaurant_price;
        taxType = item.restaurant_tax;
        break;
    }
    
    const taxPercentage = this.getTaxPercentage(taxType);
    
    // Check if item already exists in transaction (and not deleted)
    const existingItem = this.currentTransaction.items.find(
      i => i.menu_item_id === item.menu_item_id && i.deleted_status === DeletedStatus.DELETE_NOT
    );
    
    if (existingItem)
    {
      existingItem.quantity += quantity;
      existingItem.unit_price = unitPrice;
    }
    else
    {
      const transactionItem: TransactionItem = {
        menu_item_id: item.menu_item_id,
        local_name: item.local_name,
        chinese_name: item.chinese_name,
        quantity: quantity,
        unit_price: unitPrice,
        tax_percentage: taxPercentage,
        order_level: item.order_level,
        deleted_status: DeletedStatus.DELETE_NOT,  // ← Using enum!
        sequence_nr: this.nextSequence++,
        sub_sequence: 0
      };
      this.currentTransaction.items.push(transactionItem);
    }
    
    this.currentTransaction.updated_at = new Date();
  }
  
  removeItem(menuItemId: number): void
  {
    const index = this.currentTransaction.items.findIndex(
      i => i.menu_item_id === menuItemId && i.deleted_status === DeletedStatus.DELETE_NOT
    );
    
    if (index !== -1)
    {
      const item = this.currentTransaction.items[index];
      if (item.quantity > 1)
      {
        item.quantity--;
      }
      else
      {
        // Mark as deleted immediately
        item.deleted_status = DeletedStatus.DELETE_REMOVE_IMMEDIATE;
      }
    }
  }
  
  getSubtotal(): number
  {
    return this.currentTransaction.items
      .filter(i => i.deleted_status === DeletedStatus.DELETE_NOT)
      .reduce((sum, i) => sum + (i.unit_price * i.quantity), 0);
  }
  
  getTaxTotal(): number
  {
    return this.currentTransaction.items
      .filter(i => i.deleted_status === DeletedStatus.DELETE_NOT)
      .reduce((sum, i) => sum + (i.unit_price * i.quantity * i.tax_percentage / 100), 0);
  }
  
  getTotal(): number
  {
    return this.getSubtotal() + this.getTaxTotal();
  }
  
  getItemCount(): number
  {
    return this.currentTransaction.items
      .filter(i => i.deleted_status === DeletedStatus.DELETE_NOT)
      .reduce((sum, i) => sum + i.quantity, 0);
  }
  
  private getTaxPercentage(taxType: TaxType): number
  {
    switch (taxType)
    { 
      case 'btw-high': return 9.0;   // BTW_LOW
      case 'btw-low': return 21.0;  // BTW_HIGH
      case 'btw-none': return 0;   // BTW_NONE
      default: return 21;
    }
  }
  
  clearTransaction(): void
  {
    this.currentTransaction.items = [];
    this.nextSequence = 1;
    this.currentTransaction.updated_at = new Date();
  }
}