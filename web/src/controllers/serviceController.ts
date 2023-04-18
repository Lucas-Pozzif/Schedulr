export type serviceType = {
    name: string,
    stateNames: string[],
    stateValues: number[],
    haveStates: boolean,
    photo: string | null,
    inicial: boolean,
    value: number,
    duration: boolean[],
    promotion: {
        currentPromotion: null | string, //promotionId
        promotedUntil: null | string,
    }
}


export { }