
import './return-button.css'

const designCache = require('../../../cache/designCache.json')

type returnButtonType = {
    onClickButton: () => void
}

export function ReturnButton({ onClickButton }: returnButtonType) {
    const returnIcon = designCache[0].icons.return
    return (
        <img className="return-button" src={returnIcon} onClick={onClickButton} />
    )
}