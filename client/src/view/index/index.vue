/**
* Created by chenjiajun on 2019/11/4.
*/
<template>
    <div class="index-wrapper">
        <el-upload
                class="upload-wrapper"
                drag
                action="/upload"
                multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传markdown文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {}
    }
  };
</script>

<style lang="less">
    .index-wrapper{
        width: 800px;
        margin: 0 auto;

        .upload-wrapper{
            text-align: center;
        }
    }
</style>
