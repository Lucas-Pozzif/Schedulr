import './style.css'

type inputType = {
    label?: string,
    placeholder?: string,
    value?: string,
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => any

}

export function Input({ label, placeholder, value, onValueChange }: inputType) {
    return (
        <div className="input-component">
            <label htmlFor={label} className="label">{label}</label>
            <input id={label} className="input" value={value} placeholder={placeholder} onChange={onValueChange}></input>
        </div>
    )
}