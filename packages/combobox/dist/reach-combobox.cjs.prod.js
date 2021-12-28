'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
var useIsomorphicLayoutEffect = require('@reach/utils/use-isomorphic-layout-effect');
var context = require('@reach/utils/context');
var typeCheck = require('@reach/utils/type-check');
var makeId = require('@reach/utils/make-id');
var noop = require('@reach/utils/noop');
var devUtils = require('@reach/utils/dev-utils');
var composeRefs = require('@reach/utils/compose-refs');
var useUpdateEffect = require('@reach/utils/use-update-effect');
var useStatefulRefValue = require('@reach/utils/use-stateful-ref-value');
var composeEventHandlers = require('@reach/utils/compose-event-handlers');
var descendants = require('@reach/descendants');
var autoId = require('@reach/auto-id');
var popover = require('@reach/popover');
require('tiny-warning');

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

// Forked from https://github.com/bvaughn/highlight-words-core

/**
 * Creates an array of chunk objects representing both higlightable and non
 * highlightable pieces of text that match each search word.
 *
 * @return Array of "chunk" objects
 */
function findAll(_ref) {
  var autoEscape = _ref.autoEscape,
      _ref$caseSensitive = _ref.caseSensitive,
      caseSensitive = _ref$caseSensitive === void 0 ? false : _ref$caseSensitive,
      _ref$findChunks = _ref.findChunks,
      findChunks = _ref$findChunks === void 0 ? defaultFindChunks : _ref$findChunks,
      sanitize = _ref.sanitize,
      searchWords = _ref.searchWords,
      textToHighlight = _ref.textToHighlight;
  return fillInChunks({
    chunksToHighlight: combineChunks({
      chunks: findChunks({
        autoEscape: autoEscape,
        caseSensitive: caseSensitive,
        sanitize: sanitize,
        searchWords: searchWords,
        textToHighlight: textToHighlight
      })
    }),
    totalLength: textToHighlight ? textToHighlight.length : 0
  });
}
/**
 * Takes an array of "chunk" objects and combines chunks that overlap into
 * single chunks.
 *
 * @return Array of "chunk" objects
 */


function combineChunks(_ref2) {
  var chunks = _ref2.chunks;
  return chunks.sort(function (first, second) {
    return first.start - second.start;
  }).reduce(function (processedChunks, nextChunk) {
    // First chunk just goes straight in the array...
    if (processedChunks.length === 0) {
      return [nextChunk];
    } else {
      // ... subsequent chunks get checked to see if they overlap...
      var prevChunk = processedChunks.pop();

      if (nextChunk.start <= prevChunk.end) {
        // It may be the case that prevChunk completely surrounds nextChunk, so take the
        // largest of the end indeces.
        var endIndex = Math.max(prevChunk.end, nextChunk.end);
        processedChunks.push({
          highlight: false,
          start: prevChunk.start,
          end: endIndex
        });
      } else {
        processedChunks.push(prevChunk, nextChunk);
      }

      return processedChunks;
    }
  }, []);
}
/**
 * Examine text for any matches. If we find matches, add them to the returned
 * array as a "chunk" object.
 *
 * @return Array of "chunk" objects
 */


function defaultFindChunks(_ref3) {
  var autoEscape = _ref3.autoEscape,
      caseSensitive = _ref3.caseSensitive,
      _ref3$sanitize = _ref3.sanitize,
      sanitize = _ref3$sanitize === void 0 ? defaultSanitize : _ref3$sanitize,
      searchWords = _ref3.searchWords,
      textToHighlight = _ref3.textToHighlight;
  textToHighlight = sanitize(textToHighlight || "");
  return searchWords.filter(function (searchWord) {
    return searchWord;
  }) // Remove empty words
  .reduce(function (chunks, searchWord) {
    searchWord = sanitize(searchWord);

    if (autoEscape) {
      searchWord = escapeRegExpFn(searchWord);
    }

    var regex = new RegExp(searchWord, caseSensitive ? "g" : "gi");
    var match;

    while (match = regex.exec(textToHighlight || "")) {
      var start = match.index;
      var end = regex.lastIndex; // We do not return zero-length matches

      if (end > start) {
        chunks.push({
          highlight: false,
          start: start,
          end: end
        });
      } // Prevent browsers like Firefox from getting stuck in an infinite loop
      // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/


      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    return chunks;
  }, []);
}
/**
 * Given a set of chunks to highlight, create an additional set of chunks
 * to represent the bits of text between the highlighted text.
 *
 * @return Array of "chunk" objects
 */


function fillInChunks(_ref4) {
  var chunksToHighlight = _ref4.chunksToHighlight,
      totalLength = _ref4.totalLength;
  var allChunks = [];

  if (chunksToHighlight.length === 0) {
    append(0, totalLength, false);
  } else {
    var lastIndex = 0;
    chunksToHighlight.forEach(function (chunk) {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true);
      lastIndex = chunk.end;
    });
    append(lastIndex, totalLength, false);
  }

  return allChunks;

  function append(start, end, highlight) {
    if (end - start > 0) {
      allChunks.push({
        start: start,
        end: end,
        highlight: highlight
      });
    }
  }
}

