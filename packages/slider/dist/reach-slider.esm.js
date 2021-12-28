import { forwardRef, createElement, useRef, useState, useCallback, useEffect, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { useId } from '@reach/auto-id';
import { useControlledState } from '@reach/utils/use-controlled-state';
import { isRightClick } from '@reach/utils/is-right-click';
import { useStableLayoutCallback } from '@reach/utils/use-stable-callback';
import { useIsomorphicLayoutEffect } from '@reach/utils/use-isomorphic-layout-effect';
import { getOwnerDocument } from '@reach/utils/owner-document';
import { createNamedContext } from '@reach/utils/context';
import { isFunction } from '@reach/utils/type-check';
import { makeId } from '@reach/utils/make-id';
import { noop } from '@reach/utils/noop';
import { useControlledSwitchWarning, useCheckStyles } from '@reach/utils/dev-utils';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import warning from 'tiny-warning';

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

var _excluded = ["children"],
    _excluded2 = ["aria-label", "aria-labelledby", "aria-valuetext", "as", "defaultValue", "disabled", "value", "getAriaLabel", "getAriaValueText", "getValueText", "handleAlignment", "max", "min", "name", "onChange", "onKeyDown", "onMouseDown", "onMouseMove", "onMouseUp", "onPointerDown", "onPointerUp", "onTouchEnd", "onTouchMove", "onTouchStart", "orientation", "step", "children", "__componentName"],
    _excluded3 = ["ref"],
    _excluded4 = ["as", "children", "style"],
    _excluded5 = ["as", "children", "style"],
    _excluded6 = ["as", "onBlur", "onFocus", "style", "onKeyDown"],
    _excluded7 = ["as", "children", "style", "value"];
var SliderOrientation;

(function (SliderOrientation) {
  SliderOrientation["Horizontal"] = "horizontal";
  SliderOrientation["Vertical"] = "vertical";
})(SliderOrientation || (SliderOrientation = {}));

// TODO: Remove in 1.0
var SliderHandleAlignment; // TODO: Remove in 1.0

(function (SliderHandleAlignment) {
  SliderHandleAlignment["Center"] = "center";
  SliderHandleAlignment["Contain"] = "contain";
})(SliderHandleAlignment || (SliderHandleAlignment = {}));

var SLIDER_ORIENTATION_HORIZONTAL = SliderOrientation.Horizontal;
var SLIDER_ORIENTATION_VERTICAL = SliderOrientation.Vertical;
var SLIDER_HANDLE_ALIGN_CENTER = SliderHandleAlignment.Center;
var SLIDER_HANDLE_ALIGN_CONTAIN = SliderHandleAlignment.Contain;
var SliderContext = /*#__PURE__*/createNamedContext("SliderContext", {});

var useSliderContext = function useSliderContext() {
  return useContext(SliderContext);
}; // These proptypes are shared between the composed SliderInput component and the
// simplified Slider


var sliderPropTypes = {
  defaultValue: PropTypes.number,
  disabled: PropTypes.bool,
  getAriaLabel: PropTypes.func,
  getAriaValueText: PropTypes.func,
  getValueText: PropTypes.func,
  handleAlignment: /*#__PURE__*/PropTypes.oneOf([SliderHandleAlignment.Center, SliderHandleAlignment.Contain]),
  min: PropTypes.number,
  max: PropTypes.number,
  name: PropTypes.string,
  orientation: /*#__PURE__*/PropTypes.oneOf([SliderOrientation.Horizontal, SliderOrientation.Vertical]),
  onChange: PropTypes.func,
  step: PropTypes.number,
  value: PropTypes.number
}; ////////////////////////////////////////////////////////////////////////////////

/**
 * Slider
 *
 * @see Docs https://reach.tech/slider#slider
 */

var Slider = /*#__PURE__*/forwardRef(function Slider(_ref, forwardedRef) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  return /*#__PURE__*/createElement(SliderInput, _extends({}, props, {
    ref: forwardedRef,
    "data-reach-slider": "",
    __componentName: "Slider"
  }), /*#__PURE__*/createElement(SliderTrack, null, /*#__PURE__*/createElement(SliderRange, null), /*#__PURE__*/createElement(SliderHandle, null), children));
});
/**
 * @see Docs https://reach.tech/slider#slider-props
 */

