/**
 * Welcome to @reach/rect!
 *
 * Measures DOM elements (aka. bounding client rect).
 *
 * @see getBoundingClientRect https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 * @see Docs                  https://reach.tech/rect
 * @see Source                https://github.com/reach/reach-ui/tree/main/packages/rect
 */
import * as React from "react";
/**
 * Rect
 *
 * @param props
 */
declare const Rect: React.FC<RectProps>;
/**
 * @see Docs https://reach.tech/rect#rect-props
 */
declare type RectProps = UseRectOptions & {
    /**
     * A function that calls back to you with a `ref` to place on an element and
     * the `rect` measurements of the dom node.
     *
     * **Note**: On the first render `rect` will be `undefined` because we can't
     * measure a node that has not yet been rendered. Make sure your code accounts
     * for this.
     *
     * @see Docs https://reach.tech/rect#rect-onchange
     */
    children(args: {
        rect: PRect | null;
        ref: React.RefObject<any>;
    }): JSX.Element;
};
declare function useRect<T extends Element = HTMLElement>(nodeRef: React.RefObject<T | undefined | null>, options?: UseRectOptions): null | DOMRect;
declare function useRect<T extends Element = HTMLElement>(nodeRef: React.RefObject<T | undefined | null>, observe?: UseRectOptions["observe"], onChange?: UseRectOptions["onChange"]): null | DOMRect;
/**
 * @see Docs https://reach.tech/rect#userect
 */
declare type UseRectOptions = {
    /**
     * Tells `Rect` to observe the position of the node or not. While observing,
     * the `children` render prop may call back very quickly (especially while
     * scrolling) so it can be important for performance to avoid observing when
     * you don't need to.
     *
     * This is typically used for elements that pop over other elements (like a
     * dropdown menu), so you don't need to observe all the time, only when the
     * popup is active.
     *
     * Pass `true` to observe, `false` to ignore.
     *
     * @see Docs https://reach.tech/rect#userect-observe
     */
    observe?: boolean;
    /**
     * Calls back whenever the `rect` of the element changes.
     *
     * @see Docs https://reach.tech/rect#userect-onchange
     */
    onChange?: (rect: PRect) => void;
};
declare type PRect = Partial<DOMRect> & {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
};
export default Rect;
export type { PRect, UseRectOptions, RectProps };
export { Rect, useRect };