function defaultSanitize(string) {
  return string;
}

function escapeRegExpFn(string) {
  return string.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

var HighlightWords = {
  combineChunks: combineChunks,
  fillInChunks: fillInChunks,
  findAll: findAll,
  findChunks: defaultFindChunks
};

/**
 * Accepts a generic objects
 * Removes the key or id in the object
 *
 * @return String of searchable text
 */
function convertobjectToSearchableString(valueObject) {
  var notAllowedkeys = ["key", "id", "_id", "index"];
  var searchWords = Object.entries(valueObject).map(function (eachArray) {
    if (!notAllowedkeys.includes(eachArray[0])) {
      return eachArray[1];
    }
  }).join(" ");
  return searchWords;
}
/**
 * Accepts a generic objects
 * Removes the key or id in the object
 *
 * @return Returns object without keys and Id
 */

var filterObject = function filterObject(val) {
  var notAllowedkeys = ["key", "id", "_id", "index"];
  var filtered = Object.keys(val).filter(function (key) {
    return !notAllowedkeys.includes(key);
  }).reduce(function (obj, key) {
    var _extends2;

    return _extends({}, obj, (_extends2 = {}, _extends2[key] = val[key], _extends2));
  }, {});
  return filtered;
};
/**
 * Accepts a generic objects
 * Removes the key or id in the object
 *
 * @return String of searchable text
 */

var convertObjectToSearchableString = function convertObjectToSearchableString(valueObject, searchWord) {
  if (typeof valueObject === "string") {
    return valueObject;
  } else if (typeof valueObject === null) {
    return "";
  } else if (typeof valueObject === undefined) {
    return "";
  } else {
    var record = filterObject(valueObject);
    var searchWords = Object.values(record).map(function (eachStr) {
      if (String(eachStr).toLowerCase().includes(String(searchWord).toLowerCase())) {
        return eachStr;
      }

      return eachStr;
    }).join(" ");
    return searchWords;
  }
};
/**
 * Accepts an object or a string
 *
 * @return String of searchable text
 */

function checkTypeOfInput(value) {
  if (typeof value === "string") {
    return value;
  } else {
    return convertobjectToSearchableString(value);
  }
}

var _excluded = ["onSelect", "openOnFocus", "children", "as", "aria-label", "aria-labelledby"],
    _excluded2 = ["as", "selectOnClick", "autocomplete", "onClick", "onChange", "onKeyDown", "onBlur", "onFocus", "value"],
    _excluded3 = ["as", "children", "portal", "onKeyDown", "onBlur", "position"],
    _excluded4 = ["persistSelection", "as"],
    _excluded5 = ["as", "children", "index", "value", "onClick"],
    _excluded6 = ["as", "onClick", "onKeyDown"];

var _on, _on2, _on3, _on4, _states;
// States
// Nothing going on, waiting for the user to type or use the arrow keys

var IDLE = "IDLE"; // The component is suggesting options as the user types

var SUGGESTING = "SUGGESTING"; // The user is using the keyboard to navigate the list, not typing

var NAVIGATING = "NAVIGATING"; // The user is interacting with arbitrary elements inside the popup that
// are not ComboboxInputs

var INTERACTING = "INTERACTING"; ////////////////////////////////////////////////////////////////////////////////
// Events
// User cleared the value w/ backspace, but input still has focus

var CLEAR = "CLEAR"; // User is typing

var CHANGE = "CHANGE"; // Initial input value change handler for syncing user state with state machine
// Prevents initial change from sending the user to the NAVIGATING state
// https://github.com/reach/reach-ui/issues/464

var INITIAL_CHANGE = "INITIAL_CHANGE"; // User is navigating w/ the keyboard

var NAVIGATE = "NAVIGATE"; // User can be navigating with keyboard and then click instead, we want the
// value from the click, not the current nav item

var SELECT_WITH_KEYBOARD = "SELECT_WITH_KEYBOARD";
var SELECT_WITH_CLICK = "SELECT_WITH_CLICK"; // Pretty self-explanatory, user can hit escape or blur to close the popover

var ESCAPE = "ESCAPE";
var BLUR = "BLUR"; // The user left the input to interact with arbitrary elements inside the popup

var INTERACT = "INTERACT";
var FOCUS = "FOCUS";
var OPEN_WITH_BUTTON = "OPEN_WITH_BUTTON";
var OPEN_WITH_INPUT_CLICK = "OPEN_WITH_INPUT_CLICK";
var CLOSE_WITH_BUTTON = "CLOSE_WITH_BUTTON"; ////////////////////////////////////////////////////////////////////////////////

var stateChart = {
  initial: IDLE,
  states: (_states = {}, _states[IDLE] = {
    on: (_on = {}, _on[BLUR] = IDLE, _on[CLEAR] = IDLE, _on[CHANGE] = SUGGESTING, _on[INITIAL_CHANGE] = IDLE, _on[FOCUS] = SUGGESTING, _on[NAVIGATE] = NAVIGATING, _on[OPEN_WITH_BUTTON] = SUGGESTING, _on[OPEN_WITH_INPUT_CLICK] = SUGGESTING, _on)
  }, _states[SUGGESTING] = {
    on: (_on2 = {}, _on2[CHANGE] = SUGGESTING, _on2[FOCUS] = SUGGESTING, _on2[NAVIGATE] = NAVIGATING, _on2[CLEAR] = IDLE, _on2[ESCAPE] = IDLE, _on2[BLUR] = IDLE, _on2[SELECT_WITH_CLICK] = IDLE, _on2[INTERACT] = INTERACTING, _on2[CLOSE_WITH_BUTTON] = IDLE, _on2)
  }, _states[NAVIGATING] = {
    on: (_on3 = {}, _on3[CHANGE] = SUGGESTING, _on3[FOCUS] = SUGGESTING, _on3[CLEAR] = IDLE, _on3[BLUR] = IDLE, _on3[ESCAPE] = IDLE, _on3[NAVIGATE] = NAVIGATING, _on3[SELECT_WITH_CLICK] = IDLE, _on3[SELECT_WITH_KEYBOARD] = IDLE, _on3[CLOSE_WITH_BUTTON] = IDLE, _on3[INTERACT] = INTERACTING, _on3)
  }, _states[INTERACTING] = {
    on: (_on4 = {}, _on4[CLEAR] = IDLE, _on4[CHANGE] = SUGGESTING, _on4[FOCUS] = SUGGESTING, _on4[BLUR] = IDLE, _on4[ESCAPE] = IDLE, _on4[NAVIGATE] = NAVIGATING, _on4[CLOSE_WITH_BUTTON] = IDLE, _on4[SELECT_WITH_CLICK] = IDLE, _on4)
  }, _states)
};

var reducer = function reducer(data, event) {
  var nextState = _extends({}, data, {
    lastEventType: event.type
  });

  switch (event.type) {
    case CHANGE:
    case INITIAL_CHANGE:
      return _extends({}, nextState, {
        navigationValue: null,
        value: event.value
      });

    case NAVIGATE:
    case OPEN_WITH_BUTTON:
    case OPEN_WITH_INPUT_CLICK:
      return _extends({}, nextState, {
        navigationValue: findNavigationValue(nextState, event)
      });

    case CLEAR:
      return _extends({}, nextState, {
        value: "",
        navigationValue: null
      });

    case BLUR:
    case ESCAPE:
      return _extends({}, nextState, {
        navigationValue: null
      });

    case SELECT_WITH_CLICK:
      return _extends({}, nextState, {
        // if controlled, "set" the input to what it already has, and let the
        // user do whatever they want
        value: event.isControlled ? data.value : event.value,
        navigationValue: null
      });

    case SELECT_WITH_KEYBOARD:
      return _extends({}, nextState, {
        // if controlled, "set" the input to what it already has, and let the
        // user do whatever they want
        value: event.isControlled ? data.value : data.navigationValue,
        navigationValue: null
      });

    case CLOSE_WITH_BUTTON:
      return _extends({}, nextState, {
        navigationValue: null
      });

    case INTERACT:
      return nextState;

    case FOCUS:
      return _extends({}, nextState, {
        navigationValue: findNavigationValue(nextState, event)
      });

    default:
      return nextState;
  }
};

function popoverIsExpanded(state) {
  return [SUGGESTING, NAVIGATING, INTERACTING].includes(state);
}
/**
 * When we open a list, set the navigation value to the value in the input, if
 * it's in the list, then it'll automatically be highlighted.
 *
 * @param stateData
 * @param event
 */


function findNavigationValue(stateData, event) {
  // @ts-ignore
  if (event.value) {
    // @ts-ignore
    return event.value; // @ts-ignore
  } else if (event.persistSelection) {
    return stateData.value;
  } else {
    return null;
  }
}

var ComboboxDescendantContext = /*#__PURE__*/descendants.createDescendantContext("ComboboxDescendantContext");
var ComboboxContext = /*#__PURE__*/context.createNamedContext("ComboboxContext", {}); // Allows us to put the option's value on context so that ComboboxOptionText
// can work it's highlight text magic no matter what else is rendered around
// it.

var OptionContext = /*#__PURE__*/context.createNamedContext("OptionContext", {}); ////////////////////////////////////////////////////////////////////////////////

/**
 * Combobox
 *
 * @see Docs https://reach.tech/combobox#combobox
 */

var Combobox = /*#__PURE__*/React.forwardRef(function (_ref, forwardedRef) {
  var _data$navigationValue;

  var onSelect = _ref.onSelect,
      _ref$openOnFocus = _ref.openOnFocus,
      openOnFocus = _ref$openOnFocus === void 0 ? false : _ref$openOnFocus,
      children = _ref.children,
      _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      ariaLabel = _ref["aria-label"],
      ariaLabelledby = _ref["aria-labelledby"],
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useDescendantsInit = descendants.useDescendantsInit(),
      options = _useDescendantsInit[0],
      setOptions = _useDescendantsInit[1]; // Need this to focus it


  var inputRef = React.useRef();
  var popoverRef = React.useRef();
  var buttonRef = React.useRef(); // When <ComboboxInput autocomplete={false} /> we don't want cycle back to
  // the user's value while navigating (because it's always the user's value),
  // but we need to know this in useKeyDown which is far away from the prop
  // here, so we do something sneaky and write it to this ref on context so we
  // can use it anywhere else 😛. Another new trick for me and I'm excited
  // about this one too!

  var autocompletePropRef = React.useRef(false);
  var persistSelectionRef = React.useRef(false);
  var defaultData = {
    // The value the user has typed. We derive this also when the developer is
    // controlling the value of ComboboxInput.
    value: "",
    // the value the user has navigated to with the keyboard
    navigationValue: null
  };

  var _useReducerMachine = useReducerMachine(stateChart, reducer, defaultData),
      state = _useReducerMachine[0],
      data = _useReducerMachine[1],
      transition = _useReducerMachine[2];

  useFocusManagement(data.lastEventType, inputRef);
  var id = autoId.useId(props.id);
  var listboxId = id ? makeId.makeId("listbox", id) : "listbox";
  var isControlledRef = React.useRef(false);
  var context = {
    ariaLabel: ariaLabel,
    ariaLabelledby: ariaLabelledby,
    autocompletePropRef: autocompletePropRef,
    buttonRef: buttonRef,
    comboboxId: id,
    data: data,
    inputRef: inputRef,
    isExpanded: popoverIsExpanded(state),
    listboxId: listboxId,
    onSelect: onSelect || noop.noop,
    openOnFocus: openOnFocus,
    persistSelectionRef: persistSelectionRef,
    popoverRef: popoverRef,
    state: state,
    transition: transition,
    isControlledRef: isControlledRef
  };
  devUtils.useCheckStyles("combobox");
  return /*#__PURE__*/React.createElement(descendants.DescendantProvider, {
    context: ComboboxDescendantContext,
    items: options,
    set: setOptions
  }, /*#__PURE__*/React.createElement(ComboboxContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    "data-reach-combobox": "",
    "data-state": getDataState(state),
    ref: forwardedRef
  }), typeCheck.isFunction(children) ? children({
    id: id,
    isExpanded: popoverIsExpanded(state),
    navigationValue: (_data$navigationValue = data.navigationValue) != null ? _data$navigationValue : null,
    state: state
  }) : children)));
});

