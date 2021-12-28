import * as React from "react";
declare class Component<State extends object = {}, Refs extends object = {}> extends React.Component<ComponentProps<State, Refs>, State> {
    static defaultProps: {
        getInitialState: () => void;
        getRefs: () => {};
    };
    state: State;
    _refs: Refs;
    _setState: React.Component<ComponentProps<State, Refs>, State>["setState"];
    _forceUpdate: React.Component<ComponentProps<State, Refs>, State>["forceUpdate"];
    getArgs(): {
        state: State;
        props: any;
        refs: Refs;
        setState: <K extends keyof State>(state: State | ((prevState: Readonly<State>, props: Readonly<ComponentProps<State, Refs>>) => State | Pick<State, K> | null) | Pick<State, K> | null, callback?: (() => void) | undefined) => void;
        forceUpdate: (callback?: (() => void) | undefined) => void;
    };
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: ComponentProps<State, Refs>, nextState: State): boolean;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: ComponentProps<State, Refs>, prevState: State, snapshot: any): void;
    getSnapshotBeforeUpdate(prevProps: ComponentProps<State, Refs>, prevState: State): any;
    render(): any;
}
export { Component };
export default Component;
interface ComponentProps<State extends object = {}, Refs extends object = {}> {
    [key: string]: any;
    initialState?: State;
    getInitialState?: (props: ComponentProps<State>) => State;
    refs?: Refs;
    getRefs?: (...args: any[]) => Refs;
    didMount?: (...args: any[]) => void;
    didUpdate?: (...args: any[]) => void;
    willUnmount?: (...args: any[]) => void;
    getSnapshotBeforeUpdate?: (...args: any[]) => any;
    shouldUpdate?: (args: {
        props: ComponentProps<State>;
        state: State;
        nextProps: ComponentProps<State>;
        nextState: State;
    }) => boolean;
    render?: (...args: any[]) => React.ReactElement | null;
    children?: ((...args: any[]) => React.ReactElement | null) | React.ReactNode | React.ReactElement | Element | null;
}
