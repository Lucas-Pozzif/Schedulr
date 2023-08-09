import { serviceType } from "../../controllers/serviceController"

function updateService(
    service: serviceType,
    setService: (service: serviceType) => void,
    attribute:
        | 'name'
        | 'stateNames'
        | 'stateValues'
        | 'haveStates'
        | 'photo'
        | 'inicial'
        | 'value'
        | 'duration'
        | 'currentPromotion'
        | 'promotedUntil',
    newValue: any
) {
    const serviceAttributes = {
        name: 'name',
        stateNames: 'stateNames',
        stateValues: 'stateValues',
        haveStates: 'haveStates',
        photo: 'photo',
        inicial: 'inicial',
        value: 'value',
        duration: 'duration',
        currentPromotion: 'promotion.currentPromotion',
        promotedUntil: 'promotion.promotedUntil'
    }
    setService({
        ...service,
        [serviceAttributes[attribute]]: newValue
    })
}

export default updateService