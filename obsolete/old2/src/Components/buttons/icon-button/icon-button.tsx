import { iconButtonType } from "../button-type";
import './style.css';

export function IconButton({
    title,
    state,
    icon,
    onClickButton = () => { }
}: iconButtonType) {
    return (
        <div className={`button icon-button ${state}`} onClick={onClickButton}>
            <p className={`button-text icon-button-text ${state}`}>{title}</p>
            <img className="icon-button-icon" src={icon} />
        </div>
    )
}