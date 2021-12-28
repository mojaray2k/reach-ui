'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./reach-checkbox.cjs.prod.js");
} else {
  module.exports = require("./reach-checkbox.cjs.dev.js");
}
