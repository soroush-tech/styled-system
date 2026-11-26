# Build a Box

One of the most widely used styled component types is the coveted Box layout component.
While many component libraries include a Box layout component already, you may want to create your own depending on the needs of your application.
This guide will walk through creating a Box component and show you how you can add additional functionality using Styled System.

Import `styled` from UmberStyle and create a new component.

```js
// example Box.js
import { styled } from '@umber-style/react'

const Box = styled('div')({})

export default Box
```

## Base Styles

Add some base-level styles to the component.
Use `boxSizing: 'border-box'` to ensure that padding is included in width,
and use `minWidth: 0` to ensure the Box can shrink below its minimum content size when used as a flex item.

```js
const Box = styled('div')({
  boxSizing: 'border-box',
  minWidth: 0,
})
```

## Style Props

Next, import a few core Styled System functions to expose styles as props.
As a general rule of thumb, you should only expose style props when it's something likely to change on a per-instance basis throughout your app.
For styles that don't change frequently, it's generally better to [extend the component](#extending).

```tsx
// example Box.tsx
import { styled } from '@umber-style/react'
import {
  space,
  color,
  layout,
  type SpaceProps,
  type ColorProps,
  type LayoutProps,
} from '@soroush.tech/styled-system'

const Box = styled('div')<SpaceProps & ColorProps & LayoutProps>(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  space,
  color,
  layout
)

export default Box
```

With the component created above, you can quickly change styling contextually throughout your application.

```js
// example usage
<Box width={[1, 1 / 2]} p={4} mb={3} bg="tomato">
  This is a tomato box, with responsive width, some padding, and margin bottom
</Box>
```

## Flex Item Props

If you intend to use the Box component with flexbox, adding some more flexbox-specific style props can be helpful.
Add the following props to the Box.

```tsx
// example Box.tsx
import { styled } from '@umber-style/react'
import {
  space,
  color,
  layout,
  flexbox,
  type SpaceProps,
  type ColorProps,
  type LayoutProps,
  type FlexboxProps,
} from '@soroush.tech/styled-system'

const Box = styled('div')<SpaceProps & ColorProps & LayoutProps & FlexboxProps>(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  space,
  color,
  layout,
  flexbox
)

export default Box
```

Using the pattern above, you can add as much or as little as you like to your Box component.
If you find yourself writing the same Box component over-and-over again, you might want to consider publishing your own UI component library to npm for reuse.

## Extending

Not every style you use in an application needs to be added to a component as a style prop.
For one-off customizations, it's often easier to extend a simpler component than it is to maintain a more complex Box component.

There are primarily two ways to extend a styled component with UmberStyle:

1. Using the `style` prop
2. Creating an extended styled component

## `style` prop

UmberStyle has no `css` prop. A styled component takes plain style objects in its `style` prop instead.
They are merged into one class of the element: no `style` attribute is rendered.
If your Box component needs a small style change you can make it inline or create an extended component for reuse.

```tsx
export default () => (
  <Box
    p={2}
    style={{
      borderBottom: '2px solid',
    }}
  >
    This Box is using the style prop inline
  </Box>
)
```

To use the `style` prop to extend the Box component for reuse, you can do something like the following:

```tsx
// extended Box component example
import type { ComponentProps } from 'react'

export default ({ large, ...props }: { large?: boolean } & ComponentProps<typeof Box>) => (
  <Box
    {...props}
    p={large ? 4 : 2}
    style={{
      borderRadius: 4,
      border: '1px solid #f6f6f6',
      boxShadow: '0 2px 4px rgba(0, 0, 0, .125)',
    }}
  />
)
```

## Extending with `styled`

An alternative to using the `style` prop is to create a completely new styled component using the `styled` function.
You can create these components anywhere,
but it's common to colocate these in the same module that they're used in.

```tsx
import { styled } from '@umber-style/react'
import Box from './Box'

// extended Box component
const Card = styled(Box)({
  borderRadius: 4,
  border: '1px solid #f6f6f6',
  boxShadow: '0 2px 4px rgba(0, 0, 0, .125)',
})

// code for the component using the extended component below
```
