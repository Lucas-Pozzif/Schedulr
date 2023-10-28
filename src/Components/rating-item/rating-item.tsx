import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../Services/firebase/firebase";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../loading/loading-screen/loading-screen";

type RatingItemType = {
  rating: {
    userId: string;
    message: string;
    rate: number;
  };
};

export function RatingItem({ rating }: RatingItemType) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());

  useEffect(() => {
    setLoading(true);
    user.getUser(rating.userId).then(() => {
      setUser(new User(user));
      setLoading(false);
    });
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='rating-item'>
      <img className='ri-photo' src={user.getPhoto()} />
      <div className='ri-block'>
        <div className='rib-title-block'>
          <p className='rib-title'>{user.getName()}</p>
          {Array.from({ length: rating.rate }, (_, index) => {
            return <img className='rib-star' src='' />;
          })}
        </div>
        <p className='rib-message'>{rating.message}</p>
        <img className='ri-like-button' src={""} />
      </div>
    </div>
  );
}
