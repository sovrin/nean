import {createElement, type JSX, type PropsWithChildren, type ReactNode} from 'react';
import {applyModifiers, collectSlots, type Mixin, type Slots} from './mixin';
import defaultResolver, {type Resolver, type ResolverValue} from './resolver';
import {capture, omit} from './utils/capture';

export type Tag = keyof JSX.IntrinsicElements;
type IntrinsicProps<T extends Tag> = JSX.IntrinsicElements[T];

export type BaseProps<T extends Tag = never> = {
    as?: T;
    mixins?: Mixin[];
    className?: string;
};

/**
 * own props win over the ones of the element
 */
export type NeanProps<Props extends object, T extends Tag = never> = PropsWithChildren<
    [T] extends [never]
        ? Props & BaseProps
        : Props & BaseProps<T> & Omit<IntrinsicProps<T>, keyof Props | keyof BaseProps>
>;

export type Config<Props extends object, T extends Tag = never> = {
    /** default element, can be overwritten by the `as` prop */
    as?: T;
    /** base className of the element */
    className?: string;
    /** translates props into classNames */
    variants?: (props: NeanProps<Props, T>) => ResolverValue;
    /** adds or aliases props of the element */
    attrs?: (props: NeanProps<Props, T>) => Record<string, unknown>;
    /** replaces the children of the element */
    render?: (props: NeanProps<Props, T>, slots: Slots) => ReactNode;
};

export type Component<Props extends object, Default extends Tag = never> = <
    T extends Tag = Default,
>(
    props: NeanProps<Props, T>,
) => ReactNode;

export type Factory = <Props extends object = object, T extends Tag = never>(
    config: Config<Props, T>,
) => Component<Props, T>;

/**
 * the element is part of the name, so it does not need to be repeated as type
 * `nean().button<Props>({...})`
 */
export type TagFactories = {
    [T in Tag]: <Props extends object = object>(
        config: Omit<Config<Props, T>, 'as'>,
    ) => Component<Props, T>;
};

export type CreateNean = (resolver?: Resolver) => Factory & TagFactories;

const reserved = new Set(['as', 'mixins']);

const renderChildren = ({children}: PropsWithChildren) => children;

export const createNean: CreateNean = (resolver = defaultResolver) => {
    const factory: Factory =
        ({as: defaultElement, className: baseClassName, variants, attrs, render}) =>
        (props) => {
            const {props: captured, used, release} = capture(props);

            const variantClasses = variants?.(captured);
            const extensions = attrs?.(captured);
            const {as, mixins} = {...props, ...extensions} as BaseProps<Tag>;

            const children = (render ?? renderChildren)(captured, collectSlots(mixins));
            release();

            const element = as ?? defaultElement;
            if (!element) return children ?? null;

            const className =
                baseClassName || variantClasses || props.className
                    ? resolver(baseClassName, variantClasses, props.className)
                    : undefined;

            const rest = omit({...omit(props, used), ...extensions}, reserved);
            const elementProps = applyModifiers(mixins, {...rest, children, className});

            return createElement(element, elementProps);
        };

    return new Proxy(factory, {
        get: (target, key, receiver) =>
            typeof key === 'string' && !(key in target)
                ? (config: object) => target({...config, as: key as Tag})
                : Reflect.get(target, key, receiver),
    }) as Factory & TagFactories;
};

/** ready to use with the default resolver */
const nean = createNean();

export default nean;
