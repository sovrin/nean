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

export type CreateFactory = (resolver?: Resolver) => ComponentFactory;

export type IntrinsicElement = keyof JSX.IntrinsicElements;
type IntrinsicProps<T extends IntrinsicElement> = JSX.IntrinsicElements[T];

export type BaseComponentProps<T extends IntrinsicElement> = {
    as?: T;
    use?: Hook[];
    className?: string;
    ref?: Ref<T>;
};

type MergedProps<
    Props extends object,
    Element extends IntrinsicElement,
> = PropsWithChildren<
    Props & BaseComponentProps<Element> & IntrinsicProps<Element>
>;

export type ComponentConfig<
    Props extends object,
    Element extends IntrinsicElement,
> = {
    as?: Element;
    className?: string;
    style?: (props: MergedProps<Props, Element>) => any;
    extend?: (props: MergedProps<Props, Element>) => any;
    render?: (
        props: MergedProps<Props, Element>,
        hooks?: Record<string, Function>,
    ) => ReactNode;
};

export type ComponentFactory = <
    Props extends object = never,
    Element extends IntrinsicElement = never,
>(
    config: ComponentConfig<Props, Element>,
) => Component<Props, Element>;

type Component<
    Props extends object,
    Element extends IntrinsicElement = never,
> = {
    <T extends IntrinsicElement = Element>(
        props: [T] extends [never]
            ? BaseComponentProps<never> & Props
            : BaseComponentProps<T> & IntrinsicProps<T> & Props,
    ): ReactNode;

    <T extends IntrinsicElement = Element>(
        props: IntrinsicProps<T> & BaseComponentProps<T> & Props,
    ): ReactNode;
};

const createFactory: CreateFactory = (resolveClassNames = resolver) => {
    return ({
        as: defaultElement,
        className: baseClassName,
        style,
        extend,
        render = ({ children }) => children,
    }) => {
        return (props: BaseComponentProps<never>) => {
            const { captured, release, keys } = capture(props);

            const styleClasses = style?.(captured) ?? null;
            const extensions = extend?.(captured) ?? null;

            const mergedProps = { ...props, ...extensions };
            const { use, as, className, ref } =
                mergedProps as BaseComponentProps<never>;

            const children = render?.(captured, aggregate(use)) ?? null;

            release();

            if (use) keys.add("use");

            const element = as || defaultElement;
            if (!element) return children;

            if (as) keys.add("as");

            const resolvedClassName =
                baseClassName || styleClasses || className
                    ? resolveClassNames(baseClassName, styleClasses, className)
                    : undefined;

            const sanitizedProps = sanitize([...keys], mergedProps);
            const evaluatedProps = evaluate(use, {
                ...sanitizedProps,
                children,
                className: resolvedClassName,
                ref,
            });

            return createElement(element, evaluatedProps);
        };
    };
};

export default createFactory;
