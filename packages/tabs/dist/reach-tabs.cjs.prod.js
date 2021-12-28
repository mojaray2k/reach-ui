'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
var descendants = require('@reach/descendants');
var computedStyles = require('@reach/utils/computed-styles');
var cloneValidElement = require('@reach/utils/clone-valid-element');
var useControlledState = require('@reach/utils/use-controlled-state');
var useStatefulRefValue = require('@reach/utils/use-stateful-ref-value');
var useIsomorphicLayoutEffect = require('@reach/utils/use-isomorphic-layout-effect');
var context = require('@reach/utils/context');
var typeCheck = require('@reach/utils/type-check');
var makeId = require('@reach/utils/make-id');
var noop = require('@reach/utils/noop');
var devUtils = require('@reach/utils/dev-utils');
var composeRefs = require('@reach/utils/compose-refs');
var useUpdateEffect = require('@reach/utils/use-update-effect');
var composeEventHandlers = require('@reach/utils/compose-event-handlers');
var autoId = require('@reach/auto-id');

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
var TabsDescendantsContext = /*#__PURE__*/descendants.createDescendantContext("TabsDescendantsContext");
var TabPanelDescendantsContext = /*#__PURE__*/descendants.createDescendantContext("TabPanelDescendantsContext");
var TabsContext = /*#__PURE__*/context.createNamedContext("TabsContext", {});


(function (TabsKeyboardActivation) {
  TabsKeyboardActivation["Auto"] = "auto";
  TabsKeyboardActivation["Manual"] = "manual";
})(exports.TabsKeyboardActivation || (exports.TabsKeyboardActivation = {}));

 ////////////////////////////////////////////////////////////////////////////////

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
})(exports.TabsOrientation || (exports.TabsOrientation = {}));

var Tabs = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var _props$id;

  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? "div" : _ref$as,
      children = _ref.children,
      defaultIndex = _ref.defaultIndex,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? exports.TabsOrientation.Horizontal : _ref$orientation,
      _ref$index = _ref.index,
      controlledIndex = _ref$index === void 0 ? undefined : _ref$index,
      _ref$keyboardActivati = _ref.keyboardActivation,
      keyboardActivation = _ref$keyboardActivati === void 0 ? exports.TabsKeyboardActivation.Auto : _ref$keyboardActivati,
      onChange = _ref.onChange,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? false : _ref$readOnly,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var isControlled = React.useRef(controlledIndex != null);
  devUtils.useControlledSwitchWarning(controlledIndex, "index", "Tabs");

  var _id = autoId.useId(props.id);

  var id = (_props$id = props.id) != null ? _props$id : makeId.makeId("tabs", _id); // We only manage focus if the user caused the update vs. a new controlled
  // index coming in.

  var userInteractedRef = React.useRef(false);
  var selectedPanelRef = React.useRef(null);
  var isRTL = React.useRef(false);

  var _useControlledState = useControlledState.useControlledState(controlledIndex, defaultIndex != null ? defaultIndex : 0),
      selectedIndex = _useControlledState[0],
      setSelectedIndex = _useControlledState[1];

  var _React$useState = React.useState(-1),
      focusedIndex = _React$useState[0],
      setFocusedIndex = _React$useState[1];

  var _useDescendantsInit = descendants.useDescendantsInit(),
      tabs = _useDescendantsInit[0],
      setTabs = _useDescendantsInit[1];

  var context = React.useMemo(function () {
    return {
      focusedIndex: focusedIndex,
      id: id,
      isControlled: isControlled.current,
      isRTL: isRTL,
      keyboardActivation: keyboardActivation,
      onFocusPanel: function onFocusPanel() {
        if (selectedPanelRef.current && typeCheck.isFunction(selectedPanelRef.current.focus)) {
          selectedPanelRef.current.focus();
        }
      },
      onSelectTab: readOnly ? noop.noop : function (index) {
        userInteractedRef.current = true;
        onChange && onChange(index);
        setSelectedIndex(index);
      },
      onSelectTabWithKeyboard: readOnly ? noop.noop : function (index) {
        var _tabs$index;

        userInteractedRef.current = true;

        switch (keyboardActivation) {
          case exports.TabsKeyboardActivation.Manual:
            var tabElement = (_tabs$index = tabs[index]) == null ? void 0 : _tabs$index.element;

            if (tabElement && typeCheck.isFunction(tabElement.focus)) {
              tabElement.focus();
            }

            return;

          case exports.TabsKeyboardActivation.Auto:
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
  devUtils.useCheckStyles("tabs");
  return /*#__PURE__*/React.createElement(descendants.DescendantProvider, {
    context: TabsDescendantsContext,
    items: tabs,
    set: setTabs
  }, /*#__PURE__*/React.createElement(TabsContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-tabs": "",
    "data-orientation": orientation,
    id: props.id
  }), typeCheck.isFunction(children) ? children({
    focusedIndex: focusedIndex,
    id: id,
    selectedIndex: selectedIndex
  }) : children)));
});

