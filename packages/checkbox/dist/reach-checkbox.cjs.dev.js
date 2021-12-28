'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var context = require('@reach/utils/context');
var typeCheck = require('@reach/utils/type-check');
var devUtils = require('@reach/utils/dev-utils');
var composeRefs = require('@reach/utils/compose-refs');
var composeEventHandlers = require('@reach/utils/compose-event-handlers');
var useIsomorphicLayoutEffect = require('@reach/utils/use-isomorphic-layout-effect');
var machine = require('@reach/machine');
var warning = require('tiny-warning');
var PropTypes = require('prop-types');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var warning__default = /*#__PURE__*/_interopDefault(warning);
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

var _excluded = ["as", "checked", "defaultChecked", "disabled", "onChange"];

var _commonEvents;
// Used for development only, not recommended for production code!
var DEBUG = false; ////////////////////////////////////////////////////////////////////////////////
// States

 ////////////////////////////////////////////////////////////////////////////////
// Events

(function (MixedCheckboxStates) {
  MixedCheckboxStates["Checked"] = "checked";
  MixedCheckboxStates["Mixed"] = "mixed";
  MixedCheckboxStates["Unchecked"] = "unchecked";
})(exports.MixedCheckboxStates || (exports.MixedCheckboxStates = {}));

 ////////////////////////////////////////////////////////////////////////////////
// Actions & Conditions

/**
 * Toggle events will only update state if the checkbox component is
 * uncontrolled and not disabled.
 *
 * @param context
 */

(function (MixedCheckboxEvents) {
  MixedCheckboxEvents["GetDerivedData"] = "GET_DERIVED_DATA";
  MixedCheckboxEvents["Mount"] = "MOUNT";
  MixedCheckboxEvents["Set"] = "SET";
  MixedCheckboxEvents["Toggle"] = "TOGGLE";
  MixedCheckboxEvents["Unmount"] = "UNMOUNT";
})(exports.MixedCheckboxEvents || (exports.MixedCheckboxEvents = {}));

function checkToggleAllowed(data) {
  return !!(data && !data.isControlled && !data.disabled);
}
/**
 * Set events will update state if the checkbox component is controlled and
 * the state target state matches the state passed in the event.
 *
 * @param state
 */


function getCheckSetCondition(state) {
  return function (data, event) {
    return data && data.isControlled && event.state === state;
  };
}
/**
 * Assign refs to the machine's context data
 */


var assignRefs = /*#__PURE__*/machine.assign(function (data, event) {
  return _extends({}, data, {
    refs: event.refs
  });
}); ////////////////////////////////////////////////////////////////////////////////
// State Machine

var commonEvents = (_commonEvents = {}, _commonEvents[exports.MixedCheckboxEvents.Mount] = {
  actions: assignRefs
}, _commonEvents[exports.MixedCheckboxEvents.GetDerivedData] = {
  actions: [assignRefs, /*#__PURE__*/machine.assign(function (data, event) {
    return _extends({}, data, event.data);
  })]
}, _commonEvents[exports.MixedCheckboxEvents.Set] = [{
  target: exports.MixedCheckboxStates.Checked,
  cond: /*#__PURE__*/getCheckSetCondition(exports.MixedCheckboxStates.Checked)
}, {
  target: exports.MixedCheckboxStates.Unchecked,
  cond: /*#__PURE__*/getCheckSetCondition(exports.MixedCheckboxStates.Unchecked)
}, {
  target: exports.MixedCheckboxStates.Mixed,
  cond: /*#__PURE__*/getCheckSetCondition(exports.MixedCheckboxStates.Mixed)
}], _commonEvents);
/**
 * Initializer for our state machine.
 *
 * @param initial
 * @param props
 */

