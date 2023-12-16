import { useState } from "react";
import "../schedule-page.css";
import { Professional, User } from "../../../Classes/classes-imports";

export function ProfessionalSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [user, setUser] = useState(new User());
  const [professional, SetProfessional] = useState(new Professional());

  const tabHandler = () => {
    switch (tab) {
      case -1:
        return <div></div>;

      case 0: //Simple schedule tab
        return <div ></div>;
      default:
        break;
    }
  };
}
