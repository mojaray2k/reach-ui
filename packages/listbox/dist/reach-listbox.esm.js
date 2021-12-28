import { forwardRef, useRef, useMemo, useEffect, createElement, Fragment, useContext, memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useId } from '@reach/auto-id';
import { Popover, positionMatchWidth } from '@reach/popover';
import { createDescendantContext, useDescendantsInit, DescendantProvider, useDescendant, useDescendants, useDescendantKeyDown } from '@reach/descendants';
import { isRightClick } from '@reach/utils/is-right-click';
import { useIsomorphicLayoutEffect } from '@reach/utils/use-isomorphic-layout-effect';
import { useStableCallback } from '@reach/utils/use-stable-callback';
import { createNamedContext } from '@reach/utils/context';
import { isFunction, isBoolean, isString } from '@reach/utils/type-check';
import { makeId } from '@reach/utils/make-id';
import { useControlledSwitchWarning, useCheckStyles } from '@reach/utils/dev-utils';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { useStatefulRefValue } from '@reach/utils/use-stateful-ref-value';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import { assign, useCreateMachine, useMachine } from '@reach/machine';
import { getOwnerDocument } from '@reach/utils/owner-document';

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

var _commonEvents;
////////////////////////////////////////////////////////////////////////////////
// States
var ListboxStates; ////////////////////////////////////////////////////////////////////////////////
// Events

(function (ListboxStates) {
  ListboxStates["Idle"] = "IDLE";
  ListboxStates["Open"] = "OPEN";
  ListboxStates["Navigating"] = "NAVIGATING";
  ListboxStates["Dragging"] = "DRAGGING";
  ListboxStates["Interacting"] = "INTERACTING";
})(ListboxStates || (ListboxStates = {}));

var ListboxEvents; ////////////////////////////////////////////////////////////////////////////////
// Actions and conditions

(function (ListboxEvents) {
  ListboxEvents["ButtonMouseDown"] = "BUTTON_MOUSE_DOWN";
  ListboxEvents["ButtonMouseUp"] = "BUTTON_MOUSE_UP";
  ListboxEvents["Blur"] = "BLUR";
  ListboxEvents["ClearNavSelection"] = "CLEAR_NAV_SELECTION";
  ListboxEvents["ClearTypeahead"] = "CLEAR_TYPEAHEAD";
  ListboxEvents["GetDerivedData"] = "GET_DERIVED_DATA";
  ListboxEvents["KeyDownEscape"] = "KEY_DOWN_ESCAPE";
  ListboxEvents["KeyDownEnter"] = "KEY_DOWN_ENTER";
  ListboxEvents["KeyDownSpace"] = "KEY_DOWN_SPACE";
  ListboxEvents["KeyDownNavigate"] = "KEY_DOWN_NAVIGATE";
  ListboxEvents["KeyDownSearch"] = "KEY_DOWN_SEARCH";
  ListboxEvents["KeyDownTab"] = "KEY_DOWN_TAB";
  ListboxEvents["KeyDownShiftTab"] = "KEY_DOWN_SHIFT_TAB";
  ListboxEvents["OptionTouchStart"] = "OPTION_TOUCH_START";
  ListboxEvents["OptionMouseMove"] = "OPTION_MOUSE_MOVE";
  ListboxEvents["OptionMouseEnter"] = "OPTION_MOUSE_ENTER";
  ListboxEvents["OptionMouseDown"] = "OPTION_MOUSE_DOWN";
  ListboxEvents["OptionMouseUp"] = "OPTION_MOUSE_UP";
  ListboxEvents["OptionClick"] = "OPTION_CLICK";
  ListboxEvents["ListMouseUp"] = "LIST_MOUSE_UP";
  ListboxEvents["OptionPress"] = "OPTION_PRESS";
  ListboxEvents["OutsideMouseDown"] = "OUTSIDE_MOUSE_DOWN";
  ListboxEvents["OutsideMouseUp"] = "OUTSIDE_MOUSE_UP";
  ListboxEvents["ValueChange"] = "VALUE_CHANGE";
  ListboxEvents["PopoverPointerDown"] = "POPOVER_POINTER_DOWN";
  ListboxEvents["PopoverPointerUp"] = "POPOVER_POINTER_UP";
  ListboxEvents["UpdateAfterTypeahead"] = "UPDATE_AFTER_TYPEAHEAD";
})(ListboxEvents || (ListboxEvents = {}));

var clearNavigationValue = /*#__PURE__*/assign({
  navigationValue: null
});
var clearTypeahead = /*#__PURE__*/assign({
  typeaheadQuery: null
});
var assignValue = /*#__PURE__*/assign({
  value: function value(_, event) {
    return event.value;
  }
});
var navigate = /*#__PURE__*/assign({
  navigationValue: function navigationValue(data, event) {
    return event.value;
  }
});
var navigateFromCurrentValue = /*#__PURE__*/assign({
  navigationValue: function navigationValue(data) {
    // Before we navigate based on the current value, we need to make sure the
    // current value is selectable. If not, we should instead navigate to the
    // first selectable option.
    var selected = findOptionFromValue(data.value, data.options);

    if (selected && !selected.disabled) {
      return data.value;
    } else {
      var _data$options$find;

      return ((_data$options$find = data.options.find(function (option) {
        return !option.disabled;
      })) == null ? void 0 : _data$options$find.value) || null;
    }
  }
});

function listboxLostFocus(data, event) {
  if (event.type === ListboxEvents.Blur) {
    var _event$refs = event.refs,
        list = _event$refs.list,
        popover = _event$refs.popover;
    var relatedTarget = event.relatedTarget;
    var ownerDocument = getOwnerDocument(popover);
    return !!((ownerDocument == null ? void 0 : ownerDocument.activeElement) !== list && popover && !popover.contains(relatedTarget || (ownerDocument == null ? void 0 : ownerDocument.activeElement)));
  }

  return false;
}

function clickedOutsideOfListbox(data, event) {
  if (event.type === ListboxEvents.OutsideMouseDown || event.type === ListboxEvents.OutsideMouseUp) {
    var _event$refs2 = event.refs,
        button = _event$refs2.button,
        popover = _event$refs2.popover;
    var relatedTarget = event.relatedTarget; // Close the popover IF:

    return !!( // clicked element is not the button
    relatedTarget !== button && // clicked element is not inside the button
    button && !button.contains(relatedTarget) && // clicked element is not inside the popover
    popover && !popover.contains(relatedTarget));
  }

  return false;
}

function optionIsActive(data, event) {
  return !!data.options.find(function (option) {
    return option.value === data.navigationValue;
  });
}

function shouldNavigate(data, event) {
  var _event$refs3 = event.refs,
      popover = _event$refs3.popover,
      list = _event$refs3.list;
  var relatedTarget = event.relatedTarget; // When a blur event happens, we want to move to Navigating state unless the
  // user is interacting with elements inside the popover...

  if (popover && relatedTarget && popover.contains(relatedTarget) && relatedTarget !== list) {
    return false;
  } // ...otherwise, just make sure the next option is selectable


  return optionIsActive(data);
}

