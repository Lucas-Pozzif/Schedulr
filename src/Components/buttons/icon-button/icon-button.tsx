import "./icon-button.css";

type IconButtonType = {
  title?: string;
  icon?: string;
  onClick?: () => void;
};

export function IconButton({ title, icon, onClick }: IconButtonType) {
  return (
    <div className='icon-button' onClick={onClick}>
      <img className='icb-icon' src={icon} />
      <p className='icb-title'>{title}</p>
    </div>
  );
}
