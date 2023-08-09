import { titleButtonType } from "../button-type";
import './style.css';

export function DetailButton({
    title,
    state,
    onClickButton = () => { }
}: titleButtonType) {
    return (
        <div className={`button detail-button ${state}`} onClick={onClickButton}>
            <p className={`button-text detail-button-text ${state}`}>{title}</p>
        </div>
    )
}