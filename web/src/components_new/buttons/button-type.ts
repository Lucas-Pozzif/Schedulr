export type titleButtonType = {
    state: 'active' | 'inactive' | 'selected',
    title: string,

    onClickButton?: () => void
}
export type iconButtonType = {
    state: 'active' | 'inactive' | 'selected',
    title: string,
    icon: string

    onClickButton?: () => void
}
export type itemButtonType = {
    state: 'active' | 'inactive' | 'selected',
    title: string,
    subtitle?: string,
    highlightText?: string,
    detailText: string
    detailSubtitleText?: string,

    onClickButton?: () => void,
    onClickSubtitle?: () => void,
    onClickDetailButton?: () => void,
}

export type imageButtonType = {
    state: 'active' | 'inactive' | 'selected',
    image: string,
    title: string,
    subtitle?: string,
    highlightText?: string,
    detailText: string
    detailSubtitleText?: string,

    onClickButton?: () => void,
    onClickSubtitle?: () => void,
    onClickDetailButton?: () => void,
}