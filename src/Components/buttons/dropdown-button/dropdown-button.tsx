import { useState } from "react";
import "./dropdown-button.css";

type DropdownButtonType = {
  title: string;
  dropDownItems: [string, () => void][];
};

export function DropdownButton({ title, dropDownItems }: DropdownButtonType) {
  const [isOpen, setOpen] = useState(false);
  const arrow = require("../../../Assets/arrow.png");

  return (
    <>
      <div className='dropdown-button' onClick={() => setOpen(!isOpen)}>
        <p className='ddb-title'>{title}</p>
        <img className={"ddb-icon sched-arrow" + (isOpen ? " up" : " down")} src={arrow} />
      </div>

      <div className={"ddb-list" + (isOpen ? "" : " hidden")}>
        {dropDownItems.map((item) => {
          return (
            <p onClick={item[1]} className='ddb-item'>
              {item[0]}
            </p>
          );
        })}
      </div>
    </>
  );
}
