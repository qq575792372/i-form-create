# FormCreate 使用说明

`FormCreate`是一款轻量级`动态表单`组件，提供常规的表单新增、编辑、字段联动、插槽等功能，开发时只需要按照数据结构配置配置对应的字段即可。

## 开始

```html
import {FormCreate} from '@ivu-plus/i-form-create'
<FormCreate ref="formCreateRef" :layout="formLayout" :fields="formFields" :rules="formRules" :model="formModel" />
```

## 使用

### 回调方法

目前组件提供的回调方法有 `submit`、`submit-success`、`submit-failed`、 `reset`、`cancel`。

```html
<FormCreate
  ref="formCreateRef"
  editable
  :fields="formFields"
  @submit="onSubmit"
  @submit-success="onSubmitSuccess"
  @submit-failed="onSubmitFailed"
  @reset="onReset"
  @cancel="onCancel"
/>
```

```javascript
export default {
  // 在methods中
  methods: {
    /* callback 回调 */
    // 表单提交
    onSubmit(formData) {
      console.log("onSubmit回调", formData);
    },
    // 表单提交成功
    onSubmitSuccess(formData) {
      console.log("onSubmitSuccess回调", formData);
    },
    // 表单提交失败
    onSubmitFailed(error) {
      console.log("onSubmitFailed回调", error);
    },
    // 表单重置
    onReset() {
      console.log("onReset回调");
    },
    // 表单取消
    onCancel() {
      console.log("onCancel回调");
    }
  }
};
```

### 实例方法

实例方法是调用组件的 ref 实例中的方法，可以操作表单的校验，以及表单字段的方法。

```html
<FormCreate ref="formCreateRef" editable :layout="formLayout" :fields="formFields" :rules="formRules" :model="formModel" />

// 表单ref const formCreateRef = ref(null); // 使用表单实例的方法 const formData = formCreateRef.getFormData();
console.log('表单数据', formData) // 设置某个字段的值 formCreateRef.setValue('userName', '大黄') //
获取字段对应的element组件实例，调用其提供的方法 const userNameRef = formCreateRef.getFieldRef('userName') userNameRef.focus()
```

## 字段配置

一个完整的字段配置包含有：  
`字段基础属性配置`：字段配置的基础信息，包含字段的主要信息和样式布局信息，是必要的。  
`字段 props 属性配置`：支持 element-ui 对应组件的所有属性，并且这里不区分是驼峰还是短横写法。  
`字段 rules 校验配置`：当前字段的校验，在表单配置`:rules`中也接收一个`全局rules`，如果两边都配置了，以字段配置中`rules`
的优先级最高。
`字段 request 请求配置`：作用是通过自定义 url 获取到选项数据，基本是在 `Select` 和 `Cascader` 组件中使用。  
`字段 effects 联动配置`：作用是通过配置变量表达式或函数表达式的方式，解析后改变自身或其他字段的属性，更方便操作交互。
`字段 events 事件配置`：支持 element-ui 对应组件的所有事件，具体写法也在下面有详细说明。

### 字段基础属性配置

目前字段的 type
有：`text`,`input`,`textarea`,`input-number`,`select`,`radio`,`checkbox`,`switch`,`date`,`time`,`datetime`,`cascader`,`custom`

```javascript
const item = {
  /* 基础属性 */
  field: '字段名称',
  fieldDesc: '字段描述名称', // 如果field是id之类的，需要显示中文，则会默认取fieldDesc的名称
  label: '标签名称',
  type: '字段类型',
  hidden: false,
  defaultValue: '字段默认值',

  /* 样式属性 */
  span: 12,
  class: 'custom-class',
  style: 'width:240px;' // 样式可以用String字符串，也可以用Object对象形式
  // style: {width: '240px', color: 'red'},
}
```

### 字段 props 属性配置

element 官方对应组件支持的属性，这里不区分是驼峰还是短横写法

```javascript
const item = {
  /* 字段属性 */
  props: {
    type: 'input',
    placeholder: '请输入',
    disabled: false,
    clearable: true,
    maxlength: 20,
    showWordLimit: true,
    options: [], // select，radio，checkbox，cascader的选项数据
    'label-key': 'label',
    'value-key': 'value'
  }
}
```

### 字段 rules 校验配置

```javascript
const item = {
  /* 字段校验 */
  rules: [{required: true, message: '请输入', trigger: 'blur'}]
}
```

### 字段 request 请求配置

这里有个注意点，dataName
配置的是返回数据的目标对象，返回的数据结构是：`{code:200, data:{rows:[], pages:{current:1,pageSize:20}}}`，要取到 `rows`
列表这一级则是：`dataName:'data.rows',`