var createMachineDefinition = function createMachineDefinition(initial, props) {
  var _extends2, _extends3, _extends4, _states;

  return {
    id: "mixed-checkbox",
    initial: initial,
    context: {
      disabled: props.disabled,
      isControlled: props.isControlled,
      refs: {
        input: null
      }
    },
    states: (_states = {}, _states[exports.MixedCheckboxStates.Unchecked] = {
      entry: assignRefs,
      on: _extends((_extends2 = {}, _extends2[exports.MixedCheckboxEvents.Toggle] = {
        target: exports.MixedCheckboxStates.Checked,
        cond: checkToggleAllowed
      }, _extends2), commonEvents)
    }, _states[exports.MixedCheckboxStates.Checked] = {
      entry: assignRefs,
      on: _extends((_extends3 = {}, _extends3[exports.MixedCheckboxEvents.Toggle] = {
        target: exports.MixedCheckboxStates.Unchecked,
        cond: checkToggleAllowed
      }, _extends3), commonEvents)
    }, _states[exports.MixedCheckboxStates.Mixed] = {
      entry: assignRefs,
      on: _extends((_extends4 = {}, _extends4[exports.MixedCheckboxEvents.Toggle] = {
        target: exports.MixedCheckboxStates.Checked,
        cond: checkToggleAllowed
      }, _extends4), commonEvents)
    }, _states)
  };
}; ////////////////////////////////////////////////////////////////////////////////

/**
 * MixedCheckbox
 *
 * Tri-state checkbox that accepts `checked` values of `true`, `false` or
 * `"mixed"`.
 *
 * @see Docs https://reach.tech/checkbox#mixedcheckbox-1
 */


var MixedCheckbox = /*#__PURE__*/React.forwardRef(function MixedCheckbox(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "input" : _ref$as,
      checked = _ref.checked,
      defaultChecked = _ref.defaultChecked,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var ownRef = React.useRef(null);
  var ref = composeRefs.useComposedRefs(forwardedRef, ownRef);

  var _useMixedCheckbox = useMixedCheckbox(ownRef, {
    onChange: onChange,
    checked: checked,
    defaultChecked: defaultChecked,
    disabled: disabled
  }, "MixedCheckbox"),
      inputProps = _useMixedCheckbox[0];

  useControlledSwitchWarning(checked, "checked", "MixedCheckbox");
  return /*#__PURE__*/React.createElement(Comp, _extends({}, props, inputProps, {
    "data-reach-mixed-checkbox": "",
    ref: ref
  }));
});

if (process.env.NODE_ENV !== "production") {
  MixedCheckbox.displayName = "MixedCheckbox";
  MixedCheckbox.propTypes = {
    checked: /*#__PURE__*/PropTypes__default['default'].oneOfType([PropTypes__default['default'].bool, /*#__PURE__*/PropTypes__default['default'].oneOf(["mixed"])]),
    onChange: PropTypes__default['default'].func
  };
} ////////////////////////////////////////////////////////////////////////////////


/**
 * useMixedCheckbox
 *
 * React hook to create a tri-state checkbox that accepts `checked` values of
 * `true`, `false` or `"mixed"`.
 *
 * @see Docs https://reach.tech/checkbox#usemixedcheckbox
 *
 * @param ref
 * @param args
 */