/**
 * ComboboxInput
 *
 * Wraps an `<input/>` with a couple extra props that work with the combobox.
 *
 * @see Docs https://reach.tech/combobox#comboboxinput
 */


var ComboboxInput = /*#__PURE__*/React.forwardRef(function (_ref2, forwardedRef) {
  var _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "input" : _ref2$as,
      _ref2$selectOnClick = _ref2.selectOnClick,
      selectOnClick = _ref2$selectOnClick === void 0 ? false : _ref2$selectOnClick,
      _ref2$autocomplete = _ref2.autocomplete,
      autocomplete = _ref2$autocomplete === void 0 ? true : _ref2$autocomplete,
      onClick = _ref2.onClick,
      onChange = _ref2.onChange,
      onKeyDown = _ref2.onKeyDown,
      onBlur = _ref2.onBlur,
      onFocus = _ref2.onFocus,
      controlledValue = _ref2.value,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  // https://github.com/reach/reach-ui/issues/464
  var _React$useRef = React.useRef(controlledValue),
      initialControlledValue = _React$useRef.current;

  var controlledValueChangedRef = React.useRef(false);
  useUpdateEffect.useUpdateEffect(function () {
    controlledValueChangedRef.current = true;
  }, [controlledValue]);

  var _React$useContext = React.useContext(ComboboxContext),
      _React$useContext$dat = _React$useContext.data,
      navigationValue = _React$useContext$dat.navigationValue,
      rawValue = _React$useContext$dat.value,
      lastEventType = _React$useContext$dat.lastEventType,
      inputRef = _React$useContext.inputRef,
      state = _React$useContext.state,
      transition = _React$useContext.transition,
      listboxId = _React$useContext.listboxId,
      autocompletePropRef = _React$useContext.autocompletePropRef,
      openOnFocus = _React$useContext.openOnFocus,
      isExpanded = _React$useContext.isExpanded,
      ariaLabel = _React$useContext.ariaLabel,
      ariaLabelledby = _React$useContext.ariaLabelledby,
      persistSelectionRef = _React$useContext.persistSelectionRef,
      isControlledRef = _React$useContext.isControlledRef;

  var _React$useState = React.useState(""),
      internalState = _React$useState[0],
      setInternalState = _React$useState[1];

  var value = convertObjectToSearchableString(rawValue, internalState); // const navigationValue = convertObjectToSearchableString(rawNavigation);

  var ref = composeRefs.useComposedRefs(inputRef, forwardedRef);
  var selectOnClickRef = React.useRef(false);
  var handleKeyDown = useKeyDown();
  var handleBlur = useBlur();
  var isControlled = typeof controlledValue !== "undefined";

  React.useEffect(function () {
    isControlledRef.current = isControlled; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled]); // Layout effect should be SSR-safe here because we don't actually do
  // anything with this ref that involves rendering until after we've
  // let the client hydrate in nested components.

  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(function () {
    autocompletePropRef.current = autocomplete;
  }, [autocomplete, autocompletePropRef]);
  var handleValueChange = React.useCallback(function (value) {
    if (value.trim() === "") {
      transition(CLEAR, {
        isControlled: isControlled
      });
    } else if (value === initialControlledValue && !controlledValueChangedRef.current) {
      transition(INITIAL_CHANGE, {
        value: value
      });
    } else {
      transition(CHANGE, {
        value: value
      });
    }
  }, [initialControlledValue, transition, isControlled]);
  React.useEffect(function () {
    // If they are controlling the value we still need to do our transitions,
    // so  we have this derived state to emulate onChange of the input as we
    // receive new `value`s ...[*]
    if (isControlled && controlledValue !== value && ( // https://github.com/reach/reach-ui/issues/481
    controlledValue.trim() === "" ? (value || "").trim() !== "" : true)) {
      handleValueChange(controlledValue);
    }
  }, [controlledValue, handleValueChange, isControlled, value]); // [*]... and when controlled, we don't trigger handleValueChange as the
  // user types, instead the developer controls it with the normal input
  // onChange prop

  function handleChange(event) {
    var value = event.target.value;
    setInternalState(value);

    if (!isControlled) {
      handleValueChange(value);
    }
  }

  function handleFocus() {
    if (selectOnClick) {
      selectOnClickRef.current = true;
    } // If we select an option with click, useFocusManagement will focus the
    // input, in those cases we don't want to cause the menu to open back up,
    // so we guard behind these states.


    if (openOnFocus && lastEventType !== SELECT_WITH_CLICK) {
      transition(FOCUS, {
        persistSelection: persistSelectionRef.current
      });
    }
  }

  function handleClick() {
    if (selectOnClickRef.current) {
      var _inputRef$current;

      selectOnClickRef.current = false;
      (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.select();
    }

    if (openOnFocus && state === IDLE) {
      transition(OPEN_WITH_INPUT_CLICK);
    }
  }

  var inputValue = autocomplete && (state === NAVIGATING || state === INTERACTING) ? // When idle, we don't have a navigationValue on ArrowUp/Down
  navigationValue || controlledValue || value : controlledValue || value;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    "aria-activedescendant": navigationValue ? String(makeHash(checkTypeOfInput(navigationValue) || "")) : undefined,
    "aria-autocomplete": "both",
    "aria-controls": listboxId,
    "aria-expanded": isExpanded,
    "aria-haspopup": "listbox",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabel ? undefined : ariaLabelledby,
    role: "combobox"
  }, props, {
    "data-reach-combobox-input": "",
    "data-state": getDataState(state),
    ref: ref,
    onBlur: composeEventHandlers.composeEventHandlers(onBlur, handleBlur),
    onChange: composeEventHandlers.composeEventHandlers(onChange, handleChange),
    onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick),
    onFocus: composeEventHandlers.composeEventHandlers(onFocus, handleFocus),
    onKeyDown: composeEventHandlers.composeEventHandlers(onKeyDown, handleKeyDown),
    value: convertObjectToSearchableString(inputValue, internalState)
  }));
});

