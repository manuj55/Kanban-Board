import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = '', ...props }: ButtonProps) {
    const base =
        'inline-flex items-center justify-center rounded px-md py-sm text-label-md uppercase tracking-wider font-semibold transition-colors transition-shadow disabled:opacity-60 disabled:cursor-not-allowed';

    return <button className={`${base} ${className}`} {...props} />;
}
