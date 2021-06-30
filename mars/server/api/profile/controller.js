var Profile = require("./model");
var multer = require("multer");
const AWS = require("aws-sdk");
const secret = require("../../config/environment/secrets");
const moment = require("moment");

var multerS3 = require("multer-s3");
var TinyURL = require("tinyurl");

var mailer = require("../../lib/oauth2_mail.js");
const ejs = require("ejs");
var convert = require("convert-units");

const Interaction = require("../interaction/interaction.model");
const User = require("../user/user.model").User;
const Document = require("../document/document.model");

const accessKeyId = secret.aws.accessKeyId;
const secretAccessKey = secret.aws.secretAccessKey;
const region = secret.aws.region;
const apiVersion = secret.aws.apiVersion;

const Constant = require("../../lib/constant.js");
const Other = require("../../lib/other");
const { query } = require("express");
const messageMapper = require("../../lib/messageMapper");
const UserMessage  = messageMapper.language1;

const S3 = new AWS.S3({
  apiVersion: apiVersion,
  region: region,
  credentials: { accessKeyId: accessKeyId, secretAccessKey: secretAccessKey },
});

function get_profiles_count(criteria) {
  return Profile.count(criteria.query);
}

async function get_profiles(user, limit, skip) {
  let pipeline = [];
  let gender;
  if (user.gender == "m") {
    gender = "f";
  } else {
    gender = "m";
  }

  pipeline.push({
    $match: {
      $or: [{ email_verified: true }, { mobile_verified: true }],
      role: "user",
    },
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
    $sort: {
      created_at: -1,
    },
  });
  pipeline.push({
    $match: {
      "profile.profile_status": { $in: ["approved", "pending"] },
      "profile.gender": gender,
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

  let count_pipeline = [...pipeline];

  pipeline.push({
    $skip: skip,
  });

  pipeline.push({
    $limit: limit,
  });

  let project = {
    district: { $arrayElemAt: ["$profile.district", 0] },
    state: { $arrayElemAt: ["$profile.state", 0] },
    height: { $arrayElemAt: ["$profile.height", 0] },
    occupation: { $arrayElemAt: ["$profile.occupation", 0] },
    caste: { $arrayElemAt: ["$profile.caste", 0] },
    marital_status: { $arrayElemAt: ["$profile.marital_status", 0] },
    religion: { $arrayElemAt: ["$profile.religion", 0] },
    // profile_image: {
    //   $arrayElemAt: [{ $arrayElemAt: ["$profile.profile_images", 0] }, 0],
    // },
    // profile_image: "$photos.url",
    profile_image: { $arrayElemAt: ["$photos.url", 0] },
    dob: { $arrayElemAt: ["$profile.dob", 0] },
    description: { $arrayElemAt: ["$profile.description", 0] },
    last_active: "$last_active",
    user: "$_id",
    gender: { $arrayElemAt: ["$profile.gender", 0] },
    display_name: { $arrayElemAt: ["$profile.display_name", 0] },
  };
  pipeline.push({
    $project: project,
  });

  count_pipeline.push({
    $group: { _id: null, myCount: { $sum: 1 } },
  });
  let myCount = 0;
  try {
    const [profiles, count] = await Promise.all([
      User.aggregate(pipeline),
      User.aggregate(count_pipeline),
    ]);
    myCount =
      count && count.length > 0 && count[0].myCount ? count[0].myCount : 0;
    return [profiles, myCount, ""];
  } catch (e) {
    console.log(e);

    return [[], myCount, e.message];
  }
}

function get_user_profile(id, req_body) {
  return Profile.findOne({ user: id }, { gender: 1, _id: 0 });
}

function generate_query(user_profile, req_body, history_search = null) {
  var criteria = { query: {}, limit: 10, skip: 0 };

  var query = {};
  const page_number = req_body["pageNumber"] || 0;
  const page_count = req_body["pageCount"] || 10;

  if (user_profile.gender && user_profile.gender == "m") {
    query.gender = "f";
  } else {
    query.gender = "m";
  }
  query.email_verified = true;
  criteria["query"] = query;
  criteria["skip"] = page_number * page_count;
  criteria["limit"] = 10;

  return criteria;
}

module.exports.getProfile = async function (req, res) {
  try {
    const project = {
      profile_image: 1,
      profile_status: 1,
      gender: 1,
      state: 1,
      district: 1,
      complexion: 1,
      height: 1,
      heightInCm: 1,
      marital_status: 1,
      drink: 1,
      smoke: 1,
      weight: 1,
      blood_group: 1,
      mother_tongue: 1,
      caste: 1,
      religion: 1,
      gothra: 1,
      brothersDescription: 1,
      no_of_brothers: 1,
      no_of_sisters: 1,
      raasi: 1,
      dob: 1,
      sistersDescription: 1,
      diet: 1,
      birth_place: 1,
      interest: 1,
      body_type: 1,
      college_name: 1,
      currentOrganization: 1,
      currentWorkLocation: 1,
      higher_education: 1,
      higherEducationYear: 1,
      twelfthSchoolBoard: 1,
      twelfthSchoolName: 1,
      twelfthSchoolPassYear: 1,
      twelfthSchoolPercentage: 1,
      tenthSchoolBoard: 1,
      tenthSchoolName: 1,
      tenthSchoolPassYear: 1,
      tenthSchoolPercentage: 1,
      annual_income: 1,
      family_income: 1,
      father_occupation: 1,
      mother_occupation: 1,
      occupation: 1,
      fatherDescription: 1,
      motherDescription: 1,
      occupationDescription: 1,
      otherEducationDescription: 1,
      otherQualificationDetails: 1,
      description: 1,
      mother_tongue: 1,
      user: 1,
      display_name: 1
    };
    const profile = await Profile.findOne(
      {
        user: req.params.id,
        profile_status: { $in: ["approved", "pending"] },
      },
      project
    );
    if (!profile) {
      return res.status(400).json({ data: [], message: "Profile not exits" });
    }

    const photos = await Document.find(
      { user: req.params.id, status: { $in: ["approved"] } },
      { url: 1 }
    );
    profile["higher_education"] = profile["higher_education"]
      ? Constant.education_mapper[profile["higher_education"]]
      : "";
    profile["occupation"] = Constant.occupation_mapper[profile["occupation"]];
    profile["caste"] = Constant.caste_mapper[profile["caste"]];
    profile["religion"] = Constant.religion_mapper[profile["religion"]];
    profile["state"] = Constant.state[profile["state"].toUpperCase()];
    profile["father_occupation"] =
      Constant.occupation_mapper[profile["father_occupation"]];
    profile["mother_occupation"] =
      Constant.occupation_mapper[profile["mother_occupation"]];
    profile["blood_group"] = profile["blood_group"]
      ? profile["blood_group"].toUpperCase()
      : "";
    profile["profile_images"] = photos.map((photo) => photo.url);

    res.status(200).json({ data: profile, message: "success" });

    if (req.user._id == req.params.id) return;
    const visitor_profile = await Profile.findOne({ user: req.user._id });

    var new_interaction = {
      interaction_type: "visitor",
      user: req.params.id,
      profile: profile._id,
      interacted_user: req.user._id,
      interacted_profile: visitor_profile._id,
    };

    const updated_interaction = await Interaction.update(
      {
        user: req.params.id,
        interaction_type: "visitor",
        interacted_user: req.user._id,
      },
      new_interaction,
      { upsert: true }
    );
    return;
  } catch (e) {
    console.log("error", e);
    return res
      .status(500)
      .send({ message: "something went wrong", error: e.message });
  }
};

module.exports.getAllProfiles = async function (req, res) {
  let request_body = req.body;
  try {
    const user = await get_user_profile(req.user._id.toString());

    const page_number = request_body["pageNumber"] || 1;
    const limit = request_body["pageCount"] || 10;

    let skip = (parseInt(page_number) - 1) * parseInt(limit);
    // const criteria = generate_query(user_profile, req.body)
    const [profiles, count, message] = await get_profiles(user, limit, skip);

    for (let i = 0; i < profiles.length; i++) {
      profiles[i].state = Constant.state[profiles[i].state.toUpperCase()];
      profiles[i].religion = Constant.religion_mapper[profiles[i].religion];
      profiles[i].caste = Constant.caste_mapper[profiles[i].caste];
      profiles[i].occupation =
        Constant.occupation_mapper[profiles[i].occupation];
    }
    if (!profiles || profiles.length == 0) {
      res
        .status(200)
        .json({ data: [], message: "No record to show", count: 0 });
      return;
    }
    res.status(200).json({ data: profiles, message: "success", count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something went wrong", data: [] });
  }
};

var upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: "shaadikarlo/userImages",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${req.user._id}_${Date.now()}_${file.originalname}`);
    },
  }),
}).single("file0");

module.exports.image_upload = function (req, res) {
  upload(req, res, async function (err) {
    let photo = new Document({
      user: req.user.id,
      url: req.file.location,
      type: "photo",
    });
    try {
      await photo.save();
      return res.status(200).json({ status: true, message: "success" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: false,
        message: 'An error occured. Image couldn"t be uploaded!',
        error: e.message,
      });
    }
  });
};

module.exports.update_user_profile = async (req, res) => {
  var to_update = {};
  var attribute = Object.keys(req.body);
  try {
    var profile = new Profile(to_update);

    var profile = await Profile.findone_or_create({ user: req.user._id });
    var partner = {};
    attribute.forEach((key) => {
      if (req.body[key]) {
        profile[key] = req.body[key];
        if (key.includes("partner")) {
          partner[key.substring("partner".length + 1)] = req.body[key];
        }
        if (key.includes("height")) {
          profile[key] = req.body[key];
          profile["heightInCm"] = Other.feetToCm(req.body[key]);
        }
      }
    });
    profile.partner = partner;
    var saved_profile = await profile.save();
    return res.status(200).send({ message: "Updated successfully" });
  } catch (e) {
    console.log("error ", e);
    res.status(500).send({ message: "Something went wrong" });
  }
};

async function generate_request_query(user, request_body) {
  let userProfile = await Profile.findOne({ user: user._id }, { gender: 1 });

  const query = {};
  query.profile_status = { $in: ["approved", "pending"] };
  var min_dob, max_age;
  if (!request_body) {
    return query;
  }
  if (
    request_body.caste &&
    Array.isArray(request_body.caste) &&
    request_body.caste.length > 0
  ) {
    var casteRegex = request_body.caste.map(function (val) {
      return new RegExp(val);
    });

    query["caste"] = { $in: casteRegex };
  }
  if (
    request_body.district &&
    Array.isArray(request_body.district) &&
    request_body.district.length > 0
  ) {
    var districtRegex = request_body.district.map(function (val) {
      return new RegExp(val);
    });
    query["district"] = { $in: districtRegex };
  }

  if (
    request_body.education &&
    Array.isArray(request_body.education) &&
    request_body.education.length > 0
  ) {
    var educationRegex = request_body.education.map(function (val) {
      return new RegExp(val);
    });
    query["higher_education"] = { $in: educationRegex };
  } else if (
    request_body.education &&
    typeof request_body.education == "string"
  ) {
    var educationRegex = new RegExp(request_body.education);
    query["higher_education"] = { $in: [educationRegex] };
  }

  if (
    request_body.occupation &&
    Array.isArray(request_body.occupation) &&
    request_body.occupation.length > 0
  ) {
    var occupationRegex = request_body.occupation.map(function (val) {
      return new RegExp(val);
    });
    query["occupation"] = { $in: occupationRegex };
  }

  if (request_body.state) {
    query["state"] = request_body.state.toLowerCase();
  }

  if (request_body.religion) {
    query["religion"] = { $regex: new RegExp(request_body.religion, "i") };
  }

  if (request_body.marital_status && request_body.marital_status.length > 0) {
    query["marital_status"] = [];
    query["marital_status"] = request_body.marital_status;
  }
  if (request_body.minAge) {
    var min_dob = new moment()
      .subtract(parseInt(request_body.minAge), "years")
      .toDate();
  }

  if (request_body.maxAge) {
    var max_dob = new moment()
      .subtract(parseInt(request_body.maxAge), "years")
      .toDate();
  }

  if (min_dob && max_dob) {
    query["dob"] = { $lte: min_dob, $gte: max_dob };
  } else if (min_dob) {
    query["dob"] = { $lte: min_dob };
  } else if (max_dob) {
    query["dob"] = { $gte: max_dob };
  }

  if (request_body.gender) {
    query["gender"] = request_body.gender;
  } else {
    let searchGender = userProfile.gender == "m" ? "f" : "m";
    query["gender"] = searchGender;
  }

  if (request_body.minHeight && request_body.maxHeight) {
    let minHeight = Other.feetToCm(request_body.minHeight);
    let maxHeight = Other.feetToCm(request_body.maxHeight);
    query["heightInCm"] = { $gte: minHeight, $lte: maxHeight };
  } else if (request_body.minHeight) {
    let minHeight = Other.feetToCm(request_body.minHeight);
    query["heightInCm"] = { $gte: minHeight };
  } else if (request_body.maxHeight) {
    let maxHeight = Other.feetToCm(request_body.maxHeight);
    query["heightInCm"] = { $lte: maxHeight };
  }
  console.log("query", query);
  return query;
}

module.exports.regular_search = async (req, res) => {
  let requestBody = req.body;
  let pageNumber = parseInt(requestBody.pageNumber) || 1;
  let limit = parseInt(requestBody.limit) || 10;
  let skip = (pageNumber - 1) * limit;
  var search_query = await generate_request_query(req.user, req.body);
  var query = { dob: { $gte: new Date(2000, 7, 15) } };
  try {
    const profiles = await Profile.aggregate([
      {
        $match: search_query,
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "documents",
          let: {
            photo_status: "approved",
            user_id: "$user",
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
      },
      {
        $project: {
          caste: "$caste",
          religion: "$religion",
          profile_images: "$photos.url",
          dob: "$dob",
          height: "$height",
          marital_status: "$marital_status",
          occupation: "$occupation",
          district: "$district",
          state: "$state",
          gender: "$gender",
          user: "$user",
        },
      },
    ]);
    let count = await Profile.countDocuments(search_query);
    if (!profiles) {
      res.status(404).json({ message: "something went wrong", profiles: [] });
    }
    profiles.map((profile) => {
      profile.state = Constant.state[profile.state];
      return profile;
    });
    res.status(200).json({ profiles, message: "success", count });
  } catch (e) {
    console.log("e", e);
    res
      .status(500)
      .send({ message: "Something went wrong", status: 500, error: e.message });
  }
};

module.exports.get_viewed_contacts = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id.toString(),
    }).populate({
      path: "viewed_contacts",
      populate: { path: "user", select: "email mobile name" },
    });
    const viewed_contacts = profile.viewed_contacts;
    if (!viewed_contacts) {
      res
        .status(200)
        .json({ message: "No contacts viewed", viewed_contacts: [] });
    }
    res.status(200).json({ viewed_contacts, message: "success" });
  } catch (e) {
    res
      .status(500)
      .send({ message: "something went wrong", viewed_contacts: [] });
  }
};

// module.exports.most_dist = async(req, res) => {
// 	try{
// 		const moment = require('moment');
// 	    dateTo = moment().format('YYYY-MM-DD');
// 	    dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
// 		const profiles = await Profile.aggregate(
// 		// { $group: { _id: null, myCount: { $sum: 1 } } },

// 		[
// 		{$match:{dt_created:{$gte:dateFrom}}},
// 		{ $group: {_id:{district:"$district"},
// 					mycount:{$sum:1}, state:{"$first":"$state"}

//                     }
//                      },

//           { $match : { mycount : {$gte:5} } },

//         ]

// 	)

// 	res.status(200).json({profiles:profiles})
// 	}
// 	catch(e){

// 		console.log("e>>>>>>>>>>> ",e);
// 		res.status(500).json({profiles:[]})
// 	}

// }

module.exports.who_viewed_my_profile = async (req, res) => {
  let request_body = req.body;
  let pageNumber = parseInt(request_body.pageNumber) || 1;
  let limit = 10;
  let skip = (pageNumber - 1) * limit;
  try {
    let [profile_list, count] = await Promise.all([
      getInteractionProfiles(req.user._id, "visitor", skip, limit),
      getInteractionCount(req.user._id, "visitor"),
    ]);
    profile_list = getFormattedProfiles(profile_list);
    if (!profile_list) {
      res
        .status(200)
        .json({ message: "No Visitor", profile_list: [], count: 0 });
      return;
    }
    res.status(200).json({ profile_list, message: "success", count: count });
  } catch (e) {
    console.log("errr ", e);
    res.status(500).send({ message: "something went wrong", profile_list: [] });
  }
};

async function getInteractionProfiles(userId, interactionType, skip, limit) {
  let pipeline = [];
  pipeline.push({
    $match: {
      user: userId,
      interaction_type: interactionType,
    },
  });
  pipeline.push({
    $lookup: {
      from: "profiles",
      localField: "interacted_user",
      foreignField: "user",
      as: "profile",
    },
  });
  pipeline.push({
    $lookup: {
      from: "documents",
      // localField: "interacted_user",
      // foreignField: "user",
      let: {
            photo_status: ["approved", "pending"],
            user_id: "$interacted_user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$status", "$$photo_status"] },
                    { $eq: ["$user", "$$user_id"] },
                  ],
                },
              },
            },
          ],
      as: "photos",
    },
  });
  pipeline.push({
    $sort: {
      created_at: -1,
    },
  });
  pipeline.push({
    $skip: skip,
  });
  pipeline.push({
    $limit: limit,
  });

  pipeline.push({
    $project: {
      interacted_user: { $arrayElemAt: ["$profile.user", 0] },
      display_name: { $arrayElemAt: ["$profile.display_name", 0] },
      district: { $arrayElemAt: ["$profile.district", 0] },
      state: { $arrayElemAt: ["$profile.state", 0] },
      height: { $arrayElemAt: ["$profile.height", 0] },
      occupation: { $arrayElemAt: ["$profile.occupation", 0] },
      higher_education: { $arrayElemAt: ["$profile.higher_education", 0] },
      dob: { $arrayElemAt: ["$profile.dob", 0] },
      caste: { $arrayElemAt: ["$profile.caste", 0] },
      religion: { $arrayElemAt: ["$profile.religion", 0] },
      profile_image: { $arrayElemAt: ["$photos.url", 0] },
      gender: { $arrayElemAt: ["$profile.gender", 0] },
    },
  });
  return Interaction.aggregate(pipeline);
}

async function getInteractionCount(userId, interactionType) {
  return Interaction.find({
    user: userId,
    interaction_type: interactionType,
  }).count();
}

function getFormattedProfiles(profiles) {
  return profiles.map((profile) => {
    let obj = {};
    obj.interacted_profile = profile;
    obj.interacted_user = profile.interacted_user;
    obj.interacted_profile.state = Constant.state[profile.state];
    obj.interacted_profile.occupation = Constant.occupation[profile.occupation];
    obj.interacted_profile.higher_education =
      Constant.education[profile.higher_education];
    return obj;
  });
}

module.exports.get_my_interest = async (req, res) => {
  let request_body = req.body;
  let pageNumber = parseInt(request_body.pageNumber) || 1;
  let limit = 10;
  let skip = (pageNumber - 1) * limit;
  try {
    let [profile_list, count] = await Promise.all([
      getInteractionProfiles(req.user._id, "interest", skip, limit),
      getInteractionCount(req.user._id, "interest"),
    ]);
    profile_list = getFormattedProfiles(profile_list);
    if (!profile_list) {
      res
        .status(200)
        .json({ message: "No Interest Sent", profile_list: [], count: 0 });
      return;
    }
    res.status(200).json({ profile_list, message: "success", count: count });
  } catch (e) {
    console.log("errr ", e);
    res.status(500).send({ message: "something went wrong", profile_list: [] });
  }
};

module.exports.get_interested_in_me = async (req, res) => {
  try {
    let count = await Interaction.find({
      interacted_user: req.user._id,
      interaction_type: "interest",
    }).count();
    let profile_list = await Interaction.aggregate([
      {
        $match: { interacted_user: req.user._id, interaction_type: "interest" },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "user",
          foreignField: "user",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "user",
          foreignField: "interacted_user",
          as: "photos",
        },
      },
      {
        $project: {
          interacted_user: { $arrayElemAt: ["$profile.user", 0] },
          display_name: { $arrayElemAt: ["$profile.display_name", 0] },
          district: { $arrayElemAt: ["$profile.district", 0] },
          state: { $arrayElemAt: ["$profile.state", 0] },
          height: { $arrayElemAt: ["$profile.height", 0] },
          occupation: { $arrayElemAt: ["$profile.occupation", 0] },
          higher_education: { $arrayElemAt: ["$profile.higher_education", 0] },
          dob: { $arrayElemAt: ["$profile.dob", 0] },
          caste: { $arrayElemAt: ["$profile.caste", 0] },
          religion: { $arrayElemAt: ["$profile.religion", 0] },
          profile_image: { $arrayElemAt: ["$photos.url", 0] },
          gender: { $arrayElemAt: ["$profile.gender", 0] },
        },
      },
    ]);
    profile_list = getFormattedProfiles(profile_list);

    if (!profile_list) {
      res.status(200).json({ message: "No interest found", profile_list: [] });
    }
    res.status(200).json({ profile_list, message: "success", count: count });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong", profile_list: [] });
  }
};

module.exports.get_my_shortlisted = async (req, res) => {
  let request_body = req.body;
  let pageNumber = parseInt(request_body.pageNumber) || 1;
  let limit = 10;
  let skip = (pageNumber - 1) * limit;
  try {
    let [profile_list, count] = await Promise.all([
      getInteractionProfiles(req.user._id, "favourite", skip, limit),
      getInteractionCount(req.user._id, "favourite"),
    ]);
    profile_list = getFormattedProfiles(profile_list);
    if (!profile_list) {
      res.status(200).json({
        message: "No Shortlisted Profile",
        profile_list: [],
        count: 0,
      });
      return;
    }
    res.status(200).json({ profile_list, message: "success", count: count });
  } catch (e) {
    console.log("errr ", e);
    res.status(500).send({ message: "something went wrong", profile_list: [] });
  }
};

module.exports.contact_viewed_by_me = async (req, res) => {
  let request_body = req.body;
  let pageNumber = parseInt(req.body.pageNumber) || 1;
  let limit = 10;
  let skip = (pageNumber - 1) * limit;

  try {
    let [profile_list, count] = await Promise.all([
      getInteractionProfiles(req.user._id, "contacted", skip, limit),
      getInteractionCount(req.user._id, "contacted"),
    ]);
    profile_list = getFormattedProfiles(profile_list);
    if (!profile_list) {
      res.status(200).json({
        message: "No Contact Viewed",
        profile_list: [],
        count: 0,
      });
      return;
    }
    res.status(200).json({ profile_list, message: "success", count: count });
  } catch (e) {
    console.log("errr ", e);
    res.status(500).send({ message: "something went wrong", profile_list: [] });
  }
};

module.exports.send_interest = async function (req, res) {
  try {
    const to_send_profile = await Profile.findOne({ _id: req.params.id });

    if (!to_send_profile) {
      res.json({ data: [], message: "Profile not exists" });
    }

    const sender_profile = await Profile.findOne({ user: req.user._id });
    var new_interaction = new Interaction({
      interaction_type: "interest",
      user: req.user._id,
      profile: sender_profile._id,
      interacted_user: to_send_profile.user,
      interacted_profile: to_send_profile._id,
    });

    const sent_interaction = await Interaction.findOne({
      user: req.user._id,
      interaction_type: "interest",
      interacted_user: to_send_profile.user,
    });
    if (sent_interaction) {
      res.status(403).send({ message: "Already interest sent " });
      return;
    }

    const [new_inter, to_send_user] = await Promise.all([
      new_interaction.save(),
      User.findOne({ _id: to_send_profile.user }),
    ]);
    var mail_obj = {
      to_send_name: to_send_profile.display_name,
      display_name: sender_profile.display_name,
      height: sender_profile.height || "",
      education: sender_profile.education || "",
      caste: sender_profile.caste || "",
      religion: sender_profile.religion || "",
      occupation: sender_profile.occupation || "",
      income: sender_profile.income || "",
      gender: sender_profile.gender || "",
      profile_url: `https://shaadikarlo.in/member_profile/${sender_profile._id}`,
    };
    let to_send_email = to_send_user.email;
    await send_interest_mail(mail_obj, to_send_email);

    res.status(200).send({ message: "Interest sent" });
  } catch (e) {
    console.log("errrr", e);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports.short_list = async function (req, res) {
  try {
    const to_send_profile = await Profile.findOne({ _id: req.params.id });

    if (!to_send_profile) {
      res.json({ data: [], message: "Profile not exists" });
    }

    const sender_profile = await Profile.findOne({ user: req.user._id });

    var new_interaction = new Interaction({
      interaction_type: "favourite",
      user: req.user._id,
      profile: to_send_profile._id,
      interacted_user: to_send_profile.user,
      interacted_profile: to_send_profile._id,
    });

    const sent_interaction = await Interaction.findOne({
      user: req.user._id,
      interaction_type: "favourite",
      interacted_user: to_send_profile.user,
    });
    if (sent_interaction) {
      res.status(403).send({ message: "Already shortlisted" });
      return;
    }
    const new_inter = await new_interaction.save();
    res.status(200).send({ message: "Success" });
  } catch (e) {
    console.log("errrr", e);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports.get_guest_requested_profile = async (req, res) => {
  let request_body = req.body;
  var query = {};

  if (request_body.gender) {
    query.gender = request_body.gender;
  }

  if (request_body.min_age) {
    query["dob"] = {};

    let age = parseInt(request_body.min_age);
    let dob = moment().subtract(age, "years").toDate();
    query["dob"]["$lte"] = dob;
  }

  if (request_body.max_age) {
    let age = parseInt(request_body.max_age);
    let dob = moment().subtract(age, "years").toDate();
    if (!query.dob) {
      query["dob"] = {};
    }
    query["dob"]["$gte"] = dob;
  }

  if (request_body.state) {
    query.state = new RegExp(request_body.state, "i");
  }

  try {
    const profiles = await Profile.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userObj",
        },
      },
      {
        $match: {
          "userObj.role": "user",
          $or: [
            { "userObj.email_verified": true },
            { "userObj.mobile_verified": true }
          ],
        },
      },
      {
        $lookup: {
          from: "documents",
          let: {
            photo_status: "approved",
            user_id: "$user",
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
      },

      {
        $project: {
          gender: "$gender",
          caste: "$caste",
          religion: "$religion",
          dob: "$dob",
          district: "$district",
          state: "$state",
          marital_status: "$marital_status",
          occupation: "$occupation",
          height: "$height",
          // profile_image: { $arrayElemAt: ["$photos.url", 0] },
          // profile_image: 'https://shaadikarlo.s3.ap-south-1.amazonaws.com/staticImages/website_photos/web_gallery/female.png',
          created_at: "$created_at",
          user: "$user"
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    if (!profiles) {
      res.status(200).json({ message: "No recent profile", profiles: [] });
    }
    for (let i = 0; i < profiles.length; i++) {
      profiles[i].state = Constant.state[profiles[i].state.toUpperCase()];
      if(profiles[i].gender && profiles[i].gender.toLowerCase() == "f"){
        profiles[i].profile_image = 'https://shaadikarlo.s3.ap-south-1.amazonaws.com/staticImages/website_photos/web_gallery/female.png'
      }
      else{
        profiles[i].profile_image = 'https://shaadikarlo.s3.ap-south-1.amazonaws.com/staticImages/website_photos/web_gallery/male.png'
      }
      profiles[i].gender =
        profiles[i].gender && profiles[i].gender.toLowerCase() == "f"
          ? "Female"
          : "Male";
    }
    res.status(200).json({ profiles, message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong", profiles: [] });
  }
};

module.exports.getProfileSharableLink = async (req, res) => {
  let profile_id = req.params.id;

  if (!profile_id) {
    res
      .status(400)
      .send({ message: "Missing profile id in request", status: 400 });
    return;
  }

  let link = await Profile.findOne({ _id: profile_id }, { shared_link: 1 });

  if (link && link.shared_link) {
    res
      .status(200)
      .send({ message: "success", status: 200, shared_link: link.shared_link });
    return;
  }
  let url = `${req.get("origin")}/shared/profile/${profile_id}`;
  TinyURL.shorten(url, async function (link, err) {
    let saved = await Profile.updateOne(
      { _id: profile_id },
      { $set: { shared_link: link } }
    );

    if (!err)
      res
        .status(200)
        .send({ message: "success", status: 200, shared_link: link });
  });
};

module.exports.getSharedProfileAPI = async (req, res) => {
  let profile_id = req.params.id;

  if (!profile_id) {
    res
      .status(400)
      .send({ message: "Profile id is missing in request", status: 400 });
    return;
  }

  const profile = await Profile.findOne({ _id: req.params.id });

  if (!profile.shared_link) {
    res.status(400).send({
      message: "This link has been expired. Please login to view this profile",
      status: 400,
    });
    return;
  }
  if (!profile) {
    res.json({ data: [], message: "Profile not found" });
  }
  res.json({ data: profile, message: "success" });
};

module.exports.list_user_profile_photo = async (req, res) => {
  let profile_id = req.params.id;

  let query = req.query;
  let photos;
  if (query.user_id) {
    photos = await Document.find(
      { user: query.user_id, status: { $in: ["approved", "pending"] } },
      { url: 1 }
    );
  } else {
    photos = await Document.find(
      { user: req.user._id, status: { $in: ["approved", "pending"] } },
      { url: 1 }
    );
  }

  let s3Images = [];
  // console.log("photos>>>>>>>>>> ",photos);
  // var params = { Bucket: 'shaadikarlo/userImages', Key: '5fe9e6de717fd63723769890_1609301282586_address_dl.jpeg' };
  // S3.getObject(params, function(err, data) {
  // 	console.log("err", err, "data *****", data);
  // 	s3Images.push(data);
  //    // res.writeHead(200, {'Content-Type': 'image/jpeg'});
  //    // res.write(data.Body, 'binary');
  //    // res.end(null, 'binary');

  // });

  res.status(200).send({
    message: "success",
    photos: photos.map((photo) => photo.url),
    s3Images: s3Images,
  });
};

module.exports.list_user_profile_photo_guest = async (req, res) => {
  let profile_id = req.params.id;

  let query = req.query;
  let photos;
  if (query.user_id) {
    try {
      photos = await Profile.findOne(
        { user: query.user_id, shared_link: { $exists: true } },
        { profile_images: 1 }
      );
      if (photos && photos.profile_images && photos.profile_images.length > 0) {
        res
          .status(200)
          .send({ message: "success", photos: photos.profile_images });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Something went wrong", status: 500 });
      return;
    }
  }
  res.status(200).send({ message: "success", status: 200, photos: [] });
  return;
};

module.exports.delete_user_profile_photo = async (req, res) => {
  let url = req.body.url;
  try {
    let updated = await Document.updateOne(
      {
        user: req.user._id,
        url,
      },
      {
        $set: { status: "deleted" },
      }
    );
    return res.status(200).send({ message: "success", status: 200 });
  } catch (e) {
    res.status(500).send({
      message: "Something went wrong!",
      status: 500,
      error: e.message,
    });
    return;
  }
};

async function send_interest_mail(mail_obj, to_email) {
  let to = to_email;
  let subject = `${mail_obj.display_name} has expressed interest in your profile`;

  let text = "";

  ejs.renderFile(
    __dirname + "/../../email_templates/interest_received.ejs",
    { data: mail_obj },
    async (err, data) => {
      if (err) {
        throw err;
      } else {
        console.log("html **** ", secret.google.email_full);

        let html = data;

        await mailer.triggerMail(to, subject, text, html, null, null, [
          secret.google.email_full,
        ]);
      }
    }
  );
}

module.exports.adminApproveOrRejectAPI = async (req, res) => {
  let request_body = req.body;

  if (!request_body.id) {
    res.status(400).send({ message: "user_id is missing", status: 400 });
    return;
  }
  if (
    !request_body.action ||
    !["approve", "reject", "disable"].includes(request_body.action)
  ) {
    res.status(400).send({ message: "invalid action status", status: 400 });
    return;
  }

  try {
    let status = "";
    if (request_body.action == "approve") {
      status = "approved";
    } else if (request_body.action == "reject") {
      status = "rejected";
    } else if (request_body.action == "disable") {
      status = "disabled";
    }

    await Profile.updateOne(
      { user: request_body.id },
      { $set: { profile_status: status } }
    );
    res.status(200).send({ message: "success", status: 200 });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ message: "Something went wrong", status: 500, error: e.message });
    return;
  }
};

module.exports.uploadImageAdminAPI = async (req, res) => {
  let userId = req.body.userId;
  if (!userId) {
    return res.status(400).send({ message: "userId is missing", status: 400 });
  }
  if (req.files.length === 0) {
    return res.status(400).send({
      message: "No file selected. Please select a file first",
      status: 400,
    });
  }
  const uploadParams = {
    content: req.files[0].buffer,
    bucketName: `shaadikarlo/userImages`,
    contentType: req.files[0].mimetype,
    objectName: `${userId}_${Date.now().valueOf()}_${
      req.files[0].originalname
    }`,
  };
  try {
    let response = await Other.uploadFileToAWS(uploadParams);
    // await Profile.updateOne(
    //   { user: userId },
    //   { $push: { profile_images: response.path } }
    // );

    let photo = new Document({
      user: userId,
      url: response.path,
      status: 'approved',
      type: "photo",
    });
    let uploadStatus = await photo.save();
    return res.status(200).send({ message: "success", response, status: 200 });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "Something went wrong", error: e.message, status: 500 });
  }
};

module.exports.deleteImageAPI = async (req, res) => {
  const requestBody = req.body;
  if (!requestBody.userId) {
    return res
      .status(400)
      .send({ message: "User is missing in request", status: 400 });
  }
  if (!requestBody.imageUrl) {
    return res
      .status(400)
      .send({ message: "imageUrl is missing in request", status: 400 });
  }

  try {
    let updated = await Document.updateOne(
      { user: requestBody.userId, url: requestBody.imageUrl.url },
      { $set: {status:'deleted'} }
    );

    let deleteParams = {
      Bucket: `shaadikarlo`,
      Key: Other.getKeyFromS3ObjectUrl(requestBody.imageUrl.url),
    };

    let deleted = await Other.deleteFileFromS3Bucket(deleteParams);
    return res.status(200).send({ message: "success", status: 200 });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: "Something went wrong", status: 500, error: e.message });
  }
};
