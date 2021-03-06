var User = require("./user.model").User;
var Profile = require("../profile/model");
var User_OTP = require("./user.model").User_OTP; //deprecated
var mongoose = require("mongoose");
const dotenv = require("dotenv").config();
var subscription_utils = require("../subscription_order/subscription_order.utils");

const Subscription_order = require("../subscription_order/subscription_order.model");
var user_util = require("./user.utils");
var bcrypt_util = require("./bcrypt_utils");

const Interaction = require("../interaction/interaction.model");

var mailer = require("../../lib/mail.js");

var oauth_mailer = require("../../lib/oauth2_mail");

const jwt = require("jsonwebtoken");

var config = require("../../config/environment");

const EMAIL_SECRET = "email-verifications-secret";
var secret = require("../../config/environment/secrets");
const ejs = require("ejs");

const Other = require("../../lib/other");
const UserOTP = require("../userotp/userotp.model");
const moment = require("moment");
const Constant = require("../../lib/constant");
const convert = require("convert-units");
const Document = require("../document/document.model");
const messageMapper = require("../../lib/messageMapper");
const UserMessage  = messageMapper.language1;


function convertArrayOfObjectToSingleObject(arrayOfObject) {
  let result = {};
  let valueNameArray = Object.keys(arrayOfObject[0]);
  let valueKeyName = "";
  if (valueNameArray.length === 2) valueKeyName = valueNameArray[1];
  if (valueNameArray.length === 3) valueKeyName = valueNameArray[2];

  for (const [, value] of Object.entries(arrayOfObject)) {
    result[value.key] = value[valueKeyName];
  }
  return result;
}

function profilekeyValueMapper(profile, profilePohtos) {
  const educationMapper = convertArrayOfObjectToSingleObject(
    Constant.education
  );
  const religionMapper = convertArrayOfObjectToSingleObject(
    Constant.religion_list
  );
  const casteMapper = convertArrayOfObjectToSingleObject(Constant.caste_list);
  const occupationMapper = convertArrayOfObjectToSingleObject(
    Constant.occupation
  );

  const complexionMapper = convertArrayOfObjectToSingleObject(
    Constant.complexion
  );
  const bloodGroupMapper = convertArrayOfObjectToSingleObject(
    Constant.bloodGroup
  );
  const raasiMapper = convertArrayOfObjectToSingleObject(Constant.raasi);
  const drinkMapper = convertArrayOfObjectToSingleObject(Constant.drink);
  const smokeMapper = convertArrayOfObjectToSingleObject(Constant.smoke);

  const bodyTypeMapper = convertArrayOfObjectToSingleObject(Constant.bodyType);
  const foodTypeMapper = convertArrayOfObjectToSingleObject(Constant.foodType);
  const maritalListMapper = convertArrayOfObjectToSingleObject(
    Constant.maritalList
  );
  const heightMapper = convertArrayOfObjectToSingleObject(Constant.height);

  profile["higher_education"] = educationMapper[profile["higher_education"]];
  profile["occupation"] = occupationMapper[profile["occupation"]];
  profile["father_occupation"] = occupationMapper[profile["father_occupation"]];
  profile["mother_occupation"] = occupationMapper[profile["mother_occupation"]];
  profile["caste"] = casteMapper[profile["caste"]];
  profile["religion"] = religionMapper[profile["religion"]];
  profile["body_type"] = bodyTypeMapper[profile["body_type"]];
  profile["complexion"] = complexionMapper[profile["complexion"]];
  profile["state"] = Constant.state[profile["state"].toUpperCase()];
  profile["raasi"] = raasiMapper[profile["raasi"]];
  profile["blood_group"] = bloodGroupMapper[profile["blood_group"]];
  profile["smoke"] = smokeMapper[profile["smoke"]];
  profile["drink"] = drinkMapper[profile["drink"]];
  profile["diet"] = foodTypeMapper[profile["diet"]];
  profile["marital_status"] = maritalListMapper[profile["marital_status"]];
  profile["profile_images"] = profilePohtos.map((photo) => photo.url);

  return profile;
}

