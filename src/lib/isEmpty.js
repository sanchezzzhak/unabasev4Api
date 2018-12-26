export const isEmpty = target => {
  if (typeof target !== 'undefined') {
    if (target !== null) {
      return false;
    }
  }
  return true;
};
