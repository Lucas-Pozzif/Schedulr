import { iconButtonType } from "../button-type";
import './style.css';

export function VerticalIconButton({
    title,
    state,
    icon,
    onClickButton = () => { }
}: iconButtonType) {
    return (
        <button className={`button vertical-icon-button ${state}`} onClick={onClickButton}>
            <img src={icon} />
            <p className={`button-text vertical-icon-button-text ${state}`}>{title}</p>
        </button>
    )
}