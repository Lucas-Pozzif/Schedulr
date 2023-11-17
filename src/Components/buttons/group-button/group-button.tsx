import { useEffect, useState } from "react";
import { Group } from "../../../Classes/group";
import { Line } from "../../line/line";

import "./group-button.css";

type groupButtonType = {
  group: Group;
  onClick: () => void;
};

export function GroupButton({ group, onClick }: groupButtonType) {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const timeArray = [];
  var time = "Fechado";

  const star = require("../../../Assets/star.png");
  const starEmpty = require("../../../Assets/star-empty.png");
  const triangle = require("../../../Assets/triangle.png");

  for (let i = 0; i <= 24; i++) {
    timeArray.push(`${i}:00`, `${i}:30`);
  }
  if (group.getHours()[selectedDay].indexOf(true) !== -1) {
    time = `${timeArray[group.getStartHours()[selectedDay]]} - ${timeArray[group.getStartHours()[selectedDay] + group.getHours()[selectedDay].length]}`;
  }
  var ratingSum = 0;
  group.getRatings().map((rating) => {
    ratingSum += rating.rate;
  });
  const averageRating = (ratingSum + 5) / group.getRatings.length;

  return (
    <div className='group-button' onClick={onClick}>
      <img className='gb-banner' src={group.getBanner()} />
      <p className='gb-title'>{group.getTitle()}</p>
      <div style={{ paddingInline: "3px" }}>
        <Line />
      </div>
      <div className='gb-day-selector'>
        <img
          className='gbds left'
          src={triangle}
          onClick={() => {
            if (selectedDay > 0) {
              setSelectedDay(selectedDay - 1);
            } else {
              setSelectedDay(6);
            }
          }}
        />
        <p className='gb-day'>{days[selectedDay]}</p>
        <img
          className='gbds right'
          src={triangle}
          onClick={() => {
            if (selectedDay < 6) {
              setSelectedDay(selectedDay + 1);
            } else {
              setSelectedDay(0);
            }
          }}
        />
      </div>
      <div className='gb-bottom'>
        <p className='gb-time'>{time}</p>
        <div className='gb-rating-block'>
          <img className='gb-star' src={Math.floor(averageRating) > 0 ? star : starEmpty} />
          <img className='gb-star' src={Math.floor(averageRating) > 1 ? star : starEmpty} />
          <img className='gb-star' src={Math.floor(averageRating) > 2 ? star : starEmpty} />
          <img className='gb-star' src={Math.floor(averageRating) > 3 ? star : starEmpty} />
          <img className='gb-star' src={Math.floor(averageRating) > 4 ? star : starEmpty} />
        </div>
      </div>
      <img className='gb-profile' src={group.getProfile()} />
    </div>
  );
}
