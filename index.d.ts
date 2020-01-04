export * from "./src";
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
        interface IntrinsicAttributes {
            ref?: any;
            key?: any;
        }
    }
}
