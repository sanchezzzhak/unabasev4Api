export default txt => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(txt);
  }
};
