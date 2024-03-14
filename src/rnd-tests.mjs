const calculateSum = (...numbers) => {
  console.log('input values: ', numbers);  //-> input values:  [1, 2, 3, 4, 5] (array)
  return numbers.reduce((acc, number) => acc + number, 0);
}
calculateSum(1, 2, 3, 4, 5); // 15

const originalArray = [1, 2, 3];
const newArray = [...originalArray, 4, 5];
console.log(newArray); // [1, 2, 3, 4, 5]

export {calculateSum, originalArray, newArray};
