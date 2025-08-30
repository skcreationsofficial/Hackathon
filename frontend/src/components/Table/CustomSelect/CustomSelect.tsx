import React from "react";
 
interface CustomSelectProps {
    label?: string;
    value: string | number | null;
    name: string;
    options: { name: string; value: string | number }[];
    classNames?: string;
    disabled?: boolean;
    touched?: object;
    err?: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
 
const CustomSelect = ({
    label,
    value,
    name,
    options,
    err,
    classNames = "",
    disabled = false,
    onChange,
    ...props
}: CustomSelectProps) => {
    
    return (
        <div className={`space-y-1 ${classNames}`}>
        {label && (
            <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
            >
            {label}
            </label>
        )}
        <select
            name={name}
            id={name}
            value={value ?? ""}
            {...props}
            onChange={onChange}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
            {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.name}
            </option>
            ))}
        </select>
        {err && (
            <p className="text-xs text-red-500 italic mt-0.5">
            {err}
            </p>
        )}
        </div>

    );
};
 
export default CustomSelect;