```javascript
const item = {
  /* 字段请求 */
  request: {url: '', method: 'get', params: {}, dataName: 'data.dicItems'}
}
```

### 字段 effects 联动配置

联动分为 `created` 和 `changed` 两个属性，表示`初始化`和`改变时`两种，支持变量表达式和函数表达式。

变量表达式：  
变量表达式就是通过字段名操作字段的属性，只能支持最简单的变量，不支持复杂的逻辑。  
变量中可以使用占位符，目前占位符有：  
`%value`：代表获取到当前字段的值。

```bash
deptOid.defaultValue='123'; deptOid.props.disabled=true;deptOid.request.params.unitCode=%value;
```

函数表达式：  
基于以上变量的简单性，负责需要逻辑的就需要使用函数表达式了，函数表达式使用回调函数的方式，参数是固定的。

```bash
# value 标识该字段的值
# item 当前字段的配置
# ref 当前字段的ref实例
# formRef 表单组件的ref实例，可以通过这个调用表单中的submit等方法
(value, item, ref, formRef) => {
  console.log("单位联动", value, item, ref, formRef);
  // 这里演示初始化时如果单位为空，则也会默认禁用部门
  if (value === "0002") {
    formRef.setProps("deptOid", "disabled", true);
  } else {
    formRef.setProps("deptOid", "disabled", false);
  }
}
```

整合起来如下：

```javascript
const item = {
  /* 字段联动 */
  effects: {
    created: 'deptOid.defaultValue="123"; deptOid.props.disabled=true; deptOid.request.params.unitCode=%value;',
    changed: `(value, item, ref, formRef) => {
      console.log("单位联动", value, item, ref, formRef);
      // 这里演示初始化时如果单位为空，则也会默认禁用部门
      if (value === "0002") {
        formRef.setProps("deptOid", "disabled", true);
      } else {
        formRef.setProps("deptOid", "disabled", false);
      }
    }`
  }
}
```

### 字段 events 事件配置

events 事件是可以支持 element 对应组件的，事件的参数是根据官方该组件的参数动态的。

事件的参数：

```bash
value 标识该字段的值
item 当前字段的配置
ref 当前字段的ref实例
formRef 表单组件的ref实例，可以通过这个调用表单中的submit等方法
```

input-number 的改变事件是：

```js
const events = {
  change: '(newValue, oldValue, item, ref, formRef) => { /*这里写事件内容*/ }'
}
```

input，select，radio，checkbox，cascader 等的事件：  
`这里需要注意下 clear 事件官方是没有回传值，所以这里也就没有第一个参数了`

```js
const events = {
  input: '(value, item, ref, formRef) => { /*这里写事件内容*/ }',
  change: '(value, item, ref, formRef) => { /*这里写事件内容*/ }',
  clear: '(item, ref, formRef) => { /*这里写事件内容*/ }'
}
```

这里说明一下 ref 和 formRef 参数的使用方法，两者的区别是：ref 是字段元素的实例，formRef 是字段元素中获取到父表单组件的实例。

ref 的使用示例：

```js
const events = {
  change: (value, item, ref, formRef) => {
    // 第一种，直接调用该字段元素的方法
    ref.setProps('disabled', true)

    /* 第二种，获取到父表单的formRef来控制其他的字段，用formRef和getFormRef()都可以 */
    ref.getFormRef().setProps('name', 'disabled', true)
    // 这种是props传递到字段中了formRef实例，和用封装了的getFormRef()一样
    ref.formRef.setProps('name', 'disabled', true)
  }
}
```

formRef 的使用示例：

```js
const events = {
  change: (value, item, ref, formRef) => {
    // 在父表单中设置下面的某个字段
    formRef.setProps('deptOid', 'disabled', true)
  }
}
```

### 完整配置示例

```javascript
const item = {
  /* 基础属性 */
  field: '字段名称',
  fieldDesc: '字段描述名称',
  label: '标签名称',
  type: '字段类型',
  defaultValue: '字段默认值',

  /* 样式属性 */
  span: 12,
  class: 'custom-class',
  style: 'width:240px;', // 样式可以用String字符串，也可以用Object对象形式
  style: {width: '240px', color: 'red'},

  /* 字段属性 */
  props: {
    /* el组件支持的属性，支持所有的属性，并且这里不区分是驼峰还是短横写法 */
    type: 'input',
    placeholder: '请输入',
    disabled: false,
    clearable: true,
    maxlength: 20
  },

  /* 字段校验 */
  rules: [{required: true, message: '请输入', trigger: 'blur'}],

  /* 字段请求 */
  request: {url: '', method: 'get', params: {}, dataName: 'data.dicItems'},

  /* 字段联动 */
  effects: {
    created: "deptOid.defaultValue='123'; deptOid.props.disabled=true;", // 字段初始化时候，支持变量表达式
    changed: '' // 字段改变时候，支持变量表达式和函数表达式
  },

  /* 字段事件 */
  events: {
    change: '(value, item, ref, formRef) => { /*这里写事件内容*/ }',
    clear: '(item, ref, formRef) => { /*这里写事件内容*/ }'
  }
}
```

