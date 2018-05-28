# react-html-id
A npm package that allows you to use unique html IDs for components
without any dependencies on other libraries (obviously, you need to
use React in your project).

## Purpose

This module allows you to set unique `id` tags on React HTML elements,
mainly in order to connect labels to them but also for other HTML function
that require unique ids (`#references`).

## Usage

To use the module, you first need to inject the extension into
your component. You do this via the `enableUniqueIds` function
(which is the only function exposed by this module). Then you
can use `this.nextUniqueId()` to get a new identifier,
`this.lastUniqueId()` to refer to that identifier again in the HTML,
and `this.getUniqueId('name')` to get an identifier by name.

    import uniqueId from 'react-html-id';
    
    class MyComponent {
        constructor() {
            super()

            uniqueId.enableUniqueIds(this)
        }

        render () {
            // Use nextUniqueId to create a new ID, and lastUniqueId to refer to the same ID again
            return (
                <div className="form-group">
                    <label htmlFor={this.nextUniqueId()}>Name</label>
                    <input id={this.lastUniqueId()}
                           type="text"
                           className="control" />
                </div>
            )
        }
    }

### Why can't I just use a counter?

The problem with using a local counter in the render function is
that the *IDs will not be unique between different instances*.

    class BadComponent {
        render () {
            var idCounter = 0;

            // Do not do this!!
            return (
                <div className="form-group">
                    <label htmlFor={'id-' + idCounter}>Name</label>
                    <input id={'id-' + idCounter}
                           type="text"
                           className="control" />
                </div>
            )
        }
    }

If you put two instances of `BadComponent` in your React application,
they will both share the same IDs! This package ensures you will get
unique IDs per instance of every component.

### Does this work with server side rendering?

If you render your UI on the server in it's own process per request, you
do not need to anything extra, because the result of rendering will be
identical across the server and the client.

However, if you render multiple different React components on the server
using `renderToString` (this is what a framework like Next.js does) you
need to reset the unique ID counter between each request to result in the
same IDs being generated for the client every time. You can do this using
the `resetUniqueIds()` API.

The easiest way to do this for Next.js is to create a component like this:

    // PageWithUniqueIds.jsx
    import { resetUniqueIds } from "react-html-id";

    class PageWithUniqueIds extends React.Component {
        componentWillMount() {
            resetUniqueIds()
        }

        render() {
            return this.props.children;
        }
    }

    // index.jsx
    class IndexPage extends React.Component {
        render() {
            return (
                <PageWithUniqueIds>
                    {/* Your application code as usual */}
                </PageWithUniqueIds>
            );
        }
    }

Wrap ALL pages you create with this component. Because this component will
be rendered for every page, componentWillMount will be called once for both server and
client per page. This will reset the ID counter before the page is rendered.
The result is that the same IDs will be used both server side and client side.

This strategy will only work if you render entire pages server side. If you render
individual components, this library will be insufficient to solve your problem.
There is no simple way of guaranteeing that the ID counter is consistent between
server and client in that situation, without storing the information in the DOM
for those nodes.

## API

### enableUniqueIds(component, [instanceId])

This should be called from the constructor of the component that needs unique IDs,
passing `this` as the first parameter. After calling this you can use `nextUniqueId`, `lastUniqueId` and `getUniqueId`
by invoking them on `this`.

This call either adds a `componentWillUpdate` handler to the current component,
or wraps the existing one. The package uses `componentWillUpdate` to reset the
ID counter every time the component re-renders.

    class MyComponent {
        constructor() {
            super()

            // Enable Unique ID support for this class
            enableUniqueIds(this)
        }

        render() {
            // ...
        }
    }

The second optional `instanceId` parameter specifies a string to use for _all_ instances of this component when
constructing unique IDs, as opposed to using a unique string for each instance. While this essentially defeats the
purpose of this module when there are multiple instances of your component on the page, it's useful for snapshot-based
unit testing, e.g. [Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots), where the
indeterminate nature of test execution order might generate different unique IDs on each test run. In this case, you'll
likely want want to only use it when you're actually running the unit tests:

    enableUniqueIds(this, (process.env.NODE_ENV === 'test') ? props.name : undefined)

### Component.nextUniqueId()

This will returns a *new* unique id for the component. Repeatedly calling
this function will result in new IDs.

IDs are consistent between renders, as long as the function is always called
in the same order. This means there are *no DOM updates* necessary if you do
not remove calls to the function between renders.

    render() {
        var manyFields = ['firstName', 'lastName', 'address', 'postalCode', 'city']
        
        // Every label-input pair will have a unique ID 
        return (
            <form>
                {manyFields.map((field, index) => {
                    return (
                        <div className="form-group" key={index}>
                            <label htmlFor={this.nextUniqueId()}>Name</label>
                            <input id={this.lastUniqueId()}
                                type="text"
                                className="control" />
                        </div>
                    )
                })
            </form>
        )
    }

### Component.lastUniqueId()

Returns the same ID that was returned by the last call to `nextUniqueId`,
this is almost always necessary as you need to refer to the ID twice, once
for the label and once for the input.

### Component.getUniqueId(identifier : String) 

This always returns the same unique identifier, given the same name. 
This is useful if the order of components makes it impossible or confusing 
to use `lastUniqueId` to refer to a component.

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.getUniqueId('input')}>Name</label>
                <div className="help-block"
                        id={this.getUniqueId('help')}>
                    This should be your full name.
                </div>
                <input id={this.getUniqueId('input')}
                        type="text"
                        aria-describedby={this.getUniqueId('help')}
                        className="control" />
            </div>
        )
    }

You can of course also store the result of `nextUniqueId` into a variable
to acheive the same result.

### resetUniqueIds()

This resets the per-component counter of unique IDs. Call this before using
`renderToString` on the **server**. If you call this on the client, make
sure to only do so **once** per page render.

    // Call before renderToString to reset the global ID counter
    function renderAppServerSide(appProps) {
        ReactHtmlId.resetUniqueIds()
        ReactDOM.renderToString(<App props={...} />);
    }

## Credits

This package is brought to you by [Hampus Nilsson](https://hjnilsson.com).
