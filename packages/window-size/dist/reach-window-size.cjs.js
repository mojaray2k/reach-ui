'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./reach-window-size.cjs.prod.js");
} else {
  module.exports = require("./reach-window-size.cjs.dev.js");
}
