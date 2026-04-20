// transactionType.ts

// Use union type + const object (best of both worlds)
export type TransactionType = 'sit-in' | 'delivery' | 'takeaway' | 'takeaway-phone' | 'eat-inside' | 'wok';

// Optional: const object for display names and numeric values if API requires numbers
export const TRANSACTION_TYPE_MAP: Record<TransactionType, { numericValue: number; displayName: string }> = {
  'sit-in': { numericValue: 4, displayName: 'Sit-in' },
  'delivery': { numericValue: 68, displayName: 'Delivery' },
  'takeaway': { numericValue: 84, displayName: 'Takeaway' },
  'takeaway-phone': { numericValue: 80, displayName: 'Takeaway (Phone)' },
  'eat-inside': { numericValue: 69, displayName: 'Eat Inside' },
  'wok': { numericValue: 87, displayName: 'Wok' },
};