export const stateSwitcher = (value: any, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
  if (value === newValue) {
    setter(null);
  } else {
    setter(newValue);
  }
};
