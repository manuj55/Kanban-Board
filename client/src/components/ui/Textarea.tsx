import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    hasError?: boolean;
};

export default function Textarea({
    hasError,
    className = '',
    ...props
}: TextareaProps) {
    const base =
        'w-full rounded bg-surface-container-lowest px-sm py-sm text-body-md text-on-surface placeholder:text-on-surface-variant border transition-colors focus-visible:outline-none focus-visible:border-primary-container focus-visible:shadow-[0_0_12px_var(--color-primary-container)] disabled:opacity-60 disabled:cursor-not-allowed';
    const borderClass = hasError ? 'border-error' : 'border-outline-variant/40';

    return <textarea className={`${base} ${borderClass} ${className}`} {...props} />;
}
