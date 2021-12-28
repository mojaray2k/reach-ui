import * as React from "react";
declare function createDescendantContext<DescendantType extends Descendant>(name: string, initialValue?: {}): React.Context<DescendantContextValue<DescendantType>>;
/**
 * This hook registers our descendant by passing it into an array. We can then
 * search that array by to find its index when registering it in the component.
 * We use this for focus management, keyboard navigation, and typeahead
 * functionality for some components.
 *
 * The hook accepts the element node and (optionally) a key. The key is useful
 * if multiple descendants have identical text values and we need to
 * differentiate siblings for some reason.
 *
 * Our main goals with this are:
 *   1) maximum composability,
 *   2) minimal API friction
 *   3) SSR compatibility*
 *   4) concurrent safe
 *   5) index always up-to-date with the tree despite changes
 *   6) works with memoization of any component in the tree (hopefully)
 *
 * As for SSR, the good news is that we don't actually need the index on the
 * server for most use-cases, as we are only using it to determine the order of
 * composed descendants for keyboard navigation. However, in the few cases where
 * this is not the case, we can require an explicit index from the app.
 */
declare function useDescendant<DescendantType extends Descendant>(descendant: Omit<DescendantType, "index">, context: React.Context<DescendantContextValue<DescendantType>>, indexProp?: number): number;
declare function useDescendantsInit<DescendantType extends Descendant>(): [DescendantType[], React.Dispatch<React.SetStateAction<DescendantType[]>>];
declare function useDescendants<DescendantType extends Descendant>(ctx: React.Context<DescendantContextValue<DescendantType>>): DescendantType[];
declare function DescendantProvider<DescendantType extends Descendant>({ context: Ctx, children, items, set, }: {
    context: React.Context<DescendantContextValue<DescendantType>>;
    children: React.ReactNode;
    items: DescendantType[];
    set: React.Dispatch<React.SetStateAction<DescendantType[]>>;
}): JSX.Element;
/**
 * Testing this as an abstraction for compound components that use keyboard
 * navigation. Hoping this will help us prevent bugs and mismatched behavior
 * across various components, but it may also prove to be too messy of an
 * abstraction in the end.
 *
 * Currently used in:
 *   - Tabs
 *   - Accordion
 *
 * @param context
 * @param options
 */
declare function useDescendantKeyDown<DescendantType extends Descendant, K extends keyof DescendantType = keyof DescendantType>(context: React.Context<DescendantContextValue<DescendantType>>, options: {
    currentIndex: number | null | undefined;
    key?: K | "option";
    filter?: (descendant: DescendantType) => boolean;
    orientation?: "vertical" | "horizontal" | "both";
    rotate?: boolean;
    rtl?: boolean;
    callback(nextOption: DescendantType | DescendantType[K]): void;
}): (event: React.KeyboardEvent) => void;
declare type SomeElement<T> = T extends Element ? T : HTMLElement;
declare type Descendant<ElementType = HTMLElement> = {
    element: SomeElement<ElementType> | null;
    index: number;
};
interface DescendantContextValue<DescendantType extends Descendant> {
    descendants: DescendantType[];
    registerDescendant(descendant: DescendantType): void;
    unregisterDescendant(element: DescendantType["element"]): void;
}
export type { Descendant, DescendantContextValue };
export { createDescendantContext, DescendantProvider, useDescendant, useDescendantKeyDown, useDescendants, useDescendantsInit, };
