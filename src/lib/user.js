export const getUserData = data => {
  let user = {
    _id: data._id,
    isActive: data.isActive,
    name: data.name,
    username: data.username,
    idNumber: data.idNumber,
    phones: data.phones,
    emails: data.emails,
    scope: data.scope,
    type: data.type,
    address: data.address,
    lastLogin: data.lastLogin,
    imgUrl: data.imgUrl,
    google: {
      name: data.google.name,
      email: data.google.email,
      imgUrl: data.google.imgUrl
    },
    legalName: data.legalName,
    businessType: data.businessType,
    website: data.website,
    creator: data.creator,
    admins: data.admins,
    quantity: data.quantity,
    users: data.users
  };
  return user;
};