if (process.env.NODE_ENV !== "production") {
  Slider.displayName = "Slider";
  Slider.propTypes = /*#__PURE__*/_extends({}, sliderPropTypes, {
    children: PropTypes.node
  });
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SliderInput
 *
 * The parent component of the slider interface. This is a lower level component
 * if you need more control over styles or rendering the slider's inner
 * components.
 *
 * @see Docs https://reach.tech/slider#sliderinput
 */


var SliderInput = /*#__PURE__*/forwardRef(function SliderInput(_ref2, forwardedRef) {
  var _rangeStyle;

  var ariaLabel = _ref2["aria-label"],
      ariaLabelledBy = _ref2["aria-labelledby"],
      ariaValueTextProp = _ref2["aria-valuetext"],
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "div" : _ref2$as,
      defaultValue = _ref2.defaultValue,
      _ref2$disabled = _ref2.disabled,
      disabled = _ref2$disabled === void 0 ? false : _ref2$disabled,
      controlledValue = _ref2.value,
      getAriaLabel = _ref2.getAriaLabel,
      getAriaValueText = _ref2.getAriaValueText,
      DEPRECATED_getValueText = _ref2.getValueText,
      _ref2$handleAlignment = _ref2.handleAlignment,
      handleAlignment = _ref2$handleAlignment === void 0 ? SliderHandleAlignment.Center : _ref2$handleAlignment,
      _ref2$max = _ref2.max,
      max = _ref2$max === void 0 ? 100 : _ref2$max,
      _ref2$min = _ref2.min,
      min = _ref2$min === void 0 ? 0 : _ref2$min,
      name = _ref2.name,
      onChange = _ref2.onChange,
      onKeyDown = _ref2.onKeyDown,
      onMouseDown = _ref2.onMouseDown,
      onMouseMove = _ref2.onMouseMove,
      onMouseUp = _ref2.onMouseUp,
      onPointerDown = _ref2.onPointerDown,
      onPointerUp = _ref2.onPointerUp,
      onTouchEnd = _ref2.onTouchEnd,
      onTouchMove = _ref2.onTouchMove,
      onTouchStart = _ref2.onTouchStart,
      _ref2$orientation = _ref2.orientation,
      orientation = _ref2$orientation === void 0 ? SliderOrientation.Horizontal : _ref2$orientation,
      _ref2$step = _ref2.step,
      step = _ref2$step === void 0 ? 1 : _ref2$step,
      children = _ref2.children,
      _ref2$__componentName = _ref2.__componentName,
      __componentName = _ref2$__componentName === void 0 ? "SliderInput" : _ref2$__componentName,
      rest = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  useControlledSwitchWarning(controlledValue, "value", __componentName);
  process.env.NODE_ENV !== "production" ? warning(!DEPRECATED_getValueText, "The `getValueText` prop in @reach/slider is deprecated. Please use `getAriaValueText` instead.") : void 0;
  var touchId = useRef();
  var id = useId(rest.id); // Track whether or not the pointer is down without updating the component

  var pointerDownRef = useRef(false);
  var trackRef = useRef(null);
  var handleRef = useRef(null);
  var sliderRef = useRef(null);
  var ref = useComposedRefs(sliderRef, forwardedRef);

  var _React$useState = useState(false),
      hasFocus = _React$useState[0],
      setHasFocus = _React$useState[1];

  var _useDimensions = useDimensions(handleRef),
      handleDimensions = _objectWithoutPropertiesLoose(_useDimensions, _excluded3);

  var _useControlledState = useControlledState(controlledValue, defaultValue || min),
      _value = _useControlledState[0],
      setValue = _useControlledState[1];

  var value = clamp(_value, min, max);
  var trackPercent = valueToPercent(value, min, max);
  var isVertical = orientation === SliderOrientation.Vertical;
  var handleSize = isVertical ? handleDimensions.height : handleDimensions.width; // TODO: Consider removing the `handleAlignment` prop
  // We may want to use accept a `handlePosition` prop instead and let apps
  // define their own positioning logic, similar to how we do for popovers.

  var handlePosition = "calc(" + trackPercent + "% - " + (handleAlignment === SliderHandleAlignment.Center ? handleSize + "px / 2" : handleSize + "px * " + trackPercent * 0.01) + ")";
  var handlePositionRef = useRef(handlePosition);
  useIsomorphicLayoutEffect(function () {
    handlePositionRef.current = handlePosition;
  }, [handlePosition]);
  var onChangeRef = useRef(onChange);
  useIsomorphicLayoutEffect(function () {
    onChangeRef.current = onChange;
  }, [onChange]);
  var updateValue = useCallback(function updateValue(newValue) {
    setValue(newValue);

    if (onChangeRef.current) {
      // Prevent onChange from recreating the function
      // TODO: Reonsider the onChange callback API
      onChangeRef.current(newValue, {
        min: min,
        max: max,
        // Prevent handlePosition from recreating the function
        handlePosition: handlePositionRef.current
      });
    }
  }, [max, min, setValue]);
  var getNewValueFromEvent = useCallback(function (event) {
    return getNewValue(getPointerPosition(event, touchId), trackRef.current, {
      step: step,
      orientation: orientation,
      min: min,
      max: max
    });
  }, [max, min, orientation, step]); // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_kbd_interaction

  var handleKeyDown = useStableLayoutCallback(function (event) {
    if (disabled) {
      return;
    }

    var newValue;
    var tenSteps = (max - min) / 10;
    var keyStep = step || (max - min) / 100;

    switch (event.key) {
      // Decrease the value of the slider by one step.
      case "ArrowLeft":
      case "ArrowDown":
        newValue = value - keyStep;
        break;
      // Increase the value of the slider by one step

      case "ArrowRight":
      case "ArrowUp":
        newValue = value + keyStep;
        break;
      // Decrement the slider by an amount larger than the step change made by
      // `ArrowDown`.

      case "PageDown":
        newValue = value - tenSteps;
        break;
      // Increment the slider by an amount larger than the step change made by
      // `ArrowUp`.

      case "PageUp":
        newValue = value + tenSteps;
        break;
      // Set the slider to the first allowed value in its range.

      case "Home":
        newValue = min;
        break;
      // Set the slider to the last allowed value in its range.

      case "End":
        newValue = max;
        break;

      default:
        return;
    }

    event.preventDefault();
    newValue = clamp(step ? roundValueToStep(newValue, step, min) : newValue, min, max);
    updateValue(newValue);
  });
  var ariaValueText = DEPRECATED_getValueText ? DEPRECATED_getValueText(value) : getAriaValueText ? getAriaValueText(value) : ariaValueTextProp;
  var rangeStyle = (_rangeStyle = {}, _rangeStyle[isVertical ? "height" : "width"] = trackPercent + "%", _rangeStyle);
  var ctx = {
    ariaLabel: getAriaLabel ? getAriaLabel(value) : ariaLabel,
    ariaLabelledBy: ariaLabelledBy,
    ariaValueText: ariaValueText,
    handleDimensions: handleDimensions,
    handleKeyDown: handleKeyDown,
    handlePosition: handlePosition,
    handleRef: handleRef,
    hasFocus: hasFocus,
    onKeyDown: onKeyDown,
    setHasFocus: setHasFocus,
    sliderId: id,
    sliderMax: max,
    sliderMin: min,
    value: value,
    disabled: !!disabled,
    isVertical: isVertical,
    orientation: orientation,
    trackPercent: trackPercent,
    trackRef: trackRef,
    rangeStyle: rangeStyle,
    updateValue: updateValue
  }; // Slide events!
  // We will try to use pointer events if they are supported to leverage
  // setPointerCapture and releasePointerCapture. We'll fall back to separate
  // mouse and touch events.
  // TODO: This could be more concise

  var removeMoveEvents = useRef(noop);
  var removeStartEvents = useRef(noop);
  var removeEndEvents = useRef(noop); // Store our event handlers in refs so we aren't attaching/detaching events
  // on every render if the user doesn't useCallback

  var appEvents = useRef({
    onMouseMove: onMouseMove,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onTouchStart: onTouchStart,
    onTouchEnd: onTouchEnd,
    onTouchMove: onTouchMove,
    onPointerDown: onPointerDown,
    onPointerUp: onPointerUp
  });
  useIsomorphicLayoutEffect(function () {
    appEvents.current.onMouseMove = onMouseMove;
    appEvents.current.onMouseDown = onMouseDown;
    appEvents.current.onMouseUp = onMouseUp;
    appEvents.current.onTouchStart = onTouchStart;
    appEvents.current.onTouchEnd = onTouchEnd;
    appEvents.current.onTouchMove = onTouchMove;
    appEvents.current.onPointerDown = onPointerDown;
    appEvents.current.onPointerUp = onPointerUp;
  }, [onMouseMove, onMouseDown, onMouseUp, onTouchStart, onTouchEnd, onTouchMove, onPointerDown, onPointerUp]);
  var handleSlideStart = useStableLayoutCallback(function (event) {
    if (isRightClick(event)) return;

    if (disabled) {
      pointerDownRef.current = false;
      return;
    }

    var ownerDocument = getOwnerDocument(sliderRef.current);
    var ownerWindow = ownerDocument.defaultView || window;
    pointerDownRef.current = true;

    if (event.changedTouches) {
      var _changedTouches;

      // Prevent scrolling for touch events
      event.preventDefault();
      var touch = (_changedTouches = event.changedTouches) == null ? void 0 : _changedTouches[0];

      if (touch != null) {
        touchId.current = touch.identifier;
      }
    }

    var newValue = getNewValueFromEvent(event);

    if (newValue == null) {
      return;
    }

    ownerWindow.requestAnimationFrame(function () {
      var _handleRef$current;

      return (_handleRef$current = handleRef.current) == null ? void 0 : _handleRef$current.focus();
    });
    updateValue(newValue);
    removeMoveEvents.current = addMoveListener();
    removeEndEvents.current = addEndListener();
  });
  var setPointerCapture = useStableLayoutCallback(function (event) {
    var _sliderRef$current;

    if (isRightClick(event)) return;

    if (disabled) {
      pointerDownRef.current = false;
      return;
    }

    pointerDownRef.current = true;
    (_sliderRef$current = sliderRef.current) == null ? void 0 : _sliderRef$current.setPointerCapture(event.pointerId);
  });
  var releasePointerCapture = useStableLayoutCallback(function (event) {
    var _sliderRef$current2;

    if (isRightClick(event)) return;
    (_sliderRef$current2 = sliderRef.current) == null ? void 0 : _sliderRef$current2.releasePointerCapture(event.pointerId);
    pointerDownRef.current = false;
  });
  var handlePointerMove = useStableLayoutCallback(function (event) {
    if (disabled || !pointerDownRef.current) {
      pointerDownRef.current = false;
      return;
    }

    var newValue = getNewValueFromEvent(event);

    if (newValue == null) {
      return;
    }

    updateValue(newValue);
  });
  var handleSlideStop = useStableLayoutCallback(function (event) {
    if (isRightClick(event)) return;
    pointerDownRef.current = false;
    var newValue = getNewValueFromEvent(event);

    if (newValue == null) {
      return;
    }

    touchId.current = undefined;
    removeMoveEvents.current();
    removeEndEvents.current();
  });
  var addMoveListener = useCallback(function () {
    var ownerDocument = getOwnerDocument(sliderRef.current);
    var touchListener = composeEventHandlers(appEvents.current.onTouchMove, handlePointerMove);
    var mouseListener = composeEventHandlers(appEvents.current.onMouseMove, handlePointerMove);
    ownerDocument.addEventListener("touchmove", touchListener);
    ownerDocument.addEventListener("mousemove", mouseListener);
    return function () {
      ownerDocument.removeEventListener("touchmove", touchListener);
      ownerDocument.removeEventListener("mousemove", mouseListener);
    };
  }, [handlePointerMove]);
  var addEndListener = useCallback(function () {
    var ownerDocument = getOwnerDocument(sliderRef.current);
    var ownerWindow = ownerDocument.defaultView || window;
    var pointerListener = composeEventHandlers(appEvents.current.onPointerUp, releasePointerCapture);
    var touchListener = composeEventHandlers(appEvents.current.onTouchEnd, handleSlideStop);
    var mouseListener = composeEventHandlers(appEvents.current.onMouseUp, handleSlideStop);

    if ("PointerEvent" in ownerWindow) {
      ownerDocument.addEventListener("pointerup", pointerListener);
    }

    ownerDocument.addEventListener("touchend", touchListener);
    ownerDocument.addEventListener("mouseup", mouseListener);
    return function () {
      if ("PointerEvent" in ownerWindow) {
        ownerDocument.removeEventListener("pointerup", pointerListener);
      }

      ownerDocument.removeEventListener("touchend", touchListener);
      ownerDocument.removeEventListener("mouseup", mouseListener);
    };
  }, [handleSlideStop, releasePointerCapture]);
  var addStartListener = useCallback(function () {
    // e.preventDefault is ignored by React's synthetic touchStart event, so
    // we attach the listener directly to the DOM node
    // https://github.com/facebook/react/issues/9809#issuecomment-413978405
    var sliderElement = sliderRef.current;

    if (!sliderElement) {
      return noop;
    }

    var ownerDocument = getOwnerDocument(sliderElement);
    var ownerWindow = ownerDocument.defaultView || window;
    var touchListener = composeEventHandlers(appEvents.current.onTouchStart, handleSlideStart);
    var mouseListener = composeEventHandlers(appEvents.current.onMouseDown, handleSlideStart);
    var pointerListener = composeEventHandlers(appEvents.current.onPointerDown, setPointerCapture);
    sliderElement.addEventListener("touchstart", touchListener);
    sliderElement.addEventListener("mousedown", mouseListener);

    if ("PointerEvent" in ownerWindow) {
      sliderElement.addEventListener("pointerdown", pointerListener);
    }

    return function () {
      sliderElement.removeEventListener("touchstart", touchListener);
      sliderElement.removeEventListener("mousedown", mouseListener);

      if ("PointerEvent" in ownerWindow) {
        sliderElement.removeEventListener("pointerdown", pointerListener);
      }
    };
  }, [setPointerCapture, handleSlideStart]);
  useEffect(function () {
    removeStartEvents.current = addStartListener();
    return function () {
      removeStartEvents.current();
      removeEndEvents.current();
      removeMoveEvents.current();
    };
  }, [addStartListener]);
  useCheckStyles("slider");
  return /*#__PURE__*/createElement(SliderContext.Provider, {
    value: ctx
  }, /*#__PURE__*/createElement(Comp, _extends({}, rest, {
    ref: ref,
    "data-reach-slider-input": "",
    "data-disabled": disabled ? "" : undefined,
    "data-orientation": orientation,
    tabIndex: -1
  }), isFunction(children) ? children({
    hasFocus: hasFocus,
    id: id,
    max: max,
    min: min,
    value: value,
    ariaValueText: ariaValueText,
    valueText: ariaValueText // TODO: Remove in 1.0

  }) : children, name &&
  /*#__PURE__*/
  // If the slider is used in a form we'll need an input field to
  // capture the value. We'll assume this when the component is given a
  // form field name (A `name` prop doesn't really make sense in any
  // other context).
  createElement("input", {
    type: "hidden",
    value: value,
    name: name,
    id: id && makeId("input", id)
  })));
});
/**
 * @see Docs https://reach.tech/slider#sliderinput-props
 */

if (process.env.NODE_ENV !== "production") {
  SliderInput.displayName = "SliderInput";
  SliderInput.propTypes = /*#__PURE__*/_extends({}, sliderPropTypes, {
    children: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  });
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SliderTrack
 *
 * @see Docs https://reach.tech/slider#slidertrack
 */


var SliderTrackImpl = /*#__PURE__*/forwardRef(function SliderTrack(_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      children = _ref3.children,
      _ref3$style = _ref3.style,
      style = _ref3$style === void 0 ? {} : _ref3$style,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded4);

  var _useSliderContext = useSliderContext(),
      disabled = _useSliderContext.disabled,
      orientation = _useSliderContext.orientation,
      trackRef = _useSliderContext.trackRef;

  var ref = useComposedRefs(trackRef, forwardedRef);
  return /*#__PURE__*/createElement(Comp, _extends({
    ref: ref,
    style: _extends({}, style, {
      position: "relative"
    })
  }, props, {
    "data-reach-slider-track": "",
    "data-disabled": disabled ? "" : undefined,
    "data-orientation": orientation
  }), children);
});

if (process.env.NODE_ENV !== "production") {
  SliderTrackImpl.displayName = "SliderTrack";
  SliderTrackImpl.propTypes = {
    children: PropTypes.node.isRequired
  };
}

var SliderTrack = /*#__PURE__*/memo(SliderTrackImpl);
/**
 * @see Docs https://reach.tech/slider#slidertrack-props
 */

if (process.env.NODE_ENV !== "production") {
  SliderTrack.displayName = "SliderTrack";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SliderRange
 *
 * The (typically) highlighted portion of the track that represents the space
 * between the slider's `min` value and its current value.
 *
 * @see Docs https://reach.tech/slider#sliderrange
 */


var SliderRangeImpl = /*#__PURE__*/forwardRef(function SliderRange(_ref4, forwardedRef) {
  var _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "div" : _ref4$as;
      _ref4.children;
      var _ref4$style = _ref4.style,
      style = _ref4$style === void 0 ? {} : _ref4$style,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded5);

  var _useSliderContext2 = useSliderContext(),
      disabled = _useSliderContext2.disabled,
      orientation = _useSliderContext2.orientation,
      rangeStyle = _useSliderContext2.rangeStyle;

  return /*#__PURE__*/createElement(Comp, _extends({
    ref: forwardedRef,
    style: _extends({
      position: "absolute"
    }, rangeStyle, style)
  }, props, {
    "data-reach-slider-range": "",
    "data-disabled": disabled ? "" : undefined,
    "data-orientation": orientation
  }));
});

if (process.env.NODE_ENV !== "production") {
  SliderRangeImpl.displayName = "SliderRange";
  SliderRangeImpl.propTypes = {};
}

var SliderRange = /*#__PURE__*/memo(SliderRangeImpl); // TODO: Remove in 1.0

var SliderTrackHighlightImpl = /*#__PURE__*/forwardRef(function SliderTrackHighlightImpl(props, ref) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(function () {
      process.env.NODE_ENV !== "production" ? warning(false, "`SliderTrackHighlight` has been deprecated in favor of `SliderRange` and will be dropped from a future version of Reach UI.") : void 0;
    }, []);
  }

  return /*#__PURE__*/createElement(SliderRangeImpl, _extends({
    "data-reach-slider-track-highlight": ""
  }, props, {
    ref: ref
  }));
});

