import { returnButtonType } from "../button-type";
import './style.css'

const designCache = require('../../../cache/designCache.json')

export function ReturnButton({ onClickButton }: returnButtonType) {
    const returnIcon = designCache[0].icons.return
    return (<img className="return-button" src={returnIcon} onClick={onClickButton} />)
}