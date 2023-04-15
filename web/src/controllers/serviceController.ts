type serviceType = {
    name: string,
    photo: string,
    inicial: boolean,
    value: number | number[],
    duration: boolean[],
    promotion: {
        currentPromotion: string, //promotionId
        promotedUntil: string,
    }
}

export { }