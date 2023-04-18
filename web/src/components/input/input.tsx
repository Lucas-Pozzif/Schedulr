import React from "react"

type inputType = {
    label?: string,
    placeholder?: string,
    value?: string,
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => any

}

export function Input({ label, placeholder, value, onValueChange }: inputType) {
    return (
        <label>
            {label}
            <input value={value} placeholder={placeholder} onChange={onValueChange}></input>
        </label>
    )
}