## 插槽配置

如果配置字段中自带的表单组件不满足使用，也可以用自定义插槽的方式，并且插槽中是可以支持数据双向绑定的，插槽传递过来的参数有：  
`formModel（表单数据）`、`formItem（表单字段项）`、`formFields（表单字段配置集）`、`formRules（表单校验）`

### 字段具名插槽

字段配置中，每个字段可以对应一个插槽，先配置`type:"slot"`，插槽名就是`field`名。

```javascript
const fields = [
  {
    type: 'slot',
    field: 'status',
    label: '业务状态',
    span: 8
  },
  {
    type: 'slot',
    field: 'degree',
    label: '学历',
    span: 8
  }
]
```

在使用时，插槽名用`field`配置的名称即可，并且插槽的参数已经把需要的数据回传来了，按照需要进行双向绑定以及其他操作。

```vue
<template>
  <FormCreateDemo v-bind="getAttrs" v-on="getEvents">
    <template #degree="{formModel, formItem, formFields, formRules}">
      <el-select v-model="formModel.degree">
        <el-option label="高中" value="1" />
        <el-option label="大专" value="2" />
        <el-option label="本科" value="3" />
      </el-select>
    </template>
    <template #status="{formModel, formItem, formFields, formRules}">
      <el-tag type="primary" v-if="formModel.status === '1'">已开启</el-tag>
      <el-tag type="warning" v-if="formModel.status === '2'">未开启</el-tag>
      <el-tag type="danger" v-if="formModel.status === '3'">已关闭</el-tag>
    </template>
  </FormCreateDemo>
</template>
```

### 字段公用插槽

通过`field`定义的具名插槽是能有效帮助解决问题，某一个字段组件类型没有那就就写个插槽，但是当量级上来了之后就会比较瓶颈了。  
假如我们有几十个字段，这些字段都是用同一个`CustomInput`自定义组件，我们自然不希望每个具名插槽中都要写一遍，这时可以用组件提供的字段公用插槽实现，也能正常进行数据双向绑定。

在字段配置中`type:"slot"`，然后可以统一用某一个插槽名称`slotName`

```javascript
const fields = [
  {
    type: 'slot',
    field: 'test1',
    slotName: 'CustomInput',
    label: '自定义输入框1',
    span: 8
  },
  {
    type: 'slot',
    field: 'test2',
    slotName: 'CustomInput',
    label: '自定义输入框2',
    span: 8
  }
]
```

为不同字段配置同一个插槽，同样可以和`字段具名插槽`
混用，这里需要注意公用同一个插槽时，绑定数据是需要`v-model="formModel[formItem.field]"`
这样写，甚至你也可以绑定个事件方法，传递到你自己写的方法里来处理。  
`formItem`就是当前字段配置，也就是上面字段配置中的，我们通过里面的`field`名称来给`formModel`赋值，这样就实现了双向绑定。

```vue
<template>
  <FormCreateDemo v-bind="getAttrs" v-on="getEvents">
    <template #degree="{formModel, formItem, formFields, formRules}">
      <el-select v-model="formModel.degree">
        <el-option label="高中" value="1" />
        <el-option label="大专" value="2" />
        <el-option label="本科" value="3" />
      </el-select>
    </template>
    <template #status="{formModel, formItem, formFields, formRules}">
      <el-tag type="primary" v-if="formModel.status === '1'">已开启</el-tag>
      <el-tag type="warning" v-if="formModel.status === '2'">未开启</el-tag>
      <el-tag type="danger" v-if="formModel.status === '3'">已关闭</el-tag>
    </template>

    <!--为不同字段统一定义同一种类型的插槽-->
    <template #CustomInput="{formModel, formItem, formFields, formRules}">
      <!--这里根据字段的formItem，绑定不同的字段值-->
      <el-input v-model="formModel[formItem.field]" />
    </template>
  </FormCreateDemo>
</template>
```

## Api方法

### 表单组件方法

表单组件方法是通过表单 ref 去操作，同样可以传入某个字段的 field 名称操作该字段。

