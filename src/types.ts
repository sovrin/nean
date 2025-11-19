import { JSX, PropsWithChildren, ReactElement, ReactNode } from "react";
import type { Resolver } from "./resolver";
import type { Hook } from "./hook";

export type nean = (resolver?: Resolver) => Factory;

export type Config<Props extends object, Type extends ElementList> = {
    as?: Type;
    className?: string;
    style?: (props: ComponentProps<Props, Type>) => any;
    extend?: (props: ComponentProps<Props, Type>) => any;
    render?: (
        props: ComponentProps<Props, Type>,
        hooks?: { [key: string]: Function },
    ) => ReactNode;
};

export type Factory = <
    Props extends object = never,
    Type extends ElementList = never,
    Overwrite extends Type = Type,
>(
    config: Config<Props, Type>,
) => Renderer<Props, Type, Overwrite>;

type Renderer<
    Props extends object,
    Type extends ElementList = never,
    Overwrite extends Type = Type,
> = {
    <Generic extends ElementList = Overwrite>(
        props: [Generic] extends [never]
            ? FrameworkProps<never> & Props
            : FrameworkProps<Generic> & ElementProps<Generic> & Props,
    ): ReactElement | null;

    <Fallback extends ElementList = Overwrite>(
        props: ElementProps<Fallback> & Props,
    ): ReactElement | null;
};

type ComponentProps<
    Props extends object,
    Type extends ElementList,
> = PropsWithChildren<Props & FrameworkProps<Type> & ElementProps<Type>>;

export type FrameworkProps<T extends ElementList> = {
    as?: T;
    use?: Hook[];
};

export type ElementList = keyof JSX.IntrinsicElements;
type ElementProps<T extends ElementList> = JSX.IntrinsicElements[T];
