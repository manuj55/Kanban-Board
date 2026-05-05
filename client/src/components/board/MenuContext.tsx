'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface MenuContextType {
    openMenuId: string | null;
    setOpenMenuId: (id: string | null) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    return (
        <MenuContext.Provider value={{ openMenuId, setOpenMenuId }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within MenuProvider');
    }
    return context;
}
