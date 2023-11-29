import { ReturnButton } from "../../component-imports";
import "./header-input.css";

type HeaderInputType = {
  placeholder?: string;
  value?: string;
  subtitle?: string;
  icon?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickReturn?: () => void;
  onClickIcon?: () => void;
};

const arrow = require("../../../Assets/arrow.png");

export function HeaderInput({ placeholder, value, subtitle, icon, maxLength = 126, onChange, onClickReturn = () => {}, onClickIcon }: HeaderInputType) {
  return (
    <div className='header-input'>
      <ReturnButton onClick={onClickReturn} />
      <div className='hi-text-block'>
        <input className='hi-input' maxLength={maxLength} placeholder={placeholder} value={value} onChange={onChange} />
        <p className='hi-subtitle'>{subtitle}</p>
      </div>
      <img className='hi-icon' src={icon} onClick={onClickIcon} />
    </div>
  );
}
