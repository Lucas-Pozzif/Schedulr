import { titleButtonType } from "../button-type";
import './style.css';

export function DetailButton2({
    title,
    state,
    onClickButton = () => { }
}: titleButtonType) {
    return (
        <div className={`button detail-button-2 ${state}`} onClick={onClickButton}>
            <p className={`button-text detail-button-2-text ${state}`}>{title}</p>
        </div>
    )
}