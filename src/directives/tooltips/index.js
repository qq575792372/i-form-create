// 延迟关闭tooltip的计时器
let hideTooltipTimer = null

/**
 * 指令初始化
 * @param el
 * @param binding
 */
const onInit = function (el, binding) {
  const {enable = true, line = 1, placement = 'top', closeDelay = 150, zIndex} = binding.value || {}
  el.enable = enable
  el.line = line
  el.placement = placement
  el.closeDelay = closeDelay
  el.zIndex = zIndex

  // 如果没有启用tooltip，则不绑定事件
  if (!el.enable) {
    el.style.cssText = ''
    onDestroy(el, binding)
    return
  }
  // 计算自适应高度时，最多展示几行
  if (el.line === 'auto') {
    const targetComputedStyle = window.getComputedStyle(el)
    const parentComputedStyle = window.getComputedStyle(el.parentNode)
    // 默认文本行高是18.4，如果设置则以元素设置的为准
    const textLineHeight = Number(
      (targetComputedStyle.lineHeight || parentComputedStyle.lineHeight || '18.4px')
        .replace('px', '')
        .replace('normal', '18.4') || 18.4
    )

    // 获得父元素的高度
    const parentHeight =
      el.parentNode &&
      el.parentNode.offsetHeight -
        Number(parentComputedStyle.marginTop.replace(/px$/, '')) -
        Number(parentComputedStyle.marginBottom.replace(/px$/, ''))
    // 设置父元素节点的样式，由于截断元素，需要垂直居中显示
    el.parentNode.style.display = 'inline-flex'
    el.parentNode.style.alignItems = 'center'

    // 获得最多显示的行数
    el.line = Math.floor(parentHeight / textLineHeight)
  }

  // 固定行数
  if (el.line > 0) {
    // 超出一行省略
    if (el.line === 1) {
      el.style.cssText = `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;`
    }
    // 超出指定行省略
    else {
      el.style.cssText = `
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: ${el.line};
    -webkit-box-orient: vertical;`
    }
  }

  // 绑定鼠标事件
  el.addEventListener('mouseenter', onMouseEnter)
  el.addEventListener('mouseleave', onMouseLeave)
}

/**
 * 元素鼠标滑过
 * @param e
 */