/**
 * ComboboxPopover
 *
 * Contains the popup that renders the list. Because some UI needs to render
 * more than the list in the popup, you need to render one of these around the
 * list. For example, maybe you want to render the number of results suggested.
 *
 * @see Docs https://reach.tech/combobox#comboboxpopover
 */


var ComboboxPopover = /*#__PURE__*/React.forwardRef(function (_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      children = _ref3.children,
      _ref3$portal = _ref3.portal,
      portal = _ref3$portal === void 0 ? true : _ref3$portal,
      onKeyDown = _ref3.onKeyDown,
      onBlur = _ref3.onBlur,
      _ref3$position = _ref3.position,
      position = _ref3$position === void 0 ? popover.positionMatchWidth : _ref3$position,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = React.useContext(ComboboxContext),
      popoverRef = _React$useContext2.popoverRef,
      inputRef = _React$useContext2.inputRef,
      isExpanded = _React$useContext2.isExpanded,
      state = _React$useContext2.state;

  var ref = composeRefs.useComposedRefs(popoverRef, forwardedRef);
  var handleKeyDown = useKeyDown();
  var handleBlur = useBlur();
  var sharedProps = {
    "data-reach-combobox-popover": "",
    "data-state": getDataState(state),
    onKeyDown: composeEventHandlers.composeEventHandlers(onKeyDown, handleKeyDown),
    onBlur: composeEventHandlers.composeEventHandlers(onBlur, handleBlur),
    // Instead of conditionally rendering the popover we use the `hidden` prop
    // because we don't want to unmount on close (from escape or onSelect).
    // However, the developer can conditionally render the ComboboxPopover if
    // they do want to cause mount/unmount based on the app's own data (like
    // results.length or whatever).
    hidden: !isExpanded,
    tabIndex: -1,
    children: children
  };
  return portal ? /*#__PURE__*/React.createElement(popover.Popover, _extends({
    as: Comp
  }, props, {
    ref: ref,
    position: position,
    targetRef: inputRef
  }, sharedProps)) : /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref
  }, props, sharedProps));
});
/**
 * @see Docs https://reach.tech/combobox#comboboxpopover-props
 */


