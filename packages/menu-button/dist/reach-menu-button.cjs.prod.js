'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
require('tiny-warning');
var popover = require('@reach/popover');
var dropdown = require('@reach/dropdown');
var noop = require('@reach/utils/noop');
var devUtils = require('@reach/utils/dev-utils');
var reactIs = require('react-is');

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

var _excluded = ["as", "id", "children"],
    _excluded2 = ["as"],
    _excluded3 = ["as"],
    _excluded4 = ["as"],
    _excluded5 = ["as"],
    _excluded6 = ["as", "component", "onSelect"],
    _excluded7 = ["portal"],
    _excluded8 = ["as"];
////////////////////////////////////////////////////////////////////////////////

/**
 * Menu
 *
 * The wrapper component for the other components. No DOM element is rendered.
 *
 * @see Docs https://reach.tech/menu-button#menu
 */
var Menu = /*#__PURE__*/React.forwardRef(function (_ref, forwardedRef) {
  var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? React.Fragment : _ref$as,
      id = _ref.id,
      children = _ref.children,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);

  devUtils.useCheckStyles("menu-button");
  var parentIsFragment = React.useMemo(function () {
    try {
      // To test if the component renders a fragment we need to actually
      // render it, but this may throw an error since we can't predict what is
      // actually provided. There's technically a small chance that this could
      // get it wrong but I don't think it's too likely in practice.
      return reactIs.isFragment( /*#__PURE__*/React.createElement(Comp, null));
    } catch (err) {
      return false;
    }
  }, [Comp]);
  var props = parentIsFragment ? {} : _extends({
    ref: forwardedRef,
    id: id,
    "data-reach-menu": ""
  }, rest);
  return /*#__PURE__*/React.createElement(Comp, props, /*#__PURE__*/React.createElement(dropdown.DropdownProvider, {
    id: id,
    children: children
  }));
});

/**
 * MenuButton
 *
 * Wraps a DOM `button` that toggles the opening and closing of the dropdown
 * menu. Must be rendered inside of a `<Menu>`.
 *
 * @see Docs https://reach.tech/menu-button#menubutton
 */


var MenuButton = /*#__PURE__*/React.forwardRef(function (_ref2, forwardedRef) {
  var _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "button" : _ref2$as,
      rest = _objectWithoutPropertiesLoose(_ref2, _excluded2);

  var _useDropdownTrigger = dropdown.useDropdownTrigger(_extends({}, rest, {
    ref: forwardedRef
  })),
      _useDropdownTrigger$d = _useDropdownTrigger.data,
      isExpanded = _useDropdownTrigger$d.isExpanded,
      controls = _useDropdownTrigger$d.controls,
      props = _useDropdownTrigger.props;

  return /*#__PURE__*/React.createElement(Comp // When the menu is displayed, the element with role `button` has
  // `aria-expanded` set to `true`. When the menu is hidden, it is
  // recommended that `aria-expanded` is not present.
  // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
  , _extends({
    "aria-expanded": isExpanded ? true : undefined // The element with role `button` has `aria-haspopup` set to either
    // `"menu"` or `true`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
    ,
    "aria-haspopup": true // Optionally, the element with role `button` has a value specified for
    // `aria-controls` that refers to the element with role `menu`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
    ,
    "aria-controls": controls
  }, props, {
    "data-reach-menu-button": ""
  }));
});

/**
 * MenuItemImpl
 *
 * MenuItem and MenuLink share most of the same functionality captured here.
 */


var MenuItemImpl = /*#__PURE__*/React.forwardRef(function (_ref3, forwardedRef) {
  var _ref3$as = _ref3.as,
      Comp = _ref3$as === void 0 ? "div" : _ref3$as,
      rest = _objectWithoutPropertiesLoose(_ref3, _excluded3);

  var _useDropdownItem = dropdown.useDropdownItem(_extends({}, rest, {
    ref: forwardedRef
  })),
      disabled = _useDropdownItem.data.disabled,
      props = _useDropdownItem.props;

  return /*#__PURE__*/React.createElement(Comp, _extends({
    role: "menuitem"
  }, props, {
    "aria-disabled": disabled || undefined,
    "data-reach-menu-item": ""
  }));
});
////////////////////////////////////////////////////////////////////////////////

/**
 * MenuItem
 *
 * Handles menu selection. Must be a direct child of a `<MenuList>`.
 *
 * @see Docs https://reach.tech/menu-button#menuitem
 */
var MenuItem = /*#__PURE__*/React.forwardRef(function (_ref4, forwardedRef) {
  var _ref4$as = _ref4.as,
      as = _ref4$as === void 0 ? "div" : _ref4$as,
      props = _objectWithoutPropertiesLoose(_ref4, _excluded4);

  return /*#__PURE__*/React.createElement(MenuItemImpl, _extends({}, props, {
    ref: forwardedRef,
    as: as
  }));
});

/**
 * MenuItems
 *
 * A low-level wrapper for menu items. Compose it with `MenuPopover` for more
 * control over the nested components and their rendered DOM nodes, or if you
 * need to nest arbitrary components between the outer wrapper and your list.
 *
 * @see Docs https://reach.tech/menu-button#menuitems
 */


