// skip-invisibile.enum.ts

/**
 * Defines the possible visibility states for menu items.
 * The keys correspond to the constants provided.
 */
export type SkipInvisible = 'true' | 'false' | 'show';

// Optional: object for display names and numeric values if API requires numbers
export const SKIP_INVISIBILITY_MAP: Record<SkipInvisible, { numericValue: number; displayName: string }> = 
{
    'true': { numericValue: 0, displayName: 'Do show only the background.' },
    'false': { numericValue: 70, displayName: 'Do show like normal items.' },
    'show': { numericValue: 83, displayName: 'Show the item also when invisible, but mark it grey.' }
};