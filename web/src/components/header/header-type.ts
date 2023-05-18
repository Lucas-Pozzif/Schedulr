export type headerType = {
    title: string,
    subtitle: string,
    buttonTitle?: string,
    state?: "active" | "selected" | "inactive",

    onClickButton?: () => void,
    onClickReturn?: () => void
}