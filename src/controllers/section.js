import Section from "../models/section";
import User from "../models/user";
import Relation from "../models/relation";

export const get = async (req, res, next) => {
  
  try {
    let sections = await Section.paginate({}, { populate: [{ path: "users", select: "name" }], lean: true }).then(resp => {

      let promises = resp.docs.map(async se => {
        let tmpSection = se;
        tmpSection.userCount = await User.countDocuments({sections: tmpSection._id});
          return tmpSection;
     });

      Promise.all(promises).then(r => {
        res.send(resp)
      });

    });

  } catch (err) {
    next(err);
  }
};
export const find = async (req, res, next) => {
  try {
    let sections = await Section.paginate({ name: { $regex: req.params.q, $options: "i" } }, { select: "name"  }).then({});
    res.send(sections);
  } catch (err) {
    next(err);
  }
};

// GET SECTIONS (LIMIT, RANDOM)
export const getRandomSections = async (req, res, next) => {
  
  try {
  let count =  await Section.countDocuments();
  let random = Math.floor(Math.random() * count);

   let sections = await Section.find().skip(random).limit(parseInt(req.params.n));
    res.send(sections);
  } catch (err) {
    next(err);
  }
};


export const getOne = async (req, res, next) => {
  try {
    // find the selection by the id pass in params
    let section = await Section.findById(req.params.id)
      .populate([{ path: "users", select: "username name imgUrl google.imgUrl emails phones sections", populate: [{ path: "sections", select: "name isActive" }] }])
      .lean();
    // find relations active for the current user
    let relations = await Relation.find({ $or: [{ petitioner: req.user._id.toString() }, { receptor: req.user._id.toString() }], isActive: true }).lean();
    // fill an array with the receptors filtering the current user
    let receptors = relations.map(relation => relation.receptor);
    receptors = receptors.filter(receptor => receptor !== req.user._id.toString());
    // fill an array with the petitioners filtering the current user
    let petitioners = relations.map(relation => relation.petitioner);
    petitioners = petitioners.filter(petitioner => petitioner !== req.user._id.toString());
    // find users with the sections and that have a relation with the current user
    let related = await User.find({
      $and: [{ sections: { $in: [section._id] }, _id: { $ne: req.user._id.toString() } }, { $or: [{ _id: { $in: petitioners } }, { _id: { $in: receptors } }] }],
    })
      .select("username name imgUrl google.imgUrl emails phones sections")
      .populate([{ path: "sections", select: "name isActive" }])
      .lean();
    let others = await User.find({
      $and: [{ sections: { $in: [section._id] }, _id: { $ne: req.user._id.toString() } }, { _id: { $nin: petitioners } }, { _id: { $nin: receptors } }],
      // $and: [{ sections: { $in: [section._id] }, _id: { $ne: req.user._id.toString() } }, { $or: [{ _id: { $nin: petitioners } }, { _id: { $nin: receptors } }] }]
    })
      .select("username name imgUrl google.imgUrl emails phones sections")
      .populate([{ path: "sections", select: "name isActive" }])
      .lean();
    res.send({ section, related, others, common: [] });
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    let section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    res.send(section);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    let section = new Section(req.body);
    await section.save();
    res.send(section);
  } catch (err) {
    next(err);
  }
};
