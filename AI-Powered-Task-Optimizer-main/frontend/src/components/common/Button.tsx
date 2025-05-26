import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string; // Optional if children are provided
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    children?: React.ReactNode;
    // onClick is already part of ButtonHTMLAttributes
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    variant = 'primary',
    disabled = false,
    type = 'button',
    children,
    className = '', // Allow additional classes to be passed
    ...props // Spread other native button props
}) => {
    let baseStyle = "font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

    let variantStyle = "";
    switch (variant) {
        case 'primary':
            variantStyle = "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500";
            break;
        case 'secondary':
            variantStyle = "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500";
            break;
        case 'danger':
            variantStyle = "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
            break;
        case 'outline':
            variantStyle = "bg-transparent hover:bg-gray-700 text-sky-400 border border-sky-500 hover:text-white focus:ring-sky-500";
            break;
        default:
            variantStyle = "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500";
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variantStyle} ${className}`}
            {...props}
        >
            {children || text}
        </button>
    );
};

export default Button;