function useMixedCheckbox(ref, args, functionOrComponentName) {
  if (functionOrComponentName === void 0) {
    functionOrComponentName = "useMixedCheckbox";
  }

  var _ref2 = args || {},
      controlledChecked = _ref2.checked,
      defaultChecked = _ref2.defaultChecked,
      disabled = _ref2.disabled,
      onChange = _ref2.onChange,
      onClick = _ref2.onClick;

  var isControlled = controlledChecked != null;
  var machine$1 = machine.useCreateMachine(createMachineDefinition(checkedPropToStateValue(isControlled ? controlledChecked : defaultChecked), {
    disabled: !!disabled,
    isControlled: isControlled
  }));

  var _useMachine = machine.useMachine(machine$1, {
    input: ref
  }, DEBUG),
      current = _useMachine[0],
      send = _useMachine[1];

  var props = {
    "aria-checked": stateValueToAriaChecked(current.value),
    checked: stateValueToChecked(current.value),
    disabled: !!disabled,
    onChange: composeEventHandlers.composeEventHandlers(onChange, handleChange),
    onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick),
    type: "checkbox"
  };
  var contextData = {
    checked: stateValueToAriaChecked(current.value)
  };

  function handleChange() {
    /*
     * If the component is not controlled by the app, we will send the toggle
     * event when the input change handler is called and let our state machine
     * dictate the next state. Othewise we'll call onChange directly and react
     * to any resulting state changes as a side effect.
     */
    if (!isControlled) {
      send(exports.MixedCheckboxEvents.Toggle);
    }
  }

  function handleClick() {
    /*
     * A controlled checkbox will have a checked="mixed" prop, but the
     * underlying input element will receive checked="false" and
     * aria-checked="mixed". A user click will change the underlying
     * element's indeterminate property back to false even if the state
     * doesn't change. This does not trigger a re-render, so our check won't
     * work in a normal effect. We'll check again on every user click and
     * update the node imperatively if the state doesn't change.
     */
    syncDomNodeWithState();
  }

  function syncDomNodeWithState() {
    if (ref.current) {
      ref.current.indeterminate = current.value === exports.MixedCheckboxStates.Mixed;
    }
  }

  useRefDevWarning(ref, "A ref was not assigned to an input element in " + functionOrComponentName + ".");
  React.useEffect(function () {
    if (isControlled) {
      send({
        type: exports.MixedCheckboxEvents.Set,
        state: checkedPropToStateValue(controlledChecked)
      });
    }
  }, [isControlled, controlledChecked, send]); // Prevent flashing before mixed marker is displayed and check on every render

  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(syncDomNodeWithState);
  React.useEffect(function () {
    send({
      type: exports.MixedCheckboxEvents.GetDerivedData,
      data: {
        disabled: disabled,
        isControlled: isControlled
      }
    });
  }, [disabled, isControlled, send]);
  return [props, contextData];
} ////////////////////////////////////////////////////////////////////////////////

/*
 * We want the API to be similar to the native DOM input API, so we opt for a
 * checked prop with a value of `true`, `false` or `"mixed"`.
 */


function checkedPropToStateValue(checked) {
  return checked === true ? exports.MixedCheckboxStates.Checked : checked === "mixed" ? exports.MixedCheckboxStates.Mixed : exports.MixedCheckboxStates.Unchecked;
}

function stateValueToAriaChecked(state) {
  return state === exports.MixedCheckboxStates.Checked ? true : state === exports.MixedCheckboxStates.Mixed ? "mixed" : false;
}

function stateValueToChecked(state) {
  return state === exports.MixedCheckboxStates.Checked ? true : false;
} // TODO: Move to @reach/utils


function useControlledSwitchWarning(controlPropValue, controlPropName, componentName) {
  /*
   * Determine whether or not the component is controlled and warn the developer
   * if this changes unexpectedly.
   */
  var isControlled = controlPropValue != null;

  var _React$useRef = React.useRef(isControlled),
      wasControlled = _React$useRef.current;

  React.useEffect(function () {
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning__default['default'](!(!isControlled && wasControlled), componentName + " is changing from controlled to uncontrolled. " + componentName + " should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled " + componentName + " for the lifetime of the component. Check the `" + controlPropName + "` prop being passed in.") : void 0;
      process.env.NODE_ENV !== "production" ? warning__default['default'](!(isControlled && !wasControlled), componentName + " is changing from uncontrolled to controlled. " + componentName + " should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled " + componentName + " for the lifetime of the component. Check the `" + controlPropName + "` prop being passed in.") : void 0;
    }
  }, [componentName, controlPropName, isControlled, wasControlled]);
} ////////////////////////////////////////////////////////////////////////////////

