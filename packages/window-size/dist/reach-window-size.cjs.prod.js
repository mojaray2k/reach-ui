'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
var canUseDom = require('@reach/utils/can-use-dom');
var useIsomorphicLayoutEffect = require('@reach/utils/use-isomorphic-layout-effect');

/**
 * Measure the current window dimensions.
 *
 * @see Docs   https://reach.tech/window-size
 * @see Source https://github.com/reach/reach-ui/tree/main/packages/window-size
 */

/**
 * WindowSize
 *
 * @see Docs https://reach.tech/window-size#windowsize
 * @param props
 */

var WindowSize = function WindowSize(_ref) {
  var children = _ref.children;
  var dimensions = useWindowSize();
  return children(dimensions);
};

/**
 * useWindowSize
 *
 * @see Docs https://reach.tech/window-size#usewindowsize
 */


function useWindowSize() {
  var _React$useRef = React.useRef(canUseDom.canUseDOM()),
      hasWindow = _React$useRef.current;

  var _React$useState = React.useState({
    width: hasWindow ? window.innerWidth : 0,
    height: hasWindow ? window.innerHeight : 0
  }),
      dimensions = _React$useState[0],
      setDimensions = _React$useState[1];

  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(function () {
    var resize = function resize() {
      return setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", resize);
    return function () {
      return window.removeEventListener("resize", resize);
    };
  }, []);
  return dimensions;
} // TODO: Remove in 1.0

exports.WindowSize = WindowSize;
exports.default = WindowSize;
exports.useWindowSize = useWindowSize;
