import "./icon-button.css";

type ButtonType = {
  onClick?: () => void;
  title?: string;
  icon?: string;
};

export function IconButton({ onClick, title, icon }: ButtonType) {
  return (
    <div className='icon-button' onClick={onClick}>
      <img className='ib-icon' src={icon} />
      <p className='ib-title'>{title}</p>
    </div>
  );
}
