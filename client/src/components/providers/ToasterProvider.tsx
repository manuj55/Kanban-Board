'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function ToasterProvider() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <Toaster
            theme="light"
            position={isMobile ? 'bottom-center' : 'bottom-right'}
            closeButton
            richColors
            toastOptions={{
                style: {
                    width: isMobile ? '90vw' : '320px',
                    maxWidth: isMobile ? '90vw' : '320px',
                },
            }}
        />
    );
}