module.exports.getOwnProfile = async function (req, res) {
  var id = mongoose.Types.ObjectId(req.user._id);
  const profile = await Profile.findOne({ user: id }).populate({
    path: "user",
    select: "email mobile_number name",
  });

  const profilePhotos = await Document.find(
    { user: req.user._id, status: { $in: ["approved"] } },
    { url: 1 }
  );
  const mappedProfile = profilekeyValueMapper(profile, profilePhotos);
  console.log("mappedProfile", mappedProfile);
  return res.json({ data: mappedProfile, message: UserMessage.success });
};

module.exports.getAll = function (req, res) {
  User.find({}, function (err, data) {
    if (!data) {
      res.json({ message: UserMessage.noUserFound });
      return;
    }
    res.json({ data: data, message: UserMessage.success });
  });
};

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  var charactersLength = characters.length;
  const digitsLength = digits.length;

  for (var i = 0; i < length / 2; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  for (var i = 0; i < length / 2; i++) {
    result += digits.charAt(Math.floor(Math.random() * digitsLength));
  }
  return result;
}

async function create_profile(user_id, req_body) {
  var gender = req_body["gender"];
  var dob = req_body["dob"];
  var g = "";
  var profile_image = "";
  if (gender == "male") {
    g = "m";
    profile_image = "../../assets/images/male.jpeg";
  }
  if (gender == "female") {
    g = "f";
    profile_image = "../../assets/images/female.png";
  }
  return Profile.findone_or_create({
    user: user_id,
    display_name: makeid(6),
    dob: dob,
    gender: g,
    profile_image: profile_image,
    state: req_body["state"].toLowerCase(),
    district: req_body["district"].toLowerCase(),
    addressline: req_body["addressline"].toLowerCase(),
  });
}

// function get_email_verification_url(id){
//   const email_token = jwt.sign({_id:id.toString()}, EMAIL_SECRET, {expiresIn: '3d'});

//   const email_verification_url = `http://${global.gConfig.url}:${global.gConfig.port}/api/user/email/confirmation/${email_token}`;
//   return email_verification_url
// }

module.exports.register_new_user = async function (req, res) {
  if (!req.body.user) {
    res.status(400).send({ error: UserMessage.badRequest, status: 400 });
    return;
  }
  var request_data = req.body.user;
  validate_arr = user_util.validate_request_body(req.body.user);

  if (!validate_arr[0]) {
    res.status(400).send({ error: validate_arr[1] });
    return;
  }
  user_register_body = Object.keys(req.body.user);
  var userDetails = {};

  try {
    
    const [user, userMobile] = await  Promise.all([User.find({
      email: request_data.email
    }), User.find({mobile_number:request_data.mobile_number})]);
    console.log("user", user);

    if (user.length > 0 && !user[0].email_verified) {
      res.status(403).send({
        status: false,
        error: UserMessage.emailVerificationPending,
        email_verification: false,
      });
      return;
    }
    if(userMobile.length){
     return res.status(403).send({ status: false, error: UserMessage.mobileNotAvailable }); 
    }

    if (user.length) {
      res.status(403).send({ status: false, error: UserMessage.emailNotAvailable });
      return;
    }

    
    var new_user = new User();
    user_register_body.forEach((key) => (new_user[key] = req.body.user[key]));

    const user_data = await new_user.save();

    const profile_data = await create_profile(user_data._id, req.body.user);

    userDetails["email"] = user_data.email;
    userDetails["name"] = user_data.name;
    userDetails["id"] = user_data._id;

    // user_util.send_email_verification_url(userDetails, req);
    let otp = Other.generateOTP(4);
    console.log("otp ***************", otp);

    await UserOTP.SaveEmailOtp(user_data.email, otp, "register");

    user_util.send_email_verification_otp(userDetails, req, otp);
    res.status(200).send({
      email: user_data.email,
      status: true,
      message: `${UserMessage.verificationEmailOtp}`,
    });
  } catch (e) {
    console.log("err", e);
    res.status(500).send({ error: UserMessage.SomethingWentWrong, error: e.message });
  }
};

