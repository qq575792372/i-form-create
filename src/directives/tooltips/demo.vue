<template>
  <div class="easy-tooltip-demo">
    <div class="content">
      <div class="title">提示方向</div>
      <el-row>
        <el-col :span="6">
          <div>提示方向-上</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1, placement: 'top', zIndex: 3000 }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>
        <el-col :span="6">
          <div>提示方向-下</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1, placement: 'bottom' }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>
        <el-col :span="6">
          <div>提示方向-左</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1, placement: 'right' }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>

        <el-col :span="6">
          <div>提示方向-右</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1, placement: 'right' }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">文本超出指定行提示</div>
      <el-row>
        <el-col :span="6">
          <div>超出1行提示</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1 }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>超出2行提示</div>
            <div class="easy-tooltip-text">
              <div v-easy-tooltip="{ line: 2 }">
                这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>超出3行提示</div>
            <div class="easy-tooltip-text">
              <div v-easy-tooltip="{ line: 3 }">
                这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>自适应高度超出行提示</div>
            <div class="easy-tooltip-text" style="height: 64px">
              <!-- This is a comment -->
              <div v-easy-tooltip="{ line: 'auto' }">
                这是一段很长的文字这是一段很长的文这是一段很长的文字这是一段很长的文这是一段很长的文字这是一段很长的文
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">延迟关闭</div>
      <el-row>
        <el-col :span="6">
          <div>延迟1秒关闭</div>
          <div class="easy-tooltip-text" v-easy-tooltip="{ line: 1, closeDelay: 1000 }">
            这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>延迟2秒关闭</div>
            <div class="easy-tooltip-text">
              <div v-easy-tooltip="{ line: 2, closeDelay: 2000 }">
                这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
// 引入easy-tooltip指令
import vEasyTooltip from "./index.js";
import { onMounted, ref } from "vue";

const position = ref({});
onMounted(() => {
  document.addEventListener("mousedown", function (e) {
    position.value = {
      x: e.x,
      y: e.y,
    };
  });
});
</script>

<style scoped lang="scss">
.easy-tooltip-demo {
  padding: 16px;
  width: 1900px;

  .content {
    height: 400px;
    border: solid 1px red;
    padding: 16px;
    margin-bottom: 16px;

    .title {
      font-weight: bold;
    }
  }

  .easy-tooltip-text {
    width: 200px;
    padding: 24px;
    margin: 12px 0;
    background: #ccc;
    border: solid 1px red;
    position: relative;
  }
}
</style>
