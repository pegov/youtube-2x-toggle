class ElemsFinder {
  constructor(callback) {
    this.callback = callback
    this.find()
  }

  find() {
    if (this.tryIdentify()) {
      return
    }

    document.addEventListener("yt-navigate-finish", this.tryIdentify.bind(this))
  }

  tryIdentify() {
    let video = document.querySelector('video')
    let rightPanel = document.querySelector('.ytp-right-controls')
    if (!video || !rightPanel) {
      return false
    }

    this.callback(video, rightPanel)
    return true
  }
}

class Instance {
  constructor(video, rightPanel) {
    this.video = video
    this.rightPanel = rightPanel

    this.i025x = browser.runtime.getURL("images/0.25x.svg")
    this.i05x = browser.runtime.getURL("images/0.5x.svg")
    this.i075x = browser.runtime.getURL("images/0.75x.svg")
    this.i1x = browser.runtime.getURL("images/1x.svg")
    this.i125x = browser.runtime.getURL("images/1.25x.svg")
    this.i15x = browser.runtime.getURL("images/1.5x.svg")
    this.i175x = browser.runtime.getURL("images/1.75x.svg")
    this.i2x = browser.runtime.getURL("images/2x.svg")
    this.i3x = browser.runtime.getURL("images/3x.svg")

    this.removeExisting()
    this.create()
    this.bind()
    this.insert()
    this.updateRateDisplay()
  }

  removeExisting() {
    let existing = this.rightPanel.querySelector('.yt-2x-toggle')
    if (existing) {
      existing.remove()
    }
  }

  getSVG(url, w) {
    if (w) {
      return `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <svg x="100%" y="100%" overflow="visible">
            <image x="-34" y="-48" width="28px" height="48px" xlink:href="${url}">
          </svg>
        </svg>
        `
    } else {
      return  `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <svg x="100%" y="100%" overflow="visible">
            <image x="-48" y="-48" width="48px" height="48px" xlink:href="${url}">
          </svg>
        </svg>
      `
    }
  }

  create() {
    let container = document.createElement('div')
    container.classList.add('ytp-button')
    container.classList.add('yt-2x-toggle')
    container.innerHTML = this.getSVG(this.i1x, true)
    this.container = container
  }
  bind() {
    this.video.addEventListener('ratechange', this.updateRateDisplay.bind(this))
    this.container.addEventListener('click', this.click.bind(this))
    this.container.addEventListener('auxclick', this.auxclick.bind(this))
  }
  click() {
    let value = this.video.playbackRate
    if (value === 1.0) {
      this.video.playbackRate = 2.0
    } else {
      this.video.playbackRate = 1.0
    }
    this.updateSessionStorage(this.video.playbackRate)
  }
  auxclick(e) {
    if (e.button != 1) {
      return
    }
    let value = this.video.playbackRate
    if (value === 3.0) {
      this.video.playbackRate = 1.0
    } else {
      this.video.playbackRate = 3.0
    }
    this.updateSessionStorage(this.video.playbackRate)
  }

  updateSessionStorage(rate) {
    const key = "yt-player-playback-rate"
    const now = Date.now()
    const value = JSON.stringify({ data: rate, creation: now })
    sessionStorage.setItem(key, value)
  }

  updateRateDisplay() {
    let value = this.video.playbackRate
    switch (value) {
      case 3.0:
        this.container.innerHTML = this.getSVG(this.i3x, true)
        break
      case 2.0:
        this.container.innerHTML = this.getSVG(this.i2x, true)
        break
      case 1.75:
        this.container.innerHTML = this.getSVG(this.i175x, false)
        break
      case 1.5:
        this.container.innerHTML = this.getSVG(this.i15x, false)
        break
      case 1.25:
        this.container.innerHTML = this.getSVG(this.i125x, false)
        break
      case 1.0:
        this.container.innerHTML = this.getSVG(this.i1x, true)
        break
      case 0.75:
        this.container.innerHTML = this.getSVG(this.i075x, false)
        break
      case 0.5:
        this.container.innerHTML = this.getSVG(this.i05x, false)
        break
      case 0.25:
        this.container.innerHTML = this.getSVG(this.i025x, false)
        break
      default:
        this.container.innerHTML = this.getSVG(this.i1x, true)

    }
  }

  insert() {
    this.rightPanel.insertAdjacentElement("afterbegin", this.container)
    return true
  }
}

const init = async () => {
  new ElemsFinder((video, rightPanel) => {
    new Instance(video, rightPanel)
  })
}

init()

