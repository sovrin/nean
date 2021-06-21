import proxyquire from 'proxyquire';
import {IFactory} from '../src/factory';

type IStub = <T>(props: T, config: IFactory<T>) => (props) => boolean | string | JSX.Element

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 20:22
 */
export default (): IStub => {
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