function useRefDevWarning(ref, message) {
  if (process.env.NODE_ENV !== "production") {
    /* eslint-disable react-hooks/rules-of-hooks */
    var messageRef = React.useRef(message);
    React.useEffect(function () {
      messageRef.current = message;
    }, [message]);
    React.useEffect(function () {
      process.env.NODE_ENV !== "production" ? warning__default['default'](ref.current, messageRef.current) : void 0;
    }, [ref]);
    /* eslint-enable react-hooks/rules-of-hooks */
  }
}

var _excluded$1 = ["as", "checked", "children", "defaultChecked", "disabled", "onClick", "onChange", "__componentName"],
    _excluded2 = ["as", "onBlur", "onFocus"],
    _excluded3 = ["children", "id", "name", "value"];
////////////////////////////////////////////////////////////////////////////////
var CustomCheckboxContext = /*#__PURE__*/context.createNamedContext("CustomCheckboxContext", {});

function useCustomCheckboxContext() {
  return React.useContext(CustomCheckboxContext);
} ////////////////////////////////////////////////////////////////////////////////

/**
 * CustomCheckboxContainer
 *
 * Wrapper component and context provider for a custom checkbox.
 *
 * @see Docs https://reach.tech/checkbox#customcheckboxcontainer
 */


var CustomCheckboxContainer = /*#__PURE__*/React.forwardRef(function CustomCheckboxContainer(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "span" : _ref$as,
      controlledChecked = _ref.checked,
      children = _ref.children,
      defaultChecked = _ref.defaultChecked,
      disabled = _ref.disabled,
      onClick = _ref.onClick,
      onChange = _ref.onChange,
      _ref$__componentName = _ref.__componentName,
      __componentName = _ref$__componentName === void 0 ? "CustomCheckboxContainer" : _ref$__componentName,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  var inputRef = React.useRef(null);

  var _useMixedCheckbox = useMixedCheckbox(inputRef, {
    defaultChecked: defaultChecked,
    checked: controlledChecked,
    disabled: disabled,
    onChange: onChange
  }, __componentName),
      inputProps = _useMixedCheckbox[0],
      stateData = _useMixedCheckbox[1];

  var _React$useState = React.useState(false),
      focused = _React$useState[0],
      setFocused = _React$useState[1];

  function handleClick() {
    // Wait a frame so the input event is triggered, then focus the input
    window.requestAnimationFrame(function () {
      inputRef.current && inputRef.current.focus();
    });
  }

  var context = {
    defaultChecked: defaultChecked,
    disabled: disabled,
    focused: focused,
    inputProps: inputProps,
    inputRef: inputRef,
    setFocused: setFocused
  };
  useControlledSwitchWarning(controlledChecked, "checked", __componentName);
  devUtils.useCheckStyles("checkbox");
  return /*#__PURE__*/React.createElement(CustomCheckboxContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    ref: forwardedRef,
    "data-reach-custom-checkbox-container": "",
    "data-focused": focused ? "" : undefined,
    "data-state": checkedPropToStateValue(stateData.checked),
    onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick)
  }), typeCheck.isFunction(children) ? children({
    checked: inputProps["aria-checked"],
    inputRef: inputRef,
    focused: focused
  }) : children));
});
/**
 * @see Docs https://reach.tech/checkbox#custom-checkboxcontainer-props
 */

