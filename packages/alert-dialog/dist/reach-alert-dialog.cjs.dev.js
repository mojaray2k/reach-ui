'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var dialog = require('@reach/dialog');
var autoId = require('@reach/auto-id');
var ownerDocument = require('@reach/utils/owner-document');
var context = require('@reach/utils/context');
var makeId = require('@reach/utils/make-id');
var composeRefs = require('@reach/utils/compose-refs');
var invariant = require('invariant');
var PropTypes = require('prop-types');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefault(invariant);
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

var _excluded = ["leastDestructiveRef"],
    _excluded2 = ["children"],
    _excluded3 = ["as"],
    _excluded4 = ["as"],
    _excluded5 = ["id", "isOpen", "onDismiss", "leastDestructiveRef"];
var AlertDialogContext = /*#__PURE__*/context.createNamedContext("AlertDialogContext", {}); ////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogOverlay
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog overlay. In the following example we use the AlertDialogOverlay
 * and AlertDialogContent to have more control over the styles.
 *
 * Note: You must render an `AlertDialogContent` inside.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogoverlay
 */

var AlertDialogOverlay = /*#__PURE__*/React.forwardRef(function AlertDialogOverlay(_ref, forwardedRef) {
  var leastDestructiveRef = _ref.leastDestructiveRef,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var ownRef = React.useRef(null);
  var ref = composeRefs.useComposedRefs(forwardedRef, ownRef);
  var id = autoId.useId(props.id);
  var labelId = id ? makeId.makeId("alert-dialog", id) : undefined;
  var descriptionId = id ? makeId.makeId("alert-dialog-description", id) : undefined;
  return /*#__PURE__*/React.createElement(AlertDialogContext.Provider, {
    value: {
      labelId: labelId,
      descriptionId: descriptionId,
      overlayRef: ownRef,
      leastDestructiveRef: leastDestructiveRef
    }
  }, /*#__PURE__*/React.createElement(dialog.DialogOverlay, _extends({}, props, {
    ref: ref,
    "data-reach-alert-dialog-overlay": true,
    initialFocusRef: leastDestructiveRef
  })));
});

