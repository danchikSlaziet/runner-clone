export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomArrayElement = <T = []>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
