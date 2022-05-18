import {createElement, forwardRef} from 'react';
import formatter from './formatter';
import {capture, sanitize} from './utils';
import {aggregate, evaluate} from './hook';
import type {nean, FrameworkProps} from './types';

/**
 *
 * @param format
 */
const factory: nean = (format = formatter) => (
    {
        as = undefined,
        className = undefined,
        style = undefined,
        extend = undefined,
        render = ({children}) => (children)
    }
) => {
    /**
     *
     * @param props
     * @param ref
     */
    const build = (props, ref) => {
        const {captured, release, keys} = capture(props);
        const classes = (style && style(captured)) || null;
        const extended = (extend && extend(captured)) || null;

        const {
            use = undefined,
            as: propAs = undefined,
            className: propClassName = undefined,
        }: FrameworkProps = {
            ...props,
            ...extended,
        };

        const children = (render && render(captured, aggregate(use))) || null;
        release();

        if (use) {
            keys.add('use');
        }

        if (!as && !propAs) {
            return children;
        } else if (propAs) {
            keys.add('as');
        }

        className = (className || classes || propClassName) && format(
            className,
            classes,
            propClassName
        );

        const sanitized = sanitize([...keys], {
            ...props,
            ...extended,
        });

        props = {
            ...sanitized,
            children,
            className,
            ref,
        };

        const result = evaluate(use, props);

        return createElement(
            propAs || as,
            result,
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
