import type {ReactNode} from 'react';

export type ElementProps = Record<string, unknown> & {className?: string};

/**
 * changes the props of the rendered element,
 * e.g. adds a className or a data attribute
 */
export type Modifier = {
    type: 'modifier';
    modify(props: ElementProps): Partial<ElementProps> | null | void;
};

/**
 * provides content the component decides where to place,
 * e.g. an icon on the left or the right
 */
export type Slot<Position extends string = string> = {
    type: 'slot';
    name: string;
    render(position: Position, props?: object): ReactNode;
};

export type Mixin = Modifier | Slot;

export type SlotRenderer = (position?: string, props?: object) => ReactNode;
export type Slots = Record<string, SlotRenderer>;

export const createModifier = (modify: Modifier['modify']): Modifier => ({
    type: 'modifier',
    modify,
});

export const createSlot = <Position extends string = string>(
    name: string,
    render: Slot<Position>['render'],
): Slot<Position> => ({
    type: 'slot',
    name,
    render,
});

const empty: SlotRenderer = () => null;

/**
 * slots by name, a missing slot renders nothing
 */
const noSlots: Slots = new Proxy(Object.create(null), {get: () => empty});

export const collectSlots = (mixins?: Mixin[]): Slots => {
    if (!mixins?.length) return noSlots;

    const slots: Slots = Object.create(null);

    for (const mixin of mixins) {
        if (mixin.type === 'slot') {
            slots[mixin.name] = (position, props) => mixin.render(position as string, props);
        }
    }

    return new Proxy(slots, {
        get: (target, key: string) => target[key] ?? empty,
    });
};

/**
 * changes the given props in place
 */
export const applyModifiers = (mixins: Mixin[] | undefined, props: ElementProps): ElementProps => {
    if (mixins) {
        for (const mixin of mixins) {
            if (mixin.type === 'modifier') Object.assign(props, mixin.modify(props));
        }
    }

    return props;
};
