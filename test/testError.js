export const testError = err => {
  if (err) {
    console.log("--------------------------------------------");
    console.log(err.response.status);
    console.log(err.response.statusText);
    console.log(err.response.data);
  }
};
