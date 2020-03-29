export * from "./src";
declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            ref?: import("./src/react").Ref<any>;
            key?: any;
        }
        type Element = import("./src/VNode").VNode
        type ElementClass = import("./src/MVVM").MVVM | import("./src/react").Fragment
    }
}
