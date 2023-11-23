import "./user-header.css";

type UserHeaderType = {
  image?: string;
  title?: string;
  placeholder?: string;
  subtitle?: string;
  titleIcon?: string;
  editing?: boolean;
  onClickIcon?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickReturn?: () => void;
  onClickImage?: () => void;
};

const arrow = require("../../../Assets/arrow.png");

export function UserHeader({ image, title, editing, placeholder, subtitle, titleIcon, onClickIcon, onChange, onClickReturn, onClickImage }: UserHeaderType) {
  return (
    <div className='user-header'>
      <img className='uh-image' src={image} onClick={onClickImage} />
      <div className='uh-title-block'>
        {editing ? <input className='uh-title-input' placeholder={placeholder} onChange={onChange} /> : <p className='uh-title'>{title}</p>}
        <img className='uh-icon' src={titleIcon} onClick={onClickIcon} />
      </div>
      <p className='uh-subtitle'>{subtitle}</p>
      <img className='return-button uh-return' src={arrow} onClick={onClickReturn} />
    </div>
  );
}
