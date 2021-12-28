import { forwardRef, useRef, useState, useMemo, createElement, useContext, useEffect, Children, memo } from 'react';
import PropTypes from 'prop-types';
import { createDescendantContext, useDescendantsInit, DescendantProvider, useDescendants, useDescendantKeyDown, useDescendant } from '@reach/descendants';
import { getComputedStyle } from '@reach/utils/computed-styles';
import { cloneValidElement } from '@reach/utils/clone-valid-element';
import { useControlledState } from '@reach/utils/use-controlled-state';
import { useStatefulRefValue } from '@reach/utils/use-stateful-ref-value';
import { useIsomorphicLayoutEffect } from '@reach/utils/use-isomorphic-layout-effect';
import { createNamedContext } from '@reach/utils/context';
import { isFunction, isNumber, isBoolean } from '@reach/utils/type-check';
import { makeId } from '@reach/utils/make-id';
import { noop } from '@reach/utils/noop';
import { useControlledSwitchWarning, useCheckStyles } from '@reach/utils/dev-utils';
import { useComposedRefs } from '@reach/utils/compose-refs';
import { useUpdateEffect } from '@reach/utils/use-update-effect';
import { composeEventHandlers } from '@reach/utils/compose-event-handlers';
import { useId } from '@reach/auto-id';

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

var _excluded = ["as", "children", "defaultIndex", "orientation", "index", "keyboardActivation", "onChange", "readOnly"],
    _excluded2 = ["children", "as", "onKeyDown"],
    _excluded3 = ["isSelected", "children", "as", "index", "disabled", "onBlur", "onFocus"],
    _excluded4 = ["children", "as"],
    _excluded5 = ["children", "aria-label", "as", "index"];
var TabsDescendantsContext = /*#__PURE__*/createDescendantContext("TabsDescendantsContext");
var TabPanelDescendantsContext = /*#__PURE__*/createDescendantContext("TabPanelDescendantsContext");
var TabsContext = /*#__PURE__*/createNamedContext("TabsContext", {});
var TabsKeyboardActivation;

(function (TabsKeyboardActivation) {
  TabsKeyboardActivation["Auto"] = "auto";
  TabsKeyboardActivation["Manual"] = "manual";
})(TabsKeyboardActivation || (TabsKeyboardActivation = {}));

var TabsOrientation; ////////////////////////////////////////////////////////////////////////////////

/**
 * Tabs
 *
 * The parent component of the tab interface.
 *
 * @see Docs https://reach.tech/tabs#tabs
 */

(function (TabsOrientation) {
  TabsOrientation["Horizontal"] = "horizontal";
  TabsOrientation["Vertical"] = "vertical";
})(TabsOrientation || (TabsOrientation = {}));

var Tabs = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _props$id;

  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      children = _ref.children,
      defaultIndex = _ref.defaultIndex,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? TabsOrientation.Horizontal : _ref$orientation,
      _ref$index = _ref.index,
      controlledIndex = _ref$index === void 0 ? undefined : _ref$index,
      _ref$keyboardActivati = _ref.keyboardActivation,
      keyboardActivation = _ref$keyboardActivati === void 0 ? TabsKeyboardActivation.Auto : _ref$keyboardActivati,
      onChange = _ref.onChange,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? false : _ref$readOnly,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var isControlled = useRef(controlledIndex != null);
  useControlledSwitchWarning(controlledIndex, "index", "Tabs");

  var _id = useId(props.id);

  var id = (_props$id = props.id) != null ? _props$id : makeId("tabs", _id); // We only manage focus if the user caused the update vs. a new controlled
  // index coming in.

  var userInteractedRef = useRef(false);
  var selectedPanelRef = useRef(null);
  var isRTL = useRef(false);

  var _useControlledState = useControlledState(controlledIndex, defaultIndex != null ? defaultIndex : 0),
      selectedIndex = _useControlledState[0],
      setSelectedIndex = _useControlledState[1];

  var _React$useState = useState(-1),
      focusedIndex = _React$useState[0],
      setFocusedIndex = _React$useState[1];

  var _useDescendantsInit = useDescendantsInit(),
      tabs = _useDescendantsInit[0],
      setTabs = _useDescendantsInit[1];

  var context = useMemo(function () {
    return {
      focusedIndex: focusedIndex,
      id: id,
      isControlled: isControlled.current,
      isRTL: isRTL,
      keyboardActivation: keyboardActivation,
      onFocusPanel: function onFocusPanel() {
        if (selectedPanelRef.current && isFunction(selectedPanelRef.current.focus)) {
          selectedPanelRef.current.focus();
        }
      },
      onSelectTab: readOnly ? noop : function (index) {
        userInteractedRef.current = true;
        onChange && onChange(index);
        setSelectedIndex(index);
      },
      onSelectTabWithKeyboard: readOnly ? noop : function (index) {
        var _tabs$index;

        userInteractedRef.current = true;

        switch (keyboardActivation) {
          case TabsKeyboardActivation.Manual:
            var tabElement = (_tabs$index = tabs[index]) == null ? void 0 : _tabs$index.element;

            if (tabElement && isFunction(tabElement.focus)) {
              tabElement.focus();
            }

            return;

          case TabsKeyboardActivation.Auto:
          default:
            onChange && onChange(index);
            setSelectedIndex(index);
            return;
        }
      },
      orientation: orientation,
      selectedIndex: selectedIndex,
      selectedPanelRef: selectedPanelRef,
      setFocusedIndex: setFocusedIndex,
      setSelectedIndex: setSelectedIndex,
      userInteractedRef: userInteractedRef
    };
  }, [focusedIndex, id, keyboardActivation, onChange, orientation, readOnly, selectedIndex, setSelectedIndex, tabs]);
  useCheckStyles("tabs");
  return /*#__PURE__*/createElement(DescendantProvider, {
    context: TabsDescendantsContext,
    items: tabs,
    set: setTabs
  }, /*#__PURE__*/createElement(TabsContext.Provider, {
    value: context
  }, /*#__PURE__*/createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-tabs": "",
    "data-orientation": orientation,
    id: props.id
  }), isFunction(children) ? children({
    focusedIndex: focusedIndex,
    id: id,
    selectedIndex: selectedIndex
  }) : children)));
});
/**
 * @see Docs https://reach.tech/tabs#tabs-props
 */

