import elementFactory from "./factory";
import {createHook, Type} from './hook';
import {useClassName, useType} from "./hooks";

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 23.09.2019
 * Time: 21:14
 */
export default {
    elementFactory,
    createHook: createHook(Type.PROPS),
    useClassName,
    useType,
};
