// src/app/models/transaction-item.interface.ts

import { DeletedStatus } from './deleted-status.type';
import { MenuItemLevel } from './menu-item-level.type';

export interface TransactionItem {
  menu_item_id: number;
  local_name: string;
  chinese_name: string;
  quantity: number;
  unit_price: number;        // Price at order time (could be different from current menu price!)
  tax_percentage: number;    // Tax at order time
  order_level: MenuItemLevel;            // OrderLevel (item, extra, spice, etc.)
  deleted_status: DeletedStatus;    // 0=normal, -1=deleted, etc.
  sequence_nr: number;       // Position in the order
  sub_sequence: number;      // For extras/sub-items
}