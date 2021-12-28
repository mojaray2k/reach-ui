/**
 * Welcome to @reach/slider!
 *
 * A UI input component where the user selects a value from within a given
 * range. A Slider has a handle that can be moved along a track to change its
 * value. When the user's mouse or focus is on the Slider's handle, the value
 * can be incremented with keyboard controls.
 *
 * Random thoughts/notes:
 *  - Currently testing this against the behavior of the native input range
 *    element to get our slider on par. We'll explore animated and multi-handle
 *    sliders next.
 *  - We may want to research some use cases for reversed sliders in RTL
 *    languages if that's a thing
 *
 * @see Docs     https://reach.tech/slider
 * @see Source   https://github.com/reach/reach-ui/tree/main/packages/slider
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#slider
 * @see Example  https://github.com/Stanko/aria-progress-range-slider
 * @see Example  http://www.oaa-accessibility.org/examplep/slider1/
 */
import * as React from "react";
import type * as Polymorphic from "@reach/utils/polymorphic";
declare type SliderAlignment = "center" | "contain";
declare enum SliderOrientation {
    Horizontal = "horizontal",
    Vertical = "vertical"
}
declare enum SliderHandleAlignment {
    Center = "center",
    Contain = "contain"
}
declare const SLIDER_ORIENTATION_HORIZONTAL = SliderOrientation.Horizontal;
declare const SLIDER_ORIENTATION_VERTICAL = SliderOrientation.Vertical;
declare const SLIDER_HANDLE_ALIGN_CENTER = SliderHandleAlignment.Center;
declare const SLIDER_HANDLE_ALIGN_CONTAIN = SliderHandleAlignment.Contain;
/**
 * Slider
 *
 * @see Docs https://reach.tech/slider#slider
 */
declare const Slider: Polymorphic.ForwardRefComponent<"div", SliderProps>;
/**
 * @see Docs https://reach.tech/slider#slider-props
 */
interface SliderProps {
    /**
     * `Slider` can accept `SliderMarker` children to enhance display of specific
     * values along the track.
     *
     * @see Docs https://reach.tech/slider#slider-children
     */
    children?: React.ReactNode;
    /**
     * The defaultValue is used to set an initial value for an uncontrolled
     * Slider.
     *
     * @see Docs https://reach.tech/slider#slider-defaultvalue
     */
    defaultValue?: number;
    /**
     * @see Docs https://reach.tech/slider#slider-disabled
     */
    disabled?: boolean;
    /**
     * Whether or not the slider should be disabled from user interaction.
     *
     * @see Docs https://reach.tech/slider#slider-value
     */
    value?: number;
    /**
     * A function used to set a human-readable name for the slider.
     *
     * @see Docs https://reach.tech/slider#slider-getarialabel
     */
    getAriaLabel?(value: number): string;
    /**
     * A function used to set a human-readable value text based on the slider's
     * current value.
     *
     * @see Docs https://reach.tech/slider#slider-getariavaluetext
     */
    getAriaValueText?(value: number): string;
    /**
     * Deprecated. Use `getAriaValueText` instead.
     *
     * @deprecated
     * @param value
     */
    getValueText?(value: number): string;
    /**
     * When set to `center`, the slider's handle will be positioned directly
     * centered over the slider's curremt value on the track. This means that when
     * the slider is at its min or max value, a visiable slider handle will extend
     * beyond the width (or height in vertical mode) of the slider track. When set
     * to `contain`, the slider handle will always be contained within the bounds
     * of the track, meaning its position will be slightly offset from the actual
     * value depending on where it sits on the track.
     *
     * @see Docs https://reach.tech/slider#slider-handlealignment
     */
    handleAlignment?: "center" | "contain" | SliderAlignment;
    /**
     * The maximum value of the slider. Defaults to `100`.
     *
     * @see Docs https://reach.tech/slider#slider-max
     */
    max?: number;
    /**
     * The minimum value of the slider. Defaults to `0`.
     *
     * @see Docs https://reach.tech/slider#slider-min
     */
    min?: number;
    /**
     * If the slider is used as a form input, it should accept a `name` prop to
     * identify its value in context of the form.
     *
     * @see Docs https://reach.tech/slider#slider-name
     */
    name?: string;
    /**
     * Callback that fires when the slider value changes. When the `value` prop is
     * set, the Slider state becomes controlled and `onChange` must be used to
     * update the value in response to user interaction.
     *
     * @see Docs https://reach.tech/slider#slider-onchange
     */
    onChange?(newValue: number, props?: {
        min?: number;
        max?: number;
        handlePosition?: string;
    }): void;
    onMouseDown?(event: MouseEvent): void;
    onMouseMove?(event: MouseEvent): void;
    onMouseUp?(event: MouseEvent): void;
    onPointerDown?(event: PointerEvent): void;
    onPointerUp?(event: PointerEvent): void;
    onTouchEnd?(event: TouchEvent): void;
    onTouchMove?(event: TouchEvent): void;
    onTouchStart?(event: TouchEvent): void;
    /**
     * Sets the slider to horizontal or vertical mode.
     *
     * @see Docs https://reach.tech/slider#slider-orientation
     */
    orientation?: SliderOrientation;
    /**
     * The step attribute is a number that specifies the granularity that the
     * value must adhere to as it changes. Step sets minimum intervals of change,
     * creating a "snap" effect when the handle is moved along the track.
     *
     * @see Docs https://reach.tech/slider#slider-step
     */
    step?: number;
}
/**
 * SliderInput
 *
 * The parent component of the slider interface. This is a lower level component
 * if you need more control over styles or rendering the slider's inner
 * components.
 *
 * @see Docs https://reach.tech/slider#sliderinput
 */
