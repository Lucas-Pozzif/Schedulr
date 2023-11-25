import "./icon-button.css";

type IconButtonType = {
  title?: string;
  icon?: string;
  hidden?: boolean;
  onClick?: () => void;
};

export function IconButton({ title, icon, hidden = false, onClick }: IconButtonType) {
  return (
    <div className={"icon-button" + (hidden ? " hidden" : "")} onClick={onClick}>
      <img className='icb-icon' src={icon} />
      <p className='icb-title'>{title}</p>
    </div>
  );
}
