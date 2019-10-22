import elementFactory from "./factory";
import {createHook as hook, Type} from './hook';
import {useClassName, useType} from "./hooks";

const createHook = hook(Type.PROPS);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 23.09.2019
 * Time: 21:14
 */
export {
    elementFactory as factory,
    createHook as hook,
    useClassName as useClassName,
    useType as useType,
};