if (process.env.NODE_ENV !== "production") {
  SliderTrackHighlightImpl.displayName = "SliderTrackHighlight";
  SliderTrackHighlightImpl.propTypes = SliderRangeImpl.propTypes;
}

/**
 * This component was renamed to `SliderRange` in a previous version of Reach
 * UI. `SliderTrackHighlight` will be dropped in a future version. We recommend
 * updating your projects to replace `SliderTrackHighlight` with `SliderRange`.
 *
 * @alias SliderRange
 */
var SliderTrackHighlight = /*#__PURE__*/memo(SliderTrackHighlightImpl);
/**
 * `SliderRange` accepts any props that a HTML div component accepts.
 * `SliderRange` will not accept or render any children.
 *
 * @see Docs https://reach.tech/slider#sliderrange-props
 */

if (process.env.NODE_ENV !== "production") {
  SliderRange.displayName = "SliderRange";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SliderHandle
 *
 * The handle that the user drags along the track to set the slider value.
 *
 * @see Docs https://reach.tech/slider#sliderhandle
 */


var SliderHandleImpl = /*#__PURE__*/forwardRef(function SliderHandle(_ref5, forwardedRef) {
  var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "div" : _ref5$as,
      onBlur = _ref5.onBlur,
      onFocus = _ref5.onFocus,
      _ref5$style = _ref5.style,
      style = _ref5$style === void 0 ? {} : _ref5$style,
      onKeyDown = _ref5.onKeyDown,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded6);

  var _useSliderContext3 = useSliderContext(),
      ariaLabel = _useSliderContext3.ariaLabel,
      ariaLabelledBy = _useSliderContext3.ariaLabelledBy,
      ariaValueText = _useSliderContext3.ariaValueText,
      disabled = _useSliderContext3.disabled,
      handlePosition = _useSliderContext3.handlePosition,
      handleRef = _useSliderContext3.handleRef,
      isVertical = _useSliderContext3.isVertical,
      handleKeyDown = _useSliderContext3.handleKeyDown,
      orientation = _useSliderContext3.orientation,
      setHasFocus = _useSliderContext3.setHasFocus,
      sliderMin = _useSliderContext3.sliderMin,
      sliderMax = _useSliderContext3.sliderMax,
      value = _useSliderContext3.value;

  var ref = useComposedRefs(handleRef, forwardedRef);
  return /*#__PURE__*/createElement(Comp, _extends({
    "aria-disabled": disabled || undefined // If the slider has a visible label, it is referenced by
    // `aria-labelledby` on the slider element. Otherwise, the slider
    // element has a label provided by `aria-label`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabel ? undefined : ariaLabelledBy // If the slider is vertically oriented, it has `aria-orientation` set
    // to vertical. The default value of `aria-orientation` for a slider is
    // horizontal.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-orientation": orientation // The slider element has the `aria-valuemax` property set to a decimal
    // value representing the maximum allowed value of the slider.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-valuemax": sliderMax // The slider element has the `aria-valuemin` property set to a decimal
    // value representing the minimum allowed value of the slider.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-valuemin": sliderMin // The slider element has the `aria-valuenow` property set to a decimal
    // value representing the current value of the slider.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-valuenow": value // If the value of `aria-valuenow` is not user-friendly, e.g., the day
    // of the week is represented by a number, the `aria-valuetext` property
    // is set to a string that makes the slider value understandable, e.g.,
    // "Monday".
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    "aria-valuetext": ariaValueText // The element serving as the focusable slider control has role
    // `slider`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#slider_roles_states_props
    ,
    role: "slider",
    tabIndex: disabled ? -1 : 0
  }, props, {
    "data-reach-slider-handle": "",
    ref: ref,
    onBlur: composeEventHandlers(onBlur, function () {
      setHasFocus(false);
    }),
    onFocus: composeEventHandlers(onFocus, function () {
      setHasFocus(true);
    }),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
    style: _extends({
      position: "absolute"
    }, isVertical ? {
      bottom: handlePosition
    } : {
      left: handlePosition
    }, style)
  }));
});