function focusList(data, event) {
  requestAnimationFrame(function () {
    event.refs.list && event.refs.list.focus();
  });
}

function focusButton(data, event) {
  event.refs.button && event.refs.button.focus();
}

function listboxIsNotDisabled(data, event) {
  return !event.disabled;
}

function optionIsNavigable(data, event) {
  if (event.type === ListboxEvents.OptionTouchStart) {
    if (event && event.disabled) {
      return false;
    }
  }

  return true;
}

function optionIsSelectable(data, event) {
  if ("disabled" in event && event.disabled) {
    return false;
  }

  if ("value" in event) {
    return event.value != null;
  }

  return data.navigationValue != null;
}

function selectOption(data, event) {
  event.callback && event.callback(event.value);
}

function submitForm(data, event) {
  if (event.type !== ListboxEvents.KeyDownEnter) {
    return;
  } // So this one is a little weird, but here's what we're doing.
  // When a user presses Enter in the context of a form, the form
  // should submit. Now I know you're probably thinking:
  //
  //      "Aha! I've got it!"
  //          > inputNode.form.submit()
  //      ** cracks knuckles ** "Phew. My work here is done."
  //
  // But alas, we are not so lucky. What's really happening when a
  // user presses enter in a normal form field is that the browser
  // looks at the form the input is in, then looks for the first
  // button or input in that form where its type property is `submit`,
  // then it triggers a click event on that button. COOL, CARRY ON.
  //
  // If we were to fire inputNode.form.submit(), this would bypass any
  // onSubmit handler in the form and just do what the browser
  // normally does when you submit a form and trigger a page refresh.
  // No bueno. So we do what the browser does and just go on a duck
  // hunt for the first submit button in the form and we click that
  // sucker.


  var hiddenInput = event.refs.hiddenInput;

  if (hiddenInput && hiddenInput.form) {
    var submitButton = hiddenInput.form.querySelector("button,[type='submit']");
    submitButton && submitButton.click();
  }
}

var setTypeahead = /*#__PURE__*/assign({
  typeaheadQuery: function typeaheadQuery(data, event) {
    return (data.typeaheadQuery || "") + event.query;
  }
});
var setValueFromTypeahead = /*#__PURE__*/assign({
  value: function value(data, event) {
    if (event.type === ListboxEvents.UpdateAfterTypeahead && event.query) {
      var match = findOptionFromTypeahead(data.options, event.query);

      if (match && !match.disabled) {
        event.callback && event.callback(match.value);
        return match.value;
      }
    }

    return data.value;
  }
});
var setNavSelectionFromTypeahead = /*#__PURE__*/assign({
  navigationValue: function navigationValue(data, event) {
    if (event.type === ListboxEvents.UpdateAfterTypeahead && event.query) {
      var match = findOptionFromTypeahead(data.options, event.query);

      if (match && !match.disabled) {
        return match.value;
      }
    }

    return data.navigationValue;
  }
});
var commonEvents = (_commonEvents = {}, _commonEvents[ListboxEvents.GetDerivedData] = {
  actions: /*#__PURE__*/assign(function (ctx, event) {
    return _extends({}, ctx, event.data);
  })
}, _commonEvents[ListboxEvents.ValueChange] = {
  actions: [assignValue, selectOption]
}, _commonEvents); ////////////////////////////////////////////////////////////////////////////////

/**
 * Initializer for our state machine.
 *
 * @param initial
 * @param props
 */

