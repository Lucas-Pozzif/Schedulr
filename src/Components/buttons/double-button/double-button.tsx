import "./double-button.css";

type DoubleButtonType = {
  title?: string[];
  onClick?: [() => void, () => void];
  hidden?: boolean[];
};

export function DoubleButton({ title, onClick, hidden }: DoubleButtonType) {
  return (
    <div className='double-button-div'>
      <p className={"double-button" + (hidden?.[0] ? " hidden" : "")} onClick={onClick?.[0]}>
        {title?.[0]}
      </p>
      <p className={"double-button" + (hidden?.[1] ? " hidden" : "")} onClick={onClick?.[1]}>
        {title?.[1]}
      </p>
    </div>
  );
}
