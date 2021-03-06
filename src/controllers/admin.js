const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin');

exports.signup = (req, res) => {
  if (req.body.role !== 'admin') {
    return res.status(401).json({
      error: new Error('Permission denied!')
    });
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const adminModel = new AdminModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hash,
        city: req.body.city,
        dobirth: req.body.doBirth,
        sex: req.body.sex,
        imageurl: req.body.imageUrl,
        role: req.body.role,
        enabled: req.body.enabled
      });
      adminModel.save()
        .then(
          () => {
            res.status(201).json({
              message: 'Admin added successfully'
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              message: 'Oops! Something went wrong.',
              error
            });
          }
        );
    });
};

exports.updateAdmin = (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  if (req.body.role !== 'admin') {
    return res.status(401).json({
      error: new Error('Permission denied!')
    });
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const adminModel = new AdminModel({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hash,
        city: req.body.city,
        dobirth: req.body.doBirth,
        sex: req.body.sex,
        imageurl: `${url}/images/${req.body.imageUrl}`,
        role: req.body.role,
        enabled: req.body.enabled
      });
      AdminModel.updateOne({ _id: req.params.id }, adminModel)
        .then(
          () => {
            res.status(201).json({
              message: 'Admin updated successfully'
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              message: 'Oops! Something went wrong.',
              error
            });
          }
        );
    });
};

exports.login = (req, res) => {
  AdminModel.findOne({ email: req.body.email })
    .then((adminModel) => {
      if (!adminModel) {
        return res.status(401).json({
          error: new Error('Admin not found!')
        });
      }
      if (req.body.role !== 'admin') {
        return res.status(401).json({
          error: new Error('Admin not found!')
        });
      }
      return bcrypt.compare(req.body.password, adminModel.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect admin name or password!')
            });
          }
          const token = jwt.sign(
            { adminId: adminModel._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          );
          return res.status(200).json({
            adminId: adminModel._id,
            firstName: adminModel.firstName,
            lastName: adminModel.lastName,
            phoneNumber: adminModel.phoneNumber,
            city: adminModel.city,
            orgName: adminModel.orgName,
            doBirth: adminModel.doBirth,
            sex: adminModel.sex,
            imageurl: adminModel.imageUrl,
            role: adminModel.role,
            enabled: adminModel.enabled,
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
        message: 'Oops! Something went wrong.',
        error
      });
    });
};
