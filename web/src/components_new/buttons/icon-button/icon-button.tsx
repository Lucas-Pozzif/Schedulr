import { iconButtonType } from "../button-type";
import './style.css';

export function IconButton({
    title,
    state,
    icon,
    onClickButton = () => { }
}: iconButtonType) {
    return (
        <button className={`button icon-button ${state}`} onClick={onClickButton}>
            <img src={icon} />
            <p className={`button-text icon-button-text ${state}`}>{title}</p>
        </button>
    )
}