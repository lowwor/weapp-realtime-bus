var mock = require('mock.js')
var isDebug = true;

const BASE_URL = 'http://www.zhbuswx.com/Handlers/BusQuery.ashx';
const HANDLER_GET_STATION_LIST = 'GetStationList';
const HANDLER_GET_LINELIST_BY_LINENAME = "GetLineListByLineName";
const HANDLER_GET_BUSLIST_ONROAD = "GetBusListOnRoad";

function getBusListOnRoad(lineName, fromStation) {
    if (isDebug) {
        return new Promise(function (resolve, reject) {
            resolve(mock.busData)
        })
    } else {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: BASE_URL + "?handlerName=" + HANDLER_GET_BUSLIST_ONROAD + '&lineName=' + lineName + '&fromStation=' + fromStation,
                data: {},
                header: {
                    'Cookie': 'IfAuth=93cba07454f06a4a960172bbd6e2a435;ptcz=93cba07454f06a4a960172bbd6e2a435;'
                },
                success: function (res) {
                    console.log("success")
                    resolve(res.data)
                },
                fail: function (res) {
                    reject(res)
                    console.log("failed")
                }
            })
        })

    }
}

function searchLine(key) {
    if (isDebug) {
        return new Promise(function (resolve, reject) {
            resolve(mock.busLineData)
        })
    } else {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: BASE_URL + "?handlerName=" + HANDLER_GET_LINELIST_BY_LINENAME + '&key=' + key,
                data: {},
                header: {
                    'Cookie': 'IfAuth=93cba07454f06a4a960172bbd6e2a435;ptcz=93cba07454f06a4a960172bbd6e2a435;'
                },
                success: function (res) {
                    console.log("success")
                    resolve(res.data)
                },
                fail: function (res) {
                    reject(res)
                    console.log("failed")
                }
            })
        })

    }
}

function getStationByLineId(lineId) {
    if (isDebug) {
        return new Promise(function (resolve, reject) {
            resolve(mock.busStationData)
        })
    } else {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: BASE_URL + "?handlerName=" + HANDLER_GET_STATION_LIST + '&lineId=' + lineId,
                data: {},
                header: {
                    'Cookie': 'IfAuth=93cba07454f06a4a960172bbd6e2a435;ptcz=93cba07454f06a4a960172bbd6e2a435;'
                },
                success: function (res) {
                    console.log("success")
                    resolve(res.data)
                },
                fail: function (res) {
                    reject(res)
                    console.log("failed")
                }
            })
        })

    }
}


module.exports = {
    getBusListOnRoad: getBusListOnRoad,
    searchLine: searchLine,
    getStationByLineId: getStationByLineId
}
