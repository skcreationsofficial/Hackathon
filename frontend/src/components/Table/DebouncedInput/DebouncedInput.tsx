import React from 'react'
import { useEffect, useState } from "react"
 
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    type,
    placeholder,
    className,
    ...props
}: {
    value: string
    onChange: (value: string) => void
    debounce?: number
    type?: string
    placeholder?: string
    className?: string
}
) {
    const [value, setValue] = useState(initialValue)
 
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
 
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
 
        return () => clearTimeout(timeout)
    }, [value, debounce, onChange])
 
    return (
        <input
            {...props}
            type={type}
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={e => setValue(e.target.value)} />
    )
}
 
export default DebouncedInput;