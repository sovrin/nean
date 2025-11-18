import type { Config } from "../.";
import { JSX } from "react";
import { vi } from "vitest";
import { Resolver } from "../types";

type Mock = (
    formatter?: Function,
) => <T>(
    props: T,
    config: Config<T, any>,
) => (props: unknown) => boolean | string | JSX.Element;

export async function createMock(): Promise<Mock> {
    const reactMocks = {
        forwardRef:
            (callback: (props: unknown) => unknown) => (props: unknown) =>
                callback(props),
        createElement: (type: string, props: unknown) => ({ type, props }),
    };

    vi.mock("react", () => reactMocks);

    const { default: factory } = await import("../index");

    return (formatter: Resolver) => (props, config) => {
        // @ts-ignore
        return factory(formatter)(config).render(props);
    };
}
