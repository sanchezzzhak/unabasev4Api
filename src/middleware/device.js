import deviceDetector from "node-device-detector";
const detectorDevice = new deviceDetector();

export const detector = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const device = detectorDevice.detect(userAgent);
  req.deviceDetected = device;
  next();
};