declare const SliderInput: Polymorphic.ForwardRefComponent<"div", Omit<SliderProps, "children"> & {
    /**
     * Slider expects `<SliderTrack>` as its child; The track will accept all
     * additional slider sub-components as children. It can also accept a
     * function/render prop as its child to expose some of its internal state
     * variables.
     *
     * @see Docs https://reach.tech/slider#sliderinput-children
     */
    children: React.ReactNode | SliderChildrenRender;
} & {
    __componentName?: string | undefined;
}>;
/**
 * @see Docs https://reach.tech/slider#sliderinput-props
 */
declare type SliderInputProps = Omit<SliderProps, "children"> & {
    /**
     * Slider expects `<SliderTrack>` as its child; The track will accept all
     * additional slider sub-components as children. It can also accept a
     * function/render prop as its child to expose some of its internal state
     * variables.
     *
     * @see Docs https://reach.tech/slider#sliderinput-children
     */
    children: React.ReactNode | SliderChildrenRender;
};
declare const SliderTrack: Polymorphic.MemoComponent<"div", SliderTrackProps>;
/**
 * @see Docs https://reach.tech/slider#slidertrack-props
 */
interface SliderTrackProps {
    /**
     * `SliderTrack` expects `<SliderHandle>`, at minimum, for the Slider to
     * function. All other Slider subcomponents should be passed as children
     * inside the `SliderTrack`.
     *
     * @see Docs https://reach.tech/slider#slidertrack-children
     */
    children: React.ReactNode;
}
declare const SliderRange: Polymorphic.MemoComponent<"div", SliderRangeProps>;
export interface SliderTrackHighlightProps extends SliderRangeProps {
}
/**
 * This component was renamed to `SliderRange` in a previous version of Reach
 * UI. `SliderTrackHighlight` will be dropped in a future version. We recommend
 * updating your projects to replace `SliderTrackHighlight` with `SliderRange`.
 *
 * @alias SliderRange
 */
export declare const SliderTrackHighlight: Polymorphic.MemoComponent<"div", SliderRangeProps>;
/**
 * `SliderRange` accepts any props that a HTML div component accepts.
 * `SliderRange` will not accept or render any children.
 *
 * @see Docs https://reach.tech/slider#sliderrange-props
 */
interface SliderRangeProps {
}
declare const SliderHandle: Polymorphic.MemoComponent<"div", SliderHandleProps>;
/**
 * `SliderRange` accepts any props that a HTML div component accepts.
 *
 * @see Docs https://reach.tech/slider#sliderhandle-props
 */
interface SliderHandleProps {
}
declare const SliderMarker: Polymorphic.MemoComponent<"div", SliderMarkerProps>;
/**
 * @see Docs https://reach.tech/slider#slidermarker-props
 */
interface SliderMarkerProps {
    /**
     * The value to denote where the marker should appear along the track.
     *
     * @see Docs https://reach.tech/slider#slidermarker-value
     */
    value: number;
}
declare type SliderChildrenRender = (props: {
    ariaValueText?: string | undefined;
    hasFocus?: boolean;
    id?: string | undefined;
    sliderId?: string | undefined;
    max?: number;
    min?: number;
    value?: number;
    valueText?: string | undefined;
}) => JSX.Element;
export default Slider;
export type { SliderAlignment, SliderHandleProps, SliderInputProps, SliderMarkerProps, SliderProps, SliderRangeProps, SliderTrackProps, };
export { Slider, SliderHandle, SliderHandleAlignment, SliderInput, SliderMarker, SliderOrientation, SliderTrack, SliderRange, SLIDER_HANDLE_ALIGN_CENTER, SLIDER_HANDLE_ALIGN_CONTAIN, SLIDER_ORIENTATION_HORIZONTAL, SLIDER_ORIENTATION_VERTICAL, };
