import "./header.css";
type headerType = {
  title: string;
  icon?: string;
  onClickReturn?: () => void;
  onClickIcon?: () => void;
};

export function Header({ title, icon = "", onClickReturn, onClickIcon }: headerType) {
  const arrow = require("../../../Assets/arrow.png");
  const rectangle = require("../../../Assets/rectangle.png");

  return (
    <div className='header'>
      <img className='return-button' src={arrow} onClick={onClickReturn} />
      <p className='gf-header-title'>{title}</p>
      <img className='header-icon' src={icon === "" ? rectangle : icon} onClick={onClickIcon} />
    </div>
  );
}
