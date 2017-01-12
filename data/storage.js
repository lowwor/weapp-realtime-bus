
const KEY_LAST_QUERY_LINE_NAME = 'KEY_LAST_QUERY_LINE_NAME'
const KEY_AUTO_COMPLETE_ITEMS = 'KEY_AUTO_COMPLETE_ITEMS'
const KEY_IS_START_FROM_FIRST = 'KEY_IS_START_FROM_FIRST'

//default 3A
function getLastQueryName() {
    try {
        var savedLastQueryName = wx.getStorageSync('KEY_LAST_QUERY_LINE_NAME')
        if (savedLastQueryName) {
            return savedLastQueryName
        } else {
            return "3A"
        }
    } catch (e) {
        return "3A"
    }
}

function saveLastQueryName(lineName) {
    try {
        wx.setStorageSync('KEY_LAST_QUERY_LINE_NAME', lineName)
    } catch (e) {
        console.log(e)
    }
}


function getAutoCompleteItems() {
    try {
        var savedAutoCompleteItems = wx.getStorageSync('KEY_AUTO_COMPLETE_ITEMS')
        if (savedAutoCompleteItems) {
            return savedAutoCompleteItems
        } else {
            return Array.of("3A")
        }
    } catch (e) {
        return Array.of("3A")
    }
}

function saveAutoCompleteItems(lineName) {
    try {
        var data = wx.getStorageSync('KEY_AUTO_COMPLETE_ITEMS')
        if (data) {
            data.push(lineName)
            wx.setStorageSync('KEY_AUTO_COMPLETE_ITEMS', Array.from(new Set(data)))
        } else {
            wx.setStorageSync('KEY_AUTO_COMPLETE_ITEMS', Array.of(lineName))
        }
    } catch (e) {
        console.log(e)
    }
}


//default true
function getIsStartFromFirst() {
    try {
        var savedIsStartFromFirst = wx.getStorageSync('KEY_IS_START_FROM_FIRST')
        return savedIsStartFromFirst
    } catch (e) {
        return true
    }
}

function saveIsStartFromFirst(isStartFromFirst) {
    try {
        wx.setStorageSync('KEY_IS_START_FROM_FIRST', isStartFromFirst)
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    saveLastQueryName: saveLastQueryName,
    getLastQueryName: getLastQueryName,
    saveAutoCompleteItems: saveAutoCompleteItems,
    getAutoCompleteItems: getAutoCompleteItems,
    getIsStartFromFirst: getIsStartFromFirst,
    saveIsStartFromFirst: saveIsStartFromFirst
}