import { forwardRef, useRef, createElement, useEffect, useState, useContext } from 'react';
import { createNamedContext } from '@reach/utils/context';
import { isFunction } from '@reach/utils/type-check';
import { useCheckStyles } from '@reach/utils/dev-utils';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import { useIsomorphicLayoutEffect } from '@reach/utils/use-isomorphic-layout-effect';
import { assign, useCreateMachine, useMachine } from '@reach/machine';
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

var _excluded = ["as", "checked", "defaultChecked", "disabled", "onChange"];

var _commonEvents;
// Used for development only, not recommended for production code!
var DEBUG = false; ////////////////////////////////////////////////////////////////////////////////
// States

var MixedCheckboxStates; ////////////////////////////////////////////////////////////////////////////////
// Events

(function (MixedCheckboxStates) {
  MixedCheckboxStates["Checked"] = "checked";
  MixedCheckboxStates["Mixed"] = "mixed";
  MixedCheckboxStates["Unchecked"] = "unchecked";
})(MixedCheckboxStates || (MixedCheckboxStates = {}));

var MixedCheckboxEvents; ////////////////////////////////////////////////////////////////////////////////
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
})(MixedCheckboxEvents || (MixedCheckboxEvents = {}));

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


var assignRefs = /*#__PURE__*/assign(function (data, event) {
  return _extends({}, data, {
    refs: event.refs
  });
}); ////////////////////////////////////////////////////////////////////////////////
// State Machine

