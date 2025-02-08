/**
 * form-create表单组件的hooks
 */

export default function ({ props, emits, formRef }) {
  // 实例方法
  /**
   * 获取表单实例
   * @returns {Ref} 当前表单的实例
   */
  const getFormRef = function () {
    return formRef;
  };
  /**
   * 获取字段实例
   * @param {String} field 字段名称
   * @returns {Ref} 当前字段的实例
   */
  const getFieldRef = function (field) {
    let fieldName = `form-create-item-${field}`;
    return formRef.$refs[fieldName] && formRef.$refs[fieldName][0];
  };

  // 字段方法
  /**
   * 获取字段配置
   * @param {String} field 字段名称
   * @returns {Object} 当前字段的配置
   */
  const getField = function (field) {
    return props.fields.find((item) => item.field === field) || {};
  };
  /**
   * 获取字段下标
   * @param {String} field 字段名称
   * @returns {Object} 当前字段的下标
   */
  const getFieldIndex = function (field) {
    return props.fields.findIndex((v) => v.field === field);
  };

  // 字段值
  /**
   * 获取字段值
   * @param {(String|Number)} field 字段名称
   * @returns {(String|Number|Array|Boolean)} 当前字段的值
   */
  const getValue = function (field) {
    return props.model[field];
  };
  /**
   * 设置字段值
   * @param {String} field 字段名称
   * @param {Any} value 字段的值
   * @param {Boolean} setFieldDesc 设置字段值时，是否同时设置对应的字段描述，默认开启
   */
  const setValue = function (field, value, setFieldDesc = true) {
    // 设置字段的值
    props.model[field] = value;

    // 设置字段描述的值
    if (setFieldDesc) {
      const item = getField(field);
      // 如果值是空，也会清空对应的fieldDesc的值
      if (value) {
        let labelKey = _getLabelValue(item)["labelKey"];
        let valueKey = _getLabelValue(item)["valueKey"];
        const current =
          (item.props && item.props.options && item.props.options.find((v) => v[valueKey] === value)) || {};
        props.model[item["fieldDesc"]] = current[labelKey];
      } else {
        props.model[item["fieldDesc"]] = "";
      }
    }
  };

  // 字段默认值
  /**
   * 获取字段默认值
   * @param {(String|Number)} field 字段名称
   * @returns {(String|Number|Array|Boolean)} 当前字段的默认值
   */
  const getDefaultValue = function (field) {
    const item = getField(field);
    return item.defaultValue;
  };
  /**
   * 设置字段默认值
   * @param {String} field 字段名称
   * @param {Any} defaultValue 字段的默认值
   */
  const setDefaultValue = function (field, defaultValue) {
    const itemIndex = getFieldIndex(field);
    if (itemIndex > -1) {
      props.fields[itemIndex]["defaultValue"] = defaultValue;
    }
  };

  // 字段属性
  /**
   * 获取字段属性
   * @param {String} field 字段名称
   * @returns {Object} 当前字段的props
   */
  const getProps = function (field) {
    const item = getField(field);
    return item.props;
  };
  /**
   * 设置字段属性
   * @param {String} field 字段名称
   * @param {String} key 属性key
   * @param {Any} value 属性值
   */
  const setProps = function (field, key, value) {
    const itemIndex = getFieldIndex(field);
    if (itemIndex > -1) {
      if (!props.fields[itemIndex].props) {
        props.fields[itemIndex].props = {};
      }
      props.fields[itemIndex].props[key] = value;
    }
  };

  // 字段校验
  /**
   * 获取字段的rules
   * @description 以标签绑定的rules优先级最高
   * @param {String} field 字段名称
   * @returns {Array} 当前字段的rules数组
   */
  const getRules = function (field) {
    const item = getField(field);
    return item && item.rules ? item.rules : props.rules[field];
  };
  /**
   * 设置字段的rules
   * @param {String} field 字段名称
   * @param {Array} rules 规则数组
   * @param {Boolean} priority 规则优先级，默认以字段内配置的最高，为false则全局配置中的rules优先级最高
   */
  const setRules = function (field, rules, priority = true) {
    if (priority) {
      const itemIndex = getFieldIndex(field);
      if (itemIndex > -1) {
        props.fields[itemIndex]["rules"] = rules;
      }
    } else {
      props.rules[field] = rules;
    }
  };

  // 字段选项数据
  /**
   * 获取单个字段选项数据
   * @param {String} field 字段名称
   */
  const getOptions = function (field) {
    const item = getField(field);
    return (item.props && item.props.options) || [];
  };
  /**
   * 设置单个字段选项数据
   * @param {String} field 字段名称
   * @param {Array} arr 设置的数组值
   */
  const setOptions = function (field, arr = []) {
    const itemIndex = getFieldIndex(field);
    if (itemIndex > -1) {
      props.fields[itemIndex].props["options"] = arr;
    }
  };
  // 字段请求配置
  /**
   * 获取单个字段的请求配置数据
   * @param {String} field 字段名称
   */
  const getRequest = function (field) {
    const item = getField(field);
    return item.request || {};
  };
  /**
   * 设置单个字段的请求配置数据
   * @param {String} field 字段名称
   * @param {Object} setting 请求的配置
   */
  const setRequest = function (field, setting = { url: "", method: "get", params: {}, dataName: "data.result" }) {
    const itemIndex = getFieldIndex(field);
    if (itemIndex > -1) {
      props.fields[itemIndex].request = { ...props.fields[itemIndex].request, ...setting };
    }
  };

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
    const labelKey = item.props["labelKey"] || item.props["label-key"];
    const valueKey = item.props["valueKey"] || item.props["value-key"];
    const childrenKey = item.props["childrenKey"] || item.props["children-key"];
    // 返回统一的key名称
    return {
      labelKey: labelKey || "label",
      valueKey: valueKey || "value",
      childrenKey: childrenKey || "children",
    };
  };

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
    setRequest,
  };
}