/**
 * TabList
 *
 * The parent component of the tabs.
 *
 * @see Docs https://reach.tech/tabs#tablist
 */


var TabListImpl = /*#__PURE__*/React.forwardRef(function (_ref2, forwardedRef) {
  var children = _ref2.children,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "div" : _ref2$as,
      onKeyDown = _ref2.onKeyDown,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _React$useContext = React.useContext(TabsContext),
      focusedIndex = _React$useContext.focusedIndex,
      isControlled = _React$useContext.isControlled,
      isRTL = _React$useContext.isRTL,
      keyboardActivation = _React$useContext.keyboardActivation,
      onSelectTabWithKeyboard = _React$useContext.onSelectTabWithKeyboard,
      orientation = _React$useContext.orientation,
      selectedIndex = _React$useContext.selectedIndex,
      setSelectedIndex = _React$useContext.setSelectedIndex;

  var tabs = descendants.useDescendants(TabsDescendantsContext);
  var ownRef = React.useRef(null);
  var ref = composeRefs.useComposedRefs(forwardedRef, ownRef);
  React.useEffect(function () {
    if (ownRef.current && (ownRef.current.ownerDocument && ownRef.current.ownerDocument.dir === "rtl" || computedStyles.getComputedStyle(ownRef.current, "direction") === "rtl")) {
      isRTL.current = true;
    }
  }, [isRTL]);
  var handleKeyDown = composeEventHandlers.composeEventHandlers(onKeyDown, descendants.useDescendantKeyDown(TabsDescendantsContext, {
    currentIndex: keyboardActivation === exports.TabsKeyboardActivation.Manual ? focusedIndex : selectedIndex,
    orientation: orientation,
    rotate: true,
    callback: onSelectTabWithKeyboard,
    filter: function filter(tab) {
      return !tab.disabled;
    },
    rtl: isRTL.current
  }));
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(function () {
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
  return /*#__PURE__*/React.createElement(Comp // The element that serves as the container for the set of tabs has role
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
  }), React.Children.map(children, function (child, index) {
    // TODO: Remove in 1.0
    return cloneValidElement.cloneValidElement(child, {
      isSelected: index === selectedIndex
    });
  }));
});

var TabList = /*#__PURE__*/React.memo(TabListImpl);

/**
 * Tab
 *
 * The interactive element that changes the selected panel.
 *
 * @see Docs https://reach.tech/tabs#tab
 */


var Tab = /*#__PURE__*/React.forwardRef(function (_ref3, forwardedRef) {
  _ref3.isSelected;
      var children = _ref3.children,
      _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "button" : _ref3$as,
      indexProp = _ref3.index,
      disabled = _ref3.disabled,
      onBlur = _ref3.onBlur,
      onFocus = _ref3.onFocus,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _React$useContext2 = React.useContext(TabsContext),
      tabsId = _React$useContext2.id,
      onSelectTab = _React$useContext2.onSelectTab,
      orientation = _React$useContext2.orientation,
      selectedIndex = _React$useContext2.selectedIndex,
      userInteractedRef = _React$useContext2.userInteractedRef,
      setFocusedIndex = _React$useContext2.setFocusedIndex;

  var ownRef = React.useRef(null);

  var _useStatefulRefValue = useStatefulRefValue.useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue[0],
      handleRefSet = _useStatefulRefValue[1];

  var ref = composeRefs.useComposedRefs(forwardedRef, handleRefSet);
  var descendant = React.useMemo(function () {
    return {
      element: element,
      disabled: !!disabled
    };
  }, [disabled, element]);
  var index = descendants.useDescendant(descendant, TabsDescendantsContext, indexProp);
  var htmlType = Comp === "button" && props.type == null ? "button" : props.type;
  var isSelected = index === selectedIndex;

  function onSelect() {
    onSelectTab(index);
  }

  useUpdateEffect.useUpdateEffect(function () {
    if (isSelected && ownRef.current && userInteractedRef.current) {
      userInteractedRef.current = false;

      if (typeCheck.isFunction(ownRef.current.focus)) {
        ownRef.current.focus();
      }
    }
  }, [isSelected, userInteractedRef]);
  return /*#__PURE__*/React.createElement(Comp // Each element with role `tab` has the property `aria-controls` referring
  // to its associated `tabpanel` element.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
  , _extends({
    "aria-controls": makeId.makeId(tabsId, "panel", index),
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
    id: makeId.makeId(tabsId, "tab", index),
    onClick: onSelect,
    onFocus: composeEventHandlers.composeEventHandlers(onFocus, function () {
      setFocusedIndex(index);
    }),
    onBlur: composeEventHandlers.composeEventHandlers(onBlur, function () {
      setFocusedIndex(-1);
    }),
    type: htmlType
  }), children);
});

