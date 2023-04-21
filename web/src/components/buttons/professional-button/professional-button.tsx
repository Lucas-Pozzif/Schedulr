import { professionalType } from "../../../controllers/professionalController"

import './professional-button.css'

type serviceButtonType = {
    darkmode?: boolean,
    professional: professionalType,
    rightButtonTitle: string
    onClickButton: () => void,
}

export function ProfessionalButton({ darkmode, professional, rightButtonTitle, onClickButton }: serviceButtonType) {
    const title = professional.name
    const image = professional.photo
    const subtitle = professional.services

    return (
        <>
            <div className={`professional-button${darkmode ? '-selected' : ''}`}>
                <img className={`image${darkmode ? '-selected' : ''}`} src={image} />
                <p className={`title${darkmode ? '-selected' : ''}`}>{title}</p>
                <p className={`subtitle${darkmode ? '-selected' : ''}`}>{subtitle}</p>
                <div className={`right-button${darkmode ? '-selected' : ''}`}>
                    <p className={`right-button-title${darkmode ? '-selected' : ''}`}>{rightButtonTitle}</p>
                </div>

            </div>
        </>
    )
}
