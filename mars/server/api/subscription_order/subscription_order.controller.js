const SubscriptionOrder = require("./subscription_order.model");
const Subscription = require("../subscription/subscription.model");
const paymenttransaction_utils = require("../paymenttransaction/paymenttransaction.utils");
const moment = require("moment");
const Other = require("../../lib/other");

async function getSubscriptionUtils(userId) {
  let subscriptions = await SubscriptionOrder.find({ user: userId }).populate([
    "user",
    "paymenttransaction",
  ]);
  if (subscriptions.length === 0) {
    return [];
  }
  subscriptions = Other.getSubscriptionStatus(subscriptions);
  return subscriptions;
}

module.exports.get_all_subscription_of_user = async function (req, res) {
  if (req.params.id && req.params.id != "mine") {
    user_id = req.params.id;
  } else {
    user_id = req.user._id;
  }
  try {
    let subscriptions = await getSubscriptionUtils(user_id);
    res.status(200).json({ subscription_order: subscriptions, status: true });
  } catch (e) {
    res.status(500).json({
      subscription_order: [],
      message: "Server error",
      error: e.message,
    });
  }
};

module.exports.get_all_subscription_orders = async function (req, res) {
  console.log("req.params ", req.params);
  SubscriptionOrder.find({})
    .populate(["user", "paymenttransaction"])
    .then(function (subscriptions) {
      res.status(200).json({ orders: subscriptions, status: true });
    })
    .catch(function (err) {
      res.status(500).json({ message: "Server error", status: false });
    });
};

module.exports.create_promotional_order = async (req, res) => {
  console.log("req.body ", req.body);

  if (!req.body.subs_id) {
    res.status(403).json({ message: "Invalid request" });
  }
  try {
    const subscription = await Subscription.findOne({ _id: req.body.subs_id });
    if (!subscription) {
      res.status(404).json({ message: "No such plan exits" });
      return;
    }
    if (
      subscription.type !== "promotional" ||
      subscription.is_active == false
    ) {
      res.status(404).json({ message: "No such promotional plan exists" });
      return;
    }
    let subscriptions = await getSubscriptionUtils(req.user._id);
    let susbctipionStatus = false;
    if (subscriptions.length !== 0) {
      subscriptions.map((subs) => {
        if (subs.status == "active") susbctipionStatus = true;
      });
    }
    if (susbctipionStatus) {
      return res
        .status(400)
        .json({ message: "Already you have an active subscription" });
    }
    //one more condition to check if promotional plan has been used or not
    var susbcription_data = paymenttransaction_utils.map_subscription_data(
      subscription
    );
    let expiryDate = moment()
      .add("days", parseInt(susbcription_data.duration))
      .toDate();
    var subscription_order = new SubscriptionOrder({
      user: req.user._id,
      subscription: susbcription_data,
      status: "success",
      contacts_available: susbcription_data.contacts_allowed,
      promotional: true,
      expiryDate: expiryDate,
    });

    const new_subscription_order = await subscription_order.save();
    return res
      .status(200)
      .json({ message: "Subscription to promotional plan is success" });
  } catch (e) {
    console.log("e>>>>>>>>>> ", e);
    res.status(500).json({ message: "Something went wrong! " });
  }
};
