// order,model.ts

import { TransactionType} from './transaction.type';
import { ClientOrdersType} from './client-orders.type';

export interface OrderItem {
  menuItemId: number;
  unitPrice: number;
  orderQuantity: number;
}

export interface Transaction {
  id: string;
  transactionType: TransactionType;
  transactionName: string;
  items: OrderItem[];
  totalPrice: number;
  orderTime: Date;
  message: string;
  status: ClientOrdersType;
}