if (process.env.NODE_ENV !== "production") {
  AlertDialogOverlay.displayName = "AlertDialogOverlay";
  AlertDialogOverlay.propTypes = {
    isOpen: PropTypes__default['default'].bool,
    onDismiss: PropTypes__default['default'].func,
    leastDestructiveRef: function leastDestructiveRef() {
      return null;
    },
    children: PropTypes__default['default'].node
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogContent
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog content.
 *
 * Note: Must be a child of `AlertDialogOverlay`.
 *
 * Note: You only need to use this when you are also styling
 * `AlertDialogOverlay`, otherwise you can use the high-level `AlertDialog`
 * component and pass the props to it.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogcontent
 */


var AlertDialogContent = /*#__PURE__*/React.forwardRef(function AlertDialogContent(_ref2, forwardedRef) {
  var children = _ref2.children,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _React$useContext = React.useContext(AlertDialogContext),
      descriptionId = _React$useContext.descriptionId,
      labelId = _React$useContext.labelId,
      leastDestructiveRef = _React$useContext.leastDestructiveRef,
      overlayRef = _React$useContext.overlayRef;

  React.useEffect(function () {
    var ownerDocument$1 = ownerDocument.getOwnerDocument(overlayRef.current);

    if (labelId) {
      !ownerDocument$1.getElementById(labelId) ? process.env.NODE_ENV !== "production" ? invariant__default['default'](false, "@reach/alert-dialog: You must render a `<AlertDialogLabel>`\n          inside an `<AlertDialog/>`.") : invariant__default['default'](false) : void 0;
    }

    !leastDestructiveRef ? process.env.NODE_ENV !== "production" ? invariant__default['default'](false, "@reach/alert-dialog: You must provide a `leastDestructiveRef` to\n          `<AlertDialog>` or `<AlertDialogOverlay/>`. Please see\n          https://ui.reach.tech/alert-dialog/#alertdialogoverlay-leastdestructiveref") : invariant__default['default'](false) : void 0; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelId, leastDestructiveRef]);
  return /*#__PURE__*/React.createElement(dialog.DialogContent // The element that contains all elements of the dialog, including the
  // alert message and any dialog buttons, has role alertdialog.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#alertdialog
  , _extends({
    role: "alertdialog" // The element with role `alertdialog` has a value set for
    // `aria-describedby` that refers to the element containing the alert
    // message.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#alertdialog
    ,
    "aria-describedby": descriptionId // The element with role `alertdialog` has either:
    //   - A value for `aria-labelledby` that refers to the element containing
    //     the title of the dialog if the dialog has a visible label.
    //   - A value for `aria-label` if the dialog does not have a visible
    //     label.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#alertdialog
    ,
    "aria-labelledby": props["aria-label"] ? undefined : labelId
  }, props, {
    ref: forwardedRef // lol: remove in 1.0
    ,
    "data-reach-alert-dialong-content": true,
    "data-reach-alert-dialog-content": true
  }), children);
});
/**
 * @see Docs https://reach.tech/alert-dialog#alertdialogcontent-props
 */

if (process.env.NODE_ENV !== "production") {
  AlertDialogContent.displayName = "AlertDialogContent";
  AlertDialogContent.propTypes = {
    children: PropTypes__default['default'].node
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogLabel
 *
 * The first thing ready by screen readers when the dialog opens, usually the
 * title of the dialog like "Warning!" or "Please confirm!".
 *
 * This is required. The `AlertDialog` will throw an error if no label is
 * rendered.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialoglabel
 */


var AlertDialogLabel = /*#__PURE__*/React.forwardRef(function (_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = React.useContext(AlertDialogContext),
      labelId = _React$useContext2.labelId;

  return /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    ref: forwardedRef,
    id: labelId,
    "data-reach-alert-dialog-label": true
  }));
});

if (process.env.NODE_ENV !== "production") {
  AlertDialogLabel.displayName = "AlertDialogLabel";
}

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogDescription
 *
 * Additional content read by screen readers, usually a longer description
 * about what you need from the user like "This action is permanent, are you
 * sure?" etc.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogdescription
 * @param props
 */
var AlertDialogDescription = /*#__PURE__*/React.forwardRef(function AlertDialogDescription(_ref4, forwardedRef) {
  var _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "div" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  var _React$useContext3 = React.useContext(AlertDialogContext),
      descriptionId = _React$useContext3.descriptionId;

  return /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    ref: forwardedRef,
    id: descriptionId,
    "data-reach-alert-dialog-description": true
  }));
});

if (process.env.NODE_ENV !== "production") {
  AlertDialogDescription.displayName = "AlertDialogDescription";
}

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialog
 *
 * High-level component to render an alert dialog.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialog
 * @param props
 */
var AlertDialog = /*#__PURE__*/React.forwardRef(function AlertDialog(_ref5, forwardedRef) {
  var id = _ref5.id,
      isOpen = _ref5.isOpen,
      onDismiss = _ref5.onDismiss,
      leastDestructiveRef = _ref5.leastDestructiveRef,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  return /*#__PURE__*/React.createElement(AlertDialogOverlay, {
    isOpen: isOpen,
    onDismiss: onDismiss,
    leastDestructiveRef: leastDestructiveRef,
    id: id
  }, /*#__PURE__*/React.createElement(AlertDialogContent, _extends({
    ref: forwardedRef
  }, props)));
});
/**
 * @see Docs https://reach.tech/alert-dialog#alertdialog-props
 */

if (process.env.NODE_ENV !== "production") {
  AlertDialog.displayName = "AlertDialog";
  AlertDialog.propTypes = {
    isOpen: PropTypes__default['default'].bool,
    onDismiss: PropTypes__default['default'].func,
    leastDestructiveRef: function leastDestructiveRef() {
      return null;
    },
    children: PropTypes__default['default'].node
  };
} ////////////////////////////////////////////////////////////////////////////////

exports.AlertDialog = AlertDialog;
exports.AlertDialogContent = AlertDialogContent;
exports.AlertDialogDescription = AlertDialogDescription;
exports.AlertDialogLabel = AlertDialogLabel;
exports.AlertDialogOverlay = AlertDialogOverlay;
