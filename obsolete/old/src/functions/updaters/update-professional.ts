import { professionalType } from "../../controllers/professionalController"

function updateProfessional(
    professional: professionalType,
    setProfessional: (professional: professionalType) => void,
    attribute:
        | 'name'
        | 'email'
        | 'photo'
        | 'schedule'
        | 'occupations'
        | 'services'
        | 'disponibility'
        | 'lastOnline',
    newValue: any
) {
    const professionalAttributes = {
        name: 'name',
        email: 'email',
        photo: 'photo',
        schedule: 'schedule',
        occupations: 'occupations',
        services: 'services',
        disponibility: 'disponibility',
        lastOnline: 'lastOnline'
    }
    setProfessional({
        ...professional,
        [professionalAttributes[attribute]]: newValue
    })
}

export default updateProfessional