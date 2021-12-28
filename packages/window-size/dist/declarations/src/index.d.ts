/**
 * Measure the current window dimensions.
 *
 * @see Docs   https://reach.tech/window-size
 * @see Source https://github.com/reach/reach-ui/tree/main/packages/window-size
 */
import * as React from "react";
/**
 * WindowSize
 *
 * @see Docs https://reach.tech/window-size#windowsize
 * @param props
 */
declare const WindowSize: React.FC<WindowSizeProps>;
/**
 * @see Docs https://reach.tech/window-size#windowsize-props
 */
declare type WindowSizeProps = {
    /**
     * A function that calls back to you with the window size.
     *
     * @see Docs https://reach.tech/window-size#windowsize-children
     */
    children: (size: {
        width: number;
        height: number;
    }) => React.ReactElement<any, any>;
};
/**
 * useWindowSize
 *
 * @see Docs https://reach.tech/window-size#usewindowsize
 */
declare function useWindowSize(): {
    width: number;
    height: number;
};
declare type TWindowSize = {
    width: number;
    height: number;
};
export default WindowSize;
export type { TWindowSize, WindowSizeProps };
export { useWindowSize, WindowSize };
