import mongoose from "mongoose";

// import mongoosePaginate from "mongoose-paginate";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
import bcrypt from "bcryptjs";
import {
    getUserData
} from "../lib/user";
import UserPermission from "./userPermission";
import Relation from "./relation";
const Schema = mongoose.Schema;
const salt = bcrypt.genSaltSync(10);
let userSchema = Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    // name: String,
    name: {
        first: {
            type: String,
        },
        middle: {
            type: String,
        },
        last: {
            type: String,
        },
        secondLast: {
            type: String,
        },
    },
    username: {
        type: String,
        unique: true,
    },
    language: {
        type: String,
        default: "es",
    },
    password: {
        type: String,
        select: false,
    },
    security: {
        updatedAt: {
            type: Date,
            default: new Date(),
        },
        isRandom: {
            type: Boolean,
            default: false,
        },
        hasPassword: {
            type: Boolean,
            default: false,
        },
        activateHash: String,
    },
    idNumber: {
        type: String,
    },
    phones: [{
        _id: false,
        phone: String,
        label: String,
    }, ],
    emails: [{
        _id: false,
        email: String,
        label: String,
    }, ],
    sections: Array({
        type: String,
        ref: "Section",
    }),
    otherAccounts: {
        instagram: {
            url: {
                type: String,
            },
            token: {
                type: String,
            },
        },
        twitter: {
            url: {
                type: String,
            },
            token: {
                type: String,
            },
        },
        facebook: {
            url: {
                type: String,
            },
            token: {
                type: String,
            },
        },
        web: {
            url: {
                type: String,
            },
            token: {
                type: String,
            },
        },
        linkedin: {
            url: {
                type: String,
            },
            token: {
                type: String,
            },
        },
    },
    /**
     *     enum: ['personal', 'business']
     */
    type: {
        type: String,
        default: "personal",
        enum: ["personal", "business"],
    },
    /**
     *  active scope, personal or one of the business asociated
     */
    scope: {
        id: {
            type: String,
            ref: "Business",
        },
        type: {
            type: String,
            enum: ["personal", "business"],
            default: "personal",
        },
    },
    address: {
        lat: String,
        long: String,
        text: String,
        city: String,
        region: String,
        country: String,
        number: String,
        district: String,
        street: String,
        mapUrl: String,
    },
    lastLogin: Date,
    imgUrl: String,
    currency: {
        type: String,
        ref: "Currency",
    },
    google: {
        id: String,
        name: String,
        email: String,
        accessToken: String,
        imgUrl: String,
    },
    defaults: {
        tax: {
            type: String,
            ref: "Tax",
        },
    },
    relations: Array({
        ref: {
            type: String,
            ref: "User",
        },
        id: {
            type: String,
        },
    }),
    connections: Array({
        type: String,
        ref: "User",
    }),
    relationsCount: {
        type: Number,
    },
    contacts: Array({
        type: String,
        ref: "Contact",
    }),
    webpush: {
        devices: Array({
            name: {
                type: String,
            },
            subscription: {
                type: Object,
            },
            isActive: {
                type: Boolean,
            },
        }),
    },
    notifications: {
        newUserContact: {
            type: Boolean,
            default: true,
        },
    },
    //business info
    legalName: String, // razón social,
    businessType: Array({
        type: String,
    }), // giro
    website: String,
    creator: {
        type: String,
        ref: "User",
    },
    admins: Array({
        _id: false,
        description: String,
        user: {
            type: String,
            ref: "User",
        },
    }),

    /**
     *  array of ObjectIds from business asociated
     */
    business: Array({
        type: String,
        ref: "Business",
    }),
    users: Array({
        type: String,
        ref: "User",
    }),
    quantity: [{
        name: {
            type: String,
            default: "Cantidad",
        },
        number: {
            type: Number,
            default: 1,
        },
    }, ],
}, {
    timestamps: true,
});

userSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, salt, null);
};

