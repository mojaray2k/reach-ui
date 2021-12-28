/**
 * A MixedCheckbox simply renders an HTML input element where type="checked".
 * Whereas the native element technically only has two states, there is a third
 * visual state of `indeterminate` that is designed to suggest that a user has
 * fulfilled some part of whatever the checkbox is meant to control. For
 * example, you may have  multiple checkboxes nested in a hierarchy like a
 * checklist that looks like:
 *
 *   [-] All fruits
 *     [ ] Apple
 *     [x] Banana
 *     [x] Orange
 *
 * The `All fruits` checkbox is in an indeterminate state because some (but not
 * all) fruits in the list are checked. While this effect is possible with plain
 * input components, the MixedCheckbox component makes managing/syncing its
 * state with the correct DOM attributes much simpler.
 *
 * A mixed checkbox is not something you can naturally toggle by simply clicking
 * the box itself. As such, you should manage its state in your app by passing a
 * `checked` prop and an `onChange` handler.
 *
 * If you don't need an indeterminate state, you should probably just use a
 * native HTML input for your checkboxes. But of course, sometimes designers
 * have some other ideas that call for a custom solution. In that case, the
 * @reach/checkbox/custom package provides a customizable wrapper element that
 * can be styled to fit your needs.
 *
 * @see Docs     https://reach.tech/checkbox#mixedcheckbox
 * @see Source   https://github.com/reach/reach-ui/tree/main/packages/checkbox/src/mixed
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#checkbox
 */
import * as React from "react";
import type * as Polymorphic from "@reach/utils/polymorphic";
declare enum MixedCheckboxStates {
    Checked = "checked",
    Mixed = "mixed",
    Unchecked = "unchecked"
}
declare enum MixedCheckboxEvents {
    GetDerivedData = "GET_DERIVED_DATA",
    Mount = "MOUNT",
    Set = "SET",
    Toggle = "TOGGLE",
    Unmount = "UNMOUNT"
}
/**
 * MixedCheckbox
 *
 * Tri-state checkbox that accepts `checked` values of `true`, `false` or
 * `"mixed"`.
 *
 * @see Docs https://reach.tech/checkbox#mixedcheckbox-1
 */
declare const MixedCheckbox: Polymorphic.ForwardRefComponent<"input", MixedCheckboxProps>;
interface MixedCheckboxProps {
    /**
     * Whether or not the checkbox is checked or in a `mixed` (indeterminate)
     * state.
     */
    checked?: MixedOrBool;
    onChange?: React.ComponentProps<"input">["onChange"];
}
declare type MixedCheckboxArgs = {
    checked?: MixedOrBool;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
};
declare type UseMixedCheckboxProps = Required<Pick<React.ComponentProps<"input">, "checked" | "disabled" | "onChange" | "onClick" | "type">> & {
    "aria-checked": MixedOrBool;
};
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
declare function useMixedCheckbox(ref: MixedCheckboxInputRef, args?: MixedCheckboxArgs, functionOrComponentName?: string): [UseMixedCheckboxProps, {
    checked: MixedOrBool;
}];
declare function checkedPropToStateValue(checked?: MixedOrBool): MixedCheckboxStates;
declare function useControlledSwitchWarning(controlPropValue: any, controlPropName: string, componentName: string): void;
declare type MixedOrBool = boolean | "mixed";
/**
 * DOM nodes for all of the refs used in the mixed checkbox state machine.
 */
declare type MixedCheckboxNodeRefs = {
    input: HTMLInputElement | null;
};
/**
 * Input element ref object.
 */
declare type MixedCheckboxInputRef = React.RefObject<MixedCheckboxNodeRefs["input"]>;
export type { MixedCheckboxProps, MixedOrBool, UseMixedCheckboxProps };
export { MixedCheckbox, MixedCheckboxEvents, MixedCheckboxStates, useMixedCheckbox, checkedPropToStateValue as internal_checkedPropToStateValue, useControlledSwitchWarning as internal_useControlledSwitchWarning, };