if (process.env.NODE_ENV !== "production") {
  SliderHandleImpl.displayName = "SliderHandle";
  SliderHandleImpl.propTypes = {};
}

var SliderHandle = /*#__PURE__*/memo(SliderHandleImpl);
/**
 * `SliderRange` accepts any props that a HTML div component accepts.
 *
 * @see Docs https://reach.tech/slider#sliderhandle-props
 */

if (process.env.NODE_ENV !== "production") {
  SliderHandle.displayName = "SliderHandle";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SliderMarker
 *
 * A fixed value marker. These can be used to illustrate a range of steps or
 * highlight important points along the slider track.
 *
 * @see Docs https://reach.tech/slider#slidermarker
 */


var SliderMarkerImpl = /*#__PURE__*/forwardRef(function SliderMarker(_ref6, forwardedRef) {
  var _ref6$as = _ref6.as,
      Comp = _ref6$as === void 0 ? "div" : _ref6$as,
      children = _ref6.children,
      _ref6$style = _ref6.style,
      style = _ref6$style === void 0 ? {} : _ref6$style,
      value = _ref6.value,
      props = _objectWithoutPropertiesLoose(_ref6, _excluded7);

  var _useSliderContext4 = useSliderContext(),
      disabled = _useSliderContext4.disabled,
      isVertical = _useSliderContext4.isVertical,
      orientation = _useSliderContext4.orientation,
      sliderMin = _useSliderContext4.sliderMin,
      sliderMax = _useSliderContext4.sliderMax,
      sliderValue = _useSliderContext4.value;

  var inRange = !(value < sliderMin || value > sliderMax);
  var absoluteStartPosition = valueToPercent(value, sliderMin, sliderMax) + "%";
  var state = value < sliderValue ? "under-value" : value === sliderValue ? "at-value" : "over-value";
  return inRange ? /*#__PURE__*/createElement(Comp, _extends({
    ref: forwardedRef,
    style: _extends({
      position: "absolute"
    }, isVertical ? {
      bottom: absoluteStartPosition
    } : {
      left: absoluteStartPosition
    }, style)
  }, props, {
    "data-reach-slider-marker": "",
    "data-disabled": disabled ? "" : undefined,
    "data-orientation": orientation,
    "data-state": state,
    "data-value": value,
    children: children
  })) : null;
});

if (process.env.NODE_ENV !== "production") {
  SliderMarkerImpl.displayName = "SliderMarker";
  SliderMarkerImpl.propTypes = {
    value: PropTypes.number.isRequired
  };
}

var SliderMarker = /*#__PURE__*/memo(SliderMarkerImpl);
/**
 * @see Docs https://reach.tech/slider#slidermarker-props
 */

if (process.env.NODE_ENV !== "production") {
  SliderMarker.displayName = "SliderMarker";
} ////////////////////////////////////////////////////////////////////////////////


function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}
/**
 * This handles the case when num is very small (0.00000001), js will turn
 * this into 1e-8. When num is bigger than 1 or less than -1 it won't get
 * converted to this notation so it's fine.
 *
 * @param num
 * @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Slider/Slider.js#L69
 */


