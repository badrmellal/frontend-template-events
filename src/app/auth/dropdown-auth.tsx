import React, { useState } from "react";

interface DropdownProps {
    options: {label: string, value: string}[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const DropdownAuth: React.FC<DropdownProps> = ({options, selectedValue, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
        e.preventDefault();
        onChange(value);
        setIsOpen(false);
    }

    return(
        <div className="relative inline-block w-full text-left">
            <div>
                <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    {options.find(option => option.value === selectedValue)?.label || 'Select an option'}
                    <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute z-10 mt-2 w-full shadow-lg rounded-md bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {options.map(option => (
                            <a key={option.value}
                            href="#"
                            onClick={(e) => handleSelect(e, option.value)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default DropdownAuth;