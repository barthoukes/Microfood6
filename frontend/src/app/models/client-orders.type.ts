// client-orders.type.ts

// Use union type + const object (best of both worlds)
export type ClientOrdersType = 'init' | 'open' | 'closed' | 'open-paid' | 'empty' | 'personnel' | 'credit' | 'closed-credit' | 'paying';

// Optional: const object for display names and numeric values if API requires numbers
export const CLIENT_ORDERS_TYPE_MAP: Record<ClientOrdersType, { numericValue: number; displayName: string }> = {
  'init': { numericValue: 0, displayName: 'init' },
  'open': { numericValue: 1, displayName: 'open' },
  'closed': { numericValue: 2, displayName: 'closed' },
  'open-paid': { numericValue: 3, displayName: 'open-paid' },
  'empty': { numericValue: 4, displayName: 'empty' },
  'personnel': { numericValue: 6, displayName: 'personnel' },
  'credit': { numericValue: 7, displayName: 'credit' },
  'closed-credit': { numericValue: 8, displayName: 'closed-credit' },
  'paying': { numericValue: 16, displayName: 'paying' }
};
