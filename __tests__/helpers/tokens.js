const mongoose = require('mongoose');
const { issueToken } = require('../../src/services/authService');

const createToken = (subject = {}) => issueToken({ userId: new mongoose.Types.ObjectId().toString(), ...subject });

const bearer = (token) => `Bearer ${token}`;

module.exports = { createToken, bearer };
