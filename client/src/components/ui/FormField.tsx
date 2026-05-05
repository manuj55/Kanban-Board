import React from 'react';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
}

export default function FormField({
    label,
    htmlFor,
    error,
    helperText,
    children,
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-xs">
            <label
                htmlFor={htmlFor}
                className="text-label-md uppercase tracking-wider text-on-surface-variant"
            >
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-body-sm text-error">{error}</p>
            ) : helperText ? (
                <p className="text-body-sm text-on-surface-variant">{helperText}</p>
            ) : null}
        </div>
    );
}