module.exports.verify_otp = function (req, res) {
  if (!req.body || !req.body.user_id) {
    return res
      .status(400)
      .send({ status: false, error: UserMessage.missingUserId });
  }
  if (!req.body.otp) {
    return res
      .status(400)
      .send({ status: false, error: UserMessage.missingOtp });
  }

  var id = mongoose.Types.ObjectId(req.body.user_id);

  User_OTP.findOne({
    user: id,
    active: true,
    otp: req.body.otp,
  })
    .then(function (user) {
      if (!user) {
        return res.status(400).send({ status: false, error: UserMessage.userNotFound });
      }
      if (user.email_verified) {
        return res
          .status(400)
          .send({ status: false, error: UserMessage.emailAlreadyVerified });
      }
      User.findOneAndUpdate({ _id: id }, { email_verified: true })
        .then(function (data) {
          res
            .status(200)
            .send({ status: true, message: UserMessage.verificationSuccess });
        })
        .catch(function (err) {
          res.status(500).send({ status: false, error: UserMessage.SomethingWentWrong });
        });
    })
    .catch(function (err) {
      return res
        .status(500)
        .send({ status: false, error: UserMessage.SomethingWentWrong });
    });
};

function createGetAllQuery(query, url_query) {
  var options = {};
  options.criteria = {};
  var pageNumber = query.pageNumber - 1;
  var pageCount = query.pageCount;
  options.pageCount = pageCount;
  options.pageNumber = pageNumber;
  if (query.search) {
    var search = new RegExp(query.search, "i");
    options.criteria = {
      $or: [
        {
          first_name: search,
        },
        {
          last_name: search,
        },
        {
          email: search,
        },
        {
          mobile_number: search,
        },
        {
          mode: search,
        },
      ],
    };
  }

  if (query && query.name) {
    var terms = query.name.split(" ");
    var regexString = "";

    for (var i = 0; i < terms.length; i++) {
      regexString += terms[i];
      if (i < terms.length - 1) regexString += "|";
    }
    var re = new RegExp("^" + regexString, "ig");
    options.criteria = {
      $or: [
        {
          first_name: {
            $regex: re,
          },
        },
        {
          last_name: {
            $regex: re,
          },
        },
      ],
    };
  }

  if (query.email) {
    // options.criteria.email = {
    //   $regex: new RegExp('^' + query.email, 'i')
    // };
    options.criteria.email = query.email;
  }

  if (query.mobile_number) {
    options.criteria.mobile_number = query.mobile_number;
  }
  if (query.role) {
    options.criteria.role = {
      $regex: new RegExp("^" + query.role, "i"),
    };
  }
  if (url_query && url_query.profile_status == "pending") {
    options["criteria"].profile_status = "pending";
  }
  if (url_query && url_query.profile_status == "rejected") {
    options["criteria"].profile_status = "rejected";
  }
  // if (query.is_active) {
  //   options.criteria.is_active = query.is_active == 'active' ? true : false;
  // }

  // if (query.fields) {
  //   options.fields = query.fields.split(',').join(' ');
  // }

  options.sort = {};
  if (query.sortBy) {
    options.sort[query.sortBy] = query.direction;
  } else {
    options.sort.created_at = -1;
  }

  return options;
}

