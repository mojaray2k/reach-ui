/**
 * Welcome to @reach/alert-dialog!
 *
 * A modal dialog that interrupts the user's workflow to get a response, usually
 * some sort of confirmation. This is different than a typical Dialog in that it
 * requires some user response, like "Save", or "Cancel", etc.
 *
 * Most of the time you'll use `AlertDialog`, `AlertDialogLabel`, and
 * `AlertDialogDescription` together. If you need more control over the styling
 * of the modal you can drop down a level and use `AlertDialogOverlay` and
 * `AlertDialogContent` instead of `AlertDialog`.
 *
 * When a Dialog opens, the _least destructive_ action should be focused so that
 * if a user accidentally hits enter when the dialog opens no damage is done.
 * This is accomplished with the `leastDestructiveRef` prop.
 *
 * Every dialog must render an `AlertDialogLabel` so the screen reader knows
 * what to say about the dialog. If an `AlertDialogDescription` is also
 * rendered, the screen reader will also announce that. If you render more than
 * these two elements and some buttons, the screen reader might not announce it
 * so it's important to keep the content inside of `AlertDialogLabel` and
 * `AlertDialogDescription`.
 *
 * This is built on top of [Dialog](/dialog), so `AlertDialog` spreads its props
 * and renders a `Dialog`, same for `AlertDialogOverlay` to `DialogOverlay`, and
 * `AlertDialogContent` to `DialogContent`.
 *
 * @see Docs     https://reach.tech/alert-dialog
 * @see Source https://github.com/reach/reach-ui/tree/main/packages/alert-dialog
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#alertdialog
 */
import * as React from "react";
import type * as Polymorphic from "@reach/utils/polymorphic";
import type { DialogProps, DialogContentProps } from "@reach/dialog";
/**
 * AlertDialogOverlay
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog overlay. In the following example we use the AlertDialogOverlay
 * and AlertDialogContent to have more control over the styles.
 *
 * Note: You must render an `AlertDialogContent` inside.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogoverlay
 */
declare const AlertDialogOverlay: Polymorphic.ForwardRefComponent<"div", AlertDialogProps>;
/**
 * AlertDialogContent
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog content.
 *
 * Note: Must be a child of `AlertDialogOverlay`.
 *
 * Note: You only need to use this when you are also styling
 * `AlertDialogOverlay`, otherwise you can use the high-level `AlertDialog`
 * component and pass the props to it.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogcontent
 */
declare const AlertDialogContent: Polymorphic.ForwardRefComponent<"div", AlertDialogContentProps>;
/**
 * @see Docs https://reach.tech/alert-dialog#alertdialogcontent-props
 */
interface AlertDialogContentProps extends DialogContentProps {
    /**
     * Accepts any renderable content but should generally be restricted to
     * `AlertDialogLabel`, `AlertDialogDescription` and action buttons, other
     * content might not be announced to the user by the screen reader.
     *
     * @see Docs https://reach.tech/alert-dialog#alertdialogcontent-children
     */
    children: React.ReactNode;
}
/**
 * AlertDialogLabel
 *
 * The first thing ready by screen readers when the dialog opens, usually the
 * title of the dialog like "Warning!" or "Please confirm!".
 *
 * This is required. The `AlertDialog` will throw an error if no label is
 * rendered.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialoglabel
 */
declare const AlertDialogLabel: Polymorphic.ForwardRefComponent<"div", AlertDialogLabelProps>;
interface AlertDialogLabelProps {
}
/**
 * AlertDialogDescription
 *
 * Additional content read by screen readers, usually a longer description
 * about what you need from the user like "This action is permanent, are you
 * sure?" etc.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialogdescription
 * @param props
 */
declare const AlertDialogDescription: Polymorphic.ForwardRefComponent<"div", AlertDialogDescriptionProps>;
interface AlertDialogDescriptionProps {
}
/**
 * AlertDialog
 *
 * High-level component to render an alert dialog.
 *
 * @see Docs https://reach.tech/alert-dialog#alertdialog
 * @param props
 */
declare const AlertDialog: Polymorphic.ForwardRefComponent<"div", AlertDialogProps>;
/**
 * @see Docs https://reach.tech/alert-dialog#alertdialog-props
 */
interface AlertDialogProps extends DialogProps {
    id?: string;
    /**
     * Controls whether the dialog is open or not.
     *
     * @see Docs: https://reach.tech/alert-dialog#alertdialog-isopen
     */
    isOpen?: boolean;
    /**
     * When the user clicks outside the modal or hits the escape key,
     * this function will be called. If you want the modal to close,
     * you’ll need to set state.
     *
     * @see Docs: https://reach.tech/alert-dialog#alertdialog-ondismiss
     */
    onDismiss?(event: React.MouseEvent | React.KeyboardEvent): void;
    /**
     * To prevent accidental data loss, an alert dialog should focus the least
     * destructive action button when it opens.
     *
     * @see Docs: https://reach.tech/alert-dialog#alertdialog-leastdestructiveref
     */
    leastDestructiveRef?: React.RefObject<HTMLElement>;
    /**
     * Accepts any renderable content but should generally be restricted to
     * `AlertDialogLabel`, `AlertDialogDescription` and action buttons, other
     * content might not be announced to the user by the screen reader.
     *
     * @see Docs: https://reach.tech/alert-dialog#alertdialog-children
     */
    children: React.ReactNode;
}
export type { AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogLabelProps, AlertDialogProps, };
export { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogLabel, AlertDialogOverlay, };
