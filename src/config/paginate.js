import mongoosePaginate from "mongoose-paginate";

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 5
};

export default {
  mongoosePaginate
};