module.exports.getUserList = async function (req, res) {
  let query = req.query;
  var users = {};
  var skip = 0;
  let limit = req.body.query.pageCount || 10;
  var pageNumber = req.body.query.pageNumber || 1;
  if (pageNumber) {
    skip = (parseInt(pageNumber) - 1) * limit;
  }
  let pipeline = [];

  let match_obj = { $match: { $and: [] } };

  match_obj["$match"]["$and"].push({ role: "user" });
  if (req.body.query.mobile_number) {
    let mobile_number = req.body.query.mobile_number.trim();
    match_obj["$match"]["$and"].push({
      mobile_number: new RegExp(mobile_number, "i"),
    });
  }
  if (req.body.query.name) {
    let name = req.body.query.name.trim();
    match_obj["$match"]["$and"].push({ name: new RegExp(name, "i") });
  }

  if (req.body.query.email) {
    let email = req.body.query.email.trim();
    match_obj["$match"]["$and"].push({ email: new RegExp(email, "i") });
  }

  pipeline.push(match_obj);
  pipeline.push({
    $sort: { created_at: -1 },
  });

  pipeline.push({
    $lookup: {
      from: "profiles",
      localField: "_id",
      foreignField: "user",
      as: "profile",
    },
  });

  pipeline.push({
    $lookup: {
      from: "documents",
      let: {
        photo_status: "approved",
        user_id: "$_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$status", "$$photo_status"] },
                { $eq: ["$user", "$$user_id"] },
              ],
            },
          },
        },
      ],
      as: "photos",
    },
  });

  if (query.profile_status) {
    pipeline.push({
      $match: { $and: [{ "profile.profile_status": query.profile_status }] },
    });
  }

  let count_pipeline = [...pipeline];

  pipeline.push({
    $skip: skip,
  });
  pipeline.push({
    $limit: limit,
  });

  pipeline.push({
    $project: {
      mobile_number: "$mobile_number",
      email: "$email",
      is_active: "$is_active",
      name: "$name",
      created_at: "$created_at",
      profile_status: { $arrayElemAt: ["$profile.profile_status", 0] },
      profile_image:  { $arrayElemAt: ["$photos.url", 0] }
    },
  });

  count_pipeline.push({ $match: { role: "user" } });
  count_pipeline.push({ $group: { _id: null, myCount: { $sum: 1 } } });

  let [data, total_count] = await Promise.all([
    User.aggregate(pipeline),
    User.aggregate(count_pipeline),
  ]);
  users.user = data;
  users.count = total_count.myCount;
  res
    .status(200)
    .send({ message: "success", user: data, count: total_count[0].myCount });
};

function validateNewAccountRequest(requestBody) {
  if (!requestBody.email) {
    return [false, UserMessage.emailMissing];
  }
  if (!requestBody.mobileNumber) {
    return [false, UserMessage.mobileMissing];
  }
  if (requestBody.mobileNumber.length !== 10) {
    return [false, UserMessage.invalidMobile];
  }
  if (!requestBody.dob) {
    return [false, UserMessage.dobMissing];
  }
  if (!requestBody.height) {
    return [false, UserMessage.heightMissing];
  }
  if (!requestBody.password) {
    return [false, UserMessage.passwordMissing];
  }
  if (!requestBody.gender) {
    return [false, UserMessage.genderMissing];
  }
  if (!requestBody.state) {
    return [false, UserMessage.stateMissing];
  }
  if (!requestBody.district) {
    return [false, UserMessage.districtMissing];
  }
  if (!requestBody.pincode) {
    return [false, UserMessage.pincodeMissing];
  }
  return [true, ""];
}

module.exports.admin_create_user_account = async function (req, res) {
  var requestBody = req.body;
  const [status, message] = validateNewAccountRequest(requestBody);
  if (!status) {
    return res.status(400).send({ message: message });
  }
  let dob = requestBody.dob ? moment.utc(requestBody.dob) : null;
  let heightInCm = feetToCm(requestBody.height);
  const [userWithEmail, userWithMobile] = await Promise.all([
    User.isEmailExits(requestBody.email),
    User.isMobileExits(requestBody.mobileNumber),
  ]);

  if (userWithEmail) {
    return res.status(400).send({ message: UserMessage.emailAlreadyRegistered });
  }
  if (userWithMobile) {
    return res.status(400).send({ message: UserMessage.mobileAlreadyRegistered });
  }

  var encrypted_password = bcrypt_util.password_hash(requestBody.password);
  encrypted_password.then(function (hashed_password) {
    var user = new User({
      name: requestBody.name,
      email: requestBody.email,
      mobile_number: requestBody.mobileNumber,
      password: requestBody.password,
      role: "user",
      is_active: true,
      created_by: "admin",
      mobile_verified: true,
    });

    user.save().then(function (user) {
      var profile = new Profile({
        state: requestBody.state,
        district: requestBody.district,
        pincode: requestBody.pincode,
        addressline: requestBody.addressline1,
        city: requestBody.city,
        user: user._id,
        dob: dob,
        gender: requestBody.gender,
        height: requestBody.height,
        heightInCm: feetToCm(requestBody.height),
        profile_status: "approved",
        display_name: makeid(8),
      });

      profile
        .save()
        .then(function (data) {
          res.status(200).send({ message: "success" });
        })
        .catch(function (e) {
          res
            .status(500)
            .send({ message: UserMessage.SomethingWentWrong, error: e.message });
        });
    });
  });
};

