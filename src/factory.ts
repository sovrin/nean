import {createElement, forwardRef} from 'react';
import classNames from '@thomann/classnames';
import {evaluate, aggregate} from './hook';
import {capture, sanitize} from './utils';
import {Factory} from './types';

/**
 *
 * @param type
 * @param baseClass
 * @param style
 * @param extend
 * @param render
 */
const factory: Factory = (
    {
        type = null,
        className: baseClass = null,
        style = null,
        extend = null,
        render = ({children}) => (children)
    }
) => {

    /**
     *
     * @param props
     * @param ref
     */
    const build = (props, ref) => {
        let {className} = props;

        const keys: Set<string> = new Set([]);
        const {captured, release} = capture(props, keys);

        const classes = (style && style(captured)) || null;
        const extended = (extend && extend(captured)) || null;

        const {use = null} = {
            ...props,
            ...extended,
        };

        const children = (render && render(captured, aggregate(use))) || null;
        release();

        if (use) {
            keys.add('use');
        }

        if (!type) {
            return children;
        }

        className = classNames(
            baseClass,
            classes,
            className,
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
