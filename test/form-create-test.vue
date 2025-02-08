<template>
  <form-create :model="formConfig.model" :fields="formConfig.fields" />
</template>

<script setup>
import { ref } from "vue";
import { FormCreate } from "@/components/index.js";

const formConfig = ref({
  model: {
    type: "",
    days: "",
    reason: "",
    userInfo: {
      name: "",
      mobile: "",
      deptName: "",
    },
    destinations: [
      {
        address: "",
        startDate: "",
        endDate: "",
      },
      { address: "地址2", startDate: "2024-11-01", endDate: "2024-11-20" },
    ],
  },
  fields: [
    {
      field: "type",
      label: "请假类型",
      type: "select",
      defaultValue: "1",
      span: 8,
      props: {
        placeholder: "请选择请假类型",
        options: [
          { type: "1", name: "年休假" },
          { type: "2", name: "探亲假" },
          { type: "3", name: "丧假" },
          { type: "4", name: "病假" },
          { type: "5", name: "事假" },
          { type: "6", name: "婚假" },
          { type: "7", name: "产假" },
          { type: "8", name: "陪产假" },
          { type: "9", name: "看护假" },
          { type: "10", name: "节育手术假" },
          { type: "11", name: "哺乳假" },
          { type: "12", name: "护理假" },
          { type: "13", name: "育儿假" },
        ],
        labelKey: "name",
        valueKey: "type",
      },
    },
    {
      field: "days",
      label: "请假天数",
      type: "input",
      span: 8,
      defaultValue: "2",
      props: {
        placeholder: "请输入请假天数",
      },
    },
    {
      field: "reason",
      label: "请假原因",
      type: "textarea",
      defaultValue: "过年请假",
      span: 8,
      props: {
        rows: 4,
        placeholder: "请输入请假原因",
      },
    },
    {
      field: "userInfo.name",
      label: "申请人",
      type: "input",
      span: 8,
      defaultValue: "张三",
      props: {
        placeholder: "请输入申请人",
      },
    },
    {
      field: "userInfo.mobile",
      label: "联系电话",
      type: "input",
      defaultValue: "1222222",
      span: 8,
      props: {
        placeholder: "请输入联系电话",
      },
    },
    {
      field: "userInfo.deptName",
      label: "单位名称",
      type: "input",
      defaultValue: "事业部",
      span: 8,
      props: {
        placeholder: "请输入单位名称",
      },
    },
    {
      field: "destinations",
      label: "国内目的地",
      type: "children",
      span: 24,
      children: [
        {
          field: "address",
          label: "目的地",
          type: "input",
          defaultValue: "目的地1",
          props: {
            placeholder: "请输入目的地",
          },
          span: 8,
          labelWidth: 0,
        },
        {
          field: "startDate",
          label: "开始时间",
          type: "date",
          defaultValue: "2020-10-10",
          span: 8,
          props: {
            type: "date",

            placeholder: "请选择开始时间",
          },
          labelWidth: 0,
        },
        {
          field: "endDate",
          label: "结束时间",
          type: "date",
          defaultValue: "2020-11-21",
          span: 8,
          props: {
            type: "date",
            placeholder: "请选择结束时间",
          },
          labelWidth: 0,
        },
      ],
    },
  ],
});
</script>

<style scoped lang="scss"></style>
