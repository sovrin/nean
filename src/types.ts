import type {
    ForwardRefExoticComponent,
    JSX,
    PropsWithChildren,
    ReactElement,
} from "react";
import type { Resolver } from "./resolver";
import type { Hook } from "./hook";

export type nean = (resolver?: Resolver) => Factory;

export type Config<P, T extends ElementList> = {
    as?: T;
    className?: string;
    style?: (props: ComponentProps<P, T>) => any;
    extend?: (props: ComponentProps<P, T>) => any;
    render?: (
        props: ComponentProps<P, T>,
        hooks?: { [key: string]: Function },
    ) => ReactElement | null;
};

export type Factory = <P, T extends ElementList>(
    config: Config<P, T>,
) => ForwardRefExoticComponent<Prettify<ComponentProps<P, T>>>;

type ComponentProps<P, T extends ElementList> = PropsWithChildren<
    P & ConsumerProps & ElementProps<T>
>;

type ElementList = keyof JSX.IntrinsicElements;

type ElementProps<T extends ElementList> = JSX.IntrinsicElements[T];

export type ConsumerProps = {
    className?: string;
    use?: Hook[];
};

export type FrameworkProps = {
    as?: ElementList;
    className?: string;
    use?: Hook[];
};

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
