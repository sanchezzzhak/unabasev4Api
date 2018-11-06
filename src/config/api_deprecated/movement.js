export default api => {
  return {
    /**
     *    GET/  list movements
     *    params {
     *      name: string,
     *      description: string,
     *       dates: {
     *         expiration: Date
     *       },
     *      client: {
     *       _id: ObjectId,
     *       name: String
     *      },
     *      client: {
     *       _id: ObjectId,
     *       name: String
     *      },
     *      state: string,
     *      total: {
     *        net: Number,
     *        tax: Number
     *      },
     *      currency: {
     *        name: String,
     *        decimal: String,
     *        throusands: String,
     *        prefix: String,
     *        suffix: String,
     *        precision: Number
     *      },
     *      item: [
     *         {
     *           name: string,
     *           price: number,
     *           tax: number,
     *           itemId: ObjectId
     *          }
     *        ],
     *      createdAt: Date,
     *      updatedAt: Date
     *
     *    }
     *
     */
    /**
     *   POST/  create movement
     *    params {
     *      name: string,
     *      description: string,
     *       dates: {
     *         expiration: Date
     *       },
     *      client: ObjectId, ref: User
     *      client: ObjectId, ref: User
     *      state: string,
     *      total: {
     *        net: Number,
     *        tax: Number
     *      },
     *      currency: ObjectId, ref: currency
     *      item: [
     *         {
     *           name: string,
     *           price: number,
     *           tax: number,
     *           item: ObjectId, ref: Item
     *          }
     *        ],
     *
     *    }
     */
    /**
     *   PUT/  update movement
     *    params {
     *      name: string,
     *      description: string,
     *       dates: {
     *         expiration: Date
     *       },
     *      client: ObjectId, ref: User
     *      client: ObjectId, ref: User
     *      state: string,
     *      total: {
     *        net: Number,
     *        tax: Number
     *      },
     *      currency: ObjectId, ref: currency
     *      item: [
     *         {
     *           name: string,
     *           price: number,
     *           tax: number,
     *           item: ObjectId, ref: Item
     *          }
     *        ],
     *
     *    }
     */
    main: `${api}movements/`,
    /**
     *   GET/
     *   Query  [  query: String ]
     *
     */
    find: `${api}movements/find`
  };
};
