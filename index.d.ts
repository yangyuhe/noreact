declare namespace JSX {
    interface IntrinsicAttributes {
        ref?;
        key?;
    }
    type Element = import("./src").VNode;
}