////////////////////////////////////////////////////////////////////////////////

/**
 * ComboboxList
 *
 * Contains the `ComboboxOption` elements and sets up the proper aria attributes
 * for the list.
 *
 * @see Docs https://reach.tech/combobox#comboboxlist
 */
var ComboboxList = /*#__PURE__*/React.forwardRef(function (_ref4, forwardedRef) {
  var _ref4$persistSelectio = _ref4.persistSelection,
      persistSelection = _ref4$persistSelectio === void 0 ? false : _ref4$persistSelectio,
      _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "ul" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  var _React$useContext3 = React.useContext(ComboboxContext),
      persistSelectionRef = _React$useContext3.persistSelectionRef,
      listboxId = _React$useContext3.listboxId;

  if (persistSelection) {
    persistSelectionRef.current = true;
  }

  return /*#__PURE__*/React.createElement(Comp, _extends({
    role: "listbox"
  }, props, {
    ref: forwardedRef,
    "data-reach-combobox-list": "",
    id: listboxId
  }));
});

/**
 * ComboboxOption
 *
 * An option that is suggested to the user as they interact with the combobox.
 *
 * @see Docs https://reach.tech/combobox#comboboxoption
 */


var ComboboxOption = /*#__PURE__*/React.forwardRef(function (_ref5, forwardedRef) {
  var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "li" : _ref5$as,
      children = _ref5.children,
      indexProp = _ref5.index,
      value = _ref5.value,
      onClick = _ref5.onClick,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  var _React$useContext4 = React.useContext(ComboboxContext),
      onSelect = _React$useContext4.onSelect,
      navigationValue = _React$useContext4.data.navigationValue,
      transition = _React$useContext4.transition,
      isControlledRef = _React$useContext4.isControlledRef;

  var ownRef = React.useRef(null);

  var _useStatefulRefValue = useStatefulRefValue.useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue[0],
      handleRefSet = _useStatefulRefValue[1];

  var descendant = React.useMemo(function () {
    return {
      element: element,
      value: value
    };
  }, [value, element]);
  var index = descendants.useDescendant(descendant, ComboboxDescendantContext, indexProp);
  var ref = composeRefs.useComposedRefs(forwardedRef, handleRefSet);
  var isActive = navigationValue === value;

  var handleClick = function handleClick() {
    onSelect && onSelect(value);
    transition(SELECT_WITH_CLICK, {
      value: value,
      isControlled: isControlledRef.current
    });
  };

  return /*#__PURE__*/React.createElement(OptionContext.Provider, {
    value: {
      value: value,
      index: index
    }
  }, /*#__PURE__*/React.createElement(Comp, _extends({
    "aria-selected": isActive,
    role: "option"
  }, props, {
    "data-reach-combobox-option": "",
    ref: ref,
    id: String(makeHash(checkTypeOfInput(value) || "")),
    "data-highlighted": isActive ? "" : undefined // Without this the menu will close from `onBlur`, but with it the
    // element can be `document.activeElement` and then our focus checks in
    // onBlur will work as intended
    ,
    tabIndex: -1,
    onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick)
  }), children ? typeCheck.isFunction(children) ? children({
    value: value,
    index: index
  }) : children : /*#__PURE__*/React.createElement(ComboboxOptionText, null)));
});