module.exports.get_user_profile_detail = async function (req, res) {
  /* This api is used to get user and profile data of user*/
  var id = mongoose.Types.ObjectId(req.params.id);
  let profilePhotos  = await Document.find({user:id, status:{$in:["approved", "pending"]}}, {url:1, status:1});
  Profile.findOne({ user: id })
    .populate({
      path: "user",
      select: "name mobile_number email name address",
      rename: "User",
    })
    .exec(function (err, profiledata) {
      profiledata["profile_images"] = profilePhotos;
      console.log("profiledata", profiledata);
      if (err) {
        res.state(400).json({ error: UserMessage.SomethingWentWrong });
        return;
      }
      res.json({ data: profiledata, message: UserMessage.success });
    });
};

module.exports.admin_update_user_profile = function (req, res) {
  /* This admin api is used to update user and profile data of user*/

  let user_update_body = user_util.get_user_update_body(req.body);
  User.update({ _id: req.body.user._id }, user_update_body)
    .then(function (user_update) {
      return user_update;
    })
    .then(function (user_update) {
      let profile_update_body = user_util.get_profile_update_body(req.body);
      Profile.updateOne({ user: req.body.user._id }, profile_update_body).then(
        function (profile_update) {
          res.status(200).json({ message: UserMessage.profileUpdated });
        }
      );
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ error: UserMessage.SomethingWentWrong, error: err.message });
    });
};

async function update_interaction(
  my_id,
  contacted_user,
  contacted_profile,
  type
) {
  const existing_interaction = await Interaction.findOne({
    user: my_id,
    interacted_user: contacted_user,
    interaction_type: "contacted",
  });
  if (existing_interaction) {
    return false;
  }

  var new_interaction = new Interaction({
    interaction_type: type,
    user: my_id,
    interacted_user: contacted_user,
    interacted_profile: contacted_profile,
  });

  const new_inter = await new_interaction.save();
  return true;
}

module.exports.get_data_for_subscribed_user = async (req, res) => {
  try {
    const existing_interaction = await Interaction.findOne({
      user: req.user._id,
      interacted_user: req.params.id,
      interaction_type: "contacted",
    });

    const subscription = await subscription_utils.get_user_subscription(
      req.user._id
    );
    if (!subscription && !existing_interaction) {
      res.status(403).json({ message: UserMessage.buyPlan });
      return;
    }

    const contactedProfile = await Profile.findOne(
      { user: req.params.id },
      { addressline: 1, district: 1, state: 1, pincode: 1 }
    ).populate(
      "user",
      "mobile_number email addressline email_verified mobile_verified"
    );
    contactedProfile["state"] = Constant.state[contactedProfile["state"]];
    contactedProfile.user["mobile_number"] = "कृपया नंबर के लिए  9020912410 पे कॉल करें !"
    res.status(200).json({ data: contactedProfile, message: "success" });

    const new_updated_interaction = await update_interaction(
      req.user._id,
      contactedProfile.user._id,
      contactedProfile._id,
      (type = "contacted")
    );

    if (new_updated_interaction) {
      const updated_subs_order = await Subscription_order.updateOne(
        { _id: subscription._id },
        { $inc: { contacts_available: -1 } }
      );
    }
  } catch (e) {
    console.log(e);
    if (!e.subscription) {
      res.status(403).json({
        message: "Something went wrong. Please contact us or try after sometime",
      });
    } else {
      res.status(500).json({ message: UserMessage.SomethingWentWrong });
    }
  }
};

