import {ForwardRefExoticComponent, PropsWithChildren} from 'react';

type TypeList = keyof JSX.IntrinsicElements;

export type Factory = <Props, Type extends TypeList = TypeList>(
    {type, className: baseClass, style, extend, render}: Config<Props, Type>,
) => ForwardRefExoticComponent<JSX.IntrinsicElements[Type] & PropsWithChildren<Props>>;

export type Config<Props, Type> = {
    type: Type,
    className?: string,
    style?: (props: PropsWithChildren<Props>) => any,
    extend?: (props: PropsWithChildren<Props>) => any,
    render?: (props: PropsWithChildren<Props>) => any,
}

export type Scope = 'props' | 'type'

export type Hook = {
    name: string,
    scope: Scope,
    hook: Function,
}
