'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./reach-alert-dialog.cjs.prod.js");
} else {
  module.exports = require("./reach-alert-dialog.cjs.dev.js");
}