var createMachineDefinition = function createMachineDefinition(_ref) {
  var _extends2, _extends3, _extends4, _extends5, _extends6, _states;

  var value = _ref.value;
  return {
    id: "listbox",
    initial: ListboxStates.Idle,
    context: {
      value: value,
      options: [],
      navigationValue: null,
      typeaheadQuery: null
    },
    states: (_states = {}, _states[ListboxStates.Idle] = {
      on: _extends({}, commonEvents, (_extends2 = {}, _extends2[ListboxEvents.ButtonMouseDown] = {
        target: ListboxStates.Open,
        actions: [navigateFromCurrentValue],
        cond: listboxIsNotDisabled
      }, _extends2[ListboxEvents.KeyDownSpace] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, focusList],
        cond: listboxIsNotDisabled
      }, _extends2[ListboxEvents.KeyDownSearch] = {
        target: ListboxStates.Idle,
        actions: setTypeahead,
        cond: listboxIsNotDisabled
      }, _extends2[ListboxEvents.UpdateAfterTypeahead] = {
        target: ListboxStates.Idle,
        actions: [setValueFromTypeahead],
        cond: listboxIsNotDisabled
      }, _extends2[ListboxEvents.ClearTypeahead] = {
        target: ListboxStates.Idle,
        actions: clearTypeahead
      }, _extends2[ListboxEvents.KeyDownNavigate] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, clearTypeahead, focusList],
        cond: listboxIsNotDisabled
      }, _extends2[ListboxEvents.KeyDownEnter] = {
        actions: [submitForm],
        cond: listboxIsNotDisabled
      }, _extends2))
    }, _states[ListboxStates.Interacting] = {
      entry: [clearNavigationValue],
      on: _extends({}, commonEvents, (_extends3 = {}, _extends3[ListboxEvents.ClearNavSelection] = {
        actions: [clearNavigationValue, focusList]
      }, _extends3[ListboxEvents.KeyDownEnter] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends3[ListboxEvents.KeyDownSpace] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends3[ListboxEvents.ButtonMouseDown] = {
        target: ListboxStates.Idle,
        // When the user triggers a mouseDown event on the button, we call
        // event.preventDefault() because the browser will naturally send a
        // mouseup event and click, which will reopen the button (which we
        // don't want). As such, the click won't blur the open list or
        // re-focus the trigger, so we call `focusButton` to do that manually.
        // We could work around this with deferred transitions with xstate,
        // but @xstate/fsm currently doesn't support that feature and this
        // works good enough for the moment.
        actions: [focusButton]
      }, _extends3[ListboxEvents.KeyDownEscape] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends3[ListboxEvents.OptionMouseDown] = {
        target: ListboxStates.Dragging
      }, _extends3[ListboxEvents.OutsideMouseDown] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Dragging,
        actions: clearTypeahead,
        cond: optionIsActive
      }], _extends3[ListboxEvents.OutsideMouseUp] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends3[ListboxEvents.KeyDownEnter] = ListboxStates.Interacting, _extends3[ListboxEvents.Blur] = [{
        target: ListboxStates.Idle,
        cond: listboxLostFocus,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: shouldNavigate
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends3[ListboxEvents.OptionTouchStart] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends3[ListboxEvents.OptionClick] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends3[ListboxEvents.OptionPress] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends3[ListboxEvents.OptionMouseEnter] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends3[ListboxEvents.KeyDownNavigate] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead, focusList]
      }, _extends3))
    }, _states[ListboxStates.Open] = {
      on: _extends({}, commonEvents, (_extends4 = {}, _extends4[ListboxEvents.ClearNavSelection] = {
        actions: [clearNavigationValue]
      }, _extends4[ListboxEvents.KeyDownEnter] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends4[ListboxEvents.KeyDownSpace] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends4[ListboxEvents.ButtonMouseDown] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends4[ListboxEvents.KeyDownEscape] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends4[ListboxEvents.OptionMouseDown] = {
        target: ListboxStates.Dragging
      }, _extends4[ListboxEvents.OutsideMouseDown] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Dragging,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends4[ListboxEvents.OutsideMouseUp] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends4[ListboxEvents.Blur] = [{
        target: ListboxStates.Idle,
        cond: listboxLostFocus,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: shouldNavigate
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends4[ListboxEvents.ButtonMouseUp] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, focusList]
      }, _extends4[ListboxEvents.ListMouseUp] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, focusList]
      }, _extends4[ListboxEvents.OptionTouchStart] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends4[ListboxEvents.OptionClick] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends4[ListboxEvents.OptionPress] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends4[ListboxEvents.KeyDownNavigate] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead, focusList]
      }, _extends4[ListboxEvents.KeyDownSearch] = {
        target: ListboxStates.Navigating,
        actions: setTypeahead
      }, _extends4[ListboxEvents.UpdateAfterTypeahead] = {
        actions: [setNavSelectionFromTypeahead]
      }, _extends4[ListboxEvents.ClearTypeahead] = {
        actions: clearTypeahead
      }, _extends4[ListboxEvents.OptionMouseMove] = [{
        target: ListboxStates.Dragging,
        actions: [navigate],
        cond: optionIsNavigable
      }, {
        target: ListboxStates.Dragging
      }], _extends4))
    }, _states[ListboxStates.Dragging] = {
      on: _extends({}, commonEvents, (_extends5 = {}, _extends5[ListboxEvents.ClearNavSelection] = {
        actions: [clearNavigationValue]
      }, _extends5[ListboxEvents.KeyDownEnter] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends5[ListboxEvents.KeyDownSpace] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends5[ListboxEvents.ButtonMouseDown] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends5[ListboxEvents.KeyDownEscape] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends5[ListboxEvents.OptionMouseDown] = {
        target: ListboxStates.Dragging
      }, _extends5[ListboxEvents.OutsideMouseDown] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends5[ListboxEvents.OutsideMouseUp] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive,
        actions: focusList
      }, {
        target: ListboxStates.Interacting,
        actions: [clearTypeahead, focusList]
      }], _extends5[ListboxEvents.Blur] = [{
        target: ListboxStates.Idle,
        cond: listboxLostFocus,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: shouldNavigate
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends5[ListboxEvents.ButtonMouseUp] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, focusList]
      }, _extends5[ListboxEvents.OptionTouchStart] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends5[ListboxEvents.OptionClick] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends5[ListboxEvents.OptionPress] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends5[ListboxEvents.OptionMouseEnter] = {
        target: ListboxStates.Dragging,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends5[ListboxEvents.KeyDownNavigate] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead, focusList]
      }, _extends5[ListboxEvents.KeyDownSearch] = {
        target: ListboxStates.Navigating,
        actions: setTypeahead
      }, _extends5[ListboxEvents.UpdateAfterTypeahead] = {
        actions: [setNavSelectionFromTypeahead]
      }, _extends5[ListboxEvents.ClearTypeahead] = {
        actions: clearTypeahead
      }, _extends5[ListboxEvents.OptionMouseMove] = [{
        target: ListboxStates.Navigating,
        actions: [navigate],
        cond: optionIsNavigable
      }, {
        target: ListboxStates.Navigating
      }], _extends5[ListboxEvents.OptionMouseUp] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends5))
    }, _states[ListboxStates.Navigating] = {
      on: _extends({}, commonEvents, (_extends6 = {}, _extends6[ListboxEvents.ClearNavSelection] = {
        actions: [clearNavigationValue, focusList]
      }, _extends6[ListboxEvents.KeyDownEnter] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends6[ListboxEvents.KeyDownSpace] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends6[ListboxEvents.ButtonMouseDown] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends6[ListboxEvents.KeyDownEscape] = {
        target: ListboxStates.Idle,
        actions: [focusButton]
      }, _extends6[ListboxEvents.OptionMouseDown] = {
        target: ListboxStates.Dragging
      }, _extends6[ListboxEvents.OutsideMouseDown] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends6[ListboxEvents.OutsideMouseUp] = [{
        target: ListboxStates.Idle,
        cond: clickedOutsideOfListbox,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: optionIsActive
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends6[ListboxEvents.Blur] = [{
        target: ListboxStates.Idle,
        cond: listboxLostFocus,
        actions: clearTypeahead
      }, {
        target: ListboxStates.Navigating,
        cond: shouldNavigate
      }, {
        target: ListboxStates.Interacting,
        actions: clearTypeahead
      }], _extends6[ListboxEvents.ButtonMouseUp] = {
        target: ListboxStates.Navigating,
        actions: [navigateFromCurrentValue, focusList]
      }, _extends6[ListboxEvents.OptionTouchStart] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends6[ListboxEvents.OptionClick] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends6[ListboxEvents.OptionPress] = {
        target: ListboxStates.Idle,
        actions: [assignValue, clearTypeahead, focusButton, selectOption],
        cond: optionIsSelectable
      }, _extends6[ListboxEvents.OptionMouseEnter] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead],
        cond: optionIsNavigable
      }, _extends6[ListboxEvents.KeyDownNavigate] = {
        target: ListboxStates.Navigating,
        actions: [navigate, clearTypeahead, focusList]
      }, _extends6[ListboxEvents.KeyDownSearch] = {
        target: ListboxStates.Navigating,
        actions: setTypeahead
      }, _extends6[ListboxEvents.UpdateAfterTypeahead] = {
        actions: [setNavSelectionFromTypeahead]
      }, _extends6[ListboxEvents.ClearTypeahead] = {
        actions: clearTypeahead
      }, _extends6[ListboxEvents.OptionMouseMove] = [{
        target: ListboxStates.Navigating,
        actions: [navigate],
        cond: optionIsNavigable
      }, {
        target: ListboxStates.Navigating
      }], _extends6))
    }, _states)
  };
}; ////////////////////////////////////////////////////////////////////////////////

function findOptionFromTypeahead(options, string) {
  if (string === void 0) {
    string = "";
  }

  if (!string) return null;
  var found = options.find(function (option) {
    return !option.disabled && option.label && option.label.toLowerCase().startsWith(string.toLowerCase());
  });
  return found || null;
}