if (process.env.NODE_ENV !== "production") {
  Tabs.displayName = "Tabs";
  Tabs.propTypes = {
    children: /*#__PURE__*/PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    onChange: PropTypes.func,
    orientation: /*#__PURE__*/PropTypes.oneOf( /*#__PURE__*/Object.values(TabsOrientation)),
    index: function index(props, name, compName, location, propName) {
      var val = props[name];

      if (props.index > -1 && props.onChange == null && props.readOnly !== true) {
        return new Error("You provided a value prop to `" + compName + "` without an `onChange` handler. This will render a read-only tabs element. If the tabs should be mutable use `defaultIndex`. Otherwise, set `onChange`.");
      } else if (val != null && !isNumber(val)) {
        return new Error("Invalid prop `" + propName + "` supplied to `" + compName + "`. Expected `number`, received `" + (Array.isArray(val) ? "array" : typeof val) + "`.");
      }

      return null;
    },
    defaultIndex: PropTypes.number
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * TabList
 *
 * The parent component of the tabs.
 *
 * @see Docs https://reach.tech/tabs#tablist
 */


var TabListImpl = /*#__PURE__*/forwardRef(function (_ref2, forwardedRef) {
  var children = _ref2.children,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "div" : _ref2$as,
      onKeyDown = _ref2.onKeyDown,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _React$useContext = useContext(TabsContext),
      focusedIndex = _React$useContext.focusedIndex,
      isControlled = _React$useContext.isControlled,
      isRTL = _React$useContext.isRTL,
      keyboardActivation = _React$useContext.keyboardActivation,
      onSelectTabWithKeyboard = _React$useContext.onSelectTabWithKeyboard,
      orientation = _React$useContext.orientation,
      selectedIndex = _React$useContext.selectedIndex,
      setSelectedIndex = _React$useContext.setSelectedIndex;

  var tabs = useDescendants(TabsDescendantsContext);
  var ownRef = useRef(null);
  var ref = useComposedRefs(forwardedRef, ownRef);
  useEffect(function () {
    if (ownRef.current && (ownRef.current.ownerDocument && ownRef.current.ownerDocument.dir === "rtl" || getComputedStyle(ownRef.current, "direction") === "rtl")) {
      isRTL.current = true;
    }
  }, [isRTL]);
  var handleKeyDown = composeEventHandlers(onKeyDown, useDescendantKeyDown(TabsDescendantsContext, {
    currentIndex: keyboardActivation === TabsKeyboardActivation.Manual ? focusedIndex : selectedIndex,
    orientation: orientation,
    rotate: true,
    callback: onSelectTabWithKeyboard,
    filter: function filter(tab) {
      return !tab.disabled;
    },
    rtl: isRTL.current
  }));
  useIsomorphicLayoutEffect(function () {
    var _tabs$selectedIndex;

    // In the event an uncontrolled component's selected index is disabled,
    // (this should only happen if the first tab is disabled and no default
    // index is set), we need to override the selection to the next selectable
    // index value.
    if (!isControlled && boolOrBoolString((_tabs$selectedIndex = tabs[selectedIndex]) == null ? void 0 : _tabs$selectedIndex.disabled)) {
      var next = tabs.find(function (tab) {
        return !tab.disabled;
      });

      if (next) {
        setSelectedIndex(next.index);
      }
    }
  }, [tabs, isControlled, selectedIndex, setSelectedIndex]);
  return /*#__PURE__*/createElement(Comp // The element that serves as the container for the set of tabs has role
  // `tablist`
  // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
  , _extends({
    role: "tablist" // If the `tablist` element is vertically oriented, it has the property
    // `aria-orientation` set to `"vertical"`. The default value of
    // `aria-orientation` for a tablist element is `"horizontal"`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
    ,
    "aria-orientation": orientation
  }, props, {
    "data-reach-tab-list": "",
    ref: ref,
    onKeyDown: handleKeyDown
  }), Children.map(children, function (child, index) {
    // TODO: Remove in 1.0
    return cloneValidElement(child, {
      isSelected: index === selectedIndex
    });
  }));
});

if (process.env.NODE_ENV !== "production") {
  TabListImpl.displayName = "TabList";
  TabListImpl.propTypes = {
    as: PropTypes.any,
    children: PropTypes.node
  };
}

var TabList = /*#__PURE__*/memo(TabListImpl);
/**
 * @see Docs https://reach.tech/tabs#tablist-props
 */

if (process.env.NODE_ENV !== "production") {
  TabList.displayName = "TabList";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * Tab
 *
 * The interactive element that changes the selected panel.
 *
 * @see Docs https://reach.tech/tabs#tab
 */


var Tab = /*#__PURE__*/forwardRef(function (_ref3, forwardedRef) {
  _ref3.isSelected;
      var children = _ref3.children,
      _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "button" : _ref3$as,
      indexProp = _ref3.index,
      disabled = _ref3.disabled,
      onBlur = _ref3.onBlur,
      onFocus = _ref3.onFocus,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = useContext(TabsContext),
      tabsId = _React$useContext2.id,
      onSelectTab = _React$useContext2.onSelectTab,
      orientation = _React$useContext2.orientation,
      selectedIndex = _React$useContext2.selectedIndex,
      userInteractedRef = _React$useContext2.userInteractedRef,
      setFocusedIndex = _React$useContext2.setFocusedIndex;

  var ownRef = useRef(null);

  var _useStatefulRefValue = useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue[0],
      handleRefSet = _useStatefulRefValue[1];

  var ref = useComposedRefs(forwardedRef, handleRefSet);
  var descendant = useMemo(function () {
    return {
      element: element,
      disabled: !!disabled
    };
  }, [disabled, element]);
  var index = useDescendant(descendant, TabsDescendantsContext, indexProp);
  var htmlType = Comp === "button" && props.type == null ? "button" : props.type;
  var isSelected = index === selectedIndex;

  function onSelect() {
    onSelectTab(index);
  }

  useUpdateEffect(function () {
    if (isSelected && ownRef.current && userInteractedRef.current) {
      userInteractedRef.current = false;

      if (isFunction(ownRef.current.focus)) {
        ownRef.current.focus();
      }
    }
  }, [isSelected, userInteractedRef]);
  return /*#__PURE__*/createElement(Comp // Each element with role `tab` has the property `aria-controls` referring
  // to its associated `tabpanel` element.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
  , _extends({
    "aria-controls": makeId(tabsId, "panel", index),
    "aria-disabled": disabled // The active tab element has the state `aria-selected` set to `true` and
    // all other tab elements have it set to `false`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
    ,
    "aria-selected": isSelected // Each element that serves as a tab has role `tab` and is contained
    // within the element with role `tablist`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
    ,
    role: "tab",
    tabIndex: isSelected ? 0 : -1
  }, props, {
    ref: ref,
    "data-reach-tab": "",
    "data-orientation": orientation,
    "data-selected": isSelected ? "" : undefined,
    disabled: disabled,
    id: makeId(tabsId, "tab", index),
    onClick: onSelect,
    onFocus: composeEventHandlers(onFocus, function () {
      setFocusedIndex(index);
    }),
    onBlur: composeEventHandlers(onBlur, function () {
      setFocusedIndex(-1);
    }),
    type: htmlType
  }), children);
});
/**
 * @see Docs https://reach.tech/tabs#tab-props
 */

if (process.env.NODE_ENV !== "production") {
  Tab.displayName = "Tab";
  Tab.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * TabPanels
 *
 * The parent component of the panels.
 *
 * @see Docs https://reach.tech/tabs#tabpanels
 */


var TabPanelsImpl = /*#__PURE__*/forwardRef(function (_ref4, forwardedRef) {
  var children = _ref4.children,
      _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "div" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  var ownRef = useRef();
  var ref = useComposedRefs(ownRef, forwardedRef);

  var _useDescendantsInit2 = useDescendantsInit(),
      tabPanels = _useDescendantsInit2[0],
      setTabPanels = _useDescendantsInit2[1];

  return /*#__PURE__*/createElement(DescendantProvider, {
    context: TabPanelDescendantsContext,
    items: tabPanels,
    set: setTabPanels
  }, /*#__PURE__*/createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-tab-panels": ""
  }), children));
});

if (process.env.NODE_ENV !== "production") {
  TabPanelsImpl.displayName = "TabPanels";
  TabPanelsImpl.propTypes = {
    as: PropTypes.any,
    children: PropTypes.node
  };
}

var TabPanels = /*#__PURE__*/memo(TabPanelsImpl);
/**
 * @see Docs https://reach.tech/tabs#tabpanels-props
 */

if (process.env.NODE_ENV !== "production") {
  TabPanels.displayName = "TabPanels";
} ////////////////////////////////////////////////////////////////////////////////

/**
 * TabPanel
 *
 * The panel that displays when it's corresponding tab is active.
 *
 * @see Docs https://reach.tech/tabs#tabpanel
 */


var TabPanel = /*#__PURE__*/forwardRef(function (_ref5, forwardedRef) {
  var children = _ref5.children;
      _ref5["aria-label"];
      var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "div" : _ref5$as,
      indexProp = _ref5.index,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  var _React$useContext3 = useContext(TabsContext),
      selectedPanelRef = _React$useContext3.selectedPanelRef,
      selectedIndex = _React$useContext3.selectedIndex,
      tabsId = _React$useContext3.id;

  var ownRef = useRef(null);

  var _useStatefulRefValue2 = useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue2[0],
      handleRefSet = _useStatefulRefValue2[1];

  var descendant = useMemo(function () {
    return {
      element: element
    };
  }, [element]);
  var index = useDescendant(descendant, TabPanelDescendantsContext, indexProp);
  var id = makeId(tabsId, "panel", index); // Because useDescendant will always return -1 on the first render,
  // `isSelected` will briefly be false for all tabs. We set a tab panel's
  // hidden attribute based `isSelected` being false, meaning that all tabs
  // are initially hidden. This makes it impossible for consumers to do
  // certain things, like focus an element inside the active tab panel when
  // the page loads. So what we can do is track that a panel is "ready" to be
  // hidden once effects are run (descendants work their magic in
  // useLayoutEffect, so we can set our ref in useEffecct to run later). We
  // can use a ref instead of state because we're always geting a re-render
  // anyway thanks to descendants. This is a little more coupled to the
  // implementation details of descendants than I'd like, but we'll add a test
  // to (hopefully) catch any regressions.

  var isSelected = index === selectedIndex;
  var readyToHide = useRef(false);
  var hidden = readyToHide.current ? !isSelected : false;
  useEffect(function () {
    readyToHide.current = true;
  }, []);
  var ref = useComposedRefs(forwardedRef, handleRefSet, isSelected ? selectedPanelRef : null);
  return /*#__PURE__*/createElement(Comp // Each element with role `tabpanel` has the property `aria-labelledby`
  // referring to its associated tab element.
  , _extends({
    "aria-labelledby": makeId(tabsId, "tab", index),
    hidden: hidden // Each element that contains the content panel for a tab has role
    // `tabpanel`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
    ,
    role: "tabpanel",
    tabIndex: isSelected ? 0 : -1
  }, props, {
    ref: ref,
    "data-reach-tab-panel": "",
    id: id
  }), children);
});
/**
 * @see Docs https://reach.tech/tabs#tabpanel-props
 */

if (process.env.NODE_ENV !== "production") {
  TabPanel.displayName = "TabPanel";
  TabPanel.propTypes = {
    as: PropTypes.any,
    children: PropTypes.node
  };
} ////////////////////////////////////////////////////////////////////////////////

/**
 * A hook that exposes data for a given `Tabs` component to its descendants.
 *
 * @see Docs https://reach.tech/tabs#usetabscontext
 */


function useTabsContext() {
  var _React$useContext4 = useContext(TabsContext),
      focusedIndex = _React$useContext4.focusedIndex,
      id = _React$useContext4.id,
      selectedIndex = _React$useContext4.selectedIndex;

  return useMemo(function () {
    return {
      focusedIndex: focusedIndex,
      id: id,
      selectedIndex: selectedIndex
    };
  }, [focusedIndex, id, selectedIndex]);
} ////////////////////////////////////////////////////////////////////////////////

function boolOrBoolString(value) {
  return value === "true" ? true : isBoolean(value) ? value : false;
}

export { Tab, TabList, TabPanel, TabPanels, Tabs, TabsKeyboardActivation, TabsOrientation, useTabsContext };
