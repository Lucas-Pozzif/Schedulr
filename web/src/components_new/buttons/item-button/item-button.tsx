import { itemButtonType } from "../button-type";
import { DetailButton2 } from "../detail-button-2/detail-button-2";
import { DetailButton } from "../detail-button/detail-button";
import './style.css';

export function ItemButton({
    title,
    subtitle,
    highlightText,
    detailText,
    detailSubtitleText,
    state,
    onClickButton = () => { },
    onClickSubtitle = () => { },
    onClickDetailButton = () => { }
}: itemButtonType) {
    const subtitleState = (state == 'active' || state == 'inactive') ? 'selected' : 'active';

    const Subtitle = () => subtitle ? <DetailButton title={subtitle} state={subtitleState} onClickButton={onClickSubtitle} /> : null
    const Detail = () => subtitle ? <DetailButton2 title={detailText} state={subtitleState} onClickButton={onClickDetailButton} /> : null

    return (
        <div className={`button item-button ${state}`} onClick={onClickButton}>
            <div className="item-button-title-block">
                <p className={`title-button item-button-title ${state}`}>{title}</p>
                <Subtitle />
            </div>
            <div>
                <div className="flex-div">
                    <p className="item-button-highlight">{highlightText}</p>
                    <Detail />
                </div>
                <p className="item-button-detail-subtitle-text">{detailSubtitleText}</p>
            </div>
        </div>
    )
}