function findOptionFromValue(value, options) {
  return value ? options.find(function (option) {
    return option.value === value;
  }) : undefined;
} ////////////////////////////////////////////////////////////////////////////////
// Types

/**
 * Shared partial interface for all of our event objects.
 */

var _excluded = ["as", "aria-labelledby", "aria-label", "children", "defaultValue", "disabled", "form", "name", "onChange", "required", "value", "__componentName"],
    _excluded2 = ["arrow", "button", "children", "portal"],
    _excluded3 = ["aria-label", "arrow", "as", "children", "onKeyDown", "onMouseDown", "onMouseUp"],
    _excluded4 = ["as", "children"],
    _excluded5 = ["as", "position", "onBlur", "onKeyDown", "onMouseUp", "portal", "unstable_observableRefs"],
    _excluded6 = ["as"],
    _excluded7 = ["as", "children", "disabled", "index", "label", "onClick", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseUp", "onTouchStart", "value"],
    _excluded8 = ["as", "label", "children"],
    _excluded9 = ["as"];
var DEBUG = false; ////////////////////////////////////////////////////////////////////////////////
// ListboxContext

var ListboxDescendantContext = /*#__PURE__*/createDescendantContext("ListboxDescendantContext");
var ListboxContext = /*#__PURE__*/createNamedContext("ListboxContext", {});
var ListboxGroupContext = /*#__PURE__*/createNamedContext("ListboxGroupContext", {}); ////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxInput
 *
 * The top-level component and context provider for the listbox.
 *
 * @see Docs https://reach.tech/listbox#listboxinput
 */

var ListboxInput = /*#__PURE__*/forwardRef(function ListboxInput(_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      ariaLabelledBy = _ref["aria-labelledby"],
      ariaLabel = _ref["aria-label"],
      children = _ref.children,
      defaultValue = _ref.defaultValue,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      form = _ref.form,
      name = _ref.name,
      onChange = _ref.onChange,
      required = _ref.required,
      valueProp = _ref.value,
      _ref$__componentName = _ref.__componentName,
      __componentName = _ref$__componentName === void 0 ? "ListboxInput" : _ref$__componentName,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var isControlled = useRef(valueProp != null);

  var _useDescendantsInit = useDescendantsInit(),
      options = _useDescendantsInit[0],
      setOptions = _useDescendantsInit[1]; // DOM refs


  var buttonRef = useRef(null);
  var hiddenInputRef = useRef(null);
  var highlightedOptionRef = useRef(null);
  var inputRef = useRef(null);
  var listRef = useRef(null);
  var popoverRef = useRef(null);
  var selectedOptionRef = useRef(null);
  var machine = useCreateMachine(createMachineDefinition({
    // The initial value of our machine should come from the `value` or
    // `defaultValue` props if they exist.
    value: (isControlled.current ? valueProp : defaultValue) || null
  }));

  var _useMachine = useMachine(machine, {
    button: buttonRef,
    hiddenInput: hiddenInputRef,
    highlightedOption: highlightedOptionRef,
    input: inputRef,
    list: listRef,
    popover: popoverRef,
    selectedOption: selectedOptionRef
  }, DEBUG),
      state = _useMachine[0],
      send = _useMachine[1];

  function handleValueChange(newValue) {
    if (newValue !== state.context.value) {
      onChange == null ? void 0 : onChange(newValue);
    }
  } // IDs for aria attributes


  var _id = useId(props.id);

  var id = props.id || makeId("listbox-input", _id);
  var ref = useComposedRefs(inputRef, forwardedRef); // If the button has children, we just render them as the label.
  // Otherwise we'll find the option with a value that matches the listbox value
  // and use its label in the button. We'll get that here and send it to the
  // button via context.
  // If a user needs the label for SSR to prevent hydration mismatch issues,
  // they need to control the state of the component and pass a label directly
  // to the button.

  var valueLabel = useMemo(function () {
    var selected = options.find(function (option) {
      return option.value === state.context.value;
    });
    return selected ? selected.label : null;
  }, [options, state.context.value]);
  var isExpanded = isListboxExpanded(state.value);
  var context = {
    ariaLabel: ariaLabel,
    ariaLabelledBy: ariaLabelledBy,
    buttonRef: buttonRef,
    disabled: disabled,
    highlightedOptionRef: highlightedOptionRef,
    isExpanded: isExpanded,
    listboxId: id,
    listboxValueLabel: valueLabel,
    listRef: listRef,
    onValueChange: handleValueChange,
    popoverRef: popoverRef,
    selectedOptionRef: selectedOptionRef,
    send: send,
    state: state.value,
    stateData: state.context
  }; // For uncontrolled listbox components where no `defaultValue` is provided, we
  // will update the value based on the value of the first selectable option.
  // We call the update directly because:
  //   A) we only ever need to do this once, so we can guard with a ref
  //   B) useLayoutEffect races useDecendant, so we might not have options yet
  //   C) useEffect will cause a flash

  var mounted = useRef(false);

  if (!isControlled.current && // the app is not controlling state
  defaultValue == null && // there is no default value
  !mounted.current && // we haven't done this already
  options.length // we have some options
  ) {
      mounted.current = true;
      var first = options.find(function (option) {
        return !option.disabled;
      });

      if (first && first.value) {
        send({
          type: ListboxEvents.ValueChange,
          value: first.value
        });
      }
    }

  useControlledSwitchWarning(valueProp, "value", __componentName); // Even if the app controls state, we still need to update it internally to
  // run the state machine transitions

  useControlledStateSync(valueProp, state.context.value, function () {
    send({
      type: ListboxEvents.ValueChange,
      value: valueProp
    });
  });
  useIsomorphicLayoutEffect(function () {
    send({
      type: ListboxEvents.GetDerivedData,
      data: {
        options: options
      }
    });
  }, [options, send]);
  useEffect(function () {
    function handleMouseDown(event) {
      var target = event.target,
          relatedTarget = event.relatedTarget;

      if (!popoverContainsEventTarget(popoverRef.current, target)) {
        send({
          type: ListboxEvents.OutsideMouseDown,
          relatedTarget: relatedTarget || target
        });
      }
    }

    if (isExpanded) {
      window.addEventListener("mousedown", handleMouseDown);
    }

    return function () {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [send, isExpanded]);
  useEffect(function () {
    function handleMouseUp(event) {
      var target = event.target,
          relatedTarget = event.relatedTarget;

      if (!popoverContainsEventTarget(popoverRef.current, target)) {
        send({
          type: ListboxEvents.OutsideMouseUp,
          relatedTarget: relatedTarget || target
        });
      }
    }

    if (isExpanded) {
      window.addEventListener("mouseup", handleMouseUp);
    }

    return function () {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [send, isExpanded]);
  useCheckStyles("listbox");
  return /*#__PURE__*/createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-listbox-input": "",
    "data-state": isExpanded ? "expanded" : "closed",
    "data-value": state.context.value,
    id: id
  }), /*#__PURE__*/createElement(ListboxContext.Provider, {
    value: context
  }, /*#__PURE__*/createElement(DescendantProvider, {
    context: ListboxDescendantContext,
    items: options,
    set: setOptions
  }, isFunction(children) ? children({
    id: id,
    isExpanded: isExpanded,
    value: state.context.value,
    selectedOptionRef: selectedOptionRef,
    highlightedOptionRef: highlightedOptionRef,
    valueLabel: valueLabel,
    // TODO: Remove in 1.0
    expanded: isExpanded
  }) : children, (form || name || required) && /*#__PURE__*/createElement("input", {
    ref: hiddenInputRef,
    "data-reach-listbox-hidden-input": "",
    disabled: disabled,
    form: form,
    name: name,
    readOnly: true,
    required: required,
    tabIndex: -1,
    type: "hidden",
    value: state.context.value || ""
  }))));
});

if (process.env.NODE_ENV !== "production") {
  ListboxInput.displayName = "ListboxInput";
  ListboxInput.propTypes = {
    children: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    form: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    value: PropTypes.string
  };
}
/**
 * @see Docs https://reach.tech/listbox#listboxinput-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * Listbox
 *
 * High-level listbox API
 *
 * @example
 * <Listbox>
 *   <ListboxOption value="1">Option 1</ListboxOption>
 *   <ListboxOption value="2">Option 2</ListboxOption>
 *   <ListboxOption value="3">Option 3</ListboxOption>
 * </Listbox>
 *
 * @see Docs https://reach.tech/listbox#listbox-1
 */
var Listbox = /*#__PURE__*/forwardRef(function Listbox(_ref2, forwardedRef) {
  var _ref2$arrow = _ref2.arrow,
      arrow = _ref2$arrow === void 0 ? "▼" : _ref2$arrow,
      button = _ref2.button,
      children = _ref2.children,
      _ref2$portal = _ref2.portal,
      portal = _ref2$portal === void 0 ? true : _ref2$portal,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  return /*#__PURE__*/createElement(ListboxInput, _extends({}, props, {
    __componentName: "Listbox",
    ref: forwardedRef
  }), function (_ref3) {
    var value = _ref3.value,
        valueLabel = _ref3.valueLabel;
    return /*#__PURE__*/createElement(Fragment, null, /*#__PURE__*/createElement(ListboxButton, {
      arrow: arrow,
      children: button ? isFunction(button) ? button({
        value: value,
        label: valueLabel
      }) : button : undefined
    }), /*#__PURE__*/createElement(ListboxPopover, {
      portal: portal
    }, /*#__PURE__*/createElement(ListboxList, null, children)));
  });
});

if (process.env.NODE_ENV !== "production") {
  Listbox.displayName = "Listbox";
  Listbox.propTypes = /*#__PURE__*/_extends({}, ListboxInput.propTypes, {
    arrow: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    button: /*#__PURE__*/PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    children: PropTypes.node
  });
}
/**
 * @see Docs https://reach.tech/listbox#listbox-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxButton
 *
 * The interactive toggle button that triggers the popover for the listbox.
 *
 * @see Docs https://reach.tech/listbox#listbox-button
 */
var ListboxButtonImpl = /*#__PURE__*/forwardRef(function ListboxButton(_ref4, forwardedRef) {
  var ariaLabel = _ref4["aria-label"],
      _ref4$arrow = _ref4.arrow,
      arrow = _ref4$arrow === void 0 ? false : _ref4$arrow,
      _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "span" : _ref4$as,
      children = _ref4.children,
      onKeyDown = _ref4.onKeyDown,
      onMouseDown = _ref4.onMouseDown,
      onMouseUp = _ref4.onMouseUp,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded3);

  var _React$useContext = useContext(ListboxContext),
      buttonRef = _React$useContext.buttonRef,
      send = _React$useContext.send,
      ariaLabelledBy = _React$useContext.ariaLabelledBy,
      disabled = _React$useContext.disabled,
      isExpanded = _React$useContext.isExpanded,
      listboxId = _React$useContext.listboxId,
      stateData = _React$useContext.stateData,
      listboxValueLabel = _React$useContext.listboxValueLabel;

  var listboxValue = stateData.value;
  var ref = useComposedRefs(buttonRef, forwardedRef);
  var handleKeyDown = useKeyDown();

  function handleMouseDown(event) {
    if (!isRightClick(event.nativeEvent)) {
      event.preventDefault();
      event.stopPropagation();
      send({
        type: ListboxEvents.ButtonMouseDown,
        disabled: disabled
      });
    }
  }

  function handleMouseUp(event) {
    if (!isRightClick(event.nativeEvent)) {
      event.preventDefault();
      event.stopPropagation();
      send({
        type: ListboxEvents.ButtonMouseUp
      });
    }
  }

  var id = makeId("button", listboxId); // If the button has children, we just render them as the label
  // If a user needs the label on the server to prevent hydration mismatch
  // errors, they need to control the state of the component and pass a label
  // directly to the button.

  var label = useMemo(function () {
    if (!children) {
      return listboxValueLabel;
    } else if (isFunction(children)) {
      return children({
        isExpanded: isExpanded,
        label: listboxValueLabel,
        value: listboxValue,
        // TODO: Remove in 1.0
        expanded: isExpanded
      });
    }

    return children;
  }, [children, listboxValueLabel, isExpanded, listboxValue]);
  return /*#__PURE__*/createElement(Comp // Applicable to all host language elements regardless of whether a
  // `role` is applied.
  // https://www.w3.org/WAI/PF/aria/states_and_properties#global_states_header
  , _extends({
    "aria-disabled": disabled || undefined // Set by the JavaScript when the listbox is displayed. Otherwise, is
    // not present.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-collapsible.html
    ,
    "aria-expanded": isExpanded || undefined // Indicates that activating the button displays a listbox.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-collapsible.html
    ,
    "aria-haspopup": "listbox" // References the two elements whose labels are concatenated by the
    // browser to label the button. The first element is a span containing
    // perceivable label for the listbox component. The second element is
    // the button itself; the button text is set to the name of the
    // currently chosen element.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-collapsible.html
    // If an `aria-label` is passed, we should skip `aria-labelledby` to
    // avoid confusion.
    ,
    "aria-labelledby": ariaLabel ? undefined : [ariaLabelledBy, id].filter(Boolean).join(" "),
    "aria-label": ariaLabel // Identifies the element as a button widget.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/button/button.html
    ,
    role: "button" // Includes the element in the tab sequence.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/button/button.html
    ,
    tabIndex: disabled ? -1 : 0
  }, props, {
    ref: ref,
    "data-reach-listbox-button": "",
    id: id,
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
    onMouseDown: composeEventHandlers(onMouseDown, handleMouseDown),
    onMouseUp: composeEventHandlers(onMouseUp, handleMouseUp)
  }), label, arrow && /*#__PURE__*/createElement(ListboxArrow, null, isBoolean(arrow) ? null : arrow));
});

if (process.env.NODE_ENV !== "production") {
  ListboxButtonImpl.displayName = "ListboxButton";
  ListboxButtonImpl.propTypes = {
    arrow: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    children: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  };
}

var ListboxButton = /*#__PURE__*/memo(ListboxButtonImpl);
/**
 * @see Docs https://reach.tech/listbox#listboxbutton-props
 */

////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxArrow
 *
 * A wrapper component for an arrow to display in the `ListboxButton`
 *
 * @see Docs https://reach.tech/listbox#listboxarrow
 */
var ListboxArrowImpl = /*#__PURE__*/forwardRef(function ListboxArrow(_ref5, forwardedRef) {
  var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "span" : _ref5$as,
      children = _ref5.children,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded4);

  var _React$useContext2 = useContext(ListboxContext),
      isExpanded = _React$useContext2.isExpanded;

  return /*#__PURE__*/createElement(Comp // The arrow provides no semantic value and its inner content should be
  // hidden from the accessibility tree
  , _extends({
    "aria-hidden": true
  }, props, {
    ref: forwardedRef,
    "data-reach-listbox-arrow": "",
    "data-expanded": isExpanded ? "" : undefined
  }), isFunction(children) ? children({
    isExpanded: isExpanded,
    // TODO: Remove in 1.0
    expanded: isExpanded
  }) : children || "▼");
});