userSchema.methods.getUser = function () {
    // if (this.scope.type === "business") {
    //   try {
    //     let permissions = await UserPermission.find({ user: this._id, business: this.scope.id }, { populate: [{ path: "permissions" }] });

    //     let user = getUserData(this);
    //     user.permissions = userPermissions.permissions;
    //     return user;
    //   } catch (err) {
    //     return err;
    //   }
    // } else {
    //   return getUserData(this);
    // }
    // logy("user from model:::");
    // logy(this);
    let user = {
        _id: this._id,
        isActive: this.isActive,
        name: this.name,
        username: this.username,
        idNumber: this.idNumber,
        phones: this.phones,
        emails: this.emails,
        scope: this.scope,
        type: this.type,
        address: this.address,
        lastLogin: this.lastLogin,
        imgUrl: this.imgUrl,
        google: {
            name: this.google.name,
            email: this.google.email,
            imgUrl: this.google.imgUrl,
        },
        legalName: this.legalName,
        businessType: this.businessType,
        website: this.website,
        creator: this.creator,
        admins: this.admins,
        quantity: this.quantity,
        users: this.users,
    };
    return user;
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    logy(password);
    logy(this.password);
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
User.updateRelationsCount = (user) => {
    Relation.countDocuments({
        $or: [{
                petitioner: user,
            },
            {
                receptor: user,
            },
        ],
        isActive: true,
    }).exec((err, relationsCount) => {
        if (err) {
            console.log(err);
        } else {
            User.findByIdAndUpdate(user, {
                relationsCount,
            }).exec();
        }
    });
};
User.validPassword = async (id, password) => {
    const user = await User.findById(id, "password").exec();
    let valid = false;
    try {
        valid = bcrypt.compareSync(password, user.password);
    } catch (err) {
        valid = false;
    }

    return valid;
};
User.hash = (password) => {
    return bcrypt.hashSync(password, salt, null);
};
User.addUser = (user, callback) => {
    // User.create(user, callback);
    user.nopassword = user.password;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            // user.save(callback);
            User.create(user, callback);
        });
    });
};

// User.setRelation = (invite, guest, callback) => {
// 	let update
// 	update = { $set: { 'relations.related': guest }}
// 	User.findOneAndUpdate({_id: invite}, update, { new: true })
// 	.exec((err, user) => {
// 		if(err) return log(err)
// 		log(`set related ${user.name}`)
// 	})
// 	update = { $set: { 'relations.related': invite }}
// 	User.findOneAndUpdate({_id: guest}, update, { new: true })
// 	.exec((err, user) => {
// 		if(err) return log(err)
// 		log(`set related ${user.name}`)
// 	})
// 	callback()
// }
User.addBusiness = (id, business, callback) => {
    User.findByIdAndUpdate(
        id, {
            $addToSet: {
                business: business,
            },
        },
        callback
    );
};
User.getUsers = (callback, limit) => {
    User.find(callback).limit(limit);
};

User.updateUser = (id, user, options, callback) => {
    var query = {
        _id: id,
    };
    // logy(user.address);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            var update = {
                active: user.active,
                name: user.name,
                username: user.username,
                // apellido: user.apellido,
                password: user.password,
                rut: user.rut,
                phone: user.phone,
                cellphone: user.cellphone,
                email: user.email,
                address: user.address,

                updated: Date.now(),
                // empresa: user.empresa,
            };
            User.findOneAndUpdate(query, update, options, callback);
        });
    });
};

User.updateEmpresa = (username, nuevaEmpresa, options, callback) => {
    // logy("new empresa: "+login);
    var query = {
        username: username,
    };
    var update = {
        $addToSet: {
            empresa: nuevaEmpresa,
        },
    };

    User.findOne(query, function (err, user) {
        var results = user.empresa.find(function (item) {
            return item.empresaId == nuevaEmpresa.empresaId;
        });
        if (typeof results == "undefined") {
            User.findOneAndUpdate(
                query,
                update, {
                    upsert: true,
                },
                callback
            );
        }
    });
};

User.removeEmpresa = (id, empresaId, options, callback) => {
    logy("user3: " + id);
    logy("empresa3: " + empresaId);
    var query = {
        _id: id,
    };
    var update = {
        $pull: {
            empresa: empresaId,
        },
    };
    User.findOneAndUpdate(query, update, options, callback);
    // User.find(query).pull({empresa: empresaId});
};

User.getUserByLogin = function (username, callback) {
    var query = {
        username: username,
    };
    User.findOne(query, callback);
};
User.getUserByEmail = function (email, callback) {
    var query = {
        email: email,
    };
    User.findOne(query, callback);
};
User.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) {
            throw err;
        }
        callback(null, isMatch);
    });
};

User.getUserById = function (id, callback) {
    User.findById(id, callback);
};

User.passwordChange = function (id, oldPassword, password, callback) {
    logy("dentro de passwordChange");
    logy(id);
    logy(oldPassword);
    logy(password);

    User.findById(id, function (err, user) {
        User.comparePassword(oldPassword, user.password, function (err, isMatch) {
            if (err) {
                throw err;
            }
            if (isMatch) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        user.password = hash;
                        user.save();
                    });
                });
                return callback(null, user);
            } else {
                return callback(null, false, {
                    message: "password incorrecta",
                });
            }
        });
    });
};