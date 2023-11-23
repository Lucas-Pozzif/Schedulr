import "./icon-input.css";

type IconInputType = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
};

export function IconInput({ placeholder, value, onChange, icon }: IconInputType) {
  return (
    <div className='icon-input'>
      <img className='ii-icon' src={icon} />
      <input className='ii-input' value={value} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}