```javascript
const methods = {
  /* 表单方法 */
  // 表单提交
  submit(callback) {},
  // 表单重置，并移除所有校验
  reset() {},
  // 表单取消，一般用作弹框表单的关闭
  cancel() {},
  // 获取表单数据，获取到是未校验的数据
  getFormData() {},

  /* 校验方法 */
  // 表单校验
  validate(callback) {},
  // 表单单个字段进行校验
  validateField(field, callback) {},
  // 重置单个表单项，将其值重置为初始值，并移除校验结果
  resetField(field) {},
  // 重置所有表单项，将其值重置为初始值，并移除校验结果
  resetFields(field) {},
  // 清除单个字段的校验
  clearValidate(field) {},

  /* 字段方法 */
  // 获取字段配置
  getField(field) {},
  // 获取字段实例
  getFieldRef(field) {},
  // 获取字段下标
  getFieldIndex(field) {},
  // 获取字段值
  getValue(field) {},
  // 设置字段值
  setValue(field, value, setFieldDesc = true) {},
  // 获取字段默认值
  getDefaultValue(field) {},
  // 设置字段默认值
  setDefaultValue(field, value) {},
  // 获取字段属性
  getProps(field) {},
  // 设置字段属性
  setProps(field, key, value) {},
  // 获取字段的rules
  getRules(filed) {},
  // 设置字段的rules
  setRules(field, rules, priority = true) {
    /* priority为true则优先取字段中的rules，为false则优先取表单全局的rules */
  },
  // 获取单个字段选项数据
  getOptions(field) {},
  // 设置单个字段选项数据
  setOptions(field, value) {},
  // 获取单个字段的请求配置数据
  getRequest(field) {},
  // 设置单个字段的请求配置数据
  setRequest(field, setting = {url: '', method: 'get', params: {}, dataName: 'data.result'}) {}
}
```

### 表单字段方法

表单字段方法是直接操作的该字段本身，是不需要传递 field 参数。

```javascript
const methods = {
  // 获取父组件表单的实例
  getFormRef() {
    /* 必须父组件注入了formRef实例才可以 */
  },
  // 获取字段配置
  getField() {},
  // 获取字段下标
  getFieldIndex() {},
  // 获取字段值
  getValue() {},
  // 设置字段值
  setValue(value, setFieldDesc = true) {},
  // 获取字段默认值
  getDefaultValue() {},
  // 设置字段默认值
  setDefaultValue(value) {},
  // 获取字段属性
  getProps() {},
  // 设置字段属性
  setProps(key, value) {},
  // 获取字段的rules
  getRules() {},
  // 设置字段的rules
  setRules(rules, priority = true) {
    /* priority为true则优先取字段中的rules，为false则优先取表单全局的rules */
  },
  // 获取单个字段选项数据
  getOptions() {},
  // 设置单个字段选项数据
  setOptions(value) {},
  // 获取单个字段的请求配置数据
  getRequest() {},
  // 设置单个字段的请求配置数据
  setRequest(setting = {url: '', method: 'get', params: {}, dataName: 'data.result'}) {}
}
```

## 演示数据示例

综合以上的功能，最后附上配置示例，可以拷贝下面json数据到`平台组件-表单容器`的配置中。

formModel表单数据：

```json
{
  "userId": 2,
  "unitOid": 33,
  "deptOid": 400,
  "testText": "这是新改变的文本",
  "testText1": "这是个长文本这是个长文本这是这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本这是个长文本个长文本这是个长文本这是个长文本这是个长文本这是个长文本",
  "userName": "小张",
  "userName1": "小红",
  "testHiddenInput": "测试",
  "testNum": 11,
  "testSelect": "1",
  "testSelectDesc": "语文",
  "testSelect1": "1",
  "testSelectDesc1": "男",
  "testSelect2": "1",
  "testSelectDesc2": "男",
  "testSelect3": "1",
  "testSelectDesc3": "张三",
  "testSelect4": "1",
  "testSelectDesc4": "张三",
  "testSelect5": "1",
  "testSelectDesc5": "语文",
  "testCheckbox": ["1", "2"],
  "testCheckboxDesc": "语文，数学",
  "testRadio": "1",
  "testRadioDesc": "男",
  "testDate": "2023-03-18",
  "testDateRanger": ["2023-01-10", "2023-02-10"],
  "testDateRangerDesc": "2023-01-10至2023-02-10",
  "testTime": "12:10:10",
  "testTimeRange": ["12:10:20", "13:49:10"],
  "testTimeRangeDesc": "12:10:20至13:49:10",
  "testDatetime": "2023-03-18 14:10:10",
  "testDatetimeRanger": ["2023-01-10 14:10:10", "2023-02-10 14:10:10"],
  "testDatetimeRangerDesc": "2023-01-10 14:10:10至2023-02-10 14:10:10",
  "testCascader": "1-1",
  "testCascaderDesc": "广东/广州",
  "testCascader1": "0201",
  "testCascader1Desc": "机关人员/公务员",
  "testOpen": false,
  "testOpenDesc": "关",
  "remark": "备注信息"
}
```

