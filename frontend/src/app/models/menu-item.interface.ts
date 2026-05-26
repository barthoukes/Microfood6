// src/app/models/menu-item.interface.ts

import { MenuItemLevel } from './menu-item-level.type';
import { TaxType } from './tax-type.enum';

export interface MenuItem {
    menu_item_id: number;
    alias: string;
    local_name: string;
    chinese_name: string;
    restaurant_price: number;
    takeaway_price: number;
    restaurant_tax: TaxType;
    takeaway_tax: TaxType;
    order_level: MenuItemLevel;
    is_visible: number;
    // Position on screen
    position_x: number;
    position_y: number;
    position_width: number;
    position_height: number;
    // Colors from gRPC
    colour_text: number;
    colour_back: number;
    colour_selected_text: number;
    colour_selected_back: number;
    colour_back2: number;
    colour_selected_back2: number;
    grid_column: number;
    grid_row: number;
}