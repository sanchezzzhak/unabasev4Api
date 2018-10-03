const User = require("../../models/user");

module.exports = {
  logout(req, res) {
    console.log("out");
    req.logout();
    req.session = null;
    res.status(200).send("Log out");
  },
  getUsers(req, res) {
    console.log("req.query");
    console.log(req.query);
    User.paginate({}, { page: 1, limit: 1000 }, (err, users) => {
      if (err) {
      } else {
        const token = req.cookies.access_token;
        // eslint-disable-next-line
        // console.log("token");
        // console.log(token);
        console.log(users);
        res.send(users);
      }
    });
  },
  postUsers(req, res) {
    console.log("req.body post");
    console.log(req.body);
    User.paginate(
      {},
      { page: req.body.page || 1, limit: req.body.limit || 20 },
      (err, users) => {
        if (err) {
          console.log(err);
        } else {
          res.send(users);
        }
      }
    );
  },
  getUser(req, res) {
    User.findOne({ id: req.params.id }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.send(user.getUser());
      }
    });
  },
  updateUser(req, res) {},
  createUser(req, res) {},
  findOne(req, res) {
    let query = {
      $and: []
    };
    Object.keys(req.query).forEach(q => {
      if (q === "email" || q === "name") {
        query.$and.push({
          [`google.${q}`]: { $regex: req.query[q], $options: "i" }
        });
      }
      query.$and.push({ [q]: { $regex: req.query[q], $options: "i" } });
    });

    User.findOne(query, (err, user) => {
      if (err) {
        res.status(500).end();
      } else if (user) {
        res.send(user);
      } else {
        res.status(404).end();
      }
    });
  }
};