function getDecimalPrecision(num) {
  if (Math.abs(num) < 1) {
    var parts = num.toExponential().split("e-");
    var matissaDecimalPart = parts[0].split(".")[1];
    return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }

  var decimalPart = num.toString().split(".")[1];
  return decimalPart ? decimalPart.length : 0;
}

function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}

function roundValueToStep(value, step, min) {
  var nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function getPointerPosition(event, touchId) {
  if (touchId.current !== undefined && event.changedTouches) {
    for (var i = 0; i < event.changedTouches.length; i += 1) {
      var touch = event.changedTouches[i];

      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY
  };
}

function getNewValue(handlePosition, track, props) {
  var orientation = props.orientation,
      min = props.min,
      max = props.max,
      step = props.step;

  if (!track || !handlePosition) {
    return null;
  }

  var _track$getBoundingCli = track.getBoundingClientRect(),
      left = _track$getBoundingCli.left,
      width = _track$getBoundingCli.width,
      bottom = _track$getBoundingCli.bottom,
      height = _track$getBoundingCli.height;

  var isVertical = orientation === SliderOrientation.Vertical;
  var diff = isVertical ? bottom - handlePosition.y : handlePosition.x - left;
  var percent = diff / (isVertical ? height : width);
  var newValue = percentToValue(percent, min, max);
  return clamp(step ? roundValueToStep(newValue, step, min) : newValue, min, max);
}

function useDimensions(ref) {
  var _React$useState2 = useState({
    width: 0,
    height: 0
  }),
      _React$useState2$ = _React$useState2[0],
      width = _React$useState2$.width,
      height = _React$useState2$.height,
      setDimensions = _React$useState2[1]; // Many existing `useDimensions` type hooks will use `getBoundingClientRect`
  // getBoundingClientRect does not work here when borders are applied.
  // getComputedStyle is not as performant so we may want to create a utility to
  // check for any conflicts with box sizing first and only use
  // `getComputedStyle` if neccessary.

  /* const { width, height } = ref.current
    ? ref.current.getBoundingClientRect()
    : 0; */


  useIsomorphicLayoutEffect(function () {
    var ownerDocument = getOwnerDocument(ref.current);
    var ownerWindow = ownerDocument.defaultView || window;

    if (ref.current) {
      var _ownerWindow$getCompu = ownerWindow.getComputedStyle(ref.current),
          _newHeight = _ownerWindow$getCompu.height,
          _newWidth = _ownerWindow$getCompu.width;

      var newHeight = parseFloat(_newHeight);
      var newWidth = parseFloat(_newWidth);

      if (newHeight !== height || newWidth !== width) {
        setDimensions({
          height: newHeight,
          width: newWidth
        });
      }
    }
  }, [ref, width, height]);
  return {
    ref: ref,
    width: width,
    height: height
  };
}

function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
} ////////////////////////////////////////////////////////////////////////////////

export default Slider;
export { SLIDER_HANDLE_ALIGN_CENTER, SLIDER_HANDLE_ALIGN_CONTAIN, SLIDER_ORIENTATION_HORIZONTAL, SLIDER_ORIENTATION_VERTICAL, Slider, SliderHandle, SliderHandleAlignment, SliderInput, SliderMarker, SliderOrientation, SliderRange, SliderTrack, SliderTrackHighlight };
