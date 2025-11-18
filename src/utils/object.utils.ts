export const define = (
    target: any,
    prop: string,
    attributes: PropertyDescriptor,
) => Object.defineProperty(target, prop, attributes);
