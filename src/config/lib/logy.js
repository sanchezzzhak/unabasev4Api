import fs from "fs";
import path from "path";
export default txt => {
  if (process.env.NODE_ENV !== "test") {
    logy(txt);
  }

  const now = new Date();
  logy(__dirname);
  fs.appendFileSync(path.resolve(__dirname, "../../../log.csv"), `ENV: ${process.env.NODE_ENV},${now.toUTCString()},${now.toLocaleDateString()},${txt}\n`);
};
