Page({
  data: {
    currentTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'],
    selectedZones: []
  },

  onLoad() {
    this.initCanvas()
    this.loadSavedZones()
    this.startTimer()
  },

  initCanvas() {
    const ctx = wx.createCanvasContext('clockCanvas')
    this.ctx = ctx
    this.drawClock()
  },

  drawClock() {
    const now = new Date()
    const ctx = this.ctx
    const width = 300
    const height = 300
    
    ctx.clearRect(0, 0, width, height)
    
    // 绘制表盘
    ctx.setFillStyle('#ffffff')
    ctx.beginPath()
    ctx.arc(width/2, height/2, 140, 0, 2 * Math.PI)
    ctx.fill()
    
    // 绘制时针
    ctx.setStrokeStyle('#ff4444')
    ctx.beginPath()
    const hour = now.getHours() % 12
    const hourAngle = (hour * 30 + now.getMinutes() * 0.5) * Math.PI / 180
    ctx.moveTo(width/2, height/2)
    ctx.lineTo(width/2 + Math.sin(hourAngle) * 60, height/2 - Math.cos(hourAngle) * 60)
    ctx.stroke()
    
    // 绘制分针
    ctx.setStrokeStyle('#3388ff')
    ctx.beginPath()
    const minuteAngle = now.getMinutes() * 6 * Math.PI / 180
    ctx.moveTo(width/2, height/2)
    ctx.lineTo(width/2 + Math.sin(minuteAngle) * 80, height/2 - Math.cos(minuteAngle) * 80)
    ctx.stroke()
    
    // 绘制秒针
    ctx.setStrokeStyle('#00cc88')
    ctx.beginPath()
    const secondAngle = now.getSeconds() * 6 * Math.PI / 180
    ctx.moveTo(width/2, height/2)
    ctx.lineTo(width/2 + Math.sin(secondAngle) * 90, height/2 - Math.cos(secondAngle) * 90)
    ctx.stroke()
    
    ctx.draw()
  },

  startTimer() {
    setInterval(() => {
      this.setData({
        currentTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      })
      this.updateWorldTimes()
      this.drawClock()
    }, 1000)
  },

  updateWorldTimes() {
    const times = this.data.selectedZones.map(zone => {
      return new Date().toLocaleString('zh-CN', { 
        timeZone: zone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    })
    this.setData({ currentTimes: times })
  },

  handleZoneChange(e) {
    const index = e.currentTarget.dataset.index
    const zones = [...this.data.selectedZones]
    zones[index] = this.data.timezones[e.detail.value]
    this.setData({ selectedZones: zones })
  },

  saveSettings() {
    wx.setStorageSync('selectedZones', this.data.selectedZones)
    wx.showToast({ title: '保存成功' })
  },

  loadSavedZones() {
    const saved = wx.getStorageSync('selectedZones')
    if (saved) this.setData({ selectedZones: saved })
  }
})