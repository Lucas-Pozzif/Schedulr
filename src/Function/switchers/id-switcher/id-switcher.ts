export const idSwitcher = (value: any, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
  if (value?.get("id") === newValue?.get("id")) {
    setter(null);
  } else {
    setter(newValue);
  }
};
