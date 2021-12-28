'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');
var visuallyHidden = require('@reach/visually-hidden');
var usePrevious = require('@reach/utils/use-previous');
var ownerDocument = require('@reach/utils/owner-document');
var composeRefs = require('@reach/utils/compose-refs');
var PropTypes = require('prop-types');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var PropTypes__default = /*#__PURE__*/_interopDefault(PropTypes);

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

var _excluded = ["as", "children", "type"];

/*
 * Singleton state is fine because you don't server render
 * an alert (SRs don't read them on first load anyway)
 */
var keys = {
  polite: -1,
  assertive: -1
};
var elements = {
  polite: {},
  assertive: {}
};
var liveRegions = {
  polite: null,
  assertive: null
};
var renderTimer; ////////////////////////////////////////////////////////////////////////////////

/**
 * Alert
 *
 * Screen-reader-friendly alert messages. In many apps developers add "alert"
 * messages when network events or other things happen. Users with assistive
 * technologies may not know about the message unless you develop for it.
 *
 * @see Docs https://reach.tech/alert
 */

var Alert = /*#__PURE__*/React.forwardRef(function Alert(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      children = _ref.children,
      _ref$type = _ref.type,
      regionType = _ref$type === void 0 ? "polite" : _ref$type,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var ownRef = React.useRef(null);
  var ref = composeRefs.useComposedRefs(forwardedRef, ownRef);
  var child = React.useMemo(function () {
    return /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
      ref: ref,
      "data-reach-alert": true
    }), children);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [children, props]);
  useMirrorEffects(regionType, child, ownRef);
  return child;
});
/**
 * @see Docs https://reach.tech/alert#alert-props
 */

if (process.env.NODE_ENV !== "production") {
  Alert.displayName = "Alert";
  Alert.propTypes = {
    children: PropTypes__default['default'].node,
    type: /*#__PURE__*/PropTypes__default['default'].oneOf(["assertive", "polite"])
  };
} ////////////////////////////////////////////////////////////////////////////////


function createMirror(type, doc) {
  var key = ++keys[type];

  var mount = function mount(element) {
    if (liveRegions[type]) {
      elements[type][key] = element;
      renderAlerts();
    } else {
      var node = doc.createElement("div");
      node.setAttribute("data-reach-live-" + type, "true");
      liveRegions[type] = node;
      doc.body.appendChild(liveRegions[type]);
      mount(element);
    }
  };

  var update = function update(element) {
    elements[type][key] = element;
    renderAlerts();
  };

  var unmount = function unmount() {
    delete elements[type][key];
    renderAlerts();
  };

  return {
    mount: mount,
    update: update,
    unmount: unmount
  };
}

function renderAlerts() {
  if (renderTimer != null) {
    window.clearTimeout(renderTimer);
  }

  renderTimer = window.setTimeout(function () {
    Object.keys(elements).forEach(function (elementType) {
      var regionType = elementType;
      var container = liveRegions[regionType];

      if (container) {
        ReactDOM.render( /*#__PURE__*/React.createElement(visuallyHidden.VisuallyHidden, {
          as: "div"
        }, /*#__PURE__*/React.createElement("div", {
          // The status role is a type of live region and a container whose
          // content is advisory information for the user that is not
          // important enough to justify an alert, and is often presented as
          // a status bar. When the role is added to an element, the browser
          // will send out an accessible status event to assistive
          // technology products which can then notify the user about it.
          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_status_role
          role: regionType === "assertive" ? "alert" : "status",
          "aria-live": regionType
        }, Object.keys(elements[regionType]).map(function (key) {
          return /*#__PURE__*/React.cloneElement(elements[regionType][key], {
            key: key,
            ref: null
          });
        }))), liveRegions[regionType]);
      }
    });
  }, 500);
}

function useMirrorEffects(regionType, element, ref) {
  var prevType = usePrevious.usePrevious(regionType);
  var mirror = React.useRef(null);
  var mounted = React.useRef(false);
  React.useEffect(function () {
    var ownerDocument$1 = ownerDocument.getOwnerDocument(ref.current);

    if (!mounted.current) {
      mounted.current = true;
      mirror.current = createMirror(regionType, ownerDocument$1);
      mirror.current.mount(element);
    } else if (prevType !== regionType) {
      mirror.current && mirror.current.unmount();
      mirror.current = createMirror(regionType, ownerDocument$1);
      mirror.current.mount(element);
    } else {
      mirror.current && mirror.current.update(element);
    }
  }, [element, regionType, prevType, ref]);
  React.useEffect(function () {
    return function () {
      mirror.current && mirror.current.unmount();
    };
  }, []);
} ////////////////////////////////////////////////////////////////////////////////

exports.Alert = Alert;
exports.default = Alert;
