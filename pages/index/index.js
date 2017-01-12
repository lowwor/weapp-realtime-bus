//获取应用实例
var app = getApp();
var api = require('../../data/api.js');
var storage = require('../../data/storage.js');

Page({
  trackData: {
    firstStation: '',
    lastStation: '',
    normalLineId: '',
    reverseLineId: '',
    fromStation: '',
    lineId: '',
    isOneDirection: false,
    trackBusesTaskId: 0
  },
  data: {
    header: {
      defaultValue: '',
      inputValue: ''
    },
    stationListData: []
  },
  //分享
  onShareAppMessage: function () {
    var key = this.data.header.inputValue;
    return {
      title: key || '公交查询',
      desc: key ? '珠海公交 - 公交查询' : '珠海公交',
      path: '/pages/index/index' + (key ? ('?key=' + key) : '')
    };
  },

  bindClearSearchTap: function (e) {
    this.setData({
      'header.inputValue': ''
    });
  },

  bindSearchInput: function (e) {
    this.setData({
      'header.inputValue': e.detail.value
    });

    return e.detail.value;
  },

  // 点击搜索
  bindConfirmSearchTap: function () {
    this.setData({

    });
    this.search();
  },

  // 搜索
  search(key) {

    var that = this,
      inputValue = key || that.data.header.inputValue,
      reDdata = null;

    // 消除字符串首尾的空格
    function trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    inputValue = trim(inputValue).toUpperCase();

    // 对输入的是空格或未进行输入进行处理
    if (inputValue === '') {
      return false;
    }

    this.setData({
      'header.inputValue': inputValue
    });

    api.searchLine(inputValue)
      .then(res => {
        app.showLoadingToast()
        console.log(res)
        console.log(res.data)

        that.trackData.lineName = res.data[0].Name
        storage.saveLastQueryName(that.trackData.lineName)

        that.trackData.firstStation = res.data[0].FromStation
        that.trackData.lastStation = res.data[0].ToStation
        that.trackData.fromStation = storage.getIsStartFromFirst() ? that.trackData.firstStation : that.trackData.lastStation

        that.trackData.normalLineId = res.data[0].Id
        if (res.data[1]) {
          that.trackData.reverseLineId = res.data[1].Id
          that.trackData.isOneDirection = false
        } else {
          that.trackData.reverseLineId = res.data[0].Id
          that.trackData.isOneDirection = true
        }

        that.trackData.lineId = storage.getIsStartFromFirst() ? that.trackData.normalLineId : that.trackData.reverseLineId
        return api.getStationByLineId(that.trackData.lineId)
      })
      .then(res => {
        wx.hideToast();
        console.log(res.data);

        this.setData({
          stationListData: res.data
        })

        this.startTrackBuses()
      })
  },
  switchDirection: function () {
    console.log("switch direction")
    var that = this

    var newStartFromFirst = !storage.getIsStartFromFirst()
    storage.saveIsStartFromFirst(newStartFromFirst)
    if (!that.trackData.isOneDirection) {
      that.trackData.lineId = newStartFromFirst ? that.trackData.normalLineId : that.trackData.reverseLineId
      that.trackData.fromStation = newStartFromFirst ? that.trackData.firstStation : that.trackData.lastStation
      console.log(newStartFromFirst)
      console.log(that.trackData.lineId)
      console.log(that.trackData.fromStation)
      app.showLoadingToast()
      api.getStationByLineId(that.trackData.lineId)
        .then(res => {
          wx.hideToast();
          console.log(res.data);
          this.setData({
            stationListData: res.data
          })
          this.startTrackBuses()
        })
    } else {
      wx.showToast({
        title: '该路线只有单向',
        icon: 'loading',
        duration: 1000
      });
    }

  },
  startTrackBuses: function () {
    console.log("startTrackBuses")
    var that = this
    if (that.trackData.trackBusesTaskId !== 0) {
      clearInterval(that.trackData.trackBusesTaskId)
    }

    function setBuses(busList) {

      console.log(busList);
      var tempStationListData = that.data.stationListData
      for (var i = 0; i < tempStationListData.length; i++) {
        var busNumber = 0;
        for (var j = 0; j < busList.length; j++) {

          // console.log(tempStationListData[i].Name)
          if (busList[j].CurrentStation === tempStationListData[i].Name) {
            busNumber++;
          }
        }
        if (tempStationListData[i].busNumber != 0 && busNumber == 0) {
          tempStationListData[i].busNumber = 0;
        } else if (busNumber != 0) {
          tempStationListData[i].busNumber = busNumber;
        }
      }

      that.setData({
        stationListData: tempStationListData
      })

    }

    function getBuses() {
      api.getBusListOnRoad(that.trackData.lineName, that.trackData.fromStation)
        .then(data => setBuses(data.data))
    }
    getBuses()
    that.trackData.trackBusesTaskId = setInterval(getBuses, 3000)

  },

  onLoad() {
    var that = this
    this.setData({
      'header.defaultValue': storage.getLastQueryName()
    });
    that.search(storage.getLastQueryName());
    // storage.saveAutoCompleteItems("3A");
    // console.log(storage.getAutoCompleteItems())



  }

});