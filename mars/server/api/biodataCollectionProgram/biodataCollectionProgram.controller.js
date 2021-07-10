const BioddataCollection = require("./bioddataCollectionProgram.model");
const secret = require("../../config/environment/secrets");
const Commondata = require("../commondata/commondata.model");
const accessKeyId = secret.aws.accessKeyId;
const secretAccessKey = secret.aws.secretAccessKey;
const region = secret.aws.region;
const apiVersion = secret.aws.apiVersion;
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const uploadToS3 = async (uploadParams) => {
  const result = {};

  const S3 = new AWS.S3();
  const params = {
    ACL: "private",
    Body: uploadParams.content,
    Bucket: uploadParams.bucketName,
    ContentType: uploadParams.contentType,
    Key: uploadParams.objectName,
  };

  try {
    const stored = await S3.upload(params).promise();
    result.status = "success";
    result.path = stored.Location;
  } catch (err) {
    result.status = "failure";
    result.error = err;
  }
  return result;
};

module.exports.uploadBiodataApi = async (req, res) => {
  console.log(
    "request.connection.remoteAddress ********",
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null
  );
  const requestBody = req.body;
  console.log("requestBody", requestBody);

  console.log("files", req.files);
  let maleAmount = 0;
  let femaleAmount = 0;
  try {
    let commondata = await Commondata.find({
      name: "biodatacollection",
      isActive: true,
    }).sort({ createdAt: -1 });
    if (!commondata.length) {
      return res
        .status(400)
        .send({ message: "यह अभियान (campaign) समाप्त हो गया है" });
    }
    commondata = commondata[0];

    console.log("commondata", commondata);
    const endTime = commondata.data[1].endTime;

    console.log("endTime", endTime);

    const currentTime = new Date();
    console.log("currentTime", currentTime);
    if (currentTime > endTime) {
      return res
        .status(400)
        .send({ message: "यह अभियान (campaign) समाप्त हो गया है !" });
    }

    maleAmount = commondata.data[0].male;
    femaleAmount = commondata.data[0].female;
  } catch (e) {
    console.log("e", e);
    return res.status(500).send({
      message: "कोई प्रॉब्लम आ गया है, कृपया थोड़ी देर बाद कोशिश करें !",
    });
  }

  const { name, mobileNumber, gender } = requestBody;
  if (!name) {
    return res.status(400).send({ message: "कृपया अपना नाम भरें !" });
  }
  if (!mobileNumber) {
    return res.status(400).send({ message: "कृपया अपना मोबाइल भरें !" });
  }

  if (!gender) {
    return res
      .status(400)
      .send({ message: "कृपया बायोडाटा का gender चुनें !" });
  }
  const amount = gender == "f" ? femaleAmount : maleAmount;

  console.log(req.files);
  if (!req.files.length) {
    return res
      .status(400)
      .send({ message: "आपने कोई भी फाइल सेलेक्ट नहीं किया है!" });
  }

  const date = new Date();
  const promises = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    let sizeByte = Buffer.byteLength(file.buffer);
    let sizeinMb = sizeByte / 1024 / 1024;
    sizeinMb = sizeinMb.toFixed(0);
    console.log("sizeinMb", sizeinMb);
    if (sizeinMb > 5) {
      return res
        .status(200)
        .send({ message: "फाइल साइज 5mb से अधिक की अनुमति नहीं है " });
      break;
    }
    const uploadParams = {
      content: file.buffer,
      bucketName: `biodatacollection/biodata/${mobileNumber}`,
      objectName: `${date.valueOf()}_${mobileNumber}_${file.originalname}`,
      contentType: file.mimetype,
    };

    promises.push(uploadToS3(uploadParams));
  }
  // return;
  try {
    res.status(200).send({
      message:
        "बायोडाटा  अपलोड हो रहा है, स्टेटस जानने के लिए कृपया थोड़ी देर बाद पेज को रिफ्रेश करें ",
    });
    const result = await Promise.all(promises);
    console.log("result", result);
    BioddataCollection.create({
      mobileNumber: mobileNumber,
      uploadedBy: name,
      bioDataUrl:
        result[0] && result[0].status == "success" ? result[0].path : undefined,
      photoUrl1:
        result[1] && result[1].status == "success" ? result[1].path : undefined,
      photoUrl2:
        result[2] && result[2].status == "success" ? result[2].path : undefined,
      gender,
      amount,
    });
  } catch (e) {
    console.log(e);
    // return res.status(500).send({"message":"कुछ गलत हो गया! कृपया contact us पेज पे जाकर अपना शिकायत दर्ज करें !", error: e.message});
  }
};

module.exports.listBiodataApi = async (req, res) => {
  try {
    const uploadedBio = await BioddataCollection.find({}).sort({
      createdAt: -1,
    });

    const allBios = [];
    for (let i = 0; i < uploadedBio.length; i++) {
      const obj = {};
      let mobile = uploadedBio[i].mobileNumber;
      obj["uploadedby"] = uploadedBio[i].uploadedBy;
      obj["mobileNumber"] = mobile.slice(0, 4) + "****" + mobile.slice(8);
      obj["biodata"] = uploadedBio[i].bioDataUrl ? "Submitted" : "Failed";
      obj["photo1"] = uploadedBio[i].photoUrl1 ? "Submitted" : "Failed";
      obj["photo2"] = uploadedBio[i].photoUrl2 ? "Submitted" : "Failed";
      obj["amount"] = uploadedBio[i].amount;
      obj["verification"] = uploadedBio[i].verificationStatus;
      obj["payment"] = uploadedBio[i].paymentStatus;

      allBios.push(obj);
    }
    const options = {
      count: allBios.length,
      showCount: false,
    };

    return res.status(200).send({ message: "success", allBios, options });
  } catch (e) {
    console.log(e);

    return res.status(500).send({
      message:
        "कुछ गलत हो गया! कृपया contact us पेज पे जाकर अपना शिकायत दर्ज करें !",
    });
  }
};

async function getCampaign() {
  try {
    let commondata = await Commondata.find({
      name: "biodatacollection",
      isActive: true,
    }).sort({ createdAt: -1 });
    if (!commondata.length) return null;
    commondata = commondata[0];
    return commondata;
  } catch (e) {
    console.log("error", e);
    return null;
  }
}

module.exports.getCampaignStatus = async (req, res) => {
  let campaign = await getCampaign();

  if (!campaign) {
    return res.status(400).send({ message: "No capaign found", status: false });
  }
  console.log("campaign", campaign);
  const isActive = campaign.isActive;
  const endTime = campaign.data[1].endTime;
  const maleBioAmount = campaign.data[0].male;
  const femaleBioAmount = campaign.data[0].female;
  const termsandconditions = campaign.data[2].termsandconditions;
  const howitworks = campaign.data[3].howitworks;

  const currentTime = new Date();
  let campaignStatus = true;
  if (currentTime > endTime || !isActive) {
    campaignStatus = false;
  }

  if (!campaignStatus) {
    termsandconditions = "";
    howitworks = "";
  }
  let campaignObj = {
    isActive,
    endTime,
    campaignStatus,
    maleBioAmount,
    femaleBioAmount,
    termsandconditions,
    howitworks,
  };

  return res.status(200).send({ message: "", campaign: campaignObj });
};
