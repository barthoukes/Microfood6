// menu-item-level.type.ts

// Use union type + const object (best of both worlds)
export type MenuItemLevel = 
  | 'group' 
  | 'item' 
  | 'extra' 
  | 'charity' 
  | 'ask-cluster' 
  | 'spice'
  | 'minutes-price' 
  | 'separator' 
  | 'out-of-stock' 
  | 'sub-extra' 
  | 'sub-spices' 
  | 'sub-item' 
  | 'person';

export const MENU_ITEM_ORDER_LEVEL: Record<MenuItemLevel, { numericValue: number; displayName: string }> = 
{
  'group': { numericValue: 0, displayName: 'Group' },
  'item': { numericValue: 2, displayName: 'Item' },
  'extra': { numericValue: 3, displayName: 'Extra' },
  'charity': { numericValue: 4, displayName: 'Charity' },
  'ask-cluster': { numericValue: 5, displayName: 'Ask Cluster' },
  'spice': { numericValue: 6, displayName: 'Spice' },
  'minutes-price': { numericValue: 10, displayName: 'Minutes' },
  'separator': { numericValue: 12, displayName: 'Separator' },
  'out-of-stock': { numericValue: 13, displayName: 'Out of Stock' },
  'sub-extra': { numericValue: 14, displayName: 'Sub-Extra' },
  'sub-spices': { numericValue: 15, displayName: 'Sub-Spices' },
  'sub-item': { numericValue: 16, displayName: 'Sub-Item' },
  'person': { numericValue: 80, displayName: 'Person' }
};

// Helper function to convert numeric order level to MenuItemLevel type
export function toMenuItemLevel(numericValue: number): MenuItemLevel 
{
    // Find the key whose numericValue matches
    for (const [key, value] of Object.entries(MENU_ITEM_ORDER_LEVEL)) {
        if (value.numericValue === numericValue) {
            return key as MenuItemLevel;
        }
    }
    // Default to 'item' if not found
    return 'item';
}