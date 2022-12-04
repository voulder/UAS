var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');

router.get('/', function(req, res) {
	console.log("profile");
  User.findOne({unique_id: req.session.userId}, function(err, data) {
    console.log("data");
    console.log(data);
		if (req.session.userId) {
			res.render('index', {
				login_info: true,
				"name": data.username,
        "email": data.email
			});
		} else {
			res.render('index', {
				login_info: false
			});
		}
  });
});
router.get(('/SignUp'), async (req, res) => {
  res.render('SignUp')
});
router.get(('/3DModeling'), async (req, res) => {
  res.render('3DModeling')
});
router.get(('/EarnMoney'), async (req, res) => {
  res.render('EarnMoney')
});
router.get(('/GraphicDesign'), async (req, res) => {
  res.render('GraphicDesign')
});
router.get(('/Illustration'), async (req, res) => {
  res.render('Illustration')
});
router.get(('/LogoDesign'), async (req, res) => {
  res.render('LogoDesign')
});
router.get(('/Profile'), async (req, res) => {
  User.findOne({unique_id: req.session.userId}, function(err, data) {
    res.render('Profile', {
      login_info: true,
      "name": data.username,
      "email": data.email
    });
  })
});
router.get(('/login'), async (req, res, next) => {
  res.render('login.ejs');
});
router.get(('/MobileDesign'), async (req, res) => {
  res.render('MobileDesign')
});
router.get(('/PackageDesign'), async (req, res) => {
  res.render('PackageDesign')
});
router.get(('/PostAProject'), async (req, res) => {
  res.render('PostAProject')
});
router.get(('/viewmore'), async (req, res) => {
  console.log("profile");
  User.findOne({unique_id: req.session.userId}, function(err, data) {
    console.log("data");
    console.log(data);
		if (req.session.userId) {
			res.render('viewmore', {
				login_info: true,
				"name": data.username,
        "email": data.email
			});
		} else {
			res.render('viewmore', {
				login_info: false
			});
		}
  });
});
router.get(('/Website'), async (req, res) => {
  res.render('Website')
});
router.get(('/WordPress'), async (req, res) => {
  res.render('WordPress')
});

router.post('/register', function(req, res, next) {
  console.log(req.body);
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var passwordConf = req.body.passwordConf;

  if (!email || !username || !password || !passwordConf) {
    res.send();
  } else {
    if (password == passwordConf) {

      User.findOne({
        email: email
      }, function(err, data) {
        if (!data) {
          var c;
          User.findOne({}, function(err, data) {

            if (data) {
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              unique_id: c,
              email: email,
              username: username,
              password: password,
              passwordConf: passwordConf
            });

            var salt = 10;

            bcrypt.hash(newPerson.password, salt, function(err, hash) {
              if (err) throw err;

              newPerson.password = hash;

              newPerson.save(function(err, Person) {
                if (err)
                  console.log(err);
                else
                  console.log('Success, you can login now');
              });
            });
          }).sort({
            _id: -1
          }).limit(1);
          res.redirect('/login');
        } else {
          res.send({
            "Success": "Email is already used."
          });
        }

      });
    } else {
      res.send({
        "Success": "password doesn't match"
      });
    }
  }
});

router.post('/login', function(req, res, next) {

  User.findOne({
    email: req.body.email
  }, function(err, data) {
    if (data) {
      bcrypt.compare(req.body.password, data.password, function(err, result) {
        if (result) {
          req.session.userId = data.unique_id;
          res.redirect('/');

        } else {
          res.send({
            "Success": "Wrong password!"
          });
        }
      });
    } else {
      res.send({
        "Success": "This Email Is not registered!"
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  if (req.session) {

    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/forgetpass', function(req, res, next) {
  res.render("forget.ejs");
});

router.post('/forgetpass', function(req, res, next) {

  User.findOne({
    email: req.body.email
  }, function(err, data) {
    console.log(data);
    if (!data) {
      res.send({
        "Success": "This Email is not registered!"
      });
    } else {

      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function(err, Person) {
          if (err)
            console.log(err);
          else
            console.log('Success');
          res.send({
            "Success": "Password changed!"
          });
        });
      } else {
        res.send({
          "Success": "Password does not match!."
        });
      }
    }
  });
});

router.post('/postproject', function(req, res, next) {
  console.log(req.body);
  var projectInfo = req.body;

  if (!projectInfo.project || !projectInfo.description) {
    res.send();
  } else {
    Project.findOne({
      project: projectInfo.project
    }, function(err, data) {
      if (!data) {
        var c;
        Project.findOne({}, function(err, data) {

          if (data) {
            c = data.unique_id + 1;
          } else {
            c = 1;
          }

          var newProject = new Project({
            unique_id: c,
            project: projectInfo.project,
            description: projectInfo.description
          });

          newProject.save(function(err, Project) {
            if (err)
              console.log(err);
            else
              console.log('Success');
          });
        }).sort({
          _id: -1
        }).limit(1);
        res.redirect('/');
      } else {
        res.send({
          "Success": "Incomplete information."
        });
      }
    });
  }
});

module.exports = router;