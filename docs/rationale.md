From a forum thread

    I'm sure Styled System isn't for everyone, but here's some of the thinking behind it.
    Styled System is meant to:
    - Help ensure you're using scales and values consistently across your app
    - Help ensure that if you *do* want to use style props, that there is some across-the-board consistency with the prop naming conventions, e.g. `px={2}` works the same for all components that use the `space` utility
    - Allow for setting single properties, such as width or font-size, responsively without needing to handle media queries
    - Write less CSS, e.g. Styled System is an abstraction built on top that gives you flexibility where needed
    - From my experience, many developers do not want to write CSS or end up writing a lot of duplicative code. Other developers like to write CSS, and that's also completely fine, but this library probably isn't necessary for teams of fewer than 10 people where most have a good understanding of CSS.
    - With most CSS-in-JS libraries, you can still escape into low-level CSS by wrapping a component with `styled()` and adding your own styles
    When I first released my earlier utility libraries, people hated them. Some ideas like this take time to gain traction, but I've received a surprising amount of positive feedback around the library so far, and I suspect that there's some value in approaches like this
