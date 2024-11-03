'use strict';

module.exports = function (req, res) {
  const { xpub, xprv, seed } = req.body;
  res.format({
    json: async() => {
      if (!xpub && !xprv && !seed) return res.status(400).json({ message: 'At least an `xpub` is required.' });
      // TODO: store account
      return res.json({ message: 'Account created successfully.' });
    }
  });
};
