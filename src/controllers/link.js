import Link from "../models/link";
import Relation from "../models/relation";
import Notification from '../models/notification'
import User from '../models/user'
import {
  queryHelper
} from "../lib/queryHelper";
import {
  createError
} from "../lib/error";
import {
  sendPush
} from "../lib/push";
import {
  upload
} from "../lib/filesUpload";



export const create = async (req, res, next) => {
  // let exists = await Link.findOne({ url: req.body.url }, { id: 1 }).lean();
  // if (exists) next(createError(409, "Link already exists"));
  let link = new Link({
    ...req.body,
    user: req.user._id.toString()
  });
  try {
    await link.save();
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const get = async (req, res, next) => {
  let helper = queryHelper(req.query, {});
  try {
    let links = await Link.paginate(helper.query, helper.options).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};
export const getByMember = async (req, res, next) => {
  let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections main";

  try {
    let links = await Link.paginate(
      // get member with main true
      {
        members: {
          $elemMatch: {
            $and: [{
              user: req.params.member
            }, {
              main: false
            }]
          }
        }
      }, {
        populate: [{
          path: "user",
          select
        }, {
          path: "members.user",
          select
        }, {
          path: "members.positions"
        }, {
          path: "contact"
        }],
        sort: "-createdAt"
      }
    ).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};

export const getByUser = async (req, res, next) => {
  let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections";
  try {
    let links = await Link.paginate({
      $or: [{
        user: req.params.user
      }, {
        members: {
          $elemMatch: {
            user: req.params.user
          }
        }
      }],
      members: {
        $elemMatch: {
          user: req.params.user,
          main: true
        }
      }
    }, {
      populate: [{
        path: "user",
        select
      }, {
        path: "members.user",
        select
      }, {
        path: "members.positions"
      }, {
        path: "contact"
      }],
      sort: "-createdAt"
    }).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};
export const getOne = async (req, res, next) => {
  let select = "username name imgUrl google.imgUrl emails phones address otherAccounts sections";
  let link;
  try {
    link = await Link.findById(req.params.id)
      .populate([{
          path: "members.user",
          select,
          populate: [{
            path: "sections",
            select: "name isActive"
          }]
        },
        {
          path: "members.positions",
          select
        },
        {
          path: "user",
          select: 'name imgUrl'
        }
      ])
      .lean();
    if (!link) next(createError(404, req.lg.document.notFound));
    else {
      for await (let member of link.members) {
        let relation = await Relation.findOne({
          $or: [{
              petitioner: member.user._id,
              receptor: req.user._id
            },
            {
              petitioner: req.user._id,
              receptor: member.user._id
            }
          ],
          isActive: true
        }, {
          isActive: true
        }).lean();
        let index = link.members.findIndex(m => m.user._id === member.user._id);
        link.members[index].relation = relation;
      }
      res.send(link);
    }
  } catch (err) {
    next(err);
  }
};



// =========================
// GET LINK BY URL
// =========================
export const getOneByUrl = async (req, res, next) => {
  let link;
  try {
    link = await Link.find({
      url: req.query.url
    }).select(['name', 'url', 'type'])
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const getRelated = async (req, res, next) => {
  try {
    let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections username";
    // let relations = await Relation.find({ $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: true }, { petitioner: 1, receptor: 1 }).lean();
    // let users = relations.map(relation => (relation.petitioner === req.user.id ? relation.receptor : relation.petitioner));

    let limit = req.query.limit || 15
    let page = req.query.page || 1

    let links = await Link.paginate({}, {
      populate: [{
          path: "members.user",
          select
        },
        {
          path: "members.positions"
        }, {
          path: "user",
          select,
          populate: [{
            path: "sections"
          }]
        }
      ],
      limit,
      page,
      sort: {
        createdAt: -1
      }
    }).then({});
    //{ $or: [{ "members.user": { $in: users } }, { user: { $in: users } }], user: { $ne: req.user._id } }
    // .sort({ createdAt: -1 })
    // .populate([{ path: "members.user", select }, { path: "members.positions" }, { path: "user", select, populate: [{ path: "sections" }] }])
    // .lean();
    res.send(links);
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req, res, next) => {
  try {
    await Link.findByIdAndDelete(req.params.id).exec();
    res.send({
      success: true
    });
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    let link = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).lean();
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const setMain = async (req, res, next) => {
  try {
    let link = await Link.findOneAndUpdate({
      _id: req.body.id,
      "members.user": req.user._id
    }, {
      $set: {
        "members.$.main": req.body.main
      }
    }, {
      new: true
    }).lean();
    res.send(link);
  } catch (err) {
    next(err);
  }
};
export const addMember = async (req, res, next) => {
  try {
    let link = await Link.findById(req.params.id).select("members").exec();
    let member = link.members.find(member => member.user === req.body.user);
    if (member) {
      link = await Link.findOneAndUpdate({
        _id: req.params.id,
        "members.user": member.user
      }, {
        $set: {
          "members.$.positions": req.body.positions
        }
      }, {
        new: true
      }).exec();
    } else {
      link.members.push({
        user: req.body.user,
        positions: req.body.positions,
        main: req.body.main
      });
      await link.save();
    }

    
     if (req.body.user._id != req.user._id) {
       // ENVIAR NOTIFICACION PUSH ( CUANDO ETIQUETAN A UN USER)
      let userToPushNotification = await User.findById(req.body.user._id).select("name webpush").lean();

      let notification = new Notification({
        title: `${req.user.name} te ha etiquetado como`,
        user: req.body.user._id.toString(),
        link: '',
        from: {
          user: req.user._id.toString()
        },
        proyect: req.body.proyect._id
      });
      await notification.save();
      sendPush({
          body: `${req.user.name} te ha etiquetado como colaborador`,
          link: ''
        },
        userToPushNotification
      );
    }else{
      // ENVIAR NOTIFICACION PUSH ( AL DUEÑO DE PROYECTO, CUANDO AGREGO MI PARTICIPACIÓN )
      let userToPushNotification = await User.findById(req.body.proyect.user._id).select("name webpush").lean();

      let notification = new Notification({
        title: `${req.user.name.first} se agrego como participante en tu proyecto`,
        user: req.body.proyect.user._id.toString(),
        link: '',
        from: {
          user: req.user._id.toString()
        },
        proyect: req.body.proyect._id
      });
      await notification.save();
      sendPush({
          body: `${req.user.name.first} se agrego como participante en tu proyecto`,
          link: ''
        },
        userToPushNotification
      );
    }

    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    let link = await Link.findOneAndUpdate({
      _id: req.params.id
    }, {
      $pull: {
        members: {
          user: req.body.user
        }
      }
    }, {
      new: true
    }).exec();
    res.send(link);
  } catch (err) {
    next(err);
  }
};


export const shareWithUser = async (req, res, next) => {
  try {
    // ENVIAR NOTIFICACION PUSH
    let title = `${req.user.name} te invito a ver un proyecto.`;
    let notification_title = `${req.user.name} te invita a ver`;
    let userToPushNotification = await User.findById(req.body.user).select("name webpush").lean();

    let notification = new Notification({
      title: notification_title,
      user: req.body.user.toString(),
      link: '',
      from: {
        user: req.user._id.toString()
      },
      proyect: req.params.id
    });
    let notif = await notification.save();

    console.log(userToPushNotification);

    sendPush({
      body: title,
      link: ''
    }, userToPushNotification);

    res.send(notif);

  } catch (err) {
    next(err);
  }
};

export const find = async (req, res, next) => {
  let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections main";

  let query = {
    $or: [{
        description: {
          $regex: req.params.q,
          $options: "i"
        }
      },
      {
        name: {
          $regex: req.params.q,
          $options: "i"
        }
      }
    ]
  };

  try {
    let links = await Link.paginate(query, {
      populate: [{
        path: "user",
        select
      }, {
        path: "members.user",
        select
      }, {
        path: "members.positions"
      }, {
        path: "contact"
      }],
      sort: "-createdAt"
    }).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};


export const uploadProyectFile = async (req, res, next) => {
  console.log(req.file)
  try {
    let lastIndex = req.file.originalname.lastIndexOf(".");
    let name = req.file.originalname.slice(0, lastIndex);
    let ext = req.file.originalname.slice(lastIndex + 1);
    let fileType = req.file.mimetype.split('/')[0];

    let resp = await upload({
      filename: `users/${req.user._id}/files/${name}.${ext}`,
      buffer: req.file.buffer
    });


    res.send({
      name: name,
      fileType: fileType,
      location: resp.Location,
      Etag: resp.Etag
    });

  } catch (err) {
    next(err);
  }
};