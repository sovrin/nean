export type ResolverValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | ResolverValue[]
    | { [key: string]: ResolverValue }
    | (() => ResolverValue);

const resolve = (value: any): string[] => {
    if (!value) return [];

    const type = typeof value;
    if (type === "string" || type === "number") {
        return [String(value)];
    }

    if (type === "boolean") {
        return [value];
    }

    if (type === "function") {
        return resolve(value());
    }

    if (Array.isArray(value)) {
        const result: string[] = [];
        for (let i = 0; i < value.length; i++) {
            const nested = resolve(value[i]);
            if (nested.length) {
                result.push(...nested);
            }
        }

        return result;
    }

    if (type === "object") {
        const result: string[] = [];
        for (const key in value) {
            if (value[key]) {
                result.push(key);
            }
        }

        return result;
    }

    return [];
};

export type Resolver = (...values: ResolverValue[]) => string;

export const resolver: Resolver = (...values): string => {
    if (!values.length) return "";

    const classes: string[] = [];

    for (let i = 0; i < values.length; i++) {
        const processed = resolve(values[i]);
        if (processed.length) {
            classes.push(...processed);
        }
    }

    return classes.join(" ").trim();
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 28.04.2022
 * Time: 16:31
 */
export default resolver;