if (process.env.NODE_ENV !== "production") {
  ListboxArrowImpl.displayName = "ListboxArrow";
  ListboxArrowImpl.propTypes = {
    children: /*#__PURE__*/PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  };
}

var ListboxArrow = /*#__PURE__*/memo(ListboxArrowImpl);
/**
 * @see Docs https://reach.tech/listbox#listboxarrow-props
 */

////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxPopover
 *
 * The popover containing the list of options.
 *
 * @see Docs https://reach.tech/listbox#listboxpopover
 */
var ListboxPopoverImpl = /*#__PURE__*/forwardRef(function ListboxPopover(_ref6, forwardedRef) {
  var _ref6$as = _ref6.as,
      Comp = _ref6$as === void 0 ? "div" : _ref6$as,
      _ref6$position = _ref6.position,
      position = _ref6$position === void 0 ? positionMatchWidth : _ref6$position,
      onBlur = _ref6.onBlur,
      onKeyDown = _ref6.onKeyDown,
      onMouseUp = _ref6.onMouseUp,
      _ref6$portal = _ref6.portal,
      portal = _ref6$portal === void 0 ? true : _ref6$portal,
      unstable_observableRefs = _ref6.unstable_observableRefs,
      props = _objectWithoutPropertiesLoose(_ref6, _excluded5);

  var _React$useContext3 = useContext(ListboxContext),
      isExpanded = _React$useContext3.isExpanded,
      buttonRef = _React$useContext3.buttonRef,
      popoverRef = _React$useContext3.popoverRef,
      send = _React$useContext3.send;

  var ref = useComposedRefs(popoverRef, forwardedRef);
  var handleKeyDown = useKeyDown();

  function handleMouseUp() {
    send({
      type: ListboxEvents.ListMouseUp
    });
  }

  var commonProps = _extends({
    hidden: !isExpanded,
    tabIndex: -1
  }, props, {
    ref: ref,
    "data-reach-listbox-popover": "",
    onMouseUp: composeEventHandlers(onMouseUp, handleMouseUp),
    onBlur: composeEventHandlers(onBlur, handleBlur),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown)
  });

  function handleBlur(event) {
    var nativeEvent = event.nativeEvent;
    requestAnimationFrame(function () {
      send({
        type: ListboxEvents.Blur,
        relatedTarget: nativeEvent.relatedTarget || nativeEvent.target
      });
    });
  }

  return portal ? /*#__PURE__*/createElement(Popover, _extends({}, commonProps, {
    as: Comp,
    targetRef: buttonRef,
    position: position,
    unstable_observableRefs: unstable_observableRefs
  })) : /*#__PURE__*/createElement(Comp, commonProps);
});

