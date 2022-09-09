# Mithril Icons

Basic example of generating mithril vnode icons from a directory containing `.svg` files.

### Why

In response to [this](https://mithril.zulipchat.com/#narrow/stream/324076-general/topic/general/near/297833820) question asked in the mithril Zulip chat.

## Generating

Add any SVG file to `svgs/` directory in projects root and then run `pnpm icons` this will generate the relevant icon files and Typescript exports. Type definitions for SVG Attributes are also generated.

```js
{
  /**
   * Directory containing SVG files (icons)
   */
  input: 'svgs',
  /**
   * The output directory where icons should be written
   */
  output: 'src/icons',
  /**
   * Whether to upcase the export Svg names
   */
  upcase: true,
}
```

### Example

```ts
import m from 'mithril'
import * as icon from './icons'

m.mount(document.body, {

  view: () => [
    m('button', icon.Edit),
    m('button', icon.Delete)
    // etc
  ]

})

```

Alternatively, import each icon directly:

```ts
import m from 'mithril'
import { Edit, Delete } from './icons'

m.mount(document.body, {

  view: () => [
    m('button', Edit),
    m('button', Delete)
    // etc
  ]

})

```

### License

Licensed under [MIT](#LICENSE)