module.exports.get_viewed_contacts_of_user = function (req, res) {
  Profile.findOne({ user: req.user._id })
    .populate("viewed_contacts")
    .then(function (data) {
      res.status(200).json({ data: data });
    })
    .catch(function (err) {
      res.status(500).json({ message: UserMessage.SomethingWentWrong, error: err.message });
    });
};

module.exports.sendmail = async function (req, res) {
  try {
    const mail_response = await oauth_mailer.triggerMail(
      (to = "nitishkumar1500@gmail.com"),
      (subject = "This is test subject"),
      (text = "This is test text"),
      (html = "<h1>Hello World!!</h1>")
    );

    res.status(200).json({ data: mail_response, message: "success" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

module.exports.verify_email = async (req, res) => {
  const link = req.params.link;

  let client_port = process.env.CLIENT_PORT;
  let user;
  let admin_email;
  try {
    const payload = await jwt.verify(link, EMAIL_SECRET);
    user = await User.findOne({ _id: payload._id });
    if (user.email_verified) {
      if (global.gConfig.config_id == "development") {
        return res.redirect(
          `http://${global.gConfig.url}:${client_port}/register/status?status=verified`
        );
      } else {
        return res.redirect(
          `${global.gConfig.url}/register/status?status=verified`
        );
      }
    }

    const user_update = await User.update(
      { _id: payload._id },
      { $set: { email_verified: true } }
    );
    const profile_update = await Profile.update(
      { user: payload._id },
      { $set: { email_verified: true } }
    );

    let html = `<p>Hi,</p>
                <p>New user registraion detail is here.</p>
                <p>Email: ${user.email}</p>
                <p>Mobile: ${user.mobile_number}</p>`;

    admin_email = secret.google.email_full;
    if (global.gConfig.config_id == "development") {
      await oauth_mailer.triggerMail(
        admin_email,
        (subject = "New User Registration"),
        (text = "Click on the below link to reset password"),
        (html = html)
      );

      return res.redirect(
        `http://${global.gConfig.url}:${client_port}/register/status?status=success`
      );
    } else {
      await oauth_mailer.triggerMail(
        admin_email,
        (subject = "New User Registration"),
        (text = "Click on the bllow link to reset password"),
        (html = html)
      );
      return res.redirect(
        `${global.gConfig.url}/register/status?status=success`
      );
    }
  } catch (e) {
    if (global.gConfig.config_id == "development") {
      return res.redirect(
        `http://${global.gConfig.url}:${global.gConfig.port}/register/status?status=failed`
      );
    } else {
      return res.redirect(
        `${global.gConfig.url}/register/status?status=failed`
      );
    }
  }
};

function get_html_for_password_reset_mail(name, url) {
  var html = `<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
<style>
body {
  background-color: #fff;
  padding-left:20px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
</head>
<body>
<p>Hi ${name},</p>
<p>Please reset your password by clicking on this link<br> It will expire in 3 days</p>

<p>${url}</p>


Thanks <br>
<span style= 'padding-bottom:10px;'>Team Shaadikarlo<span>

</body>
</html>
`;
  return html;
}

module.exports.generate_password_reset_link = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let client_port = process.env.CLIENT_PORT;
    if (!user) {
      res.status(400).json({ message: "User not exists with this email" });
    }

    const email_token = jwt.sign({ _id: user._id.toString() }, EMAIL_SECRET, {
      expiresIn: "3d",
    });
    let password_reset_url;

    password_reset_url = `${global.gConfig.url}/password/reset/${email_token}`;
    // var html = get_html_for_password_reset_mail(user.name, password_reset_url)
    var obj = { name: user.name, password_reset_url: password_reset_url };
    ejs.renderFile(
      __dirname + "/../../email_templates/password_reset.ejs",
      { data: obj },
      async (err, data) => {
        if (err) {
          throw err;
        } else {
          console.log("html **** ", data);

          let html = data;

          try {
            var password_mail = await oauth_mailer.triggerMail(
              (to = user.email),
              (subject = "Reset Password Link"),
              (text = "Click on the below link to reset your password"),
              (html = html)
            );
            res.status(200).json({
              message: "password reset link has been sent to your email",
            });
            console.log("email_resp", email_resp);
          } catch (e) {}
        }
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.update_password = async (req, res) => {
  if (!req.params.link || !req.body.password) {
    res.send({ message: "Invalid request!" });
    return;
  }
  try {
    const payload = await jwt.verify(req.params.link, EMAIL_SECRET);

    const user = await User.findById({ _id: payload._id });
    user.password = req.body.password;
    const updated_user = await user.save();
    res.status(200).send({ message: UserMessage.passwordUpdated });
  } catch (e) {
    res.status(500).send({ message: UserMessage.SomethingWentWrong });
  }
};

module.exports.send_email_verification = async (req, res) => {
  try {
    var user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(400).json({ message: UserMessage.emailUserNotExists });
      return;
    }
    if (user.email_verified) {
      res.status(400).json({ message: UserMessage.emailAlreadyVerified });
      return;
    }
    const userDetails = {};
    userDetails["email"] = user.email;
    userDetails["name"] = user.name;
    userDetails["id"] = user._id;
    user_util.send_email_verification_url(userDetails, req);
    res.status(200).json({ message: "Verification link sent to email" });
  } catch (e) {
    res.status(500).json({
      message:
        "Something went wrong. Please try after some time Or message the issue under contact us form",
    });
    return;
  }
};

module.exports.get_user_stats = async (req, res) => {
  try {
    const active_users = await User.count({ is_active: true });
    const total_users = await User.count({});
    const email_verified_users = await User.count({ email_verified: true });

    res.status(200).send({ active_users, total_users, email_verified_users });
  } catch (e) {
    res.status(500).send({ err: "something went wrong" });
  }
};

module.exports.registration_otp_verification = async (req, res) => {
  let request_body = req.body;
  let email = request_body.email;
  let otp = request_body.otp;
  try {
    if (!email) {
      res
        .status(400)
        .send({ message: UserMessage.emailMissing, status: 400 });
      return;
    }
    if (!otp) {
      res
        .status(200)
        .send({ message: UserMessage.missingOtp, status: 400 });
      return;
    }

    let userotp = await UserOTP.find({ email, otp, active: true }).sort({
      created_at: -1,
    });
    if (!userotp || userotp.length == 0) {
      res.status(400).send({ message: UserMessage.otpIncorrect });
      return;
    }

    let expire_time = moment(userotp[0].expiresIn);
    if (moment() > expire_time) {
      res.status(403).send({ message: UserMessage.otpExpired, status: 403 });
      return;
    }

    let user = await User.findOne({ email: email });
    if (user.email_verified) {
      res.status(400).send({ message: UserMessage.emailAlreadyVerified });
      return;
    }

    const user_update = await User.update(
      { _id: user._id },
      { $set: { email_verified: true } }
    );
    const profile_update = await Profile.update(
      { user: user._id },
      { $set: { email_verified: true } }
    );

    let update = await UserOTP.updateMany(
      {
        email: email,
      },
      { $set: { active: false } }
    );

    let html = `<p>Hi,</p>
                <p>New user registraion detail is here.</p>
                <p>Email: ${user.email}</p>
                <p>Mobile: ${user.mobile_number}</p>`;

    admin_email = secret.google.email_full;
    if (global.gConfig.config_id == "development") {
      res.status(200).send({ message: "success", status: 200 });
      await oauth_mailer.triggerMail(
        admin_email,
        (subject = "New User Registration:Development"),
        (text = "Click on the below link to reset password"),
        (html = html)
      );

      // return res.redirect(`http://${global.gConfig.url}:${client_port}/register/status?status=success`);
    } else {
      res.status(200).send({ message: "success", status: 200 });
      await oauth_mailer.triggerMail(
        admin_email,
        (subject = "New User Registration"),
        (text = "New user registraion"),
        (html = html)
      );
      // return res.redirect(`${global.gConfig.url}/register/status?status=success`);
    }
  } catch (e) {
    //  catch(e){
    //      console.log("error>>>>>>>> ",e);
    //      if(global.gConfig.config_id=='development'){
    //           return res.redirect(`http://${global.gConfig.url}:${global.gConfig.port}/register/status?status=failed`);

    //      }
    //      else{
    //          return res.redirect(`${global.gConfig.url}/register/status?status=failed`);
    //      }
    //  }

    //      res.status(200).send({"message":"success", status:200});
    //      return

    // }
    res.status(500).send({ message: UserMessage.SomethingWentWrong, error: e.message });
  }
};

module.exports.resend_otp = async (req, res) => {
  let request_body = req.body;
  if (!request_body.email) {
    res
      .status(400)
      .send({ message: UserMessage.emailMissing, status: 400 });
    return;
  }

  const user = await User.find({
    email: request_body.email,
  }).sort({ created_at: -1 });
  if (!user || user.length == 0) {
    res.status(403).send({ message: UserMessage.emailNotFound, status: 403 });
    return;
  }

  if (user[0].email_verified) {
    res
      .status(403)
      .send({ message: User.emailAlreadyVerified, status: 403 });
    return;
  }
  userDetails = {};
  userDetails["email"] = user[0].email;
  userDetails["name"] = user[0].name;
  userDetails["id"] = user[0]._id;

  let otp = Other.generateOTP(4);
  await UserOTP.SaveEmailOtp(user[0].email, otp, "register");
  user_util.send_email_verification_otp(userDetails, req, otp);
  res.status(200).send({ message: "success", status: 200 });
  return;
};

module.exports.send_password_reset_otp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let client_port = process.env.CLIENT_PORT;
    if (!user) {
      res.status(400).json({ message: UserMessage.emailUserNotExists });
      return;
    }

    let otp = Other.generateOTP(4);
    await UserOTP.SaveEmailOtp(user.email, otp, "password_reset");
    var obj = { name: user.name, otp: otp };
    ejs.renderFile(
      __dirname + "/../../email_templates/password_reset.ejs",
      { data: obj },
      async (err, data) => {
        if (err) {
          throw err;
        } else {
          let html = data;
          try {
            var password_mail = await oauth_mailer.triggerMail(
              (to = user.email),
              (subject = "Reset Password Otp"),
              (text = "Click on the below link to reset your password"),
              (html = html)
            );
            res.status(200).json({
              message: UserMessage.passwordResetOtp,
            });
          } catch (e) {
            console.log("e ", e);
            res
              .status(500)
              .json({ message: UserMessage.SomethingWentWrong, error: e.message });
          }
        }
      }
    );
  } catch (e) {
    console.log("error ", e);
    res
      .status(500)
      .json({ message: UserMessage.SomethingWentWrong, error: e.message });
  }
};

module.exports.verify_otp_and_update_password = async (req, res) => {
  let request_body = req.body;

  if (!request_body.otp || !request_body.email || !request_body.password) {
    res.status(400).send({ message: "Invalid request!" });
    return;
  }
  try {
    let userotp = await UserOTP.findOne({
      email: request_body.email,
      otp: request_body.otp,
      active: true,
    }).sort({ created_at: -1 });
    console.log("userotp", userotp);

    if (!userotp) {
      res.status(403).send({ message: UserMessage.otpIncorrect });
      return;
    }

    let expire_time = moment(userotp.expiresIn);
    if (moment() > expire_time) {
      res.status(403).send({ message: UserMessage.otpExpired, status: 403 });
      return;
    }
    const user = await User.findOne({ email: request_body.email });
    user.password = req.body.password;
    let updated_user = await user.save();
    let update = await UserOTP.updateMany(
      {
        email: request_body.email,
      },
      { $set: { active: false } }
    );
    res.status(200).send({ message: UserMessage.passwordUpdated });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: UserMessage.SomethingWentWrong });
  }
};

function feetToCm(heightinFeet) {
  let [feet, inch] = heightinFeet.split(/'/);
  inch = parseInt(inch);
  feet = parseInt(feet);
  let totalHeightInFeet = feet + parseFloat(inch / 12);
  let heightInCm = convert(totalHeightInFeet).from("ft").to("cm").toFixed(0);
  return heightInCm;
}
