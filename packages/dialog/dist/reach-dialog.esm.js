import { forwardRef, useEffect, createElement, useRef, useCallback } from 'react';
import { Portal } from '@reach/portal';
import { getOwnerDocument } from '@reach/utils/owner-document';
import { isString } from '@reach/utils/type-check';
import { noop } from '@reach/utils/noop';
import { useCheckStyles } from '@reach/utils/dev-utils';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
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

var _excluded = ["as", "isOpen"],
    _excluded2 = ["allowPinchZoom", "as", "dangerouslyBypassFocusLock", "dangerouslyBypassScrollLock", "initialFocusRef", "onClick", "onDismiss", "onKeyDown", "onMouseDown", "unstable_lockFocusAcrossFrames"],
    _excluded3 = ["as", "onClick", "onKeyDown"],
    _excluded4 = ["allowPinchZoom", "initialFocusRef", "isOpen", "onDismiss"];
var overlayPropTypes = {
  allowPinchZoom: PropTypes.bool,
  dangerouslyBypassFocusLock: PropTypes.bool,
  dangerouslyBypassScrollLock: PropTypes.bool,
  // TODO:
  initialFocusRef: function initialFocusRef() {
    return null;
  },
  onDismiss: PropTypes.func
}; ////////////////////////////////////////////////////////////////////////////////

/**
 * DialogOverlay
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog overlay.
 *
 * Note: You must render a `DialogContent` inside.
 *
 * @see Docs https://reach.tech/dialog#dialogoverlay
 */

var DialogOverlay = /*#__PURE__*/forwardRef(function DialogOverlay(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? true : _ref$isOpen,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  useCheckStyles("dialog"); // We want to ignore the immediate focus of a tooltip so it doesn't pop
  // up again when the menu closes, only pops up when focus returns again
  // to the tooltip (like native OS tooltips).

  useEffect(function () {
    if (isOpen) {
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = true;
    } else {
      window.requestAnimationFrame(function () {
        // Wait a frame so that this doesn't fire before tooltip does
        // @ts-ignore
        window.__REACH_DISABLE_TOOLTIPS = false;
      });
    }
  }, [isOpen]);
  return isOpen ? /*#__PURE__*/createElement(Portal, {
    "data-reach-dialog-wrapper": ""
  }, /*#__PURE__*/createElement(DialogInner, _extends({
    ref: forwardedRef,
    as: Comp
  }, props))) : null;
});

if (process.env.NODE_ENV !== "production") {
  DialogOverlay.displayName = "DialogOverlay";
  DialogOverlay.propTypes = /*#__PURE__*/_extends({}, overlayPropTypes, {
    isOpen: PropTypes.bool
  });
}

////////////////////////////////////////////////////////////////////////////////

/**
 * DialogInner
 */
var DialogInner = /*#__PURE__*/forwardRef(function DialogInner(_ref2, forwardedRef) {
  var allowPinchZoom = _ref2.allowPinchZoom,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "div" : _ref2$as,
      _ref2$dangerouslyBypa = _ref2.dangerouslyBypassFocusLock,
      dangerouslyBypassFocusLock = _ref2$dangerouslyBypa === void 0 ? false : _ref2$dangerouslyBypa,
      _ref2$dangerouslyBypa2 = _ref2.dangerouslyBypassScrollLock,
      dangerouslyBypassScrollLock = _ref2$dangerouslyBypa2 === void 0 ? false : _ref2$dangerouslyBypa2,
      initialFocusRef = _ref2.initialFocusRef,
      onClick = _ref2.onClick,
      _ref2$onDismiss = _ref2.onDismiss,
      onDismiss = _ref2$onDismiss === void 0 ? noop : _ref2$onDismiss,
      onKeyDown = _ref2.onKeyDown,
      onMouseDown = _ref2.onMouseDown,
      unstable_lockFocusAcrossFrames = _ref2.unstable_lockFocusAcrossFrames,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var lockFocusAcrossFramesIsDefined = unstable_lockFocusAcrossFrames !== undefined;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(function () {
      if (lockFocusAcrossFramesIsDefined) {
        console.warn("The unstable_lockFocusAcrossFrames in @reach/dialog is deprecated. It will be removed in the next minor release.");
      }
    }, [lockFocusAcrossFramesIsDefined]);
  }

  var mouseDownTarget = useRef(null);
  var overlayNode = useRef(null);
  var ref = useComposedRefs(overlayNode, forwardedRef);
  var activateFocusLock = useCallback(function () {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [initialFocusRef]);

  function handleClick(event) {
    if (mouseDownTarget.current === event.target) {
      event.stopPropagation();
      onDismiss(event);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onDismiss(event);
    }
  }

  function handleMouseDown(event) {
    mouseDownTarget.current = event.target;
  }

  useEffect(function () {
    return overlayNode.current ? createAriaHider(overlayNode.current) : void null;
  }, []);
  return /*#__PURE__*/createElement(FocusLock, {
    autoFocus: true,
    returnFocus: true,
    onActivation: activateFocusLock,
    disabled: dangerouslyBypassFocusLock,
    crossFrame: unstable_lockFocusAcrossFrames != null ? unstable_lockFocusAcrossFrames : true
  }, /*#__PURE__*/createElement(RemoveScroll, {
    allowPinchZoom: allowPinchZoom,
    enabled: !dangerouslyBypassScrollLock
  }, /*#__PURE__*/createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-dialog-overlay": ""
    /*
     * We can ignore the `no-static-element-interactions` warning here
     * because our overlay is only designed to capture any outside
     * clicks, not to serve as a clickable element itself.
     */
    ,
    onClick: composeEventHandlers(onClick, handleClick),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
    onMouseDown: composeEventHandlers(onMouseDown, handleMouseDown)
  }))));
});

