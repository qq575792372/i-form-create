/**
 * easy-form-item表单项组件的hooks
 */
export default function ({props, emits, ref, formRef}) {
  // 实例方法
  /**
   * 获取表单实例
   * @returns {Ref} 当前表单的实例
   */
  const getFormRef = function () {
    return formRef
  }
  /**
   * 获取字段实例
   * @returns {Ref} 当前字段的实例
   */
  const getFieldRef = function () {
    return ref
  }

  // 字段方法
  /**
   * 获取字段配置
   * @returns {Object} 当前字段的配置
   */
  const getField = function () {
    return props.item
  }
  /**
   * 获取字段下标
   * @returns {Object} 当前字段的下标
   */
  const getFieldIndex = function () {
    return props.fields.findIndex(v => v.field === props.item.field)
  }

  // 字段值
  /**
   * 获取字段值
   * @returns {(String|Number|Array|Boolean)} 当前字段的值
   */
  const getValue = function () {
    return props.model[props.item.field]
  }
  /**
   * 设置字段值
   * @param {Any} value 字段的值
   * @param {Boolean} setFieldDesc 设置字段值时，是否同时设置对应的字段描述，默认开启
   */
  const setValue = function (value, setFieldDesc = true) {
    // 设置字段的值
    props.model[props.item.field] = value

    // 设置字段描述的值
    if (setFieldDesc) {
      // 如果值是空，也会清空对应的fieldDesc的值
      if (value) {
        let labelKey = _getLabelValue(props.item)['labelKey']
        let valueKey = _getLabelValue(props.item)['valueKey']
        const current = props.item.props.options.find(v => v[valueKey] === value)
        props.model[props.item['fieldDesc']] = current[labelKey]
      } else {
        props.model[props.item['fieldDesc']] = ''
      }
    }
  }

  // 字段默认值
  /**
   * 获取字段默认值
   * @returns {(String|Number|Array|Boolean)} 当前字段的默认值
   */
  const getDefaultValue = function () {
    return props.item.defaultValue
  }
  /**
   * 设置字段默认值
   * @param {Any} defaultValue 字段的默认值
   */
  const setDefaultValue = function (defaultValue) {
    props.item.defaultValue = defaultValue
  }

  // 字段属性
  /**
   * 获取字段属性
   * @returns {Object} 当前字段的props
   */
  const getProps = function () {
    return props.item.props
  }
  /**
   * 设置字段属性
   * @param {String} key 属性key
   * @param {Any} value 属性值
   */
  const setProps = function (key, value) {
    props.item.props[key] = value
  }

  // 字段校验
  /**
   * 获取字段的rules
   * @description 以标签绑定的rules优先级最高
   * @returns {Array} 当前字段的rules数组
   */
  const getRules = function () {
    return props.item && props.item.rules ? props.item.rules : props.rules[props.item.field]
  }
  /**
   * 设置字段的rules
   * @param {Array} rules 规则数组
   * @param {Boolean} priority 规则优先级，默认以字段内配置的最高，为false则全局配置中的rules优先级最高
   */
  const setRules = function (rules, priority = true) {
    if (priority) {
      this.$set(props.item, 'rules', rules)
    } else {
      this.$set(props.item, props.item.field, rules)
    }
  }

  // 字段选项数据
  /**
   * 获取单个字段选项数据
   */
  const getOptions = function () {
    return (props.item.props && props.item.props.options) || []
  }
  /**
   * 设置单个字段选项数据
   * @param {Array} arr 设置的数组值
   */
  const setOptions = function (arr = []) {
    props.item.options = arr
  }
  // 字段请求配置
  /**
   * 获取单个字段的请求配置数据
   */
  const getRequest = function () {
    return props.item.request || {}
  }
  /**
   * 设置单个字段的请求配置数据
   * @param {Object} setting 请求的配置
   */
  const setRequest = function (setting = {url: '', method: 'get', params: {}, dataName: 'data.result'}) {
    props.item.request = {...props.item.request, ...setting}
  }

  /** ******************* 组件内部函数使用的方法 ******************** */
  /**
   * 获取选项数据对应的label和value的名称
   * @description 默认返回label、value、children，否则返回labelKey/valueKey/childrenKey对应的值
   * @param {Object} item 当前字段的配置
   * @private
   * @returns {Object} 返回labelKey、valueKey、childrenKey
   */
  const _getLabelValue = function (item) {
    // 获取配置中的键名和值名，支持以下几种写法
    const labelKey = item.props['labelKey'] || item.props['label-key']
    const valueKey = item.props['valueKey'] || item.props['value-key']
    const childrenKey = item.props['childrenKey'] || item.props['children-key']
    // 返回统一的key名称
    return {
      labelKey: labelKey || 'label',
      valueKey: valueKey || 'value',
      childrenKey: childrenKey || 'children'
    }
  }

  return {
    getField,
    getFieldRef,
    getFieldIndex,
    getValue,
    setValue,
    getDefaultValue,
    setDefaultValue,
    getProps,
    setProps,
    getRules,
    setRules,
    getOptions,
    setOptions,
    getRequest,
    setRequest
  }
}
