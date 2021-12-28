'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var autoId = require('@reach/auto-id');
var popover = require('@reach/popover');
var descendants = require('@reach/descendants');
var isRightClick = require('@reach/utils/is-right-click');
var usePrevious = require('@reach/utils/use-previous');
var ownerDocument = require('@reach/utils/owner-document');
var context = require('@reach/utils/context');
var typeCheck = require('@reach/utils/type-check');
var makeId = require('@reach/utils/make-id');
var useStatefulRefValue = require('@reach/utils/use-stateful-ref-value');
var composeRefs = require('@reach/utils/compose-refs');
var composeEventHandlers = require('@reach/utils/compose-event-handlers');

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

var _excluded = ["onKeyDown", "onMouseDown", "id", "ref"],
    _excluded2 = ["as"],
    _excluded3 = ["index", "isLink", "onClick", "onDragStart", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseUp", "onSelect", "disabled", "onFocus", "valueText", "ref"],
    _excluded4 = ["as"],
    _excluded5 = ["id", "onKeyDown", "ref"],
    _excluded6 = ["as"],
    _excluded7 = ["onBlur", "portal", "position", "ref"],
    _excluded8 = ["as"];
////////////////////////////////////////////////////////////////////////////////
// Actions
var CLEAR_SELECTION_INDEX = "CLEAR_SELECTION_INDEX";
var CLICK_MENU_ITEM = "CLICK_MENU_ITEM";
var CLOSE_MENU = "CLOSE_MENU";
var OPEN_MENU_AT_FIRST_ITEM = "OPEN_MENU_AT_FIRST_ITEM";
var OPEN_MENU_AT_INDEX = "OPEN_MENU_AT_INDEX";
var OPEN_MENU_CLEARED = "OPEN_MENU_CLEARED";
var SEARCH_FOR_ITEM = "SEARCH_FOR_ITEM";
var SELECT_ITEM_AT_INDEX = "SELECT_ITEM_AT_INDEX";
var SET_BUTTON_ID = "SET_BUTTON_ID";
var DropdownDescendantContext = /*#__PURE__*/descendants.createDescendantContext("DropdownDescendantContext");
var DropdownContext = /*#__PURE__*/context.createNamedContext("DropdownContext", {});
var initialState = {
  // The button ID is needed for aria controls and can be set directly and
  // updated for top-level use via context. Otherwise a default is set by useId.
  // TODO: Consider deprecating direct ID in 1.0 in favor of id at the top level
  //       for passing deterministic IDs to descendent components.
  triggerId: null,
  // Whether or not the dropdown is expanded
  isExpanded: false,
  // When a user begins typing a character string, the selection will change if
  // a matching item is found
  typeaheadQuery: "",
  // The index of the current selected item. When the selection is cleared a
  // value of -1 is used.
  selectionIndex: -1
}; ////////////////////////////////////////////////////////////////////////////////
// Dropdown!

var DropdownProvider = function DropdownProvider(_ref) {
  var id = _ref.id,
      children = _ref.children;
  var triggerRef = React.useRef(null);
  var dropdownRef = React.useRef(null);
  var popoverRef = React.useRef(null);

  var _useDescendantsInit = descendants.useDescendantsInit(),
      descendants$1 = _useDescendantsInit[0],
      setDescendants = _useDescendantsInit[1];

  var _id = autoId.useId(id);

  var dropdownId = id || makeId.makeId("menu", _id);
  var triggerId = makeId.makeId("menu-button", dropdownId);

  var _React$useReducer = React.useReducer(reducer, _extends({}, initialState, {
    triggerId: triggerId
  })),
      state = _React$useReducer[0],
      dispatch = _React$useReducer[1]; // We use an event listener attached to the window to capture outside clicks
  // that close the dropdown. We don't want the initial button click to trigger
  // this when a dropdown is closed, so we can track this behavior in a ref for
  // now. We shouldn't need this when we rewrite with state machine logic.


  var triggerClickedRef = React.useRef(false); // We will put children callbacks in a ref to avoid triggering endless render
  // loops when using render props if the app code doesn't useCallback
  // https://github.com/reach/reach-ui/issues/523

  var selectCallbacks = React.useRef([]); // If the popover's position overlaps with an option when the popover
  // initially opens, the mouseup event will trigger a select. To prevent that,
  // we decide the control is only ready to make a selection if the pointer
  // moves a certain distance OR if the mouse button is pressed for a certain
  // length of time, otherwise the user is just registering the initial button
  // click rather than selecting an item.
  // For context on some implementation details, see https://github.com/reach/reach-ui/issues/563

  var readyToSelect = React.useRef(false);
  var mouseDownStartPosRef = React.useRef({
    x: 0,
    y: 0
  }); // Trying a new approach for splitting up contexts by stable/unstable
  // references. We'll see how it goes!

  var context = {
    dispatch: dispatch,
    dropdownId: dropdownId,
    dropdownRef: dropdownRef,
    mouseDownStartPosRef: mouseDownStartPosRef,
    popoverRef: popoverRef,
    readyToSelect: readyToSelect,
    selectCallbacks: selectCallbacks,
    state: state,
    triggerClickedRef: triggerClickedRef,
    triggerRef: triggerRef
  }; // When the dropdown is open, focus is placed on the dropdown itself so that
  // keyboard navigation is still possible.

  React.useEffect(function () {
    if (state.isExpanded) {
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = true;
      window.requestAnimationFrame(function () {
        focus(dropdownRef.current);
      });
    } else {
      // We want to ignore the immediate focus of a tooltip so it doesn't pop up
      // again when the dropdown closes, only pops up when focus returns again
      // to the tooltip (like native OS tooltips).
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = false;
    }
  }, [state.isExpanded]);
  return /*#__PURE__*/React.createElement(descendants.DescendantProvider, {
    context: DropdownDescendantContext,
    items: descendants$1,
    set: setDescendants
  }, /*#__PURE__*/React.createElement(DropdownContext.Provider, {
    value: context
  }, typeCheck.isFunction(children) ? children({
    isExpanded: state.isExpanded,
    // TODO: Remove in 1.0
    isOpen: state.isExpanded
  }) : children));
};

if (process.env.NODE_ENV !== "production") {
  DropdownProvider.displayName = "DropdownProvider";
} ////////////////////////////////////////////////////////////////////////////////


function useDropdownTrigger(_ref2) {
  var onKeyDown = _ref2.onKeyDown,
      onMouseDown = _ref2.onMouseDown,
      id = _ref2.id,
      forwardedRef = _ref2.ref,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded);

  var _useDropdownContext = useDropdownContext(),
      dispatch = _useDropdownContext.dispatch,
      dropdownId = _useDropdownContext.dropdownId,
      mouseDownStartPosRef = _useDropdownContext.mouseDownStartPosRef,
      triggerClickedRef = _useDropdownContext.triggerClickedRef,
      triggerRef = _useDropdownContext.triggerRef,
      _useDropdownContext$s = _useDropdownContext.state,
      triggerId = _useDropdownContext$s.triggerId,
      isExpanded = _useDropdownContext$s.isExpanded;

  var ref = composeRefs.useComposedRefs(triggerRef, forwardedRef);
  var items = useDropdownDescendants();
  var firstNonDisabledIndex = React.useMemo(function () {
    return items.findIndex(function (item) {
      return !item.disabled;
    });
  }, [items]);
  React.useEffect(function () {
    if (id != null && id !== triggerId) {
      dispatch({
        type: SET_BUTTON_ID,
        payload: id
      });
    }
  }, [triggerId, dispatch, id]);

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault(); // prevent scroll

        dispatch({
          type: OPEN_MENU_AT_INDEX,
          payload: {
            index: firstNonDisabledIndex
          }
        });
        break;

      case "Enter":
      case " ":
        dispatch({
          type: OPEN_MENU_AT_INDEX,
          payload: {
            index: firstNonDisabledIndex
          }
        });
        break;
    }
  }

  function handleMouseDown(event) {
    if (isRightClick.isRightClick(event.nativeEvent)) {
      return;
    }

    mouseDownStartPosRef.current = {
      x: event.clientX,
      y: event.clientY
    };

    if (!isExpanded) {
      triggerClickedRef.current = true;
    }

    if (isExpanded) {
      dispatch({
        type: CLOSE_MENU
      });
    } else {
      dispatch({
        type: OPEN_MENU_CLEARED
      });
    }
  }

  return {
    data: {
      isExpanded: isExpanded,
      controls: dropdownId
    },
    props: _extends({}, props, {
      ref: ref,
      id: triggerId || undefined,
      onKeyDown: composeEventHandlers.composeEventHandlers(onKeyDown, handleKeyDown),
      onMouseDown: composeEventHandlers.composeEventHandlers(onMouseDown, handleMouseDown),
      type: "button"
    })
  };
}

