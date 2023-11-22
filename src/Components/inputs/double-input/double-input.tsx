import "./double-input.css";

type DoubleInputType = {
  input1: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  input2: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export function DoubleInput({ input1, input2 }: DoubleInputType) {
  return (
    <div className='double-input'>
      <input className='di-1' placeholder={input1.placeholder} value={input1.value} onChange={input1.onChange} />
      <input className='di-2' placeholder={input2.placeholder} value={input2.value} onChange={input2.onChange} />
    </div>
  );
}
