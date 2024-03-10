import "./small-icon-button.css";

type ButtonType = {
  onClick?: () => void;
  title?: string;
  icon?: string;
};

export function SmallIconButton({ onClick, title, icon }: ButtonType) {
  return (
    <div className='small-icon-button' onClick={onClick}>
      <img className='sib-icon' src={icon} />
      <p className='sib-title'>{title}</p>
    </div>
  );
}
