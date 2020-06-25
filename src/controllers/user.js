const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const userModel = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hash,
        city: req.body.city,
        org: req.body.org,
        dobirth: req.body.doBirth,
        sex: req.body.sex,
        imageurl: req.body.imageUrl,
        role: req.body.role,
        enabled: req.body.enabled
      });
      userModel.save()
        .then(
          () => {
            res.status(201).json({
              message: 'User added successfully'
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              error
            });
          }
        );
    });
};

exports.login = (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .then((userModel) => {
      if (!userModel) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      return bcrypt.compare(req.body.password, userModel.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect username or password!')
            });
          }
          const token = jwt.sign(
            { userId: userModel._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          );
          return res.status(200).json({
            userId: userModel._id,
            token
          });
        })
        .catch((error) => {
          res.status(500).json({
            error
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
};
