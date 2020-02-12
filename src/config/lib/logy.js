import fs from "fs";
import path from "path";
export default txt => {
  if (process.env.NODE_ENV !== "test") {
    console.log(txt);
  }

  const now = new Date();
  console.log(__dirname);
  fs.appendFileSync(path.resolve(__dirname, "../../../log.csv"), `${now.toUTCString()},${now.toLocaleDateString()},${txt}\n`);
};
