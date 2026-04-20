// menu-item.interface.ts

export interface MenuItem 
{
  menu_item_id: number;
  alias: string;
  local_name: string;
  chinese_name: string;
  restaurant_price: number;
  takeaway_price: number;
  order_level_numeric: number;  // From gRPC OrderLevel
  is_visible: number;           // 86 = visible, 73 = invisible
}