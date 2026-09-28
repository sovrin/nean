import nean, {createModifier, createSlot, resolver} from '../index';

type ElementProps = {
    variant?: 'primary' | 'secondary';
    bold?: boolean;
};

const withBadge = (badge: string) =>
    createModifier(({className}) => ({
        className: resolver(className, 'badge'),
        'data-badge': badge,
    }));

const withIcon = (icon: string, side: 'left' | 'right' = 'left') =>
    createSlot<'left' | 'right'>('icon', (position) => (position === side ? icon : null));

const Element = nean.input<ElementProps>({
    className: 'element',
    variants: ({variant, bold}) => ({[`element--${variant}`]: variant, bold}),
    attrs: ({bold}) => ({'data-bold': bold}),
});

const Text = nean<ElementProps>({
    as: undefined,
    render: ({children}, {icon}) => [icon('left'), children, icon('right')],
});

const Nothing = nean.button({});

export const Valid = () => (
    <>
        <Element mixins={[withBadge('2'), withIcon('i')]} />
        <Element variant="primary" onChange={(event) => event.currentTarget.value} />
        <Element<'button'> as="button" onClick={(event) => event.currentTarget.type} />
        <Element<'form'> as="form" onSubmit={(event) => event.currentTarget.action} />
        <Text bold>text</Text>
        <Nothing onClick={(event) => event.currentTarget.type} />
    </>
);

export const Invalid = () => (
    <>
        {/* @ts-expect-error unknown variant */}
        <Element variant="tertiary" />
        {/* @ts-expect-error a form has no href */}
        <Element<'form'> as="form" href="/" />
        {/* @ts-expect-error not a mixin */}
        <Element mixins={['badge']} />
    </>
);