/**
 * TabPanels
 *
 * The parent component of the panels.
 *
 * @see Docs https://reach.tech/tabs#tabpanels
 */


var TabPanelsImpl = /*#__PURE__*/React.forwardRef(function (_ref4, forwardedRef) {
  var children = _ref4.children,
      _ref4$as = _ref4.as,
      Comp = _ref4$as === void 0 ? "div" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  var ownRef = React.useRef();
  var ref = composeRefs.useComposedRefs(ownRef, forwardedRef);

  var _useDescendantsInit2 = descendants.useDescendantsInit(),
      tabPanels = _useDescendantsInit2[0],
      setTabPanels = _useDescendantsInit2[1];

  return /*#__PURE__*/React.createElement(descendants.DescendantProvider, {
    context: TabPanelDescendantsContext,
    items: tabPanels,
    set: setTabPanels
  }, /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    ref: ref,
    "data-reach-tab-panels": ""
  }), children));
});

var TabPanels = /*#__PURE__*/React.memo(TabPanelsImpl);

/**
 * TabPanel
 *
 * The panel that displays when it's corresponding tab is active.
 *
 * @see Docs https://reach.tech/tabs#tabpanel
 */


var TabPanel = /*#__PURE__*/React.forwardRef(function (_ref5, forwardedRef) {
  var children = _ref5.children;
      _ref5["aria-label"];
      var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "div" : _ref5$as,
      indexProp = _ref5.index,
      props = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  var _React$useContext3 = React.useContext(TabsContext),
      selectedPanelRef = _React$useContext3.selectedPanelRef,
      selectedIndex = _React$useContext3.selectedIndex,
      tabsId = _React$useContext3.id;

  var ownRef = React.useRef(null);

  var _useStatefulRefValue2 = useStatefulRefValue.useStatefulRefValue(ownRef, null),
      element = _useStatefulRefValue2[0],
      handleRefSet = _useStatefulRefValue2[1];

  var descendant = React.useMemo(function () {
    return {
      element: element
    };
  }, [element]);
  var index = descendants.useDescendant(descendant, TabPanelDescendantsContext, indexProp);
  var id = makeId.makeId(tabsId, "panel", index); // Because useDescendant will always return -1 on the first render,
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
  var readyToHide = React.useRef(false);
  var hidden = readyToHide.current ? !isSelected : false;
  React.useEffect(function () {
    readyToHide.current = true;
  }, []);
  var ref = composeRefs.useComposedRefs(forwardedRef, handleRefSet, isSelected ? selectedPanelRef : null);
  return /*#__PURE__*/React.createElement(Comp // Each element with role `tabpanel` has the property `aria-labelledby`
  // referring to its associated tab element.
  , _extends({
    "aria-labelledby": makeId.makeId(tabsId, "tab", index),
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
 * A hook that exposes data for a given `Tabs` component to its descendants.
 *
 * @see Docs https://reach.tech/tabs#usetabscontext
 */


function useTabsContext() {
  var _React$useContext4 = React.useContext(TabsContext),
      focusedIndex = _React$useContext4.focusedIndex,
      id = _React$useContext4.id,
      selectedIndex = _React$useContext4.selectedIndex;

  return React.useMemo(function () {
    return {
      focusedIndex: focusedIndex,
      id: id,
      selectedIndex: selectedIndex
    };
  }, [focusedIndex, id, selectedIndex]);
} ////////////////////////////////////////////////////////////////////////////////

function boolOrBoolString(value) {
  return value === "true" ? true : typeCheck.isBoolean(value) ? value : false;
}

exports.Tab = Tab;
exports.TabList = TabList;
exports.TabPanel = TabPanel;
exports.TabPanels = TabPanels;
exports.Tabs = Tabs;
exports.useTabsContext = useTabsContext;
