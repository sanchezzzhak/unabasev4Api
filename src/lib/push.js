export const sendPush = (payload, user) => {
  payload = JSON.stringify(payload);
  console.log(user.name + " have been notify");
  // Pass object into sendNotification
  webPush.sendNotification(user.webpush.subscription, payload).catch(err => console.error(err));
};
