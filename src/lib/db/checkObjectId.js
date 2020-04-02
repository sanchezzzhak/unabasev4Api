import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default id => ObjectId.isValid(id) && ObjectId(id) == id;