if (process.env.NODE_ENV !== "production") {
  CustomCheckboxContainer.displayName = "CustomCheckboxContainer";
  CustomCheckboxContainer.propTypes = {
    checked: /*#__PURE__*/PropTypes__default['default'].oneOfType([PropTypes__default['default'].bool, /*#__PURE__*/PropTypes__default['default'].oneOf(["mixed"])]),
    defaultChecked: PropTypes__default['default'].bool,
    disabled: PropTypes__default['default'].bool,
    onChange: PropTypes__default['default'].func
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * CustomCheckboxInput
 *
 * Component to render the HTML input element for our custom checkbox. The
 * rendered element should be visually hidden and exists only to manage its
 * state and hold a form name and value.
 *
 * @see Docs https://reach.tech/checkbox#customcheckboxinput
 */


var CustomCheckboxInput = /*#__PURE__*/React.forwardRef(function CustomCheckboxInput(_ref2, forwardedRef) {
  var _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "input" : _ref2$as,
      onBlur = _ref2.onBlur,
      onFocus = _ref2.onFocus,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _useCustomCheckboxCon = useCustomCheckboxContext(),
      focused = _useCustomCheckboxCon.focused,
      inputProps = _useCustomCheckboxCon.inputProps,
      inputRef = _useCustomCheckboxCon.inputRef,
      setFocused = _useCustomCheckboxCon.setFocused;

  var ref = composeRefs.useComposedRefs(forwardedRef, inputRef);
  var mounted = React.useRef(true);

  function handleBlur() {
    // window.requestAnimationFrame(() => send(CustomCheckboxEvents.Blur));
    window.requestAnimationFrame(function () {
      if (mounted.current) {
        setFocused(false);
      }
    });
  }

  function handleFocus() {
    // window.requestAnimationFrame(() => send(CustomCheckboxEvents.Focus));
    window.requestAnimationFrame(function () {
      if (mounted.current) {
        setFocused(true);
      }
    });
  }

  React.useEffect(function () {
    return function () {
      return void (mounted.current = false);
    };
  }, []);
  return /*#__PURE__*/React.createElement(Comp, _extends({}, props, inputProps, {
    ref: ref,
    type: "checkbox",
    "data-reach-custom-checkbox-input": "",
    "data-focused": focused ? "" : undefined,
    onBlur: composeEventHandlers.composeEventHandlers(onBlur, handleBlur),
    onFocus: composeEventHandlers.composeEventHandlers(onFocus, handleFocus)
  }));
});

if (process.env.NODE_ENV !== "production") {
  CustomCheckboxInput.displayName = "CustomCheckboxInput";
  CustomCheckboxInput.propTypes = {};
} ////////////////////////////////////////////////////////////////////////////////

/**
 * CustomCheckbox
 *
 * A checkbox component with a wrapper element for custom styling.
 *
 * @see Docs https://reach.tech/checkbox#customcheckbox-1
 */


var CustomCheckbox = /*#__PURE__*/React.forwardRef(function CustomCheckbox(_ref3, forwardedRef) {
  var children = _ref3.children,
      id = _ref3.id,
      name = _ref3.name,
      value = _ref3.value,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  return /*#__PURE__*/React.createElement(CustomCheckboxContainer, _extends({}, props, {
    "data-reach-custom-checkbox": "" // @ts-ignore
    ,
    __componentName: "CustomCheckbox"
  }), /*#__PURE__*/React.createElement(CustomCheckboxInput, {
    id: id,
    name: name,
    ref: forwardedRef,
    value: value
  }), children);
});
/**
 * @see Docs https://reach.tech/checkbox#custom-checkbox-props
 */

if (process.env.NODE_ENV !== "production") {
  CustomCheckbox.displayName = "CustomCheckbox";
  CustomCheckbox.propTypes = {
    checked: /*#__PURE__*/PropTypes__default['default'].oneOfType([PropTypes__default['default'].bool, /*#__PURE__*/PropTypes__default['default'].oneOf(["mixed"])]),
    disabled: PropTypes__default['default'].bool,
    name: PropTypes__default['default'].string,
    onChange: PropTypes__default['default'].func,
    value: PropTypes__default['default'].string
  };
} ////////////////////////////////////////////////////////////////////////////////

exports.CustomCheckbox = CustomCheckbox;
exports.CustomCheckboxContainer = CustomCheckboxContainer;
exports.CustomCheckboxInput = CustomCheckboxInput;
exports.MixedCheckbox = MixedCheckbox;
exports.internal_checkedPropToStateValue = checkedPropToStateValue;
exports.internal_useControlledSwitchWarning = useControlledSwitchWarning;
exports.useMixedCheckbox = useMixedCheckbox;
