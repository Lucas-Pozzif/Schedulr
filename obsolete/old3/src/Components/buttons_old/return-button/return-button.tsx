import { returnButtonType } from "../button-type";
import './style.css'

export function ReturnButton({ onClickButton }: returnButtonType) {
    return (<img className="return-button" src={''} onClick={onClickButton} />)
}