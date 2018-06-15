/* Copyright (c) 2018 Hampus Joakim Nilsson
 * Licensed via the MIT license.
 **/

// Unique counter per COMPONENT that uniqueness is added to
var _globallyUniqueIdCounter = 0

function resetUniqueIds() {
    _globallyUniqueIdCounter = 0
}

function injectUniqueness(component) {

    var instanceId;
    if (arguments.length > 1) {
        instanceId = arguments[1];
        if (typeof instanceId !== 'string') {
            console.log('Warning: Expected string as second argument passed to `injectUniqueness`')
            instanceId = '' + instanceId
        }
    }

    // Store all state in the closure for the member functions
    var _render = component.render
    var _htmlIds = {}
    var _uniqueIdCounter = 0
    var _uniqueInstance = instanceId || ++_globallyUniqueIdCounter

    // Inject the following functions into the component
    component.render = function () {
        _uniqueIdCounter = 0
        return _render.apply(component)
    }

    component.nextUniqueId = function () {
        ++_uniqueIdCounter
        return 'id-' + _uniqueInstance + '-' + _uniqueIdCounter
    }

    component.lastUniqueId = function () {
        return 'id-' + _uniqueInstance + '-' + _uniqueIdCounter
    }

    component.getUniqueId = function (identifier) {
        if (typeof identifier !== 'string') {
            console.log('Warning: Expected string identifer passed to `getUniqueId`')
            identifier = '' + identifier
        }

        if (!_htmlIds[identifier]) {
            _htmlIds[identifier] = 'id-' + _uniqueInstance + '-' + identifier
        }

        return _htmlIds[identifier]
    }
}

module.exports = {
    resetUniqueIds: resetUniqueIds,
    enableUniqueIds: injectUniqueness,
}
