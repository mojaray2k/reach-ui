import { useRef, useState, useEffect, createElement, forwardRef, useContext, useMemo } from 'react';
import { createNamedContext } from '@reach/utils/context';
import { makeId } from '@reach/utils/make-id';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import { useId } from '@reach/auto-id';
import warning from 'tiny-warning';
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

var _excluded = ["children", "defaultOpen", "onChange", "open"],
    _excluded2 = ["as", "children", "onClick", "onMouseDown", "onPointerDown"],
    _excluded3 = ["as", "children"];
var DisclosureContext = /*#__PURE__*/createNamedContext("DisclosureContext", {}); ////////////////////////////////////////////////////////////////////////////////

var DisclosureStates; ////////////////////////////////////////////////////////////////////////////////

/**
 * Disclosure
 *
 * The wrapper component and context provider for a disclosure's button and
 * panel components. A disclosure should only have one button and one panel
 * descendant.
 *
 * @see Docs https://reach.tech/disclosure#disclosure-1
 *
 * @param props
 */

(function (DisclosureStates) {
  DisclosureStates["Open"] = "open";
  DisclosureStates["Collapsed"] = "collapsed";
})(DisclosureStates || (DisclosureStates = {}));

var Disclosure = function Disclosure(_ref) {
  var children = _ref.children,
      _ref$defaultOpen = _ref.defaultOpen,
      defaultOpen = _ref$defaultOpen === void 0 ? false : _ref$defaultOpen,
      onChange = _ref.onChange,
      openProp = _ref.open,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  /*
   * You shouldn't switch between controlled/uncontrolled. We'll check for a
   * controlled component and track any changes in a ref to show a warning.
   */
  var wasControlled = openProp != null;

  var _React$useRef = useRef(wasControlled),
      isControlled = _React$useRef.current;

  var id = useId(props.id != null ? String(props.id) : undefined) || "disclosure";
  var panelId = makeId("panel", id); // If a disclosure is uncontrolled, we set its initial state to `true` instead
  // of using its default state prop. This is because we want disclosures to
  // generally be accessible without JavaScript enabled. After the first render
  // we will set state to the `defaultOpen` value.

  var _React$useState = useState(isControlled ? openProp : true),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  useEffect(function () {
    if (!isControlled) {
      setOpen(defaultOpen);
    } // explicitly only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_ENV !== "production" ? warning(!(isControlled && !wasControlled || !isControlled && wasControlled), "Disclosure is changing from controlled to uncontrolled. Disclosure should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Disclosure for the lifetime of the component. Check the `open` prop being passed in.") : void 0;
  }

  function onSelect() {
    onChange == null ? void 0 : onChange();

    if (!isControlled) {
      setOpen(function (open) {
        return !open;
      });
    }
  }

  var context = {
    disclosureId: id,
    onSelect: onSelect,
    open: open,
    panelId: panelId
  };

  if (isControlled && openProp !== open) {
    /*
     * If the component is controlled, we'll sync internal state with the
     * controlled state
     */
    setOpen(openProp);
  }

  return /*#__PURE__*/createElement(DisclosureContext.Provider, {
    value: context
  }, children);
};

if (process.env.NODE_ENV !== "production") {
  Disclosure.displayName = "Disclosure";
  Disclosure.propTypes = {
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool,
    onChange: PropTypes.func,
    open: PropTypes.bool
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * DisclosureButton
 *
 * The trigger button a user clicks to interact with a disclosure.
 *
 * @see Docs https://reach.tech/disclosure#disclosurebutton
 */


var DisclosureButton = /*#__PURE__*/forwardRef(function DisclosureButton(_ref2, forwardedRef) {
  var _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "button" : _ref2$as,
      children = _ref2.children,
      onClick = _ref2.onClick;
      _ref2.onMouseDown;
      _ref2.onPointerDown;
      var props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _React$useContext = useContext(DisclosureContext),
      onSelect = _React$useContext.onSelect,
      open = _React$useContext.open,
      panelId = _React$useContext.panelId;

  var ownRef = useRef(null);
  var ref = useComposedRefs(forwardedRef, ownRef);

  function handleClick(event) {
    event.preventDefault();
    ownRef.current && ownRef.current.focus();
    onSelect();
  }

  return /*#__PURE__*/createElement(Comp // Optionally, the element with role `button` has a value specified for
  // `aria-controls` that refers to the element that contains all the
  // content that is shown or hidden.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#disclosure
  , _extends({
    "aria-controls": panelId // When the content is visible, the element with role `button` has
    // `aria-expanded` set to `true`. When the content area is hidden, it is
    // set to `false`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#disclosure
    ,
    "aria-expanded": open
  }, props, {
    "data-reach-disclosure-button": "",
    "data-state": open ? DisclosureStates.Open : DisclosureStates.Collapsed,
    ref: ref,
    onClick: composeEventHandlers(onClick, handleClick)
  }), children);
});
/**
 * @see Docs https://reach.tech/disclosure#disclosurebutton-props
 */

if (process.env.NODE_ENV !== "production") {
  DisclosureButton.displayName = "DisclosureButton";
  DisclosureButton.propTypes = {
    as: PropTypes.any,
    children: PropTypes.node
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * DisclosurePanel
 *
 * The collapsible panel in which inner content for an disclosure item is
 * rendered.
 *
 * @see Docs https://reach.tech/disclosure#disclosurepanel
 */


var DisclosurePanel = /*#__PURE__*/forwardRef(function DisclosurePanel(_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      children = _ref3.children,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = useContext(DisclosureContext),
      panelId = _React$useContext2.panelId,
      open = _React$useContext2.open;

  return /*#__PURE__*/createElement(Comp, _extends({
    ref: forwardedRef,
    hidden: !open
  }, props, {
    "data-reach-disclosure-panel": "",
    "data-state": open ? DisclosureStates.Open : DisclosureStates.Collapsed,
    id: panelId
  }), children);
});

if (process.env.NODE_ENV !== "production") {
  DisclosurePanel.displayName = "DisclosurePanel";
  DisclosurePanel.propTypes = {};
}
/**
 * @see Docs https://reach.tech/disclosure#disclosurepanel-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * A hook that exposes data for a given `Disclosure` component to its
 * descendants.
 *
 * @see Docs https://reach.tech/disclosure#usedisclosurecontext
 */
function useDisclosureContext() {
  var _React$useContext3 = useContext(DisclosureContext),
      open = _React$useContext3.open,
      panelId = _React$useContext3.panelId,
      disclosureId = _React$useContext3.disclosureId;

  return useMemo(function () {
    return {
      id: disclosureId,
      panelId: panelId,
      open: open
    };
  }, [disclosureId, open, panelId]);
} ////////////////////////////////////////////////////////////////////////////////

export { Disclosure, DisclosureButton, DisclosurePanel, DisclosureStates, useDisclosureContext };
