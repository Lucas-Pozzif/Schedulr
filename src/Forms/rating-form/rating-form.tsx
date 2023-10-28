import { Header } from "../../Components/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";

import "./rating-form.css";

export function RatingForm() {
  return (
    <div className='rating-form'>
      <Header title={"Fazer Avaliação"} onClickReturn={() => {}} />
      <SubHeader title={""} buttonTitle={""} onClick={() => {}} />
      <textarea className='rf-textarea' placeholder='Digite sua avaliação' onChange={() => {}} />
    </div>
  );
}
