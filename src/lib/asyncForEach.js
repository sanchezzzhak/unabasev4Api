export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.legth; index++) {
    await callback(array[index], index, array);
  }
};
