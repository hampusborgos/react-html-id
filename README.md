# react-unique-id
A npm package that allows you to use unique html IDs for components.

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

    class MyComponent {
        constructor() {
            super()

            enableUniqueIds(this)
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
that the *IDs will not be unique between different instance*.

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

## API

### enableUniqueIds(component)

This should be called from the constructor of the component that needs unique IDs,
passing `this` as the parameter. After calling this you can use `nextUniqueId`, `lastUniqueId` and `getUniqueId` by invoking them on `this`.

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

## Credits

This simple extension is brough to you by [Hampus Nilsson](https://hjnilsson.com).