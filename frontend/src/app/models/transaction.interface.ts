// src/app/models/transaction.interface.ts

import { TransactionItem } from './transaction-item.interface';
import { TransactionType } from './transaction.type';

export interface Transaction {
  transaction_id: number;
  table_id: number;
  customer_name: string;
  transaction_type: TransactionType;
  trans_type_value: number;    // From TRANSACTION_TYPE_MAP
  status: number;              // CLIENT_ORDER_OPEN, etc. from common_types.proto
  items: TransactionItem[];
  created_at: Date;
  updated_at: Date;
}