if (process.env.NODE_ENV !== "production") {
  DialogOverlay.displayName = "DialogOverlay";
  DialogOverlay.propTypes = /*#__PURE__*/_extends({}, overlayPropTypes);
} ////////////////////////////////////////////////////////////////////////////////

/**
 * DialogContent
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog content.
 *
 * Note: Must be a child of `DialogOverlay`.
 *
 * Note: You only need to use this when you are also styling `DialogOverlay`,
 * otherwise you can use the high-level `Dialog` component and pass the props
 * to it. Any props passed to `Dialog` component (besides `isOpen` and
 * `onDismiss`) will be spread onto `DialogContent`.
 *
 * @see Docs https://reach.tech/dialog#dialogcontent
 */


var DialogContent = /*#__PURE__*/forwardRef(function DialogContent(_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      onClick = _ref3.onClick;
      _ref3.onKeyDown;
      var props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  return /*#__PURE__*/createElement(Comp, _extends({
    "aria-modal": "true",
    role: "dialog",
    tabIndex: -1
  }, props, {
    ref: forwardedRef,
    "data-reach-dialog-content": "",
    onClick: composeEventHandlers(onClick, function (event) {
      event.stopPropagation();
    })
  }));
});
/**
 * @see Docs https://reach.tech/dialog#dialogcontent-props
 */

if (process.env.NODE_ENV !== "production") {
  DialogContent.displayName = "DialogContent";
  DialogContent.propTypes = {
    "aria-label": ariaLabelType,
    "aria-labelledby": ariaLabelType
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * Dialog
 *
 * High-level component to render a modal dialog window over the top of the page
 * (or another dialog).
 *
 * @see Docs https://reach.tech/dialog#dialog
 */


var Dialog = /*#__PURE__*/forwardRef(function Dialog(_ref4, forwardedRef) {
  var _ref4$allowPinchZoom = _ref4.allowPinchZoom,
      allowPinchZoom = _ref4$allowPinchZoom === void 0 ? false : _ref4$allowPinchZoom,
      initialFocusRef = _ref4.initialFocusRef,
      isOpen = _ref4.isOpen,
      _ref4$onDismiss = _ref4.onDismiss,
      onDismiss = _ref4$onDismiss === void 0 ? noop : _ref4$onDismiss,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  return /*#__PURE__*/createElement(DialogOverlay, {
    allowPinchZoom: allowPinchZoom,
    initialFocusRef: initialFocusRef,
    isOpen: isOpen,
    onDismiss: onDismiss
  }, /*#__PURE__*/createElement(DialogContent, _extends({
    ref: forwardedRef
  }, props)));
});
/**
 * @see Docs https://reach.tech/dialog#dialog-props
 */

if (process.env.NODE_ENV !== "production") {
  Dialog.displayName = "Dialog";
  Dialog.propTypes = {
    isOpen: PropTypes.bool,
    onDismiss: PropTypes.func,
    "aria-label": ariaLabelType,
    "aria-labelledby": ariaLabelType
  };
} ////////////////////////////////////////////////////////////////////////////////


function createAriaHider(dialogNode) {
  var originalValues = [];
  var rootNodes = [];
  var ownerDocument = getOwnerDocument(dialogNode);

  if (!dialogNode) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("A ref has not yet been attached to a dialog node when attempting to call `createAriaHider`.");
    }

    return noop;
  }

  Array.prototype.forEach.call(ownerDocument.querySelectorAll("body > *"), function (node) {
    var _dialogNode$parentNod, _dialogNode$parentNod2;

    var portalNode = (_dialogNode$parentNod = dialogNode.parentNode) == null ? void 0 : (_dialogNode$parentNod2 = _dialogNode$parentNod.parentNode) == null ? void 0 : _dialogNode$parentNod2.parentNode;

    if (node === portalNode) {
      return;
    }

    var attr = node.getAttribute("aria-hidden");
    var alreadyHidden = attr !== null && attr !== "false";

    if (alreadyHidden) {
      return;
    }

    originalValues.push(attr);
    rootNodes.push(node);
    node.setAttribute("aria-hidden", "true");
  });
  return function () {
    rootNodes.forEach(function (node, index) {
      var originalValue = originalValues[index];

      if (originalValue === null) {
        node.removeAttribute("aria-hidden");
      } else {
        node.setAttribute("aria-hidden", originalValue);
      }
    });
  };
}

function ariaLabelType(props, propName, compName, location, propFullName) {
  var details = "\nSee https://www.w3.org/TR/wai-aria/#aria-label for details.";

  if (!props["aria-label"] && !props["aria-labelledby"]) {
    return new Error("A <" + compName + "> must have either an `aria-label` or `aria-labelledby` prop.\n      " + details);
  }

  if (props["aria-label"] && props["aria-labelledby"]) {
    return new Error("You provided both `aria-label` and `aria-labelledby` props to a <" + compName + ">. If the a label for this component is visible on the screen, that label's component should be given a unique ID prop, and that ID should be passed as the `aria-labelledby` prop into <" + compName + ">. If the label cannot be determined programmatically from the content of the element, an alternative label should be provided as the `aria-label` prop, which will be used as an `aria-label` on the HTML tag." + details);
  } else if (props[propName] != null && !isString(props[propName])) {
    return new Error("Invalid prop `" + propName + "` supplied to `" + compName + "`. Expected `string`, received `" + (Array.isArray(propFullName) ? "array" : typeof propFullName) + "`.");
  }

  return null;
} ////////////////////////////////////////////////////////////////////////////////

export default Dialog;
export { Dialog, DialogContent, DialogOverlay };
