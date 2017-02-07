var _globallyUniqueIdCounter = 0

function injectUniqueness(component) {
    var willUpdate = component.componentWillUpdate
    var _htmlIds = {}
    var _uniqueIdCounter = 0

    component.componentWillUpdate = function(nextProps, nextState) {
        _uniqueIdCounter = 0
        console.log("Reset unique counter!")

        if (typeof willUpdate != 'undefined') {
            willUpdate.apply(component, nextProps, nextState)
        }
    }

    component.nextUniqueId = function() {
        var id = ++_uniqueIdCounter
        return 'id-' + _uniqueIdCounter
    }

    component.lastUniqueId = function() {
        return 'id-' + _uniqueIdCounter
    }

    component.getUniqueId = function(identifier) {
        if (typeof identifier !== 'string') {
            console.log('Warning: Expected string identiifer passed to `getUniqueId`')
            identifier = '' + identifier
        }

        if (!_htmlIds[identifier]) {
            var globallyUnique = ++_globallyUniqueIdCounter
            _htmlIds[identifier] = 'id-' + identifier + '-' + globallyUnique
        }

        return _htmlIds[identifier]
    }
}

module.exports = {
    enableUniqueIds: injectUniqueness
}
