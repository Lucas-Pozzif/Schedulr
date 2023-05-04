import { imageButtonType, itemButtonType } from "../button-type";
import { DetailButton2 } from "../detail-button-2/detail-button-2";
import { DetailButton } from "../detail-button/detail-button";
import './style.css';

export function ImageButton({
    image,
    title,
    subtitle,
    highlightText,
    detailText,
    detailSubtitleText,
    state,
    onClickButton = () => { },
    onClickSubtitle = () => { },
    onClickDetailButton = () => { }
}: imageButtonType) {
    const subtitleState = (state == 'active' || state == 'inactive') ? 'selected' : 'active';

    const Subtitle = () => subtitle ? <DetailButton title={subtitle} state={subtitleState} onClickButton={onClickSubtitle} /> : null
    const Detail = () => subtitle ? <DetailButton2 title={detailText} state={subtitleState} onClickButton={onClickDetailButton} /> : null

    return (
        <div className={`button image-button ${state}`} onClick={onClickButton}>
            <div className="flex-div">
                <img src={image} className="image-button-image" />
                <div className="image-button-title-block">
                    <p className={`title-button image-button-title ${state}`}>{title}</p>
                    <Subtitle />
                </div>
            </div>
            <div>
                <div className="flex-div">
                    <p className="image-button-highlight">{highlightText}</p>
                    <Detail />
                </div>
                <p className="image-button-detail-subtitle-text">{detailSubtitleText}</p>
            </div>
        </div>
    )
}