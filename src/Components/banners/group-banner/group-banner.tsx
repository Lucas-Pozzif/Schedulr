import { useNavigate } from "react-router-dom";
import "./group-banner.css";

type GroupBannerType = {
  placeholder?: string;
  banner?: string;
  profile?: string;
  returnButton?: boolean;
  onClickBanner?: () => void;
  onClickProfile?: () => void;
  onClickReturn?: () => void;
};

const addImage = require("../../../Assets/add-image.png");
const arrow = require("../../../Assets/arrow.png");

export function GroupBanner({ banner, profile, onClickProfile, onClickBanner, onClickReturn, returnButton, placeholder = addImage }: GroupBannerType) {
  const navigate = useNavigate();
  return (
    <div className='group-banner'>
      <img className={`group-banner-${banner ? "image" : "placeholder"}`} src={banner ? banner : placeholder} onClick={onClickBanner} />
      <div className='gp-blur' onClick={onClickBanner} />
      <div className='gp-profile' onClick={onClickProfile}>
        <img className={`gp-profile-${profile ? "image" : "placeholder"}`} src={profile ? profile : addImage} />
      </div>
      <img
        className={`return-button gp-return ${returnButton ? "" : "hidden"}`}
        src={arrow}
        onClick={() => {
          onClickReturn ? onClickReturn() : navigate(-1);
        }}
      />
    </div>
  );
}
