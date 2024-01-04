import "./block-input.css";

type BlockInputType = {
  placeholder?: string;
  value?: string;
  label?: string;
  type?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function BlockInput({ placeholder, value, label, type, maxLength = 126, onChange }: BlockInputType) {
  return (
    <form className='block-input' onSubmit={(e) => e.preventDefault()}>
      <label className='bi-label'>{label}</label>
      <input className='bi-input' type={type} maxLength={maxLength} placeholder={placeholder} value={value} onChange={onChange}></input>
    </form>
  );
}
