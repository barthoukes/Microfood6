// src/app/models/menu-page.interface.ts

export interface MenuPage 
{
    menuCardId: number;
    menuPageId: number;
    localName: string;
    chineseName: string;
    pageButtonSize: number;     // ← This determines item size
    picture: string;
    isVerticalOrientation: boolean;  // ← Scroll direction
}

