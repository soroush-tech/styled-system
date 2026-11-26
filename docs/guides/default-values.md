# Default Values

A question that comes up quite often is how do you define defaults for Styled System props.

Let's say you have a Card component that nine times out of ten,
has a specific padding, but every once in a while, you need to change it up.
To add a default value for any Styled System prop, set a default parameter on a thin
wrapper component (React 19 removed the older `defaultProps` approach for function components).

```tsx
// example
import type { ComponentProps } from 'react'
import { styled } from '@umber-style/react'
import { space, color, type SpaceProps, type ColorProps } from '@soroush.tech/styled-system'

const CardBase = styled('div')<SpaceProps & ColorProps>(
  {
    borderRadius: '2px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.125)',
  },
  space,
  color
)

// Set defaults with default parameters on a thin wrapper (React 19 removed `defaultProps`
// for function components).
const Card = ({ p = 2, bg = 'white', ...props }: ComponentProps<typeof CardBase>) => (
  <CardBase p={p} bg={bg} {...props} />
)

export default Card
```

With the default props above, your Card component will have padding and a white background by default.
You can override these styles when needed by passing a prop to the component.

```jsx
// example overriding default styles
<Card p={3} bg="lightgray">
  <Image />
  <Text />
</Card>
```
