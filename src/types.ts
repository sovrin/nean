import {ForwardRefExoticComponent, PropsWithChildren} from 'react';

export type nean = (formatter?: Formatter) => Factory;

export type Formatter = (...context: (string | boolean | number | string [] | object | Function)[]) => string;

export type Factory = <P, T extends ElementList = ElementList>(
    {
        as,
        className,
        style,
        extend,
        render,
    }: Config<P, T>,
) => ForwardRefExoticComponent<Props<P, T>>;

export type Config<P, T> = {
    as?: T,
    className?: string,
    style?: (props: P) => any,
    extend?: (props: PropsWithChildren<FrameworkProps> & P) => any,
    render?: (props: PropsWithChildren<FrameworkProps> & P, hooks?: { [key: string]: Function }) => any,
};

type Props<P, T extends ElementList> =
    ElementProps<T> & P
;

type ElementList = keyof JSX.IntrinsicElements;

type ElementProps<T extends ElementList> =
    JSX.IntrinsicElements[T]
;

export type FrameworkProps = {
    as?: ElementList,
    className?: string,
    use?: Hook[],
};

export type Hook = {
    name: string,
    hook: Function,
};
