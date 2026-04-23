// tax-type.enum.ts

export type TaxType = 'btw-high' | 'btw-low' | 'btw-none' | 'btw-max';

// Optional: const object for display names and numeric values if API requires numbers
export const TAX_TYPE_MAP: Record<TaxType, { numericValue: number; displayName: string }> = 
{
  'btw-high': { numericValue: 2, displayName: 'btw hoog' },
  'btw-low': { numericValue: 1, displayName: 'btw laag' },
  'btw-none': { numericValue: 3, displayName: 'btw geen' },
  'btw-max': { numericValue: 4, displayName: '' }
}

export function toTaxType(numericValue: number): TaxType
{
  // Find the key whose numericValue matches
  switch(numericValue)
  {
      case 1: return 'btw-low';
      case 2: return 'btw-high';
      case 3: return 'btw-none';
      case 4: return 'btw-max';
      default: return 'btw-low';
  }
}
