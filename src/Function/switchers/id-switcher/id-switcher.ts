export const idSwitcher = (value: any, newValue: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
    if (value?.getId() === newValue?.getId()) {
        setter(null);
    } else {
        setter(newValue);
    }
};
