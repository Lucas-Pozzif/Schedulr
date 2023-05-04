import { imageButtonType, itemButtonType } from "../button-type";
import { DetailButton2 } from "../detail-button-2/detail-button-2";
import { DetailButton } from "../detail-button/detail-button";
import { ItemButton } from "../item-button/item-button";
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
            <img className="image-button-image" src={image} />
            <ItemButton state={state}
                title={title}
                subtitle={subtitle}
                highlightText={highlightText}
                detailText={detailText}
                detailSubtitleText={detailSubtitleText}
            />
        </div>
    )
}