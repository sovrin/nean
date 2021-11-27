import proxyquire from 'proxyquire';
import {Config} from '../src';
import {TypeList} from '../src/types';

type Mock = <T>(props: T, config: Config<T, TypeList> ) => (
    (props) => boolean | string | JSX.Element
)

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 20:22
 */
export default (): Mock => {
    const stub = {
        forwardRef: (cb) => (props) => cb(props),
        createElement: (type, props) => ({type, props}),
    };

    const {default: factory} = proxyquire('../src/index', {
        'react': stub,
        '@noCallThru': true,
    });

    return (props, config) => {
        return factory(config).render(props);
    };
}
