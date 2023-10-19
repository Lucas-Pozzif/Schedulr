import "./double-button.css";

type DoubleButtonType = {
  title: string[];
  onClick: [() => void, () => void];
  hide: boolean[];
};

export function DoubleButton({ title, onClick, hide }: DoubleButtonType) {
  return (
    <div className='double-button-div'>
      <p className={"double-button" + (hide[0] ? " hidden" : "")} onClick={onClick[0]}>
        {title[0]}
      </p>
      <p className={"double-button" + (hide[1] ? " hidden" : "")} onClick={onClick[1]}>
        {title[1]}
      </p>
    </div>
  );
}
