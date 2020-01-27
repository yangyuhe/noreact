export * from "./src";
declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            ref?: import("./src/react").Ref;
            key?: any;
        }
        type Element = import("./src/VNode").VNode
        type ElementClass = import("./src/MVVM").MVVM<any> | import("./src/react").Fragment
    }
}
