var Subscription = require("./subscription.model");
var multer = require("multer");
var subscription_utils = require("./subscription.utils");

module.exports.getAll = function (req, res) {
  console.log("get_all >>>>>>>>>>>>>>>>> ", req.user);
  var query = { is_active: true };
  if (req.user.role == "admin") {
    query = {};
  }

  Subscription.find(query).then(function (susbcriptions) {
    if (!susbcriptions) {
      res.json({
        susbcriptions: [],
        message: "No susbcription found",
        status: false,
      });
    }

    res.json({
      subscriptions: susbcriptions,
      message: "Success",
      status: true,
    });
  });
};

module.exports.getSusbciption = function (req, res) {
  var request_body = req.body;
  console.log("req.query>>>>>>>>>>> ", req.query);
  console.log("req.params>>>>>>>>>>> ", req.params.id);
  var subscription_id = request_body.subscription_id || req.params.id;
  if (!subscription_id) {
    res.status(400).json({ message: "No subscription found!!" });
  }

  Subscription.findOne({ _id: subscription_id })
    .limit(5)
    .then(function (subscription) {
      if (!subscription) {
        res.json({ subscription: [], message: "No susbcription found" });
        return;
      }
      console.log("subscription>>>>>>>>>>", subscription);
      res.json({ subscription: subscription, message: "Success" });
    });
};

module.exports.addSubscription = function (req, res) {
  console.log("request_body>>>>>>>>>>>>>> ", req.body);
  var request_body = req.body;

  var new_subs = new Subscription({
    name: request_body.name,
    type: request_body.type,
    description: request_body.description,
    contacts_allowed: request_body.contacts_allowed,
    duration: request_body.duration,
    price: request_body.price,
    is_active: true,
  });
  new_subs.save().then(function (data) {
    res.json({ message: "Susbcription created " });
  });
};

module.exports.updateSubscription = function (req, res) {
  console.log("get_all >>>>>>>>>>>>>>>>> ", req.user);
  var request_body = req.body;
  var susbscription_id = request_body.susbscription_id;
  if (!susbscription_id) {
    res.status(400).json({ message: "No subscription found!!" });
  }

  Subscription.updateOne(
    { _id: susbscription_id },
    { name: request_body.susbcription_name }
  );
  // var new_subs = new Subscription({
  // 	susbcription_name:request_body.susbcription_name,
  // 	susbcription_type:request_body.susbcription_type,
  // 	description: request_body.susbcription_type,
  // 	contacts_allowed:request_body.contacts_allowed,
  // 	duration:request_body.duration
  // })
  // new_subs.save()
  // .then(function(data){
  // 	res.json({ "message":"Susbcription created "})
  // })
};

module.exports.deactivate_subscription = async (req, res) => {
  var subscription_id = req.params.id;
  if (!subscription_id) {
    res.status(400).json({ message: "No subscription found!!" });
  }

  const subscription = await Subscription.updateOne(
    { _id: subscription_id },
    { is_active: false }
  );

  res.status(200).send({ message: "Deactivated" });
};

module.exports.activate_subscription = async (req, res) => {
  var subscription_id = req.params.id;
  if (!subscription_id) {
    res.status(400).json({ message: "No subscription found!!" });
  }
  const subscription = await Subscription.findOne({ _id: subscription_id });
  if (!subscription) {
    res.status(400).json({ message: "No subscription found" });
  }

  if (subscription.is_active) {
    res.status(400).json({ message: "Subscription is already active" });
  }
  const updated_subscription = await Subscription.updateOne(
    { _id: subscription_id },
    { is_active: true }
  );

  res.status(200).send({ message: "Activated" });
};
