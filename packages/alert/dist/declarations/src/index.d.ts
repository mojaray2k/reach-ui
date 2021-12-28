/**
 * Welcome to @reach/alert!
 *
 * An alert is an element that displays a brief, important message in a way that
 * attracts the user's attention without interrupting the user's task.
 * Dynamically rendered alerts are automatically announced by most screen
 * readers, and in some operating systems, they may trigger an alert sound.
 *
 * The approach here is to allow developers to render a visual <Alert> and then
 * we mirror that to a couple of aria-live regions behind the scenes. This way,
 * most of the time, developers don't have to think about visual vs. aria
 * alerts.
 *
 * Limitations: Developers can't read from context inside of an Alert because
 * we aren't using ReactDOM.createPortal(), we're actually creating a couple of
 * brand new React roots. We could use createPortal but then apps would need to
 * render the entire app tree in an <AlertProvider>, or maybe there's a way
 * with default context to do it, but we haven't explored that yet. So, we'll
 * see how this goes. If it becomes a problem we can introduce a portal later.
 *
 * @see Docs     https://reach.tech/alert
 * @see Source   https://github.com/reach/reach-ui/tree/main/packages/alert
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#alert
 */
import * as React from "react";
import type * as Polymorphic from "@reach/utils/polymorphic";
/**
 * Alert
 *
 * Screen-reader-friendly alert messages. In many apps developers add "alert"
 * messages when network events or other things happen. Users with assistive
 * technologies may not know about the message unless you develop for it.
 *
 * @see Docs https://reach.tech/alert
 */
declare const Alert: Polymorphic.ForwardRefComponent<"div", AlertProps>;
/**
 * @see Docs https://reach.tech/alert#alert-props
 */
interface AlertProps {
    /**
     * Controls whether the assistive technology should read immediately
     * ("assertive") or wait until the user is idle ("polite").
     *
     * @see Docs https://reach.tech/alert#alert-type
     */
    type?: "assertive" | "polite";
    children: React.ReactNode;
}
export type { AlertProps };
export { Alert };
export default Alert;
