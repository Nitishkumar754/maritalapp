var convert = require("convert-units");
const Secrets = require("./../config/environment/secrets");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

let methods = {
  generateOTP(length) {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },

  feetToCm(heightinFeet) {
    let [feet, inch] = heightinFeet.split(/'/);
    inch = parseInt(inch);
    feet = parseInt(feet);
    let totalHeightInFeet = feet + parseFloat(inch / 12);
    let heightInCm = convert(totalHeightInFeet).from("ft").to("cm").toFixed(0);
    return heightInCm;
  },

  async uploadFileToAWS(uploadParams) {
    let result = {};

    AWS.config.update({
      accessKeyId: Secrets.aws.accessKeyId,
      secretAccessKey: Secrets.aws.secretAccessKey,
      region: Secrets.aws.region,
    });
    uploadParams.objectName
      ? uploadParams.objectName
      : "report-" + moment().valueOf();

    const S3 = new AWS.S3();
    let params = {
      ACL: uploadParams.ACL ? uploadParams.ACL : "public-read",
      Body: uploadParams.content,
      Bucket: uploadParams.bucketName,
      ContentType: uploadParams.contentType,
      Key: uploadParams.objectName,
    };

    try {
      const stored = await S3.upload(params).promise();
      result["status"] = "success";
      result["path"] = stored.Location;
    } catch (err) {
      result["status"] = "failure";
      result["error"] = err;
    }
    console.log("result", result);
    return result;
  },

  async deleteFileFromS3Bucket(params) {
    AWS.config.update({
      accessKeyId: Secrets.aws.accessKeyId,
      secretAccessKey: Secrets.aws.secretAccessKey,
      region: Secrets.aws.region,
    });
    const S3 = new AWS.S3();
    try {
      return new Promise(function (resolve, reject) {
        S3.deleteObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            return reject(err);
          }

          return resolve(data);
        });
      });
    } catch (e) {
      console.log("e", e);
    }
  },

  getKeyFromS3ObjectUrl(objectUrl) {
    let url = decodeURIComponent(objectUrl);
    url = url.split("/");
    let key = "";
    for (let i = 3; i < url.length; i++) {
      if (!key) key = key + "" + url[i];
      else key = key + "/" + url[i];
    }
    return key;
  },

  getSubscriptionStatus(subscriptions) {
    subscriptions = subscriptions.map((subscription) => {
      if (subscription.expiryDate < new Date()) {
        subscription.status = "expired";
      } else if (subscription.contacts_available === 0) {
        subscription.status = "expired";
      } else {
        subscription.status = "active";
      }
      return subscription;
    });
    return subscriptions;
  },
};

module.exports = methods;
