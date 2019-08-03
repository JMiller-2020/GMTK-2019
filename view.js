'use strict';

class View {
  constructor(canvas) {
    this._cvs = canvas
    this._initView()
  }

  _initView() {
    this._ctx = this._cvs.getContext('2d')
    this._handleResize()
    addEventListener('resize', this._handleResize.bind(this))
  }

  render() {
    this._ctx.fillRect(10, 10, this._w - 20, this._h - 20)
  }

  _handleResize() {
    this._w = this._cvs.width = window.innerWidth
    this._h = this._cvs.height = window.innerHeight
  }
}