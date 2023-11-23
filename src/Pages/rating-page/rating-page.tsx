import { useState } from "react";
import { Group } from "../../Classes/group";
import { Header } from "../../Components/header/header/header";
import { RatingItem } from "../../Components/rating-item/rating-item";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { RatingForm } from "../../Forms/rating-form/rating-form";

type RatingPageType = {
  group: Group;
};

export function RatingPage({ group }: RatingPageType) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const tabHandler = () => {
    switch (tab) {
      case 0:
        return (
          <div className='rating-page'>
            <Header title={group.getTitle()} onClickReturn={() => {}} />
            <SubHeader
              title={""}
              buttonTitle={"Fazer Avaliação"}
              onClick={() => {
                setTab(1);
              }}
            />
            <div className='rp-list'>
              {group.getRatings().map((rating) => {
                return <RatingItem rating={rating} />;
              })}
            </div>
          </div>
        );
      case 1:
        return <RatingForm />;
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