if (process.env.NODE_ENV !== "production") {
  ListboxPopoverImpl.displayName = "ListboxPopover";
  ListboxPopoverImpl.propTypes = {
    children: PropTypes.node.isRequired,
    portal: PropTypes.bool,
    position: PropTypes.func
  };
}

var ListboxPopover = /*#__PURE__*/memo(ListboxPopoverImpl);
/**
 * @see Docs https://reach.tech/listbox#listboxpopover-props
 */

////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxList
 *
 * The list containing all listbox options.
 *
 * @see Docs https://reach.tech/listbox#listboxlist
 */
var ListboxList = /*#__PURE__*/forwardRef(function ListboxList(_ref7, forwardedRef) {
  var _ref7$as = _ref7.as,
      Comp = _ref7$as === void 0 ? "ul" : _ref7$as,
      props = _objectWithoutPropertiesLoose(_ref7, _excluded6);

  var _React$useContext4 = useContext(ListboxContext),
      listRef = _React$useContext4.listRef,
      ariaLabel = _React$useContext4.ariaLabel,
      ariaLabelledBy = _React$useContext4.ariaLabelledBy,
      isExpanded = _React$useContext4.isExpanded,
      listboxId = _React$useContext4.listboxId,
      _React$useContext4$st = _React$useContext4.stateData,
      value = _React$useContext4$st.value,
      navigationValue = _React$useContext4$st.navigationValue;

  var ref = useComposedRefs(forwardedRef, listRef);
  return /*#__PURE__*/createElement(Comp // Tells assistive technologies which of the options, if any, is
  // visually indicated as having keyboard focus. DOM focus remains on the
  // `ul` element and the idref specified for `aria-activedescendant`
  // refers to the `li` element that is visually styled as focused. When
  // navigation keys, such as `Down Arrow`, are pressed, the JavaScript
  // changes the value.
  // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-grouped.html
  , _extends({
    "aria-activedescendant": useOptionId(isExpanded ? navigationValue : value) // If the listbox is not part of another widget, then it has a visible
    // label referenced by `aria-labelledby` on the element with role
    // `listbox`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox
    // If an `aria-label` is passed, we should skip `aria-labelledby` to
    // avoid confusion.
    ,
    "aria-labelledby": ariaLabel ? undefined : ariaLabelledBy,
    "aria-label": ariaLabel // An element that contains or owns all the listbox options has role
    // listbox.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox
    ,
    role: "listbox" // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-collapsible.html
    ,
    tabIndex: -1
  }, props, {
    ref: ref,
    "data-reach-listbox-list": "",
    id: makeId("listbox", listboxId)
  }));
});

if (process.env.NODE_ENV !== "production") {
  ListboxList.displayName = "ListboxList";
  ListboxList.propTypes = {};
}
/**
 * @see Docs https://reach.tech/listbox#listboxlist-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxOption
 *
 * A selectable option for the listbox.
 *
 * @see Docs https://reach.tech/listbox#listboxoption
 */