var DropdownTrigger = /*#__PURE__*/React.forwardRef(function (_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "button" : _ref3$as,
      rest = _objectWithoutPropertiesLoose(_ref3, _excluded2);

  var _useDropdownTrigger = useDropdownTrigger(_extends({}, rest, {
    ref: forwardedRef
  })),
      props = _useDropdownTrigger.props;

  return /*#__PURE__*/React.createElement(Comp, _extends({
    "data-reach-dropdown-trigger": ""
  }, props));
});

if (process.env.NODE_ENV !== "production") {
  DropdownTrigger.displayName = "DropdownTrigger";
} ////////////////////////////////////////////////////////////////////////////////


function useDropdownItem(_ref4) {
  var indexProp = _ref4.index,
      _ref4$isLink = _ref4.isLink,
      isLink = _ref4$isLink === void 0 ? false : _ref4$isLink,
      onClick = _ref4.onClick,
      onDragStart = _ref4.onDragStart,
      onMouseDown = _ref4.onMouseDown,
      onMouseEnter = _ref4.onMouseEnter,
      onMouseLeave = _ref4.onMouseLeave,
      onMouseMove = _ref4.onMouseMove,
      onMouseUp = _ref4.onMouseUp,
      onSelect = _ref4.onSelect,
      disabled = _ref4.disabled,
      onFocus = _ref4.onFocus,
      valueTextProp = _ref4.valueText,
      forwardedRef = _ref4.ref,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded3);

  var _useDropdownContext2 = useDropdownContext(),
      dispatch = _useDropdownContext2.dispatch,
      dropdownRef = _useDropdownContext2.dropdownRef,
      mouseDownStartPosRef = _useDropdownContext2.mouseDownStartPosRef,
      readyToSelect = _useDropdownContext2.readyToSelect,
      selectCallbacks = _useDropdownContext2.selectCallbacks,
      triggerRef = _useDropdownContext2.triggerRef,
      _useDropdownContext2$ = _useDropdownContext2.state,
      selectionIndex = _useDropdownContext2$.selectionIndex,
      isExpanded = _useDropdownContext2$.isExpanded;

  var ownRef = React.useRef(null); // After the ref is mounted to the DOM node, we check to see if we have an
  // explicit valueText prop before looking for the node's textContent for
  // typeahead functionality.

  var _React$useState = React.useState(valueTextProp || ""),
      valueText = _React$useState[0],
      setValueText = _React$useState[1];

  var setValueTextFromDOM = React.useCallback(function (node) {
    if (!valueTextProp && node != null && node.textContent) {
      setValueText(node.textContent);
    }
  }, [valueTextProp]);
  var mouseEventStarted = React.useRef(false);

  var _useStatefulRefValue = useStatefulRefValue.useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue[0],
      handleRefSet = _useStatefulRefValue[1];

  var descendant = React.useMemo(function () {
    return {
      element: element,
      key: valueText,
      disabled: disabled,
      isLink: isLink
    };
  }, [disabled, element, isLink, valueText]);
  var index = descendants.useDescendant(descendant, DropdownDescendantContext, indexProp);
  var isSelected = index === selectionIndex && !disabled;
  var ref = composeRefs.useComposedRefs(forwardedRef, handleRefSet, setValueTextFromDOM); // Update the callback ref array on every render

  selectCallbacks.current[index] = onSelect;

  function select() {
    focus(triggerRef.current);
    onSelect && onSelect();
    dispatch({
      type: CLICK_MENU_ITEM
    });
  }

  function handleClick(event) {
    if (isRightClick.isRightClick(event.nativeEvent)) {
      return;
    }

    if (isLink) {
      if (disabled) {
        event.preventDefault();
      } else {
        select();
      }
    }
  }

  function handleDragStart(event) {
    // Because we don't preventDefault on mousedown for links (we need the
    // native click event), clicking and holding on a link triggers a
    // dragstart which we don't want.
    if (isLink) {
      event.preventDefault();
    }
  }

  function handleMouseDown(event) {
    if (isRightClick.isRightClick(event.nativeEvent)) {
      return;
    }

    if (isLink) {
      // Signal that the mouse is down so we can call the right function if the
      // user is clicking on a link.
      mouseEventStarted.current = true;
    } else {
      event.preventDefault();
    }
  }

  function handleMouseEnter(event) {
    var doc = ownerDocument.getOwnerDocument(dropdownRef.current);

    if (!isSelected && index != null && !disabled) {
      if (dropdownRef != null && dropdownRef.current && dropdownRef.current !== doc.activeElement && ownRef.current !== doc.activeElement) {
        dropdownRef.current.focus();
      }

      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: index
        }
      });
    }
  }

  function handleMouseLeave(event) {
    // Clear out selection when mouse over a non-dropdown-item child.
    dispatch({
      type: CLEAR_SELECTION_INDEX
    });
  }

  function handleMouseMove(event) {
    if (!readyToSelect.current) {
      var threshold = 8;
      var deltaX = Math.abs(event.clientX - mouseDownStartPosRef.current.x);
      var deltaY = Math.abs(event.clientY - mouseDownStartPosRef.current.y);

      if (deltaX > threshold || deltaY > threshold) {
        readyToSelect.current = true;
      }
    }

    if (!isSelected && index != null && !disabled) {
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: index,
          dropdownRef: dropdownRef
        }
      });
    }
  }

  function handleFocus() {
    readyToSelect.current = true;

    if (!isSelected && index != null && !disabled) {
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: index
        }
      });
    }
  }

  function handleMouseUp(event) {
    if (isRightClick.isRightClick(event.nativeEvent)) {
      return;
    }

    if (!readyToSelect.current) {
      readyToSelect.current = true;
      return;
    }

    if (isLink) {
      // If a mousedown event was initiated on a link item followed by a mouseup
      // event on the same link, we do nothing; a click event will come next and
      // handle selection. Otherwise, we trigger a click event.
      if (mouseEventStarted.current) {
        mouseEventStarted.current = false;
      } else if (ownRef.current) {
        ownRef.current.click();
      }
    } else {
      if (!disabled) {
        select();
      }
    }
  }

  React.useEffect(function () {
    if (isExpanded) {
      // When the dropdown opens, wait for about half a second before enabling
      // selection. This is designed to mirror dropdown menus on macOS, where
      // opening a menu on top of a trigger would otherwise result in an
      // immediate accidental selection once the click trigger is released.
      var id = window.setTimeout(function () {
        readyToSelect.current = true;
      }, 400);
      return function () {
        window.clearTimeout(id);
      };
    } else {
      // When the dropdown closes, reset readyToSelect for the next interaction.
      readyToSelect.current = false;
    }
  }, [isExpanded, readyToSelect]); // Any time a mouseup event occurs anywhere in the document, we reset the
  // mouseEventStarted ref so we can check it again when needed.

  React.useEffect(function () {
    var ownerDocument$1 = ownerDocument.getOwnerDocument(ownRef.current);
    ownerDocument$1.addEventListener("mouseup", listener);
    return function () {
      ownerDocument$1.removeEventListener("mouseup", listener);
    };

    function listener() {
      mouseEventStarted.current = false;
    }
  }, []);
  return {
    data: {
      disabled: disabled
    },
    props: _extends({
      id: useItemId(index),
      tabIndex: -1
    }, props, {
      ref: ref,
      "data-disabled": disabled ? "" : undefined,
      "data-selected": isSelected ? "" : undefined,
      "data-valuetext": valueText,
      onClick: composeEventHandlers.composeEventHandlers(onClick, handleClick),
      onDragStart: composeEventHandlers.composeEventHandlers(onDragStart, handleDragStart),
      onMouseDown: composeEventHandlers.composeEventHandlers(onMouseDown, handleMouseDown),
      onMouseEnter: composeEventHandlers.composeEventHandlers(onMouseEnter, handleMouseEnter),
      onMouseLeave: composeEventHandlers.composeEventHandlers(onMouseLeave, handleMouseLeave),
      onMouseMove: composeEventHandlers.composeEventHandlers(onMouseMove, handleMouseMove),
      onFocus: composeEventHandlers.composeEventHandlers(onFocus, handleFocus),
      onMouseUp: composeEventHandlers.composeEventHandlers(onMouseUp, handleMouseUp)
    })
  };
}
/**
 * DropdownItem
 */