/**
 * ComboboxOptionText
 *
 * Renders the value of a `ComboboxOption` as text but with spans wrapping the
 * matching and non-matching segments of text.
 *
 * We don't forwardRef or spread props because we render multiple spans or null,
 * should be fine 🤙
 *
 * @example
 *   <ComboboxOption value="Seattle">
 *     🌧 <ComboboxOptionText />
 *   </ComboboxOption>
 *
 * @see Docs https://reach.tech/combobox#comboboxoptiontext
 */


function ComboboxOptionText() {
  var _React$useContext5 = React.useContext(OptionContext),
      value = _React$useContext5.value;

  var _React$useContext6 = React.useContext(ComboboxContext),
      contextValue = _React$useContext6.data.value;

  var results = React.useMemo(function () {
    return HighlightWords.findAll({
      searchWords: escapeRegexp(checkTypeOfInput(value) || "").split(/\s+/),
      textToHighlight: checkTypeOfInput(value)
    });
  }, [contextValue, value]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, results.length ? results.map(function (result, index) {
    var _checkTypeOfInput;

    var str = (_checkTypeOfInput = checkTypeOfInput(value)) == null ? void 0 : _checkTypeOfInput.slice(result.start, result.end);
    return /*#__PURE__*/React.createElement("span", {
      key: index,
      "data-reach-combobox-option-text": "",
      "data-user-value": result.highlight ? true : undefined,
      "data-suggested-value": result.highlight ? undefined : true
    }, str);
  }) : value);
}

/**
 * ComboboxButton
 */


