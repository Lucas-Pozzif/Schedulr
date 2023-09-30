import { professionalType } from "../../../../controllers/professionalController"
import { ImageButton } from "../image-button"

const occupationCache = require('../../../../cache/occupationCache.json')

type professionalButtonType = {
    state: 'active' | 'inactive' | 'selected',
    professional: professionalType,
    detailText: string,

    onClickButton?: () => void,
    onClickDetailButton?: () => void
}
export function ProfessionalButton({ state, professional, detailText, onClickButton = () => { }, onClickDetailButton = () => { } }: professionalButtonType) {

    const subtitle = professional.occupations.map(occupationId => occupationCache[occupationId]?.name)

    return (
        <ImageButton
            state={state}
            image={professional.photo}
            title={professional.name}
            subtitle={subtitle.join(', ')}
            detailText={detailText}
            onClickButton={onClickButton}
            onClickDetailButton={onClickDetailButton}
        />
    )

}