var DropdownItem = /*#__PURE__*/React.forwardRef(function (_ref5, forwardedRef) {
  var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "div" : _ref5$as,
      rest = _objectWithoutPropertiesLoose(_ref5, _excluded4);

  var _useDropdownItem = useDropdownItem(_extends({}, rest, {
    ref: forwardedRef
  })),
      props = _useDropdownItem.props;

  return /*#__PURE__*/React.createElement(Comp, _extends({
    "data-reach-dropdown-item": ""
  }, props));
});

if (process.env.NODE_ENV !== "production") {
  DropdownItem.displayName = "DropdownItem";
} ////////////////////////////////////////////////////////////////////////////////


function useDropdownItems(_ref6) {
  _ref6.id;
      var onKeyDown = _ref6.onKeyDown,
      forwardedRef = _ref6.ref,
      props = _objectWithoutPropertiesLoose(_ref6, _excluded5);

  var _useDropdownContext3 = useDropdownContext(),
      dispatch = _useDropdownContext3.dispatch,
      triggerRef = _useDropdownContext3.triggerRef,
      dropdownRef = _useDropdownContext3.dropdownRef,
      selectCallbacks = _useDropdownContext3.selectCallbacks,
      dropdownId = _useDropdownContext3.dropdownId,
      _useDropdownContext3$ = _useDropdownContext3.state,
      isExpanded = _useDropdownContext3$.isExpanded,
      triggerId = _useDropdownContext3$.triggerId,
      selectionIndex = _useDropdownContext3$.selectionIndex,
      typeaheadQuery = _useDropdownContext3$.typeaheadQuery;

  var items = useDropdownDescendants();
  var ref = composeRefs.useComposedRefs(dropdownRef, forwardedRef);
  React.useEffect(function () {
    // Respond to user char key input with typeahead
    var match = findItemFromTypeahead(items, typeaheadQuery);

    if (typeaheadQuery && match != null) {
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: match,
          dropdownRef: dropdownRef
        }
      });
    }

    var timeout = window.setTimeout(function () {
      return typeaheadQuery && dispatch({
        type: SEARCH_FOR_ITEM,
        payload: ""
      });
    }, 1000);
    return function () {
      return window.clearTimeout(timeout);
    };
  }, [dispatch, items, typeaheadQuery, dropdownRef]);
  var prevItemsLength = usePrevious.usePrevious(items.length);
  var prevSelected = usePrevious.usePrevious(items[selectionIndex]);
  var prevSelectionIndex = usePrevious.usePrevious(selectionIndex);
  React.useEffect(function () {
    if (selectionIndex > items.length - 1) {
      // If for some reason our selection index is larger than our possible
      // index range (let's say the last item is selected and the list
      // dynamically updates), we need to select the last item in the list.
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: items.length - 1,
          dropdownRef: dropdownRef
        }
      });
    } else if ( // Checks if
    //  - item length has changed
    //  - selection index has not changed BUT selected item has changed
    //
    // This prevents any dynamic adding/removing of items from actually
    // changing a user's expected selection.
    prevItemsLength !== items.length && selectionIndex > -1 && prevSelected && prevSelectionIndex === selectionIndex && items[selectionIndex] !== prevSelected) {
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: items.findIndex(function (i) {
            return i.key === (prevSelected == null ? void 0 : prevSelected.key);
          }),
          dropdownRef: dropdownRef
        }
      });
    }
  }, [dropdownRef, dispatch, items, prevItemsLength, prevSelected, prevSelectionIndex, selectionIndex]);
  var handleKeyDown = composeEventHandlers.composeEventHandlers(function handleKeyDown(event) {
    var key = event.key;

    if (!isExpanded) {
      return;
    }

    switch (key) {
      case "Enter":
      case " ":
        var selected = items.find(function (item) {
          return item.index === selectionIndex;
        }); // For links, the Enter key will trigger a click by default, but for
        // consistent behavior across items we'll trigger a click when the
        // spacebar is pressed.

        if (selected && !selected.disabled) {
          event.preventDefault();

          if (selected.isLink && selected.element) {
            selected.element.click();
          } else {
            // Focus the button first by default when an item is selected.
            // We fire the onSelect callback next so the app can manage
            // focus if needed.
            focus(triggerRef.current);
            selectCallbacks.current[selected.index] && selectCallbacks.current[selected.index]();
            dispatch({
              type: CLICK_MENU_ITEM
            });
          }
        }

        break;

      case "Escape":
        focus(triggerRef.current);
        dispatch({
          type: CLOSE_MENU
        });
        break;

      case "Tab":
        // prevent leaving
        event.preventDefault();
        break;

      default:
        // Check if a user is typing some char keys and respond by setting
        // the query state.
        if (typeCheck.isString(key) && key.length === 1) {
          var query = typeaheadQuery + key.toLowerCase();
          dispatch({
            type: SEARCH_FOR_ITEM,
            payload: query
          });
        }

        break;
    }
  }, descendants.useDescendantKeyDown(DropdownDescendantContext, {
    currentIndex: selectionIndex,
    orientation: "vertical",
    rotate: false,
    filter: function filter(item) {
      return !item.disabled;
    },
    callback: function callback(index) {
      dispatch({
        type: SELECT_ITEM_AT_INDEX,
        payload: {
          index: index,
          dropdownRef: dropdownRef
        }
      });
    },
    key: "index"
  }));
  return {
    data: {
      activeDescendant: useItemId(selectionIndex) || undefined,
      triggerId: triggerId
    },
    props: _extends({
      tabIndex: -1
    }, props, {
      ref: ref,
      id: dropdownId,
      onKeyDown: composeEventHandlers.composeEventHandlers(onKeyDown, handleKeyDown)
    })
  };
}
/**
 * DropdownItem
 */