var ComboboxButton = /*#__PURE__*/React.forwardRef(function (_ref6, forwardedRef) {
  var _ref6$as = _ref6.as,
      Comp = _ref6$as === void 0 ? "button" : _ref6$as,
      onClick = _ref6.onClick,
      onKeyDown = _ref6.onKeyDown,
      props = _objectWithoutPropertiesLoose(_ref6, _excluded6);

  var _React$useContext7 = React.useContext(ComboboxContext),
      transition = _React$useContext7.transition,
      state = _React$useContext7.state,
      buttonRef = _React$useContext7.buttonRef,
      listboxId = _React$useContext7.listboxId,
      isExpanded = _React$useContext7.isExpanded;

  var ref = composeRefs.useComposedRefs(buttonRef, forwardedRef);
  var handleKeyDown = useKeyDown();

  var handleClick = function handleClick() {
    if (state === IDLE) {
      transition(OPEN_WITH_BUTTON);
    } else {
      transition(CLOSE_WITH_BUTTON);
    }
  };

  return /*#__PURE__*/React.createElement(Comp, _extends({
    "aria-controls": listboxId,
    "aria-haspopup": "listbox",
    "aria-expanded": isExpanded
  }, props, {
    "data-reach-combobox-button": "",
    ref: ref,
    onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick),
    onKeyDown: composeEventHandlers.composeEventHandlers(onKeyDown, handleKeyDown)
  }));
});

/**
 * Move focus back to the input if we start navigating w/ the
 * keyboard after focus has moved to any focusable content in
 * the popup.
 *
 * @param lastEventType
 * @param inputRef
 */


function useFocusManagement(lastEventType, inputRef) {
  // useLayoutEffect so that the cursor goes to the end of the input instead
  // of awkwardly at the beginning, unclear to me why 🤷‍♂️
  //
  // Should be safe to use here since we're just focusing an input.
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(function () {
    if (lastEventType === NAVIGATE || lastEventType === ESCAPE || lastEventType === SELECT_WITH_CLICK || lastEventType === OPEN_WITH_BUTTON) {
      var _inputRef$current2;

      (_inputRef$current2 = inputRef.current) == null ? void 0 : _inputRef$current2.focus();
    }
  }, [inputRef, lastEventType]);
}
/**
 * We want the same events when the input or the popup have focus (HOW COOL ARE
 * HOOKS BTW?) This is probably the hairiest piece but it's not bad.
 */


function useKeyDown() {
  var _React$useContext8 = React.useContext(ComboboxContext),
      navigationValue = _React$useContext8.data.navigationValue,
      onSelect = _React$useContext8.onSelect,
      state = _React$useContext8.state,
      transition = _React$useContext8.transition,
      autocompletePropRef = _React$useContext8.autocompletePropRef,
      persistSelectionRef = _React$useContext8.persistSelectionRef,
      isControlledRef = _React$useContext8.isControlledRef;

  var options = descendants.useDescendants(ComboboxDescendantContext);
  return function handleKeyDown(event) {
    var index = options.findIndex(function (_ref7) {
      var value = _ref7.value;
      return value === navigationValue;
    });

    function getNextOption() {
      var atBottom = index === options.length - 1;

      if (atBottom) {
        if (autocompletePropRef.current) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getFirstOption();
        }
      } else {
        // Go to the next item in the list
        return options[(index + 1) % options.length];
      }
    }

    function getPreviousOption() {
      var atTop = index === 0;

      if (atTop) {
        if (autocompletePropRef.current) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getLastOption();
        }
      } else if (index === -1) {
        // displaying the user's value, so go select the last one
        return getLastOption();
      } else {
        // normal case, select previous
        return options[(index - 1 + options.length) % options.length];
      }
    }

    function getFirstOption() {
      return options[0];
    }

    function getLastOption() {
      return options[options.length - 1];
    }

    switch (event.key) {
      case "ArrowDown":
        // Don't scroll the page
        event.preventDefault();

        if (!options || !options.length) {
          return;
        }

        if (state === IDLE) {
          // Opening a closed list
          transition(NAVIGATE, {
            persistSelection: persistSelectionRef.current
          });
        } else {
          var next = getNextOption();
          transition(NAVIGATE, {
            value: next ? next.value : null
          });
        }

        break;
      // A lot of duplicate code with ArrowDown up next, I'm already over it.

      case "ArrowUp":
        // Don't scroll the page
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        if (state === IDLE) {
          transition(NAVIGATE);
        } else {
          var prev = getPreviousOption();
          transition(NAVIGATE, {
            value: prev ? prev.value : null
          });
        }

        break;

      case "Home":
      case "PageUp":
        // Don't scroll the page
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        if (state === IDLE) {
          transition(NAVIGATE);
        } else {
          transition(NAVIGATE, {
            value: getFirstOption().value
          });
        }

        break;

      case "End":
      case "PageDown":
        // Don't scroll the page
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        if (state === IDLE) {
          transition(NAVIGATE);
        } else {
          transition(NAVIGATE, {
            value: getLastOption().value
          });
        }

        break;

      case "Escape":
        if (state !== IDLE) {
          transition(ESCAPE);
        }

        break;

      case "Enter":
        if (state === NAVIGATING && navigationValue !== null) {
          // don't want to submit forms
          event.preventDefault();
          onSelect && onSelect(navigationValue);
          transition(SELECT_WITH_KEYBOARD, {
            isControlled: isControlledRef.current
          });
        }

        break;
    }
  };
}

