import webPush from "web-push";
export const sendPush = async (payload, user) => {
  payload = JSON.stringify(payload);
  try {
    console.log(user);
    console.log(user.name + " have been notify");
  } catch (err) {
    console.log(err);
  }
  if (user.webpush?.devices) {
    // Pass object into sendNotification
    for await (let data of user.webpush.devices) {
      webPush.sendNotification(data.subscription, payload).catch(err => console.error(err));
    }
    // webPush.sendNotification(user.webpush.subscription, payload).catch(err => console.error(err));
  }
};
