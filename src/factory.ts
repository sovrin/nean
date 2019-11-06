import {createElement, forwardRef} from 'react';
import {useClassName} from "./hooks";
import {useHooks} from './hook';
import {capture, sanitize} from './utils';

interface IFactory {
    type?: string,
    className?: string,
    style?: Function,
    extend?: Function,
    render?: Function,
}

/**
 *
 * @param type
 * @param baseClass
 * @param style
 * @param extend
 * @param render
 */
const factory = ({type = null, className: baseClass = null, style = null, extend = (props) => (props), render = ({children}) => (children)}: IFactory) => {

    /**
     *
     * @param props
     * @param ref
     */
    const build = (props, ref) => {
        let {className} = props;

        const keys = new Set(['use']);
        const {captured, release} = capture(props, keys);
        const classes = (style && style(captured)) || null;
        const extended = (extend && extend(captured)) || null;
        const children = (render && render(captured)) || null;
        release();

        if (!type) {
            return children;
        }

        className = useClassName(
            baseClass,
            classes,
            className,
        );

        const {use = null} = {
            ...props,
            ...extended,
        };

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

        const result = useHooks(use, {type, props});

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
