import { titleButtonType } from "../button-type";
import './style.css';

export function SmallButton({
    title,
    state,
    onClickButton = () => { }
}: titleButtonType) {
    return (
        <button className={`button small-button ${state}`} onClick={onClickButton}>
            <p className={`button-text small-button-text ${state}`}>{title}</p>
        </button>
    )
}