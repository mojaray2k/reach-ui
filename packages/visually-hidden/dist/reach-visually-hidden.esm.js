import { forwardRef, createElement } from 'react';
import PropTypes from 'prop-types';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded = ["as", "style"];

/**
 * VisuallyHidden
 *
 * Provides text for screen readers that is visually hidden.
 * It is the logical opposite of the `aria-hidden` attribute.
 */
var VisuallyHidden = /*#__PURE__*/forwardRef(function VisuallyHidden(_ref, ref) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "span" : _ref$as,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  return /*#__PURE__*/createElement(Comp, _extends({
    ref: ref,
    style: _extends({
      border: 0,
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
      whiteSpace: "nowrap",
      wordWrap: "normal"
    }, style)
  }, props));
});
/**
 * @see Docs https://reach.tech/visually-hidden#visuallyhidden-props
 */

if (process.env.NODE_ENV !== "production") {
  VisuallyHidden.displayName = "VisuallyHidden";
  VisuallyHidden.propTypes = {
    as: PropTypes.any,
    children: PropTypes.node
  };
} ////////////////////////////////////////////////////////////////////////////////

export default VisuallyHidden;
export { VisuallyHidden };
