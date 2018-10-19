export default function findInObj(obj, txt) {
  let found = [];
  for (let i in obj) {
    if (obj[i].indexOf(txt) >= 0) {
      found.push(i);
    }
  }
  return found;
}
