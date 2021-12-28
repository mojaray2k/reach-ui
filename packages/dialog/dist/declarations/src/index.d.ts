/**
 * Welcome to @reach/dialog!
 *
 * An accessible dialog or "modal" window.
 *
 * @see Docs     https://reach.tech/dialog
 * @see Source   https://github.com/reach/reach-ui/tree/main/packages/dialog
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_modal
 */
import * as React from "react";
import type * as Polymorphic from "@reach/utils/polymorphic";
/**
 * DialogOverlay
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog overlay.
 *
 * Note: You must render a `DialogContent` inside.
 *
 * @see Docs https://reach.tech/dialog#dialogoverlay
 */
declare const DialogOverlay: Polymorphic.ForwardRefComponent<"div", DialogOverlayProps>;
interface DialogOverlayProps extends DialogProps {
    /**
     * By default the dialog locks the focus inside it. Normally this is what you
     * want. This prop is provided so that this feature can be disabled. This,
     * however, is strongly discouraged.
     *
     * The reason it is provided is not to disable the focus lock entirely.
     * Rather, there are certain situations where you may need more control on how
     * the focus lock works. This should be complemented by setting up a focus
     * lock yourself that would allow more flexibility for your specific use case.
     *
     * If you do set this prop to `true`, make sure you set up your own
     * `FocusLock` component. You can likely use
     * `react-focus-lock`, which is what Reach uses internally by default. It has
     * various settings to allow more customization, but it takes care of a lot of
     * hard work that you probably don't want or need to do.
     *
     * @see Docs https://reach.tech/dialog#dialogoverlay-dangerouslybypassfocuslock
     * @see https://github.com/theKashey/react-focus-lock
     * @see https://github.com/reach/reach-ui/issues/615
     */
    dangerouslyBypassFocusLock?: boolean;
    /**
     * By default the dialog locks scrolling with `react-remove-scroll`, which
     * also injects some styles on the body element to remove the scrollbar while
     * maintaining its gap to prevent jank when the dialog's open state is
     * toggled. This is almost always what you want in a dialog, but in some cases
     * you may have the need to customize this behavior further.
     *
     * This prop will disable `react-remove-scroll` and allow you to compose your
     * own scroll lock component to meet your needs. Like the
     * `dangerouslyBypassFocusLock` prop, this is generally discouraged and should
     * only be used if a proper fallback for managing scroll behavior is provided.
     *
     * @see Docs https://reach.tech/dialog#dialogoverlay-dangerouslybypassscrolllock
     * @see https://github.com/theKashey/react-remove-scroll
     */
    dangerouslyBypassScrollLock?: boolean;
}
/**
 * DialogContent
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog content.
 *
 * Note: Must be a child of `DialogOverlay`.
 *
 * Note: You only need to use this when you are also styling `DialogOverlay`,
 * otherwise you can use the high-level `Dialog` component and pass the props
 * to it. Any props passed to `Dialog` component (besides `isOpen` and
 * `onDismiss`) will be spread onto `DialogContent`.
 *
 * @see Docs https://reach.tech/dialog#dialogcontent
 */
declare const DialogContent: Polymorphic.ForwardRefComponent<"div", DialogContentProps>;
/**
 * @see Docs https://reach.tech/dialog#dialogcontent-props
 */
interface DialogContentProps {
    /**
     * Accepts any renderable content.
     *
     * @see Docs https://reach.tech/dialog#dialogcontent-children
     */
    children?: React.ReactNode;
}
/**
 * Dialog
 *
 * High-level component to render a modal dialog window over the top of the page
 * (or another dialog).
 *
 * @see Docs https://reach.tech/dialog#dialog
 */
declare const Dialog: Polymorphic.ForwardRefComponent<"div", DialogProps>;
/**
 * @see Docs https://reach.tech/dialog#dialog-props
 */
interface DialogProps {
    /**
     * Handle zoom/pinch gestures on iOS devices when scroll locking is enabled.
     * Defaults to `false`.
     *
     * @see Docs https://reach.tech/dialog#dialog-allowpinchzoom
     */
    allowPinchZoom?: boolean;
    /**
     * Accepts any renderable content.
     *
     * @see Docs https://reach.tech/dialog#dialog-children
     */
    children?: React.ReactNode;
    /**
     * By default the first focusable element will receive focus when the dialog
     * opens but you can provide a ref to focus instead.
     *
     * @see Docs https://reach.tech/dialog#dialog-initialfocusref
     */
    initialFocusRef?: React.RefObject<any>;
    /**
     * Controls whether or not the dialog is open.
     *
     * @see Docs https://reach.tech/dialog#dialog-isopen
     */
    isOpen?: boolean;
    /**
     * This function is called whenever the user hits "Escape" or clicks outside
     * the dialog. _It's important to close the dialog `onDismiss`_.
     *
     * The only time you shouldn't close the dialog on dismiss is when the dialog
     * requires a choice and none of them are "cancel". For example, perhaps two
     * records need to be merged and the user needs to pick the surviving record.
     * Neither choice is less destructive than the other, so in these cases you
     * may want to alert the user they need to a make a choice on dismiss instead
     * of closing the dialog.
     *
     * @see Docs https://reach.tech/dialog#dialog-ondismiss
     */
    onDismiss?(event: React.MouseEvent | React.KeyboardEvent): void;
    /**
     * By default, React Focus Lock prevents focus from being moved outside of the
     * locked element even if the thing trying to take focus is in another frame.
     * Normally this is what you want, as an iframe is typically going to be a
     * part of your page content. But in some situations, like when using Code
     * Sandbox, you can't use any of the controls or the editor in the sandbox
     * while dialog is open because of the focus lock.
     *
     * This prop may have some negative side effects and unintended consequences,
     * and it opens questions about how we might distinguish frames that *should*
     * steal focus from those that shouldn't. Perhaps it's best for app devs to
     * decide, and if they use this prop we should advise them to imperatively
     * assign a -1 tabIndex to other iframes that are a part of the page content
     * when the dialog is open.
     *
     * https://github.com/reach/reach-ui/issues/536
     *
     * @deprecated
     */
    unstable_lockFocusAcrossFrames?: boolean;
}
export type { DialogContentProps, DialogOverlayProps, DialogProps };
export { Dialog, DialogContent, DialogOverlay };
export default Dialog;
