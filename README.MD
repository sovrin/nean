<h1 align="left">nean</h1>

[![npm version][npm-src]][npm-href]
[![types][types-src]][types-href]
[![size][size-src]][size-href]
[![coverage][coverage-src]][coverage-href]
[![vulnerabilities][vulnerabilities-src]][vulnerabilities-href]
[![dependencies][dep-src]][dep-href]
[![License][license-src]][license-href]

> js framework for neat and lean components

## Installation
```bash
$ npm i nean
```

## Usage
```js
import react, {Fragment} from 'react';
import nean from 'nean';

const Button = nean()({
    as: 'button',
    className: 'btn',
    style: ({rounded, primary}) => ({
        'btn--rounded': rounded,
        'btn--primary': primary,
    }),
    extend: ({md}) => ({
        'data-size': md,
    }),
    render: ({children, prefix}) => (
        <Fragment>
            {prefix}{children}
        </Fragment>
    ),
});

<Button
    prefix="foo"
    md={2}
    rounded
    primary
>
    bar
</Button>

// ===

<button 
    className="btn btn--rounded btn--primary" 
    data-size="2"
>
    foobar
</button>
```

## API
- <a href="#ctor"><code><b>nean()</b></code></a>
- <a href="#interceptHook"><code>interceptHook()</code></a>
- <a href="#createHook"><code>createHook()</code></a>

<a name="library"></a>
### Library

<a name="ctor"></a>
### `nean(formatter: Formatter)`
#### `Factory`
|             | type      | default               | description                                                |
|:------------|:----------|:----------------------|:-----------------------------------------------------------|
| `as`        | string?   |                       | type of element e.g. `span`, `div`, `button`               |
| `className` | string?   |                       | base className of the element                              |
| `style`     | Function? | `props`               | provides an object with all consumed props for translation |
| `extend`    | Function? | `props`               | allows extending or aliasing of props                      |
| `render`    | Function? | `{children}, [hooks]` | overwrite of default render function, array of hooks       |

##### `as`
Pass type `button` to create a plain button component.
```javascript
import nean from 'nean';

const Button = nean()({
    as: 'button',
});
```

***

##### `className`
By adding `className`, the component receives a base className. 
```javascript
import nean from 'nean';

const Button = nean()({
    as: 'button',
    className: 'btn',
});
```

***

##### `style(props)`
To bind props to css classNames of the chosen framework, return an object with the new classNames with props as values. 
`style` recursively evaluates every property/value by its truthiness and keeps its key.
```javascript
import nean from 'nean';

const Button = nean()({
    as: 'button',
    style: (({primary}) => ({
        'btn-primary': primary
    })),
});
```

***

##### `extend(props)`
Sometimes, css frameworks have components which rely on data attributes.
These can be set via `extend`. This function allows the extension of the original props.
```javascript
import nean from 'nean';

const Button = nean()({
    as: 'button',
    extend: (({badges}) => ({
        'data-badges': badges
    })),
});
```

***

##### `render(props)`
It's possible to overwrite the render output via the `render` function.
This allows to wrap your components `children` with other components.
```javascript
import React from 'react';
import nean from 'nean';

const Link = nean()({
    as: 'a',
    render: (({children}) => (
        <Button>
            {children}
        </Button>
    )),
});
```

***

<a name="interceptHook"></a>
### `interceptHook(use[, destructive = false])`
nean components accept custom tailored hooks which can be addressed individually later on `render`.

* `use` (array of hooks)
* optional `destructive` (shift used hook from array of hooks)

<a name="createHook"></a>
### `createHook(name, hook)`
hooks can extend a component via provided props.

* `name` (name of the hook)
* `hook` (hook function)

```javascript
import React from 'react';
import nean, {interceptHook, createHook} from 'nean';

// definition
const Button = nean()({
    render: ({children, use}) => {
        const icon = interceptHook(use)('icon');

        return (
            <Fragment>
                {icon('left')} {children} {icon('right')}
            </Fragment>
        );
    },
});

const useIcon = (type, side = 'left') => createHook('icon', (check) => {
    if (check !== side) {
        return null;
    }

    return (
        <Icon type={type}/>
    );
});

// usage
const App = () => (
    <Button use={[
        useIcon('hamburger', 'right')
    ]}>
        hello world
    </Button>
)
```

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
