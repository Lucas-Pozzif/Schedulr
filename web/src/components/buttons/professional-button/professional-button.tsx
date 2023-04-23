import { professionalType } from "../../../controllers/professionalController"

import './professional-button.css'

type serviceButtonType = {
    selected?: boolean,
    professional: professionalType,
    rightButtonTitle: string
    onClickButton: () => void,
}

export function ProfessionalButton({ selected, professional, rightButtonTitle, onClickButton }: serviceButtonType) {
    const title = professional.name
    const image = professional.photo
    const subtitle = professional.services

    return (
        <>
            <div className={`professional-button${selected ? '-selected' : ''}`}>
                <img className={`image${selected ? '-selected' : ''}`} src={image} />
                <p className={`title${selected ? '-selected' : ''}`}>{title}</p>
                <p className={`subtitle${selected ? '-selected' : ''}`}>{subtitle}</p>
                <div className={`right-button${selected ? '-selected' : ''}`}>
                    <p className={`right-button-title${selected ? '-selected' : ''}`}>{rightButtonTitle}</p>
                </div>

            </div>
        </>
    )
}