var DropdownItems = /*#__PURE__*/React.forwardRef(function (_ref7, forwardedRef) {
  var _ref7$as = _ref7.as,
      Comp = _ref7$as === void 0 ? "div" : _ref7$as,
      rest = _objectWithoutPropertiesLoose(_ref7, _excluded6);

  var _useDropdownItems = useDropdownItems(_extends({}, rest, {
    ref: forwardedRef
  })),
      props = _useDropdownItems.props;

  return /*#__PURE__*/React.createElement(Comp, _extends({
    "data-reach-dropdown-items": ""
  }, props));
});

if (process.env.NODE_ENV !== "production") {
  DropdownItems.displayName = "DropdownItems";
} ////////////////////////////////////////////////////////////////////////////////


function useDropdownPopover(_ref8) {
  var onBlur = _ref8.onBlur,
      _ref8$portal = _ref8.portal,
      portal = _ref8$portal === void 0 ? true : _ref8$portal,
      position = _ref8.position,
      forwardedRef = _ref8.ref,
      props = _objectWithoutPropertiesLoose(_ref8, _excluded7);

  var _useDropdownContext4 = useDropdownContext(),
      triggerRef = _useDropdownContext4.triggerRef,
      triggerClickedRef = _useDropdownContext4.triggerClickedRef,
      dispatch = _useDropdownContext4.dispatch,
      dropdownRef = _useDropdownContext4.dropdownRef,
      popoverRef = _useDropdownContext4.popoverRef,
      isExpanded = _useDropdownContext4.state.isExpanded;

  var ref = composeRefs.useComposedRefs(popoverRef, forwardedRef);
  React.useEffect(function () {
    if (!isExpanded) {
      return;
    }

    var ownerDocument$1 = ownerDocument.getOwnerDocument(popoverRef.current);

    function listener(event) {
      if (triggerClickedRef.current) {
        triggerClickedRef.current = false;
      } else if (!popoverContainsEventTarget(popoverRef.current, event.target)) {
        // We on want to close only if focus rests outside the dropdown
        dispatch({
          type: CLOSE_MENU
        });
      }
    }

    ownerDocument$1.addEventListener("mousedown", listener); // see https://github.com/reach/reach-ui/pull/700#discussion_r530369265
    // ownerDocument.addEventListener("touchstart", listener);

    return function () {
      ownerDocument$1.removeEventListener("mousedown", listener); // ownerDocument.removeEventListener("touchstart", listener);
    };
  }, [triggerClickedRef, triggerRef, dispatch, dropdownRef, popoverRef, isExpanded]);
  return {
    data: {
      portal: portal,
      position: position,
      targetRef: triggerRef,
      isExpanded: isExpanded
    },
    props: _extends({
      ref: ref,
      hidden: !isExpanded,
      onBlur: composeEventHandlers.composeEventHandlers(onBlur, function (event) {
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }

        dispatch({
          type: CLOSE_MENU
        });
      })
    }, props)
  };
}

