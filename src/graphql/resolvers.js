export default {
  Query: {
    taxs: async (parent, args, { Tax }, info) => {
      const taxs = await Tax.find({});
      taxs.map(t => {
        t._id = t._id.toString();
        return t;
      });
    }
  },
  Mutation: {
    tax: async (parent, args, { Tax }, info) => {
      const tax = await new Tax(args).save();
      tax._id = tax._id.toString();
      return taxs;
    }
  }
};
