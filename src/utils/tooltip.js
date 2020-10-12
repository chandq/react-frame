/**
 * @title tooltip
 * @Desc 自定义的tooltip方法, 支持拖动悬浮提示
 * Created by chendeqiao on 2017/5/8.
 * @example
 *  <span onmouseleave="mouseLeaveEvt({})" onmousemove="mouseEnterEvt({title: 'title content', event: event})"
 * 		onmouseenter="mouseEnterEvt({title: 'title content', event: event})">title content </span>
 */

// 获取字符串的像素宽度
String.prototype.getWidth = function (fontSize = 14) {
  if (typeof this == 'string' && this.length > 0) {
    var strWidth = ''
    var getEle = null
    if (!document.querySelector('#getStrWidth1494304949567')) {
      var _ele = document.createElement('span')
      _ele.id = 'getStrWidth1494304949567'
      _ele.style.fontSize = fontSize + 'px'
      _ele.style.whiteSpace = 'nowrap'
      _ele.style.visibility = 'hidden'
      _ele.textContent = this
      document.body.appendChild(_ele)
      getEle = document.querySelector('#getStrWidth1494304949567')
    } else {
      getEle = document.querySelector('#getStrWidth1494304949567')
      getEle.textContent = this
    }
    strWidth = getEle.offsetWidth
    return strWidth
  }
}
// 自定义的title提示功能的函数
export function mouseEnterEvt({ ele = '#root', title, event }) {
  try {
    var $reactEle = document.querySelector(ele)
    var $customTitle = null
    if (document.querySelector('#customTitle1494304949567')) {
      $customTitle = document.querySelector('#customTitle1494304949567')
      mouseenter($customTitle, title, event)
    } else {
      var $contentContainer = document.createElement('div')
      $contentContainer.className = 'customTitle'
      $contentContainer.id = 'customTitle1494304949567'
      $contentContainer.className = 'tooltip'
      $contentContainer.style.cssText = 'z-index: 999999; visibility: hidden;'
      $contentContainer.innerHTML =
        '<div class="tooltip-inner" style="word-wrap: break-word; max-width: 44px;">皮肤</div>'
      $reactEle.appendChild($contentContainer)
      $customTitle = document.querySelector('#customTitle1494304949567')
      if (title) {
        //判断div显示的内容是否为空
        mouseenter($customTitle, title, event)
        $customTitle.style.visibility = 'visible'
      }
    }
  } catch (e) {
    console.error(e.message)
  }
}
function mouseenter($customTitle, title, e) {
  var diffValueX = 200 + 50,
    diffValueY //默认设置弹出div的宽度为250px
  var x = 13,
    y = 23
  var $contentEle = $customTitle.children[0]
  if (title.getWidth(12) < 180 + 50) {
    //【弹出div自适应字符串宽度】若显示的字符串占用宽度小于180，则设置弹出div的宽度为“符串占用宽度”+20
    $contentEle.style.maxWidth = title.getWidth(12) + 20 + 50 + 'px'
    diffValueX = e.clientX + (title.getWidth(12) + 50) - document.body.offsetWidth
  } else {
    $contentEle.style.maxWidth = '250px'
    diffValueX = e.clientX + 230 - document.body.offsetWidth //计算div水平方向显示的内容超出屏幕多少宽度
  }

  $contentEle.innerHTML = title //html方法可解析内容中换行标签，text方法不能
  if (diffValueX > 0) {
    //水平方向超出可见区域时
    x -= diffValueX
  }
  $customTitle.style.top = e.clientY + y + 'px'
  $customTitle.style.left = e.clientX + x + 'px'
  $customTitle.style.maxWidth = '250px'
  diffValueY = $customTitle.getBoundingClientRect().top + $contentEle.offsetHeight - document.body.offsetHeight
  if (diffValueY > 0) {
    //垂直方向超出可见区域时
    $customTitle.style.top = e.clientY - diffValueY + 'px'
  }
}
export function mouseLeaveEvt({ ele = '#root' }) {
  if (document.querySelector('#customTitle1494304949567')) {
    document.querySelector(ele).removeChild(document.querySelector('#customTitle1494304949567'))
  }
}
