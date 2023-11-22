import "./group-banner.css";

type GroupBannerType = {
  placeholder?: string;
  banner?: string;
  onClick?: () => void;
};

const addImage = require("../../../Assets/add-image.png");

export function GroupBanner({ banner, onClick, placeholder = addImage }: GroupBannerType) {
  return (
    <div className='group-banner' onClick={onClick}>
      <img className={`group-banner-${banner ? "image" : "placeholder"}`} src={banner ? banner : placeholder} />
    </div>
  );
}