var DropdownPopover = /*#__PURE__*/React.forwardRef(function (_ref9, forwardedRef) {
  var _ref9$as = _ref9.as,
      Comp = _ref9$as === void 0 ? "div" : _ref9$as,
      rest = _objectWithoutPropertiesLoose(_ref9, _excluded8);

  var _useDropdownPopover = useDropdownPopover(_extends({}, rest, {
    ref: forwardedRef
  })),
      _useDropdownPopover$d = _useDropdownPopover.data,
      portal = _useDropdownPopover$d.portal,
      targetRef = _useDropdownPopover$d.targetRef,
      position = _useDropdownPopover$d.position,
      props = _useDropdownPopover.props;

  var sharedProps = {
    "data-reach-dropdown-popover": ""
  };
  return portal ? /*#__PURE__*/React.createElement(popover.Popover, _extends({}, props, sharedProps, {
    as: Comp,
    targetRef: targetRef,
    position: position
  })) : /*#__PURE__*/React.createElement(Comp, _extends({}, props, sharedProps));
});

if (process.env.NODE_ENV !== "production") {
  DropdownPopover.displayName = "DropdownPopover";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * When a user's typed input matches the string displayed in an item, it is
 * expected that the matching item is selected. This is our matching function.
 */


function findItemFromTypeahead(items, string) {
  if (string === void 0) {
    string = "";
  }

  if (!string) {
    return null;
  }

  var found = items.find(function (item) {
    var _item$element, _item$element$dataset, _item$element$dataset2;

    return item.disabled ? false : (_item$element = item.element) == null ? void 0 : (_item$element$dataset = _item$element.dataset) == null ? void 0 : (_item$element$dataset2 = _item$element$dataset.valuetext) == null ? void 0 : _item$element$dataset2.toLowerCase().startsWith(string);
  });
  return found ? items.indexOf(found) : null;
}

function useItemId(index) {
  var _React$useContext = React.useContext(DropdownContext),
      dropdownId = _React$useContext.dropdownId;

  return index != null && index > -1 ? makeId.makeId("option-" + index, dropdownId) : undefined;
}

function focus(element) {
  element && element.focus();
}

function popoverContainsEventTarget(popover, target) {
  return !!(popover && popover.contains(target));
}

function reducer(state, action) {
  if (action === void 0) {
    action = {};
  }

  switch (action.type) {
    case CLICK_MENU_ITEM:
      return _extends({}, state, {
        isExpanded: false,
        selectionIndex: -1
      });

    case CLOSE_MENU:
      return _extends({}, state, {
        isExpanded: false,
        selectionIndex: -1
      });

    case OPEN_MENU_AT_FIRST_ITEM:
      return _extends({}, state, {
        isExpanded: true,
        selectionIndex: 0
      });

    case OPEN_MENU_AT_INDEX:
      return _extends({}, state, {
        isExpanded: true,
        selectionIndex: action.payload.index
      });

    case OPEN_MENU_CLEARED:
      return _extends({}, state, {
        isExpanded: true,
        selectionIndex: -1
      });

    case SELECT_ITEM_AT_INDEX:
      {
        var _action$payload$dropd = action.payload.dropdownRef,
            dropdownRef = _action$payload$dropd === void 0 ? {
          current: null
        } : _action$payload$dropd;

        if (action.payload.index >= 0 && action.payload.index !== state.selectionIndex) {
          if (dropdownRef.current) {
            var doc = ownerDocument.getOwnerDocument(dropdownRef.current);

            if (dropdownRef.current !== (doc == null ? void 0 : doc.activeElement)) {
              dropdownRef.current.focus();
            }
          }

          return _extends({}, state, {
            selectionIndex: action.payload.max != null ? Math.min(Math.max(action.payload.index, 0), action.payload.max) : Math.max(action.payload.index, 0)
          });
        }

        return state;
      }

    case CLEAR_SELECTION_INDEX:
      return _extends({}, state, {
        selectionIndex: -1
      });

    case SET_BUTTON_ID:
      return _extends({}, state, {
        triggerId: action.payload
      });

    case SEARCH_FOR_ITEM:
      if (typeof action.payload !== "undefined") {
        return _extends({}, state, {
          typeaheadQuery: action.payload
        });
      }

      return state;

    default:
      return state;
  }
}

function useDropdownContext() {
  return React.useContext(DropdownContext);
}

function useDropdownDescendants() {
  return descendants.useDescendants(DropdownDescendantContext);
} ////////////////////////////////////////////////////////////////////////////////

exports.DropdownItem = DropdownItem;
exports.DropdownItems = DropdownItems;
exports.DropdownPopover = DropdownPopover;
exports.DropdownProvider = DropdownProvider;
exports.DropdownTrigger = DropdownTrigger;
exports.useDropdownContext = useDropdownContext;
exports.useDropdownDescendants = useDropdownDescendants;
exports.useDropdownItem = useDropdownItem;
exports.useDropdownItems = useDropdownItems;
exports.useDropdownPopover = useDropdownPopover;
exports.useDropdownTrigger = useDropdownTrigger;