var ListboxOption = /*#__PURE__*/forwardRef(function ListboxOption(_ref8, forwardedRef) {
  var _ref8$as = _ref8.as,
      Comp = _ref8$as === void 0 ? "li" : _ref8$as,
      children = _ref8.children,
      disabled = _ref8.disabled,
      indexProp = _ref8.index,
      labelProp = _ref8.label,
      onClick = _ref8.onClick,
      onMouseDown = _ref8.onMouseDown,
      onMouseEnter = _ref8.onMouseEnter,
      onMouseLeave = _ref8.onMouseLeave,
      onMouseMove = _ref8.onMouseMove,
      onMouseUp = _ref8.onMouseUp,
      onTouchStart = _ref8.onTouchStart,
      value = _ref8.value,
      props = _objectWithoutPropertiesLoose(_ref8, _excluded7);

  if (process.env.NODE_ENV !== "production" && !value) {
    throw Error("A ListboxOption must have a value prop.");
  }

  var _React$useContext5 = useContext(ListboxContext),
      highlightedOptionRef = _React$useContext5.highlightedOptionRef,
      selectedOptionRef = _React$useContext5.selectedOptionRef,
      send = _React$useContext5.send,
      isExpanded = _React$useContext5.isExpanded,
      onValueChange = _React$useContext5.onValueChange,
      state = _React$useContext5.state,
      _React$useContext5$st = _React$useContext5.stateData,
      listboxValue = _React$useContext5$st.value,
      navigationValue = _React$useContext5$st.navigationValue;

  var _React$useState = useState(labelProp),
      labelState = _React$useState[0],
      setLabel = _React$useState[1];

  var label = labelProp || labelState || "";
  var ownRef = useRef(null);

  var _useStatefulRefValue = useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue[0],
      handleRefSet = _useStatefulRefValue[1];

  var descendant = useMemo(function () {
    return {
      element: element,
      value: value,
      label: label,
      disabled: !!disabled
    };
  }, [disabled, element, label, value]);
  useDescendant(descendant, ListboxDescendantContext, indexProp); // After the ref is mounted to the DOM node, we check to see if we have an
  // explicit label prop before looking for the node's textContent for
  // typeahead functionality.

  var getLabelFromDomNode = useCallback(function (node) {
    if (!labelProp && node) {
      setLabel(function (prevState) {
        if (node.textContent && prevState !== node.textContent) {
          return node.textContent;
        }

        return prevState || "";
      });
    }
  }, [labelProp]);
  var isHighlighted = navigationValue ? navigationValue === value : false;
  var isSelected = listboxValue === value;
  var ref = useComposedRefs(getLabelFromDomNode, forwardedRef, handleRefSet, isSelected ? selectedOptionRef : null, isHighlighted ? highlightedOptionRef : null);

  function handleMouseEnter() {
    send({
      type: ListboxEvents.OptionMouseEnter,
      value: value,
      disabled: !!disabled
    });
  }

  function handleTouchStart() {
    send({
      type: ListboxEvents.OptionTouchStart,
      value: value,
      disabled: !!disabled
    });
  }

  function handleMouseLeave() {
    send({
      type: ListboxEvents.ClearNavSelection
    });
  }

  function handleMouseDown(event) {
    // Prevent blur event from firing and bubbling to the popover
    if (!isRightClick(event.nativeEvent)) {
      event.preventDefault();
      send({
        type: ListboxEvents.OptionMouseDown
      });
    }
  }

  function handleMouseUp(event) {
    if (!isRightClick(event.nativeEvent)) {
      send({
        type: ListboxEvents.OptionMouseUp,
        value: value,
        callback: onValueChange,
        disabled: !!disabled
      });
    }
  }

  function handleClick(event) {
    // Generally an option will be selected on mouseup, but in case this isn't
    // handled correctly by the device (whether because it's a touch/pen or
    // virtual click event) we want to handle selection on a full click event
    // just in case. This should address issues with screenreader selection,
    // but this needs more robust testing.
    if (!isRightClick(event.nativeEvent)) {
      send({
        type: ListboxEvents.OptionClick,
        value: value,
        callback: onValueChange,
        disabled: !!disabled
      });
    }
  }

  function handleMouseMove() {
    // We don't really *need* these guards since we put all of our transition
    // logic in the state machine, but in this case it seems wise not to
    // needlessly run our transitions every time the user's mouse moves. Seems
    // like a lot. 🙃
    if (state === ListboxStates.Open || navigationValue !== value) {
      send({
        type: ListboxEvents.OptionMouseMove,
        value: value,
        disabled: !!disabled
      });
    }
  }

  return /*#__PURE__*/createElement(Comp // In a single-select listbox, the selected option has `aria-selected`
  // set to `true`.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox
  , _extends({
    "aria-selected": (isExpanded ? isHighlighted : isSelected) || undefined // Applicable to all host language elements regardless of whether a
    // `role` is applied.
    // https://www.w3.org/WAI/PF/aria/states_and_properties#global_states_header
    ,
    "aria-disabled": disabled || undefined // Each option in the listbox has role `option` and is a DOM descendant
    // of the element with role `listbox`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox
    ,
    role: "option"
  }, props, {
    ref: ref,
    id: useOptionId(value),
    "data-reach-listbox-option": "",
    "data-current-nav": isHighlighted ? "" : undefined,
    "data-current-selected": isSelected ? "" : undefined,
    "data-label": label,
    "data-value": value,
    onClick: composeEventHandlers(onClick, handleClick),
    onMouseDown: composeEventHandlers(onMouseDown, handleMouseDown),
    onMouseEnter: composeEventHandlers(onMouseEnter, handleMouseEnter),
    onMouseLeave: composeEventHandlers(onMouseLeave, handleMouseLeave),
    onMouseMove: composeEventHandlers(onMouseMove, handleMouseMove),
    onMouseUp: composeEventHandlers(onMouseUp, handleMouseUp),
    onTouchStart: composeEventHandlers(onTouchStart, handleTouchStart)
  }), children);
});

if (process.env.NODE_ENV !== "production") {
  ListboxOption.displayName = "ListboxOption";
  ListboxOption.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.string.isRequired
  };
}
/**
 * @see Docs https://reach.tech/listbox#listboxoption-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxGroup
 *
 * A group of related listbox options.
 *
 * @see Docs https://reach.tech/listbox#listboxgroup
 */