const onMouseEnter = function (e) {
  // 获得元素中绑定的参数
  let {innerText, offsetWidth, line, placement, closeDelay, zIndex} = e.target
  let targetBoundingRect = (e.target && e.target.getBoundingClientRect()) || {}
  let targetComputedStyle = window.getComputedStyle(e.target)
  // 如果是多行，则会去找到父组件来计算，因为只有一个元素设置了-webkit-line-clamp:2时，该元素设置padding后是无法超出显示省略号生效
  if (line !== 1) {
    targetBoundingRect = (e.target.parentElement && e.target.parentElement.getBoundingClientRect()) || {}
    targetComputedStyle = window.getComputedStyle(e.target.parentElement)
  }

  /* 第一步：根据划过的元素创建模板 */
  // 创建对应的模版span元素
  const tempTextSpan = document.createElement('span')
  tempTextSpan.style.fontSize = targetComputedStyle.fontSize
  tempTextSpan.style.fontWeight = targetComputedStyle.fontWeight
  tempTextSpan.style.fontWeight = targetComputedStyle.fontWeight
  tempTextSpan.style.fontFamily = targetComputedStyle.fontFamily
  tempTextSpan.style.lineHeight = targetComputedStyle.lineHeight
  tempTextSpan.style.letterSpacing = targetComputedStyle.letterSpacing
  tempTextSpan.style.whiteSpace = 'nowrap'
  tempTextSpan.innerText = innerText
  document.body.appendChild(tempTextSpan)
  // 获取模版span元素的长度
  const tempTextSpanWidth = tempTextSpan.offsetWidth
  // 获得元素的实际长度（去掉border和padding）
  const elOffsetWidth =
    offsetWidth -
    Number(targetComputedStyle.paddingLeft.replace(/px$/, '')) -
    Number(targetComputedStyle.paddingRight.replace(/px$/, '')) -
    Number(targetComputedStyle.borderLeftWidth.replace(/px$/, '')) -
    Number(targetComputedStyle.borderRightWidth.replace(/px$/, ''))
  // 获取完所有需要计算的数据后，删除模版span元素
  document.body.removeChild(tempTextSpan)

  /* 第二步：如果文本元素 大于 实际元素*行数 ，则展示tooltip */
  let easyTooltipElem = document.getElementById('easy-tooltip')
  if (tempTextSpanWidth > elOffsetWidth * line) {
    // 清空隐藏tooltip的定时器
    if (hideTooltipTimer) clearTimeout(hideTooltipTimer)
    // 页面不存在easy-tooltip
    if (!easyTooltipElem) {
      // easy-tooltip元素
      easyTooltipElem = document.createElement('div')
      easyTooltipElem.id = 'easy-tooltip'
      easyTooltipElem.className = 'easy-tooltip el-popper is-dark'
      // arrow三角
      const easyTooltipArrowElem = document.createElement('span')
      easyTooltipArrowElem.className = 'el-popper__arrow'
      easyTooltipElem.appendChild(easyTooltipArrowElem)
      // 提示内容
      const easyTooltipContentElem = document.createElement('span')
      easyTooltipContentElem.className = 'el-popper__content'
      easyTooltipElem.appendChild(easyTooltipContentElem)
      // 将tooltip增加到body
      document.body.appendChild(easyTooltipElem)
    }

    // 显示easy-tooltip
    if (zIndex) {
      easyTooltipElem.style.zIndex = zIndex
    }
    easyTooltipElem.style.display = 'block'
    easyTooltipElem.closeDelay = closeDelay
    easyTooltipElem.style.maxWidth = targetBoundingRect.width * 2 + 'px'
    easyTooltipElem.querySelector('.el-popper__content').innerHTML = innerText
    easyTooltipElem.setAttribute('data-popper-placement', placement)

    // 页面可视窗口的宽度和高度
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth
    let viewportHeight = window.innerHeight || document.documentElement.clientHeight
    // 页面body的宽度
    let bodyWidth = document.documentElement.clientWidth || document.body.clientWidth
    // 页面body的高度
    let bodyHeight = document.documentElement.clientHeight || document.body.clientHeight
    // 页面包含左右滚动条的宽度和高度
    let scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    // 页面左侧滚动条宽度
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    // 页面滚动条距离顶部高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // 页面滚动条距离底部高度
    let scrollBottom = scrollHeight - viewportHeight

    // 展示方向
    // tooltip显示在顶部
    const setEasyTooltipTop = () => {
      // 设置tooltip的位置
      easyTooltipElem.setAttribute('data-popper-placement', 'top')
      // 设置tooltip的参数
      easyTooltipElem.style.inset = 'auto auto 0px 0px'
      easyTooltipElem.style.transform = `translate(${scrollLeft + targetBoundingRect.left}px,${targetBoundingRect.top - (bodyHeight - scrollTop) - 12}px)`
      // 设置tooltip三角的样式
      easyTooltipElem.querySelector('.el-popper__arrow').style.cssText =
        `position: absolute;left: 0px;transform: translate(${targetBoundingRect.width / 2 - 5}px, 0px);`
    }
    // tooltip显示在底部
    const setEasyTooltipBottom = () => {
      // 设置tooltip的位置
      easyTooltipElem.setAttribute('data-popper-placement', 'bottom')
      // 设置tooltip的参数
      easyTooltipElem.style.inset = '0px auto auto 0px'
      easyTooltipElem.style.transform = `translate(${scrollLeft + targetBoundingRect.left}px,${scrollTop + targetBoundingRect.bottom + 12}px)`
      // 设置tooltip三角的样式
      easyTooltipElem.querySelector('.el-popper__arrow').style.cssText =
        `position: absolute; left: 0px; transform: translate(${targetBoundingRect.width / 2 - 5}px, 0px);`
    }
    // tooltip显示在左侧
    const setEasyTooltipLeft = () => {
      easyTooltipElem.setAttribute('data-popper-placement', 'left')
      // 设置tooltip的参数
      easyTooltipElem.style.inset = '0px 0px auto auto'
      easyTooltipElem.style.transform = `translate(${targetBoundingRect.left - (bodyWidth - scrollLeft) - 12}px,${targetBoundingRect.top + scrollTop}px)`
      // 设置tooltip三角的样式
      easyTooltipElem.querySelector('.el-popper__arrow').style.cssText =
        `position: absolute; top: 0px; transform: translate(0px, ${easyTooltipBoundingRect.height > targetBoundingRect.height ? targetBoundingRect.height / 2 - 5 : easyTooltipBoundingRect.height / 2 - 5}px);`
    }
    // tooltip显示在右侧
    const setEasyTooltipRight = () => {
      easyTooltipElem.setAttribute('data-popper-placement', 'right')
      // 设置tooltip的参数
      easyTooltipElem.style.inset = '0px auto auto 0px'
      easyTooltipElem.style.transform = `translate(${targetBoundingRect.right + scrollLeft + 12}px,${targetBoundingRect.top + scrollTop}px)`
      // 设置tooltip三角的样式
      easyTooltipElem.querySelector('.el-popper__arrow').style.cssText =
        `position: absolute; top: 0px; transform: translate(0px, ${easyTooltipBoundingRect.height > targetBoundingRect.height ? targetBoundingRect.height / 2 - 5 : easyTooltipBoundingRect.height / 2 - 5}px);`
    }

    // tooltip元素位置计算
    let easyTooltipBoundingRect = easyTooltipElem.getBoundingClientRect() || {}
    // 展示的方向
    if (placement === 'top') {
      // 如果顶部不够显示，则显示在底部
      if (easyTooltipBoundingRect.height > targetBoundingRect.top) {
        setEasyTooltipBottom()
      } else {
        setEasyTooltipTop()
      }
    }
    if (placement === 'bottom') {
      // 如果底部不够显示，则显示在顶部
      if (easyTooltipBoundingRect.height > viewportHeight - targetBoundingRect.bottom) {
        setEasyTooltipTop()
      } else {
        setEasyTooltipBottom()
      }
    }
    if (placement === 'left') {
      // 如果左侧不够显示，则显示在右侧
      let leftWidth = targetBoundingRect.left + scrollLeft
      if (easyTooltipBoundingRect.width > leftWidth) {
        setEasyTooltipRight()
      } else {
        setEasyTooltipLeft()
      }
    }
    if (placement === 'right') {
      // 如果右侧不够显示，则显示在左侧
      let rightWidth = scrollWidth - (targetBoundingRect.right + scrollLeft) // 元素在视图右侧剩余的宽度
      if (easyTooltipBoundingRect.width > rightWidth) {
        setEasyTooltipLeft()
      } else {
        setEasyTooltipRight()
      }
    }
  }

  /* 第三步：tooltip绑定鼠标事件，用于延迟关闭 */
  easyTooltipElem.addEventListener('mouseenter', onTooltipMouseEnter)
  easyTooltipElem.addEventListener('mouseleave', onTooltipMouseLeve)
}

