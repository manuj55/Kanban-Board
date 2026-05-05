import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
};

export default function Input({ hasError, className = '', ...props }: InputProps) {
    const base =
        'w-full rounded bg-surface-container-lowest px-sm py-sm text-body-md text-on-surface placeholder:text-on-surface-variant border transition-all duration-150 ease-out focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-primary)_20%,_transparent)] disabled:opacity-60 disabled:cursor-not-allowed';
    const borderClass = hasError
        ? 'border-error focus-visible:border-error focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--color-error)_20%,_transparent)] animate-shake'
        : 'border-outline-variant/40';

    return <input className={`${base} ${borderClass} ${className}`} {...props} />;
}
