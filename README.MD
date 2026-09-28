<h1 align="left">nean</h1>

[![npm version][npm-src]][npm-href]
[![types][types-src]][types-href]
[![size][size-src]][size-href]
[![coverage][coverage-src]][coverage-href]
[![vulnerabilities][vulnerabilities-src]][vulnerabilities-href]
[![dependencies][dep-src]][dep-href]
[![License][license-src]][license-href]

> neat and lean react components for css-only frameworks

## Installation
```bash
$ npm i nean
```
Requires `react` >= 19.

## About
The purpose of this library is to reduce the boilerplate code needed to create react components for css-only frameworks.
Focusing only on the necessary bits.

## Usage
```tsx
import nean from 'nean';

const Button = nean.button<{rounded?: boolean; primary?: boolean; md?: number}>({
    className: 'btn',
    variants: ({rounded, primary}) => ({
        'btn--rounded': rounded,
        'btn--primary': primary,
    }),
    attrs: ({md}) => ({
        'data-size': md,
    }),
});

<Button md={2} rounded primary>bar</Button>

// ===

<button className="btn btn--rounded btn--primary" data-size="2">bar</button>
```

## API
- <a href="#factory"><code><b>nean</b></code></a>
- <a href="#mixins"><code>mixins</code></a>
- <a href="#createNean"><code>createNean()</code></a>
- <a href="#createModifier"><code>createModifier()</code></a>
- <a href="#createSlot"><code>createSlot()</code></a>
- <a href="#resolver"><code>resolver()</code></a>

<a name="factory"></a>
### `nean`
The factory, one method per element: `nean.button<Props>({...})`.

|             | type      | description                                                   |
|:------------|:----------|:--------------------------------------------------------------|
| `as`        | string?   | default element, only for `nean<Props>({...})` (see below)    |
| `className` | string?   | base className                                                |
| `variants`  | Function? | receives the props, returns classNames (see `resolver`)       |
| `attrs`     | Function? | receives the props, returns props to add to the element       |
| `render`    | Function? | receives the props and the `slots`, returns the children      |

The final className is `className`, then the result of `variants`, then the `className` a consumer passes.

The element is the name of the method, `nean.button<Props>({...})`, so it is only written once.
Without a fixed element, use `nean<Props>({...})`; a component like that renders only its children until you pass `as`.

Every prop read in `variants`, `attrs` or `render` is consumed and is not passed to the element.
Everything else is passed through. That includes a rest spread: `render: ({children, ...rest}) => ...` reads, and so consumes, every prop.
If `attrs` returns a key that was consumed, the returned value is passed, e.g. `attrs: ({disabled}) => ({disabled})` keeps `disabled` on the element.

Every component also accepts `as` to change the element per usage, and `mixins`.

```tsx
const Link = nean.a<{active?: boolean}>({
    variants: ({active}) => ({active}),
});

<Link as="button" active />; // renders a button, typed as one
```

Props you declare win over the props of the element, so a `size` prop of your own never clashes with the native one.

<a name="createNean"></a>
### `createNean(resolver?: Resolver)`
Returns a factory of its own. Pass your own `resolver` to change how classNames are joined.

```ts
import {createNean} from 'nean';

const nean = createNean((...values) => myJoin(values));
```

<a name="mixins"></a>
### `mixins`
Every component accepts `mixins`, a list of small extras a consumer can add per usage. There are two kinds.

<a name="createModifier"></a>
#### `createModifier(modify)`
Changes the props of the rendered element. `modify` receives the final props of the element (including `children` and the resolved `className`) and returns the ones to change.
Modifiers run in order, each seeing the result of the previous.

```tsx
import {createModifier, resolver} from 'nean';

const withTooltip = (text: string) =>
    createModifier(({className}) => ({
        className: resolver(className, 'tooltip'),
        'data-tooltip': text,
    }));

<Button mixins={[withTooltip('hello')]} />
```

<a name="createSlot"></a>
#### `createSlot(name, render)`
Provides content the component places itself. `render` receives a position and returns a node.
The component reads it from the second argument of its own `render`, e.g. `icon('left')`.
Extra props for the slot can be passed as second argument, `icon('left', {size: 'lg'})`, and arrive as the second parameter of the slot's `render`.
A slot that was not passed renders nothing.

```tsx
import {createSlot} from 'nean';

const Button = nean.button({
    render: ({children}, {icon}) => [icon('left'), children, icon('right')],
});

const withIcon = (type: string, side: 'left' | 'right' = 'left') =>
    createSlot<'left' | 'right'>('icon', (position) =>
        position === side ? <Icon type={type} /> : null,
    );

<Button mixins={[withIcon('hamburger', 'right')]}>menu</Button>
```

<a name="resolver"></a>
### `resolver(...values)`
Joins values into a className: strings and numbers as they are, objects by their truthy keys, arrays by what their items resolve to. Everything falsy is dropped.

```ts
resolver('a', {b: true, c: false}, ['d', [null, 'e']]); // "a b d e"
```

## Migrating from 4.x
- prop `use` is now `mixins`
- `style` is now `variants`, `extend` is now `attrs`
- `nean()` is now `nean`, use `createNean(resolver)` for a custom resolver
- `createHook(name, fn)` is split into `createModifier(fn)` and `createSlot(name, fn)`
- `interceptHook` is gone, slots are passed to `render` as its second argument
- `resolver(true)` no longer adds `"true"` as a className, and functions are no longer resolved

## Licence
MIT License, see [LICENSE](./LICENSE)

[npm-src]: https://badgen.net/npm/v/nean
[npm-href]: https://www.npmjs.com/package/nean
[size-src]: https://badgen.net/packagephobia/install/nean
[size-href]: https://packagephobia.com/result?p=nean
[types-src]: https://badgen.net/npm/types/nean
[types-href]: https://www.npmjs.com/package/nean
[coverage-src]: https://coveralls.io/repos/github/sovrin/nean/badge.svg?branch=master
[coverage-href]: https://coveralls.io/github/sovrin/nean?branch=master
[vulnerabilities-src]: https://snyk.io/test/github/sovrin/nean/badge.svg
[vulnerabilities-href]: https://snyk.io/test/github/sovrin/nean
[dep-src]: https://img.shields.io/librariesio/release/npm/nean
[dep-href]: https://img.shields.io/librariesio/release/npm/nean
[license-src]: https://badgen.net/github/license/sovrin/nean
[license-href]: LICENSE
