# Spacing

There are many ways to approach spacing (margin and padding) in a web application,
and Styled System is intended to work at a low enough level to support several of these
depending on your team's preferences.

If you're not familiar with Styled System's `space` utility,
you might want to read the [Getting Started](../getting-started.md#margin--padding) documentation first.

## Where does space belong?

Generally speaking, it's a good idea to avoid adding default margins to reusable components in React.
Some people prefer to use a declarative approach by adding a "spacer" component in between other components.
This is the _[spacer.gif][]_ of React, and it's a completely acceptable practice, despite what some people may say.

[spacer.gif]: https://en.wikipedia.org/wiki/Spacer_GIF

Others prefer creating wrapper layout components that apply spacing to child components.
This is also an acceptable approach, but requires an additional layer of abstraction and creates a larger API surface area
for your component library. This approach will also be less familiar to people new to React.

The third common way, and the way that Styled System's API encourages you to approach this is through spacing props.

All three approaches are valid, and all three can be used together with Styled System helping ensure that the values used for spacing
are consistent across your entire application.

## Spacer Component

One of the simpler approaches comes from the early days of the web, and is a really great way to add space to UI.

To create a spacer component with Styled System, you can either reuse a [Box component](./build-a-box.md) or create a specialized component
for this purpose.

```tsx
// example Spacer component
import { styled } from '@umber-style/react'
import { space, type SpaceProps } from '@soroush.tech/styled-system'

const Spacer = styled('div')<SpaceProps>(space)
```

To use the Spacer component, render it without any children and use the margin props.

```js
// example Spacer usage
<Header />
<Spacer mb={4} />
<Section />
```

The Spacer component is also really great for flexbox layouts, where `margin: auto` will fill any remaining space.

```js
// example Spacer in flexbox
<Flex>
  <Logo />
  <Spacer m="auto" />
  <Link>Beep</Link>
  <Link>Boop</Link>
</Flex>
```

## Wrapper Component

Some people use a wrapping parent component to control spacing on child components.
This can be useful for tiled layouts or grid systems.

To target child elements you can either use the `React.Children` API to map over child elements, or use child CSS selectors.
The use of child CSS selectors can lead to styling bugs and isn't generally recommended.

```tsx
// example using child CSS selectors
import { styled } from '@umber-style/react'
import { space, type SpaceProps } from '@soroush.tech/styled-system'

const SpaceChildren = styled('div')<SpaceProps>((props) => ({
  '& > *': space(props),
}))
```

The following example does not create a wrapping element and does not rely on child CSS selectors.

```tsx
import { Children, cloneElement, type ReactElement, type ReactNode } from 'react'
import { styled } from '@umber-style/react'
import { space, type SpaceProps } from '@soroush.tech/styled-system'

const classnames = (...args: string[]) => args.join(' ')
const getClassName = (el: ReactElement<{ className?: string }>) => el.props.className || ''

export const StyledChildren = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => {
  const styledChildren = Children.toArray(children).map((child) =>
    cloneElement(child as ReactElement<{ className?: string }>, {
      className: classnames(
        getClassName(child as ReactElement<{ className?: string }>),
        className ?? ''
      ),
    })
  )
  return <>{styledChildren}</>
}

const SpaceChildren = styled(StyledChildren)<SpaceProps>(space)

export default SpaceChildren
```

## Space Props

While the above approaches work perfectly fine, it can be useful to control margin and padding on a per-element basis.
This is where Styled System's `space` utility really shines.
It lets you add margin and padding props to any component, whether it's a Box layout component, a heading, or a button.
By including the `space` props in your components, you can quickly make one-off adjustments and adapt to changing requirements.

The `space` utility can be added to any component that accepts the `className` prop.

```tsx
// example
import { styled } from '@umber-style/react'
import { space, type SpaceProps } from '@soroush.tech/styled-system'

const Heading = styled.h2<SpaceProps>(space)
```

When using the component, you can adjust margin and padding in any direction needed.

```jsx
// example usage
<Heading mt={0} mb={4} pl={0}>
  Hello
</Heading>
```

While the `space` utility is a perfect choice for most cases, it can be useful to add only margin or padding props to
a component. To handle those cases, Styled System provides subsets of the `space` utility: `padding` and `margin` utilities.

The `padding` utility adds only padding props to a component and the `margin` utility adds only margin props. Usage of
the utilities are the same as the usage of `space` utility

```tsx
// margin utility example
import { styled } from '@umber-style/react'
import { margin, type MarginProps } from '@soroush.tech/styled-system'

const Paragraph = styled.p<MarginProps>(margin)
```

When using the component, you can adjust margin, but not padding:

```jsx
// example usage
<Paragraph mt={0} mb={4}>
  I have only margin props available
</Paragraph>
```
