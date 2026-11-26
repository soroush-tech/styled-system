# Removing props from HTML elements

Due to the nature of the popular `styled` higher order component,
as an author you must rely on the CSS-in-JS library you're using to decide whether or not to forward props along to the HTML element.
For the most part, these libraries do a good job of not forwarding props that aren't valid HTML attributes.
However, the Styled System API uses a few prop names that are either deprecated HTML attributes or SVG attributes and aren't intended to be rendered in the output HTML.
While most browsers should handle these stray HTML attributes with no problem, there might be good reason to clean these up in production.

## UmberStyle

UmberStyle has first-class support in its API for determining which props are forwarded to the HTML element with its `shouldForwardProp` option.
Styled System has a optional utility that can be passed directly to this option.

Install the following utility to make sure your UmberStyle components do not render style props as HTML.

```sh
npm i @soroush.tech/styled-system
```

In your styled component definition, pass this utility function as an option to `styled`.

```tsx
import { styled } from '@umber-style/react'
import shouldForwardProp from '@soroush.tech/styled-system/should-forward-prop'
import { space, color, type SpaceProps, type ColorProps } from '@soroush.tech/styled-system'

const Box = styled('div', {
  shouldForwardProp,
})<SpaceProps & ColorProps>(space, color)
```

UmberStyle already keeps props that are not HTML attributes off a string tag, and forwards every prop to a component.
The utility also drops the style props that are valid attributes, such as `color` and `width`, and works the same for a component:

```tsx
import type { ComponentProps } from 'react'

function Anchor(props: ComponentProps<'a'>) {
  return <a {...props} />
}

const Link = styled(Anchor, { shouldForwardProp })<ColorProps>(color)
```

To keep a prop of your own off the element too, build the filter with `createShouldForwardProp` and the list of Styled System prop names:

```tsx
import { createShouldForwardProp, props } from '@soroush.tech/styled-system/should-forward-prop'

const Button = styled('button', {
  shouldForwardProp: createShouldForwardProp([...props, 'kind']),
})<SpaceProps & { kind?: 'filled' | 'outlined' }>(space)
```

## Plain elements

UmberStyle has no `css` prop: style an element through `styled` as above.
If you render an element yourself and need to split its props, `omit` from `@soroush.tech/styled-system/props` returns the props without the Styled System ones:

```tsx
import { omit } from '@soroush.tech/styled-system/props'

export default (props: SpaceProps & ComponentProps<'section'>) => <section {...omit(props)} />
```
