import { iconButtonType } from "../button-type";
import './style.css';

export function IconButton2({
    title,
    state,
    icon,
    onClickButton = () => { }
}: iconButtonType) {
    return (
        <div className={`button icon-button-2 ${state}`} onClick={onClickButton}>
            <img src={icon} />
            <p className={`button-text icon-button-2-text ${state}`}>{title}</p>
        </div>
    )
}