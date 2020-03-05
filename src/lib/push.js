import webPush from "web-push";
export const sendPush = (payload, options = {}, user) => {
  payload = JSON.stringify(payload);
  try {
    console.log(user);
    console.log(user.name + " have been notify");
  } catch (err) {
    console.log(err);
  }
  // Pass object into sendNotification
  webPush.sendNotification(user.webpush.subscription, payload, options).catch(err => console.error(err));
};
