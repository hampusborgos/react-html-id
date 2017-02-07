var _globallyUniqueIdCounter = 0

function injectUniqueness(component) {
    var willUpdate = component.componentWillUpdate
    var _htmlIds = {}
    var _uniqueIdCounter = 0
    var _uniqueInstance = ++_globallyUniqueIdCounter

    component.componentWillUpdate = function(nextProps, nextState) {
        _uniqueIdCounter = 0
        if (typeof willUpdate != 'undefined') {
            willUpdate.apply(component, nextProps, nextState)
        }
    }

    component.nextUniqueId = function() {
        var id = ++_uniqueIdCounter
        return 'id-' + _uniqueInstance + '-' + _uniqueIdCounter
    }

    component.lastUniqueId = function() {
        return 'id-' + _uniqueInstance + '-' + _uniqueIdCounter
    }

    component.getUniqueId = function(identifier) {
        if (typeof identifier !== 'string') {
            console.log('Warning: Expected string identiifer passed to `getUniqueId`')
            identifier = '' + identifier
        }

        if (!_htmlIds[identifier]) {
            _htmlIds[identifier] = 'id-' + _uniqueInstance + '-' + identifier
        }

        return _htmlIds[identifier]
    }
}

module.exports = {
    enableUniqueIds: injectUniqueness
}