formFields表单字段配置：

```json
[
  {
    "type": "hidden",
    "field": "userId",
    "defaultValue": "1"
  },
  {
    "type": "text",
    "field": "testText",
    "label": "普通文本",
    "defaultValue": "这是个文本",
    "class": "",
    "span": 12,
    "style": ""
  },
  {
    "type": "input",
    "field": "userName",
    "label": "姓名",
    "defaultValue": "",
    "props": {
      "type": "text",
      "placeholder": "请输入姓名",
      "disabled": false,
      "clearable": true,
      "hidden": false,
      "maxlength": 20
    }
  },
  {
    "field": "unitOid",
    "fieldDesc": "unitName",
    "label": "单位",
    "type": "select",
    "defaultValue": "0001",
    "props": {
      "lazy": false,
      "placeholder": "请选择单位",
      "clearable": true,
      "labelKey": "unitName",
      "valueKey": "unitCode",
      "options": [
        {
          "unitName": "人才工作局",
          "unitCode": "0001"
        },
        {
          "unitName": "科技创新局",
          "unitCode": "0002"
        },
        {
          "unitName": "文化旅游局",
          "unitCode": "0003"
        }
      ]
    },
    "request": {
      "url": "http://192.183.8.208:11204/mockApi/5Q42R7t820ac8775fb1d4e9465262befca8937131c8b015/getUnit",
      "method": "get",
      "params": {},
      "dataName": "data.result"
    },
    "effects": {
      "created": "(value, item, ref, formRef) => { let deptOid = formRef.getField('deptOid'); if(value) { deptOid.props.disabled=false; } else { deptOid.props.disabled=true; } }",
      "changed": "deptOid.props.disabled=false; deptOid.request.params.unitCode = %value;"
    },
    "events": {
      "change": "(value, item, ref, formRef) => { console.log('单位改变', value, item, ref, formRef);}",
      "clear": "(item, ref, formRef) => { console.log('单位重置', item, ref, formRef);}"
    }
  },
  {
    "field": "deptOid",
    "fieldDesc": "deptName",
    "label": "部门",
    "type": "select",
    "defaultValue": "00010001",
    "props": {
      "lazy": true,
      "placeholder": "请选择部门",
      "clearable": true,
      "labelKey": "deptName",
      "valueKey": "deptCode",
      "disabled": true,
      "options": [
        {
          "deptName": "人才一组",
          "deptCode": "00010001"
        },
        {
          "deptName": "人才二组",
          "deptCode": "00010002"
        },
        {
          "deptName": "人才三组 ",
          "deptCode": "00010003"
        }
      ]
    },
    "request": {
      "url": "http://192.183.8.208:11204/mockApi/5Q42R7t820ac8775fb1d4e9465262befca8937131c8b015/getDepartment",
      "method": "get",
      "params": {
        "unitCode": "0001"
      },
      "dataName": "data.result"
    },
    "events": {
      "change": "(value, item, ref, formRef) => {console.log('部门改变', value, item, ref, formRef);}"
    }
  },
  {
    "type": "cascader",
    "field": "dutyLevel",
    "label": "省市区",
    "defaultValue": "1-1",
    "props": {
      "options": [
        {
          "value": "1",
          "label": "广东",
          "children": [
            {
              "value": "1-1",
              "label": "广州"
            },
            {
              "value": "1-2",
              "label": "深圳"
            }
          ]
        },
        {
          "value": "2",
          "label": "湖南",
          "children": [
            {
              "value": "2-1",
              "label": "长沙"
            }
          ]
        }
      ]
    }
  },
  {
    "type": "date",
    "field": "createDate",
    "label": "创建日期",
    "defaultValue": "2024-04-09",
    "props": {
      "valueFormat": "YYYY-MM-DD"
    }
  },
  {
    "type": "date",
    "field": "dateRange",
    "label": "日期时间段",
    "defaultValue": ["2024-04-09", "2024-04-11"],
    "props": {
      "type": "daterange",
      "valueFormat": "YYYY-MM-DD"
    }
  }
]
```

formRules表单校验：

```json
{
  "userName": [
    {
      "required": true,
      "message": "姓名不能为空",
      "trigger": "blur"
    }
  ]
}
```
