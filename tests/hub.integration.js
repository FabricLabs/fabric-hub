'use strict';

const assert = require('assert');
const Hub = require('../services/hub');

describe('hub.fabric.pub', function () {
  describe('Hub', function () {
    this.timeout(10000);

    it('can smoothly create an instance of the Hub service', function () {
      const hub = new Hub();
      assert.ok(hub);
      assert.ok(hub.id);
    });
  });
});
