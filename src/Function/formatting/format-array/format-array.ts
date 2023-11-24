export function formatArray(arr: string[]) {
  const length = arr.length;

  return length === 0 ? "Não há ocupações" : length === 1 ? arr[0] : length === 2 ? `${arr[0]} & ${arr[1]}` : `${arr[0]}, ${arr[1]} & ${length - 2} mais`;
}
