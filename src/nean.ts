import {
    createElement,
    type JSX,
    type PropsWithChildren,
    type ReactNode,
    type Ref,
} from "react";
import resolver, { type Resolver } from "./resolver";
import { sanitize } from "./utils/array.utils";
import { capture } from "./utils/proxy.utils";
import { aggregate, evaluate, type Hook } from "./hook";

export type nean = (resolver?: Resolver) => Factory;

export type ElementList = keyof JSX.IntrinsicElements;
type ElementProps<T extends ElementList> = JSX.IntrinsicElements[T];

export type FrameworkProps<T extends ElementList> = {
    as?: T;
    use?: Hook[];
    className?: string;
    ref?: Ref<T>;
};

type ComponentProps<
    Props extends object,
    Type extends ElementList,
> = PropsWithChildren<Props & FrameworkProps<Type> & ElementProps<Type>>;

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
>(
    config: Config<Props, Type>,
) => Renderer<Props, Type>;

type Renderer<Props extends object, Type extends ElementList = never> = {
    <Generic extends ElementList = Type>(
        props: [Generic] extends [never]
            ? FrameworkProps<never> & Props
            : FrameworkProps<Generic> & ElementProps<Generic> & Props,
    ): ReactNode;

    <Fallback extends ElementList = Type>(
        props: ElementProps<Fallback> & Props,
    ): ReactNode;
};

const closure: nean = (resolveClassNames = resolver) => {
    return ({
        as,
        className: baseClassName,
        style,
        extend,
        render = ({ children }) => children,
    }) => {
        return (props: FrameworkProps<never>) => {
            const { captured, release, keys } = capture(props);

            const classes = style ? style(captured) : null;
            const extended = extend ? extend(captured) : null;

            const mergedProps: FrameworkProps<never> = {
                ...props,
                ...extended,
            };

            const {
                use,
                as: propAs,
                className: propClassName,
                ref,
            }: FrameworkProps<never> = mergedProps;

            const children =
                (render && render(captured, aggregate(use))) || null;

            release();

            if (use) {
                keys.add("use");
            }

            const finalAs = propAs || as;
            if (!finalAs) {
                return children;
            }

            if (propAs) {
                keys.add("as");
            }

            const resolvedClassName =
                baseClassName || classes || propClassName
                    ? resolveClassNames(baseClassName, classes, propClassName)
                    : undefined;

            const sanitized = sanitize([...keys], {
                ...props,
                ...extended,
            });

            const evaluatedProps = evaluate(use, {
                ...sanitized,
                children,
                className: resolvedClassName,
                ref,
            });

            return createElement(finalAs, evaluatedProps);
        };
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 21:31
 */
export default closure;