var MenuItems = /*#__PURE__*/React.forwardRef(function (_ref5, forwardedRef) {
  var _ref5$as = _ref5.as,
      Comp = _ref5$as === void 0 ? "div" : _ref5$as,
      rest = _objectWithoutPropertiesLoose(_ref5, _excluded5);

  var _useDropdownItems = dropdown.useDropdownItems(_extends({}, rest, {
    ref: forwardedRef
  })),
      _useDropdownItems$dat = _useDropdownItems.data,
      activeDescendant = _useDropdownItems$dat.activeDescendant,
      triggerId = _useDropdownItems$dat.triggerId,
      props = _useDropdownItems.props;

  return (
    /*#__PURE__*/
    // TODO: Should probably file a but in jsx-a11y, but this is correct
    // according to https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
    // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
    React.createElement(Comp // Refers to the descendant menuitem element that is visually indicated
    // as focused.
    // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
    , _extends({
      "aria-activedescendant": activeDescendant // Refers to the element that contains the accessible name for the
      // `menu`. The menu is labeled by the menu button.
      // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
      ,
      "aria-labelledby": triggerId || undefined // The element that contains the menu items displayed by activating the
      // button has role menu.
      // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
      ,
      role: "menu"
    }, props, {
      "data-reach-menu-items": ""
    }))
  );
});

/**
 * MenuLink
 *
 * Handles linking to a different page in the menu. By default it renders `<a>`,
 * but also accepts any other kind of Link as long as the `Link` uses the
 * `React.forwardRef` API.
 *
 * Must be a direct child of a `<MenuList>`.
 *
 * @see Docs https://reach.tech/menu-button#menulink
 */


var MenuLink = /*#__PURE__*/React.forwardRef(function (_ref6, forwardedRef) {
  var _ref6$as = _ref6.as,
      as = _ref6$as === void 0 ? "a" : _ref6$as;
      _ref6.component;
      var onSelect = _ref6.onSelect,
      props = _objectWithoutPropertiesLoose(_ref6, _excluded6);
  return /*#__PURE__*/React.createElement(MenuItemImpl, _extends({}, props, {
    ref: forwardedRef,
    "data-reach-menu-link": "",
    as: as,
    isLink: true,
    onSelect: onSelect || noop.noop
  }));
});

/**
 * MenuList
 *
 * Wraps a DOM element that renders the menu items. Must be rendered inside of
 * a `<Menu>`.
 *
 * @see Docs https://reach.tech/menu-button#menulist
 */


var MenuList = /*#__PURE__*/React.forwardRef(function (_ref7, forwardedRef) {
  var _ref7$portal = _ref7.portal,
      portal = _ref7$portal === void 0 ? true : _ref7$portal,
      props = _objectWithoutPropertiesLoose(_ref7, _excluded7);

  return /*#__PURE__*/React.createElement(MenuPopover, {
    portal: portal
  }, /*#__PURE__*/React.createElement(MenuItems, _extends({}, props, {
    ref: forwardedRef,
    "data-reach-menu-list": ""
  })));
});

/**
 * MenuPopover
 *
 * A low-level wrapper for the popover that appears when a menu button is open.
 * You can compose it with `MenuItems` for more control over the nested
 * components and their rendered DOM nodes, or if you need to nest arbitrary
 * components between the outer wrapper and your list.
 *
 * @see Docs https://reach.tech/menu-button#menupopover
 */


var MenuPopover = /*#__PURE__*/React.forwardRef(function (_ref8, forwardedRef) {
  var _ref8$as = _ref8.as,
      Comp = _ref8$as === void 0 ? "div" : _ref8$as,
      rest = _objectWithoutPropertiesLoose(_ref8, _excluded8);

  var _useDropdownPopover = dropdown.useDropdownPopover(_extends({}, rest, {
    ref: forwardedRef
  })),
      _useDropdownPopover$d = _useDropdownPopover.data,
      portal = _useDropdownPopover$d.portal,
      targetRef = _useDropdownPopover$d.targetRef,
      position = _useDropdownPopover$d.position,
      props = _useDropdownPopover.props;

  var sharedProps = {
    "data-reach-menu-popover": ""
  };
  return portal ? /*#__PURE__*/React.createElement(popover.Popover, _extends({}, props, sharedProps, {
    as: Comp,
    targetRef: targetRef,
    position: position
  })) : /*#__PURE__*/React.createElement(Comp, _extends({}, props, sharedProps));
});

/**
 * A hook that exposes data for a given `Menu` component to its descendants.
 *
 * @see Docs https://reach.tech/menu-button#usemenubuttoncontext
 */


function useMenuButtonContext() {
  var _useDropdownContext = dropdown.useDropdownContext(),
      isExpanded = _useDropdownContext.state.isExpanded;

  return React.useMemo(function () {
    return {
      isExpanded: isExpanded
    };
  }, [isExpanded]);
} ////////////////////////////////////////////////////////////////////////////////

exports.Menu = Menu;
exports.MenuButton = MenuButton;
exports.MenuItem = MenuItem;
exports.MenuItems = MenuItems;
exports.MenuLink = MenuLink;
exports.MenuList = MenuList;
exports.MenuPopover = MenuPopover;
exports.useMenuButtonContext = useMenuButtonContext;
