import { filter, search } from "../../../_global";
import { VerticalLine } from "../../component-imports";
import "./home-searchbar.css";

type HomeSearchBarType = {
  placeholder: string;
  value: string;
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
};

export function HomeSearchBar({ placeholder, value, onChange }: HomeSearchBarType) {
  return (
    <div className='home-searchbar'>
      <img className='hs-search-icon' src={search} />
      <input className='hs-input' placeholder={placeholder} value={value} onChange={onChange} />
      <VerticalLine />
      <img className='hs-filter-icon' src={filter} />
    </div>
  );
}
