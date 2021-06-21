import {createElement, forwardRef, ReactNode} from 'react';
import classNames from '@thomann/classnames';
import {evaluate} from './hook';
import {capture, sanitize} from './utils';

type Props<T> = {
    [P in keyof T]?: any
} & {children?: ReactNode};

export type IFactory<T> = {
    type?: string,
    className?: string,
    style?: (props: Props<T>) => any,
    alias?: (props: Props<T>) => any,
    render?: (props: Props<T>) => any,
}

/**
 *
 * @param type
 * @param baseClass
 * @param style
 * @param alias
 * @param render
 */
const factory = <T>({type = null, className: baseClass = null, style = null, alias = null, render = ({children}) => (children)}: IFactory<T>) => {

    /**
     *
     * @param props
     * @param ref
     */
    const build = (props, ref) => {
        props = {...props, ref};
        let {className} = props;

        const keys: Set<string> = new Set([]);
        const {captured, release} = capture(props, keys);
        const classes = (style && style(captured)) || null;
        const aliased = (alias && alias(captured)) || null;
        const children = (render && render(captured)) || null;
        release();

        if (!type) {
            return children;
        }

        className = classNames(
            baseClass,
            classes,
            className,
        );

        const {use = null} = {
            ...props,
            ...aliased,
        };

        if (use) {
            keys.add('use');
        }

        const sanitized = sanitize([...keys], {
            ...props,
            ...aliased,
        });

        props = {
            ...sanitized,
            children,
            className,
            ref,
        };

        const result = evaluate(use, {type, props});

        return createElement(
            result.type,
            result.props
        );
    };

    return forwardRef(build);
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 21:31
 */
export default factory;
