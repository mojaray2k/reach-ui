import { forwardRef, useRef, createElement, useContext, useEffect } from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { useId } from '@reach/auto-id';
import { getOwnerDocument } from '@reach/utils/owner-document';
import { createNamedContext } from '@reach/utils/context';
import { makeId } from '@reach/utils/make-id';
import { useComposedRefs } from '@reach/utils/compose-refs';
import invariant from 'invariant';
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

var _excluded = ["leastDestructiveRef"],
    _excluded2 = ["children"],
    _excluded3 = ["as"],
    _excluded4 = ["as"],
    _excluded5 = ["id", "isOpen", "onDismiss", "leastDestructiveRef"];
var AlertDialogContext = /*#__PURE__*/createNamedContext("AlertDialogContext", {}); ////////////////////////////////////////////////////////////////////////////////

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

var AlertDialogOverlay = /*#__PURE__*/forwardRef(function AlertDialogOverlay(_ref, forwardedRef) {
  var leastDestructiveRef = _ref.leastDestructiveRef,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var ownRef = useRef(null);
  var ref = useComposedRefs(forwardedRef, ownRef);
  var id = useId(props.id);
  var labelId = id ? makeId("alert-dialog", id) : undefined;
  var descriptionId = id ? makeId("alert-dialog-description", id) : undefined;
  return /*#__PURE__*/createElement(AlertDialogContext.Provider, {
    value: {
      labelId: labelId,
      descriptionId: descriptionId,
      overlayRef: ownRef,
      leastDestructiveRef: leastDestructiveRef
    }
  }, /*#__PURE__*/createElement(DialogOverlay, _extends({}, props, {
    ref: ref,
    "data-reach-alert-dialog-overlay": true,
    initialFocusRef: leastDestructiveRef
  })));
});

if (process.env.NODE_ENV !== "production") {
  AlertDialogOverlay.displayName = "AlertDialogOverlay";
  AlertDialogOverlay.propTypes = {
    isOpen: PropTypes.bool,
    onDismiss: PropTypes.func,
    leastDestructiveRef: function leastDestructiveRef() {
      return null;
    },
    children: PropTypes.node
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


var AlertDialogContent = /*#__PURE__*/forwardRef(function AlertDialogContent(_ref2, forwardedRef) {
  var children = _ref2.children,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _React$useContext = useContext(AlertDialogContext),
      descriptionId = _React$useContext.descriptionId,
      labelId = _React$useContext.labelId,
      leastDestructiveRef = _React$useContext.leastDestructiveRef,
      overlayRef = _React$useContext.overlayRef;

  useEffect(function () {
    var ownerDocument = getOwnerDocument(overlayRef.current);

    if (labelId) {
      !ownerDocument.getElementById(labelId) ? process.env.NODE_ENV !== "production" ? invariant(false, "@reach/alert-dialog: You must render a `<AlertDialogLabel>`\n          inside an `<AlertDialog/>`.") : invariant(false) : void 0;
    }

    !leastDestructiveRef ? process.env.NODE_ENV !== "production" ? invariant(false, "@reach/alert-dialog: You must provide a `leastDestructiveRef` to\n          `<AlertDialog>` or `<AlertDialogOverlay/>`. Please see\n          https://ui.reach.tech/alert-dialog/#alertdialogoverlay-leastdestructiveref") : invariant(false) : void 0; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelId, leastDestructiveRef]);
  return /*#__PURE__*/createElement(DialogContent // The element that contains all elements of the dialog, including the
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
    children: PropTypes.node
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


var AlertDialogLabel = /*#__PURE__*/forwardRef(function (_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = useContext(AlertDialogContext),
      labelId = _React$useContext2.labelId;

  return /*#__PURE__*/createElement(Comp, _extends({}, props, {
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
var AlertDialogDescription = /*#__PURE__*/forwardRef(function AlertDialogDescription(_ref4, forwardedRef) {
  var _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "div" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  var _React$useContext3 = useContext(AlertDialogContext),
      descriptionId = _React$useContext3.descriptionId;

  return /*#__PURE__*/createElement(Comp, _extends({}, props, {
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
var AlertDialog = /*#__PURE__*/forwardRef(function AlertDialog(_ref5, forwardedRef) {
  var id = _ref5.id,
      isOpen = _ref5.isOpen,
      onDismiss = _ref5.onDismiss,
      leastDestructiveRef = _ref5.leastDestructiveRef,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  return /*#__PURE__*/createElement(AlertDialogOverlay, {
    isOpen: isOpen,
    onDismiss: onDismiss,
    leastDestructiveRef: leastDestructiveRef,
    id: id
  }, /*#__PURE__*/createElement(AlertDialogContent, _extends({
    ref: forwardedRef
  }, props)));
});
/**
 * @see Docs https://reach.tech/alert-dialog#alertdialog-props
 */

if (process.env.NODE_ENV !== "production") {
  AlertDialog.displayName = "AlertDialog";
  AlertDialog.propTypes = {
    isOpen: PropTypes.bool,
    onDismiss: PropTypes.func,
    leastDestructiveRef: function leastDestructiveRef() {
      return null;
    },
    children: PropTypes.node
  };
} ////////////////////////////////////////////////////////////////////////////////

export { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogLabel, AlertDialogOverlay };
