import deviceDetector from "node-device-detector";

export const detector = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const detector = new deviceDetector();
  const device = detector.detect(userAgent);
  req.deviceDetected = device;
  next();
};
