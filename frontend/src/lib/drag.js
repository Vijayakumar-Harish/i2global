export function moveArrayItem(arr, from, to) {
  const item = arr[from];
  const newArr = arr.filter((_, i) => i !== from);
  newArr.splice(to, 0, item);
  return newArr;
}
