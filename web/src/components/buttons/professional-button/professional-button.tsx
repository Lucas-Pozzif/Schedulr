import { professionalType } from "../../../controllers/professionalController"
import { isSelected } from "../../../functions/is-selected/is-selected"

import './professional-button.css'

const occupationCache = require('../../../cache/occupationCache.json')

type serviceButtonType = {
    selected?: boolean,
    professional: professionalType,
    rightButtonTitle: string
    onClickButton: () => void,
}

export function ProfessionalButton({
    selected = false,
    professional,
    rightButtonTitle,
    onClickButton
}: serviceButtonType) {
    const title = professional.name
    const image = professional.photo 
    const subtitle = professional.occupations.map(occupationId => occupationCache[occupationId].name)

    return (
        <div className={`professional-button button ${isSelected(selected)}`} onClick={onClickButton}>
            <div className="pb-left-block">
                <img className={`pb-image button ${isSelected(!selected)}`} src={image}></img>
                <div className={`pb-title-block`}>
                    <p className={`pb-title button-text ${isSelected(selected)}`}>{title}</p>
                    <p className={`pb-subtitle button button-text ${isSelected(!selected)}`}>{subtitle}</p>
                </div>

            </div>
            <p className={`pb-right-button-title button button-text ${isSelected(!selected)}`}>{rightButtonTitle}</p>
        </div >
    )
}
