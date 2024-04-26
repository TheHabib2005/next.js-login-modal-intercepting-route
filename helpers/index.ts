export const delay = (time: number) => {
  return new Promise((resolve, rejects) => {
    setTimeout(resolve, time);
  });
};