var ListboxGroup = /*#__PURE__*/forwardRef(function ListboxGroup(_ref9, forwardedRef) {
  var _ref9$as = _ref9.as,
      Comp = _ref9$as === void 0 ? "div" : _ref9$as,
      label = _ref9.label,
      children = _ref9.children,
      props = _objectWithoutPropertiesLoose(_ref9, _excluded8);

  var _React$useContext6 = useContext(ListboxContext),
      listboxId = _React$useContext6.listboxId;

  var labelId = makeId("label", useId(props.id), listboxId);
  return /*#__PURE__*/createElement(ListboxGroupContext.Provider, {
    value: {
      labelId: labelId
    }
  }, /*#__PURE__*/createElement(Comp // Refers to the element containing the option group label
  // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-grouped.html
  , _extends({
    "aria-labelledby": labelId // Identifies a group of related options
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-grouped.html
    ,
    role: "group"
  }, props, {
    "data-reach-listbox-group": "",
    ref: forwardedRef
  }), label && /*#__PURE__*/createElement(ListboxGroupLabel, null, label), children));
});

if (process.env.NODE_ENV !== "production") {
  ListboxGroup.displayName = "ListboxGroup";
  ListboxGroup.propTypes = {
    label: /*#__PURE__*/PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };
}
/**
 * @see Docs https://reach.tech/listbox#listboxgroup-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * ListboxGroupLabel
 *
 * @see Docs https://reach.tech/listbox#listboxgrouplabel
 */
var ListboxGroupLabel = /*#__PURE__*/forwardRef(function ListboxGroupLabel(_ref10, forwardedRef) {
  var _ref10$as = _ref10.as,
      Comp = _ref10$as === void 0 ? "span" : _ref10$as,
      props = _objectWithoutPropertiesLoose(_ref10, _excluded9);

  var _React$useContext7 = useContext(ListboxGroupContext),
      labelId = _React$useContext7.labelId;

  return /*#__PURE__*/createElement(Comp // See examples
  // https://www.w3.org/TR/wai-aria-practices-1.2/examples/listbox/listbox-grouped.html
  , _extends({
    role: "presentation"
  }, props, {
    ref: forwardedRef,
    "data-reach-listbox-group-label": "",
    id: labelId
  }));
});

if (process.env.NODE_ENV !== "production") {
  ListboxGroupLabel.displayName = "ListboxGroupLabel";
  ListboxGroupLabel.propTypes = {};
}
/**
 * @see Docs https://reach.tech/listbox#listboxgroup-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * A hook that exposes data for a given `Listbox` component to its descendants.
 *
 * @see Docs https://reach.tech/listbox#uselistboxcontext
 */
function useListboxContext() {
  var _React$useContext8 = useContext(ListboxContext),
      highlightedOptionRef = _React$useContext8.highlightedOptionRef,
      selectedOptionRef = _React$useContext8.selectedOptionRef,
      listboxId = _React$useContext8.listboxId,
      listboxValueLabel = _React$useContext8.listboxValueLabel,
      isExpanded = _React$useContext8.isExpanded,
      value = _React$useContext8.stateData.value;

  return useMemo(function () {
    return {
      id: listboxId,
      isExpanded: isExpanded,
      selectedOptionRef: selectedOptionRef,
      highlightedOptionRef: highlightedOptionRef,
      value: value,
      valueLabel: listboxValueLabel
    };
  }, [listboxId, isExpanded, value, listboxValueLabel, selectedOptionRef, highlightedOptionRef]);
} ////////////////////////////////////////////////////////////////////////////////


function isListboxExpanded(state) {
  return [ListboxStates.Navigating, ListboxStates.Open, ListboxStates.Dragging, ListboxStates.Interacting].includes(state);
}

function useKeyDown() {
  var _React$useContext9 = useContext(ListboxContext),
      send = _React$useContext9.send,
      listboxDisabled = _React$useContext9.disabled,
      onValueChange = _React$useContext9.onValueChange,
      _React$useContext9$st = _React$useContext9.stateData,
      navigationValue = _React$useContext9$st.navigationValue,
      typeaheadQuery = _React$useContext9$st.typeaheadQuery;

  var options = useDescendants(ListboxDescendantContext);
  var stableOnValueChange = useStableCallback(onValueChange);
  useEffect(function () {
    if (typeaheadQuery) {
      send({
        type: ListboxEvents.UpdateAfterTypeahead,
        query: typeaheadQuery,
        callback: stableOnValueChange
      });
    }

    var timeout = window.setTimeout(function () {
      if (typeaheadQuery != null) {
        send({
          type: ListboxEvents.ClearTypeahead
        });
      }
    }, 1000);
    return function () {
      window.clearTimeout(timeout);
    };
  }, [stableOnValueChange, send, typeaheadQuery]);
  var index = options.findIndex(function (_ref11) {
    var value = _ref11.value;
    return value === navigationValue;
  });
  var handleKeyDown = composeEventHandlers(function (event) {
    var key = event.key;
    var isSearching = isString(key) && key.length === 1;
    var navOption = options.find(function (option) {
      return option.value === navigationValue;
    });

    switch (key) {
      case "Enter":
        send({
          type: ListboxEvents.KeyDownEnter,
          value: navigationValue,
          callback: onValueChange,
          disabled: !!(navOption != null && navOption.disabled || listboxDisabled)
        });
        return;

      case " ":
        // Prevent browser from scrolling down
        event.preventDefault();
        send({
          type: ListboxEvents.KeyDownSpace,
          value: navigationValue,
          callback: onValueChange,
          disabled: !!(navOption != null && navOption.disabled || listboxDisabled)
        });
        return;

      case "Escape":
        send({
          type: ListboxEvents.KeyDownEscape
        });
        return;

      case "Tab":
        var eventType = event.shiftKey ? ListboxEvents.KeyDownShiftTab : ListboxEvents.KeyDownTab;
        send({
          type: eventType
        });
        return;

      default:
        if (isSearching) {
          send({
            type: ListboxEvents.KeyDownSearch,
            query: key,
            disabled: listboxDisabled
          });
        }

        return;
    }
  }, useDescendantKeyDown(ListboxDescendantContext, {
    currentIndex: index,
    orientation: "vertical",
    key: "index",
    rotate: true,
    filter: function filter(option) {
      return !option.disabled;
    },
    callback: function callback(nextIndex) {
      send({
        type: ListboxEvents.KeyDownNavigate,
        value: options[nextIndex].value,
        disabled: listboxDisabled
      });
    }
  }));
  return handleKeyDown;
}

function useOptionId(value) {
  var _React$useContext10 = useContext(ListboxContext),
      listboxId = _React$useContext10.listboxId;

  return value ? makeId("option-" + value, listboxId) : undefined;
}

function popoverContainsEventTarget(popover, target) {
  return !!(popover && popover.contains(target));
} ////////////////////////////////////////////////////////////////////////////////
// Types


function useControlledStateSync(controlPropValue, internalValue, send) {
  var _React$useRef = useRef(controlPropValue != null),
      isControlled = _React$useRef.current;

  if (isControlled && controlPropValue !== internalValue) {
    send();
  }
} ////////////////////////////////////////////////////////////////////////////////

export { Listbox, ListboxArrow, ListboxButton, ListboxGroup, ListboxGroupLabel, ListboxInput, ListboxList, ListboxOption, ListboxPopover, useListboxContext };
