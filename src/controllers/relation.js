import Relation from "../models/relation";
import { queryHelper } from "../lib/queryHelper";
import { sendPush } from "../lib/push";
import Notification from "../models/notification";
import User from "../models/user";
import { createError } from "../lib/error";

export const create = async (req, res, next) => {
    let exists = await Relation.findOne(
        {
            $or: [
                {
                    petitioner: req.user.id,
                    receptor: req.body.receptor
                },
                {
                    receptor: req.user.id,
                    petitioner: req.body.receptor
                }
            ]
        },
        { id: 1 }
    ).lean();
    if (exists) next(createError(409, "Relations already exists"));
    console.log(req.user);
    let relation = new Relation({
        petitioner: req.user.id,
        receptor: req.body.receptor
    });
    try {
        await relation.save();
        let user = await User.findById(req.body.receptor).select("name webpush").lean();
        let link = ``;
        let title = `${req.user.name.first} quiere conectar contigo.`;
        sendPush(
            {
                body: title,
                link
            },
            user
        );
        res.send(relation);
    } catch (err) {
        next(err);
    }
};
export const stateChange = async (req, res, next) => {
    try {
        let relation = await Relation.findOneAndUpdate({ receptor: req.user.id, petitioner: req.body.petitioner }, { isActive: req.body.isActive }, { new: true }).lean();
        let petitioner = await User.findById(req.body.petitioner).select("name webpush").lean();
        User.updateRelationsCount(req.body.petitioner);
        User.updateRelationsCount(req.user._id.toString());


        let title = `${req.user.name.first} ${req.user.name.second || ""} ha ${req.body.isActive ? "aceptado" : "rechazado"} tu solicitud de conexión`;
        sendPush(
            {
                body: title,
                link: ""
            },
            petitioner
        );
        res.send(relation);
    } catch (err) {
        next(err);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        await Relation.findByIdAndDelete(req.params.id).exec();
        User.updateRelationsCount(req.user._id.toString());
        res.send({ success: true });
    } catch (err) {
        next(err);
    }
};
export const disconnect = async (req, res, next) => {
    try {
        let result = await Relation.findOneAndDelete({
            $or: [
                { petitioner: req.user.id, receptor: req.params.user },
                { petitioner: req.params.user, receptor: req.user.id }
            ]
        }).exec();

        User.updateRelationsCount(req.params.user);
        User.updateRelationsCount(req.user._id.toString());
        res.status(result ? 200 : 404).send({ success: result ? true : false });
    } catch (err) {
        next(err);
    }
};
export const deleteAll = async (req, res, next) => {
    try {
        await Relation.deleteMany({ receptor: req.user.id }).exec();
        User.updateRelationsCount(req.user._id.toString());
        res.send({ success: true });
    } catch (err) {
        next(err);
    }
};
export const getOne = async (req, res, next) => {
    try {
        let relation = await Relation.findById(req.params.id)
            .populate([
                {
                    path: "receptor",
                    select: "name imgUrl google.imgUrl emails phones"
                },
                {
                    path: "petitioner",
                    select: "name imgUrl google.imgUrl emails phones address otherAccounts sections",

                    populate: {
                        path: "sections"
                    }
                }
            ])
            .lean();
        res.send(relation);
    } catch (err) {
        next(err);
    }
};
export const get = async (req, res, next) => {
    let populate = [
        {
            path: "receptor",
            select: "name imgUrl google.imgUrl emails phones"
        },
        {
            path: "petitioner",
            select: "name imgUrl google.imgUrl emails phones"
        }
    ];
    let helper = queryHelper(req.query, { populate });
    try {
        let relations = await Relation.paginate(helper.query, helper.options).then({});
        res.send(relations);
    } catch (err) {
        next(err);
    }
};

export const getByUser = async (req, res, next) => {
    let populate = [{
         path: "petitioner",
         select: "name imgUrl google.imgUrl username sections",
         populate: {
            path: "sections"
        }
        },
        {
         path: "receptor",
         select: "name imgUrl google.imgUrl username sections",
         populate: {
            path: "sections"
         }
        }];
 
    try {
        let helper = queryHelper({ isActive: true, $or: [{ receptor: req.params.user } , { petitioner: req.params.user }] }, { populate });
        let relations = await Relation.paginate(helper.query, helper.options);
        
        
        res.send(relations);
    } catch (err) {
        next(err);
    }
};

// TODO DEPRECATED
export const getAccepted = async (req, res, next) => {
    let populate = [
        {
            path: "receptor",
            select: "name imgUrl google.imgUrl emails phones sections",
            populate: {
                path: "sections"
            }
        },
        {
            path: "petitioner",
            select: "name imgUrl google.imgUrl emails phones sections",
            populate: {
                path: "sections"
            }
        }
    ];
    let helper = queryHelper(req.query, { populate });
    try {
        let relations = await Relation.paginate({ $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: true }, helper.options).then({});
        res.send(relations);
    } catch (err) {
        next(err);
    }
};
export const getByState = async (req, res, next) => {
    let query;
    switch (req.params.state) {
        case "accepted":
            query = { $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: true };
            break;
        case "rejected":
            query = { $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: false };
            break;
        case "pending":
            query = { receptor: req.user.id, isActive: { $exists: false } };
            break;
    }
    let populate = [
        {
            path: "receptor",
            select: "username name imgUrl google.imgUrl emails phones sections",
            populate: {
                path: "sections"
            }
        },
        {
            path: "petitioner",
            select: "username name imgUrl google.imgUrl emails phones sections",
            populate: {
                path: "sections"
            }
        }
    ];
    let helper = queryHelper({}, { populate });
    try {
        let relations = await Relation.paginate(query, helper.options).then({});
        res.send(relations);
    } catch (err) {
        next(err);
    }
};
