export type headerType = {
    title: string,
    subtitle: string,
    buttonTitle?: string,

    onClickButton?: () => void,
    onClickReturn?: () => void
}
export type loginHeaderType = {
    title: string,
    subtitle: string,
}