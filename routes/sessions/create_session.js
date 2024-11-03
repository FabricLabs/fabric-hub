'use strict';

// Dependencies
// const { hashSync, compareSync, genSaltSync } = require('bcrypt'); // user authentication

// Fabric Types
const Token = require('@fabric/core/types/token');

// Exports an Express.js middleware function
module.exports = async function (req, res, next) {
  const { xpub, xprv, seed } = req.body;
  const roles = ['user'];
  console.debug('handling incoming login:', xpub, xprv, seed);

  // Create Token
  const access_token = new Token({
    capability: 'OP_IDENTITY',
    issuer: null,
    subject: 'guest',
    state: {
      roles: roles
    }
  });

  // TODO: sign token
  // TODO: validate token after signing

  res.format({
    json: function () {
      res.json({
        message: 'Authentication successful.',
        token: access_token.toString(),
        username: 'anonymous',
        // isCompliant: user.is_compliant,
        id: null
      });
    },
    html: function () {
      const next = (req.query.next || '/').replace(/[^a-zA-Z0-9\/]/g, '');
      res.cookie('token', access_token.toString(), { httpOnly: true });
      res.redirect(next);
    }
  });
};