/**
 * 元素鼠标离开
 * @param e
 */

const onMouseLeave = function (e) {
  hideTooltipDelay(e)
}

/**
 * tooltip鼠标移入
 * @param e
 */
const onTooltipMouseEnter = function (e) {
  if (hideTooltipTimer) clearTimeout(hideTooltipTimer)
}
/**
 * tooltip鼠标离开
 * @param e
 */
const onTooltipMouseLeve = function (e) {
  hideTooltipDelay(e)
}
/**
 * 隐藏tooltip
 * @param e
 */
const hideTooltipDelay = function (e) {
  if (hideTooltipTimer) clearTimeout(hideTooltipTimer)
  hideTooltipTimer = setTimeout(function () {
    let easyTooltipElem = document.getElementById('easy-tooltip')
    if (easyTooltipElem) {
      // 隐藏tooltip
      easyTooltipElem.style.display = 'none'
      // 移除tooltip绑定的事件
      easyTooltipElem.removeEventListener('mouseenter', onTooltipMouseEnter)
      easyTooltipElem.removeEventListener('mouseleave', onTooltipMouseLeve)
    }
  }, e.target.closeDelay)
}
/**
 * 指令销毁
 * @param el
 * @param binding
 */
const onDestroy = function (el, binding) {
  // 注销元素绑定的事件
  el.removeEventListener('mouseenter', onMouseEnter)
  el.removeEventListener('mouseleave', onMouseLeave)

  // 移除tooltip绑定的事件和元素
  const easyTooltipElem = document.getElementById('easy-tooltip')
  if (easyTooltipElem) {
    easyTooltipElem.removeEventListener('mouseenter', onTooltipMouseEnter)
    easyTooltipElem.removeEventListener('mouseleave', onTooltipMouseLeve)
    easyTooltipElem && document.body.removeChild(easyTooltipElem)
  }
}

// 导出
export default {
  mounted(el, binding) {
    onInit(el, binding)
  },
  updated(el, binding) {
    onInit(el, binding)
  },
  unmounted(el, binding) {
    onDestroy(el, binding)
  }
}