var commonEvents = (_commonEvents = {}, _commonEvents[MixedCheckboxEvents.Mount] = {
  actions: assignRefs
}, _commonEvents[MixedCheckboxEvents.GetDerivedData] = {
  actions: [assignRefs, /*#__PURE__*/assign(function (data, event) {
    return _extends({}, data, event.data);
  })]
}, _commonEvents[MixedCheckboxEvents.Set] = [{
  target: MixedCheckboxStates.Checked,
  cond: /*#__PURE__*/getCheckSetCondition(MixedCheckboxStates.Checked)
}, {
  target: MixedCheckboxStates.Unchecked,
  cond: /*#__PURE__*/getCheckSetCondition(MixedCheckboxStates.Unchecked)
}, {
  target: MixedCheckboxStates.Mixed,
  cond: /*#__PURE__*/getCheckSetCondition(MixedCheckboxStates.Mixed)
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
    states: (_states = {}, _states[MixedCheckboxStates.Unchecked] = {
      entry: assignRefs,
      on: _extends((_extends2 = {}, _extends2[MixedCheckboxEvents.Toggle] = {
        target: MixedCheckboxStates.Checked,
        cond: checkToggleAllowed
      }, _extends2), commonEvents)
    }, _states[MixedCheckboxStates.Checked] = {
      entry: assignRefs,
      on: _extends((_extends3 = {}, _extends3[MixedCheckboxEvents.Toggle] = {
        target: MixedCheckboxStates.Unchecked,
        cond: checkToggleAllowed
      }, _extends3), commonEvents)
    }, _states[MixedCheckboxStates.Mixed] = {
      entry: assignRefs,
      on: _extends((_extends4 = {}, _extends4[MixedCheckboxEvents.Toggle] = {
        target: MixedCheckboxStates.Checked,
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


var MixedCheckbox = /*#__PURE__*/forwardRef(function MixedCheckbox(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "input" : _ref$as,
      checked = _ref.checked,
      defaultChecked = _ref.defaultChecked,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var ownRef = useRef(null);
  var ref = useComposedRefs(forwardedRef, ownRef);

  var _useMixedCheckbox = useMixedCheckbox(ownRef, {
    onChange: onChange,
    checked: checked,
    defaultChecked: defaultChecked,
    disabled: disabled
  }, "MixedCheckbox"),
      inputProps = _useMixedCheckbox[0];

  useControlledSwitchWarning(checked, "checked", "MixedCheckbox");
  return /*#__PURE__*/createElement(Comp, _extends({}, props, inputProps, {
    "data-reach-mixed-checkbox": "",
    ref: ref
  }));
});

if (process.env.NODE_ENV !== "production") {
  MixedCheckbox.displayName = "MixedCheckbox";
  MixedCheckbox.propTypes = {
    checked: /*#__PURE__*/PropTypes.oneOfType([PropTypes.bool, /*#__PURE__*/PropTypes.oneOf(["mixed"])]),
    onChange: PropTypes.func
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
  var machine = useCreateMachine(createMachineDefinition(checkedPropToStateValue(isControlled ? controlledChecked : defaultChecked), {
    disabled: !!disabled,
    isControlled: isControlled
  }));

  var _useMachine = useMachine(machine, {
    input: ref
  }, DEBUG),
      current = _useMachine[0],
      send = _useMachine[1];

  var props = {
    "aria-checked": stateValueToAriaChecked(current.value),
    checked: stateValueToChecked(current.value),
    disabled: !!disabled,
    onChange: composeEventHandlers(onChange, handleChange),
    onClick: composeEventHandlers(onClick, handleClick),
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
      send(MixedCheckboxEvents.Toggle);
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
      ref.current.indeterminate = current.value === MixedCheckboxStates.Mixed;
    }
  }

  useRefDevWarning(ref, "A ref was not assigned to an input element in " + functionOrComponentName + ".");
  useEffect(function () {
    if (isControlled) {
      send({
        type: MixedCheckboxEvents.Set,
        state: checkedPropToStateValue(controlledChecked)
      });
    }
  }, [isControlled, controlledChecked, send]); // Prevent flashing before mixed marker is displayed and check on every render

  useIsomorphicLayoutEffect(syncDomNodeWithState);
  useEffect(function () {
    send({
      type: MixedCheckboxEvents.GetDerivedData,
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
  return checked === true ? MixedCheckboxStates.Checked : checked === "mixed" ? MixedCheckboxStates.Mixed : MixedCheckboxStates.Unchecked;
}

function stateValueToAriaChecked(state) {
  return state === MixedCheckboxStates.Checked ? true : state === MixedCheckboxStates.Mixed ? "mixed" : false;
}

function stateValueToChecked(state) {
  return state === MixedCheckboxStates.Checked ? true : false;
} // TODO: Move to @reach/utils


function useControlledSwitchWarning(controlPropValue, controlPropName, componentName) {
  /*
   * Determine whether or not the component is controlled and warn the developer
   * if this changes unexpectedly.
   */
  var isControlled = controlPropValue != null;

  var _React$useRef = useRef(isControlled),
      wasControlled = _React$useRef.current;

  useEffect(function () {
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(!(!isControlled && wasControlled), componentName + " is changing from controlled to uncontrolled. " + componentName + " should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled " + componentName + " for the lifetime of the component. Check the `" + controlPropName + "` prop being passed in.") : void 0;
      process.env.NODE_ENV !== "production" ? warning(!(isControlled && !wasControlled), componentName + " is changing from uncontrolled to controlled. " + componentName + " should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled " + componentName + " for the lifetime of the component. Check the `" + controlPropName + "` prop being passed in.") : void 0;
    }
  }, [componentName, controlPropName, isControlled, wasControlled]);
} ////////////////////////////////////////////////////////////////////////////////

function useRefDevWarning(ref, message) {
  if (process.env.NODE_ENV !== "production") {
    /* eslint-disable react-hooks/rules-of-hooks */
    var messageRef = useRef(message);
    useEffect(function () {
      messageRef.current = message;
    }, [message]);
    useEffect(function () {
      process.env.NODE_ENV !== "production" ? warning(ref.current, messageRef.current) : void 0;
    }, [ref]);
    /* eslint-enable react-hooks/rules-of-hooks */
  }
}

var _excluded$1 = ["as", "checked", "children", "defaultChecked", "disabled", "onClick", "onChange", "__componentName"],
    _excluded2 = ["as", "onBlur", "onFocus"],
    _excluded3 = ["children", "id", "name", "value"];
////////////////////////////////////////////////////////////////////////////////
var CustomCheckboxContext = /*#__PURE__*/createNamedContext("CustomCheckboxContext", {});

function useCustomCheckboxContext() {
  return useContext(CustomCheckboxContext);
} ////////////////////////////////////////////////////////////////////////////////

/**
 * CustomCheckboxContainer
 *
 * Wrapper component and context provider for a custom checkbox.
 *
 * @see Docs https://reach.tech/checkbox#customcheckboxcontainer
 */


var CustomCheckboxContainer = /*#__PURE__*/forwardRef(function CustomCheckboxContainer(_ref, forwardedRef) {
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

  var inputRef = useRef(null);

  var _useMixedCheckbox = useMixedCheckbox(inputRef, {
    defaultChecked: defaultChecked,
    checked: controlledChecked,
    disabled: disabled,
    onChange: onChange
  }, __componentName),
      inputProps = _useMixedCheckbox[0],
      stateData = _useMixedCheckbox[1];

  var _React$useState = useState(false),
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
  useCheckStyles("checkbox");
  return /*#__PURE__*/createElement(CustomCheckboxContext.Provider, {
    value: context
  }, /*#__PURE__*/createElement(Comp, _extends({}, props, {
    ref: forwardedRef,
    "data-reach-custom-checkbox-container": "",
    "data-focused": focused ? "" : undefined,
    "data-state": checkedPropToStateValue(stateData.checked),
    onClick: composeEventHandlers(onClick, handleClick)
  }), isFunction(children) ? children({
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
    checked: /*#__PURE__*/PropTypes.oneOfType([PropTypes.bool, /*#__PURE__*/PropTypes.oneOf(["mixed"])]),
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
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


var CustomCheckboxInput = /*#__PURE__*/forwardRef(function CustomCheckboxInput(_ref2, forwardedRef) {
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

  var ref = useComposedRefs(forwardedRef, inputRef);
  var mounted = useRef(true);

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

  useEffect(function () {
    return function () {
      return void (mounted.current = false);
    };
  }, []);
  return /*#__PURE__*/createElement(Comp, _extends({}, props, inputProps, {
    ref: ref,
    type: "checkbox",
    "data-reach-custom-checkbox-input": "",
    "data-focused": focused ? "" : undefined,
    onBlur: composeEventHandlers(onBlur, handleBlur),
    onFocus: composeEventHandlers(onFocus, handleFocus)
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


var CustomCheckbox = /*#__PURE__*/forwardRef(function CustomCheckbox(_ref3, forwardedRef) {
  var children = _ref3.children,
      id = _ref3.id,
      name = _ref3.name,
      value = _ref3.value,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  return /*#__PURE__*/createElement(CustomCheckboxContainer, _extends({}, props, {
    "data-reach-custom-checkbox": "" // @ts-ignore
    ,
    __componentName: "CustomCheckbox"
  }), /*#__PURE__*/createElement(CustomCheckboxInput, {
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
    checked: /*#__PURE__*/PropTypes.oneOfType([PropTypes.bool, /*#__PURE__*/PropTypes.oneOf(["mixed"])]),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  };
} ////////////////////////////////////////////////////////////////////////////////

export { CustomCheckbox, CustomCheckboxContainer, CustomCheckboxInput, MixedCheckbox, MixedCheckboxEvents, MixedCheckboxStates, checkedPropToStateValue as internal_checkedPropToStateValue, useControlledSwitchWarning as internal_useControlledSwitchWarning, useMixedCheckbox };
