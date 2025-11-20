import type { Config } from "../.";
import { ReactNode } from "react";
import { vi } from "vitest";
import { Resolver } from "../resolver";

const reactMocks = {
    forwardRef: (callback: (props: object) => ReactNode) => (props: object) =>
        callback(props),
    createElement: (type: string, props: object) => ({ type, props }),
};

vi.mock("react", () => reactMocks);

type Mock = (
    resolver?: Resolver,
) => <Props extends object>(
    props: Props,
    config: Config<Props, any>,
) => ReactNode;

export async function createMock(): Promise<Mock> {
    const { default: factory } = await import("../index");

    return (resolver) => (props, config) => {
        return factory(resolver)(config)(props);
    };
}