function useBlur() {
  var _React$useContext9 = React.useContext(ComboboxContext),
      state = _React$useContext9.state,
      transition = _React$useContext9.transition,
      popoverRef = _React$useContext9.popoverRef,
      inputRef = _React$useContext9.inputRef,
      buttonRef = _React$useContext9.buttonRef;

  return function handleBlur(event) {
    var popover = popoverRef.current;
    var input = inputRef.current;
    var button = buttonRef.current;
    var activeElement = event.relatedTarget; // we on want to close only if focus propss outside the combobox

    if (activeElement !== input && activeElement !== button && popover) {
      if (popover.contains(activeElement)) {
        // focus landed inside the combobox, keep it open
        if (state !== INTERACTING) {
          transition(INTERACT);
        }
      } else {
        // focus landed outside the combobox, close it.
        transition(BLUR);
      }
    }
  };
}
/**
 * This manages transitions between states with a built in reducer to manage
 * the data that goes with those transitions.
 *
 * @param chart
 * @param reducer
 * @param initialData
 */


function useReducerMachine(chart, reducer, initialData) {
  var _React$useState2 = React.useState(chart.initial),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var _React$useReducer = React.useReducer(reducer, initialData),
      data = _React$useReducer[0],
      dispatch = _React$useReducer[1];

  var transition = function transition(event, payload) {
    if (payload === void 0) {
      payload = {};
    }

    var currentState = chart.states[state];
    var nextState = currentState && currentState.on[event];

    if (nextState) {
      dispatch(_extends({
        type: event,
        state: state,
        nextState: state
      }, payload));
      setState(nextState);
      return;
    }
  };

  return [state, data, transition];
}
/**
 * We don't want to track the active descendant with indexes because nothing is
 * more annoying in a combobox than having it change values RIGHT AS YOU HIT
 * ENTER. That only happens if you use the index as your data, rather than
 * *your data as your data*. We use this to generate a unique ID based on the
 * value of each item.  This function is short, sweet, and good enough™ (I also
 * don't know how it works, tbqh)
 *
 * @see https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 * @param str
 */


function makeHash(str) {
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash = hash & hash;
  }

  return hash;
} // function getActiveElement(node: Element | null | undefined) {
//   let activeElement: Element | null = null;
//   try {
//     // If Element.getRootNode is supported, we'll retrieve either the root
//     // Document or shadow root depending on where the component is rendered.
//     // https://github.com/reach/reach-ui/issues/787
//     activeElement = (node?.getRootNode() as ShadowRoot | Document)
//       .activeElement;
//   } finally {
//     return activeElement || (node?.ownerDocument || document).activeElement;
//   }
// }


function getDataState(state) {
  return state.toLowerCase();
}
/**
 * Escape regexp special characters in `str`
 *
 * @see https://github.com/component/escape-regexp/blob/5ce923c1510c9802b3da972c90b6861dd2829b6b/index.js
 * @param str
 */


function escapeRegexp(str) {
  return String(str).replace(/([.*+?=^!:${}()|[\]/\\])/g, "\\$1");
} //////////////////////////
//////////////////////////////////////////////////////

/**
 * A hook that exposes data for a given `Combobox` component to its descendants.
 *
 * @see Docs https://reach.tech/combobox#usecomboboxcontext
 */

function useComboboxContext() {
  var _React$useContext10 = React.useContext(ComboboxContext),
      isExpanded = _React$useContext10.isExpanded,
      comboboxId = _React$useContext10.comboboxId,
      data = _React$useContext10.data,
      state = _React$useContext10.state;

  var navigationValue = data.navigationValue;
  return React.useMemo(function () {
    return {
      id: comboboxId,
      isExpanded: isExpanded,
      navigationValue: navigationValue != null ? navigationValue : null,
      state: state
    };
  }, [comboboxId, isExpanded, navigationValue, state]);
}
/**
 * A hook that exposes data for a given `ComboboxOption` component to its descendants.
 *
 * @see Docs https://reach.tech/combobox#usecomboboxcontext
 */

function useComboboxOptionContext() {
  var _React$useContext11 = React.useContext(OptionContext),
      value = _React$useContext11.value,
      index = _React$useContext11.index;

  return React.useMemo(function () {
    return {
      value: value,
      index: index
    };
  }, [value, index]);
} ////////////////////////////////////////////////////////////////////////////////
// Well alright, you made it all the way here to like 1100 lines of code (geez,
// what the heck?). Have a great day :D
////////////////////////////////////////////////////////////////////////////////
// Types

exports.Combobox = Combobox;
exports.ComboboxButton = ComboboxButton;
exports.ComboboxInput = ComboboxInput;
exports.ComboboxList = ComboboxList;
exports.ComboboxOption = ComboboxOption;
exports.ComboboxOptionText = ComboboxOptionText;
exports.ComboboxPopover = ComboboxPopover;
exports.escapeRegexp = escapeRegexp;
exports.unstable_useKeyDown = useKeyDown;
exports.useComboboxContext = useComboboxContext;
exports.useComboboxOptionContext = useComboboxOptionContext;
