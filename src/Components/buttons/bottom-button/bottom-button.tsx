import './bottom-button.css'

type bottomButtonType = {
    hide: boolean;
    title: string;
    onClick?: () => void
}

export function BottomButton({ hide, title, onClick }: bottomButtonType) {
    return (
        <p className={"bottom-button" + (hide ? " hidden" : "")} onClick={onClick}>{title}</p>
    )
}