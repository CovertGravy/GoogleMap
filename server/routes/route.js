const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//////////////////
// ?models here //
//////////////////
const tariff = require("../models/tariff");
const Driver = require("../models/driver");
const user = require("../models/user");

//////////////////
// ?Tariff APIs //
//////////////////
router.post("/addtariff", (req, res) => {
  let newTariff = new tariff(req.body);
  // newTariff.cabType = req.body.cabType;

  newTariff.save((err, doc) => {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: "Record added!"
      });
    }
  });
});

router.get("/showtariff", (req, res) => {
  tariff.find({}, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

router.get("/showtariff/:id", (req, res) => {
  tariff.find(
    {
      _id: req.params.id
    },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    }
  );
});

router.put("/updatetariff/:id", (req, res) => {
  tariff.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "Tariff updated successfully"
        });
      }
    }
  );
});

router.delete("/deletetariff/:id", (req, res) => {
  tariff.findOneAndRemove(
    {
      _id: req.params.id
    },
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "Record Successfully Deleted"
        });
      }
    }
  );
});

//////////////////
// ?Driver APIs //
//////////////////
router.post("/addDriver", (req, res) => {
  let newDriver = new Driver(req.body);
  // newDriver.cabType = req.body.cabType;

  newDriver.save((err, doc) => {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: "Record added!"
      });
    }
  });
});

router.get("/showDriver", (req, res) => {
  Driver.find({}, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

router.get("/showDriver/:id", (req, res) => {
  Driver.find(
    {
      _id: req.params.id
    },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    }
  );
});

router.put("/updateDriver/:id", (req, res) => {
  Driver.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "Driver updated successfully"
        });
      }
    }
  );
});

router.delete("/deleteDriver/:id", (req, res) => {
  Driver.findOneAndRemove(
    {
      _id: req.params.id
    },
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "Record Successfully Deleted"
        });
      }
    }
  );
});

//////////////////
// ?user APIs //
//////////////////
router.post("/adduser", (req, res) => {
  let newuser = new user(req.body);
  // newuser.cabType = req.body.cabType;

  newuser.save((err, doc) => {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: "Record added!"
      });
    }
  });
});

router.get("/showusers", (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

router.post("/login", (req, res) => {
  user.findOne(
    {
      email: req.body.email
    },
    (err, user_data) => {
      if (err) {
        throw err;
      } else if (!user_data) {
        res.json({
          success: false,
          message: "Incorrect email"
        });
      } else if (!user_data.validPassword(req.body.password)) {
        res.json({
          success: false,
          message: "Incorrect Password"
        });
      } else if (user_data) {
        // res.json(user_data);
        const token = jwt.sign(user_data.toJSON(), "covertsecret", {
          expiresIn: 1440
        });
        res.json({
          success: true,
          token: token,
          isLoggedIn: true,
          details: user_data
        });
      }
    }
  );
});

router.put("/updateuser/:id", (req, res) => {
  user.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "user updated successfully"
        });
      }
    }
  );
});

router.delete("/deleteuser/:id", (req, res) => {
  user.findOneAndRemove(
    {
      _id: req.params.id
    },
    (err, doc) => {
      if (err) {
        throw err;
      } else {
        res.json({
          success: true,
          message: "Record Successfully Deleted"
        });
      }
    }
  );
});

module.exports = router;
