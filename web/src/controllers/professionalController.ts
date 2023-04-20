
export type professionalType = {
    name: string,
    email: string,
    photo: string,
    schedule: string,
    occupations: string[],
    services: string[],
    disponibility: {
        0: boolean[],
        1: boolean[],
        2: boolean[],
        3: boolean[],
        4: boolean[],
        5: boolean[],
        6: boolean[],
    },
    lastOnline: string
}

export { }
