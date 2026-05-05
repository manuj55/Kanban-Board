import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
}

export default function Button({
    className = '',
    loading = false,
    loadingText,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const base =
        'inline-flex items-center justify-center gap-sm rounded-md px-md py-sm min-h-[44px] text-label-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2';

    const isDisabled = disabled || loading;

    return (
        <button
            className={`${base} ${className}`}
            disabled={isDisabled}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {loading ? (loadingText || children) : children}
        </button>
    );
}
