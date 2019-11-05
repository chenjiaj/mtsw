/**
* Created by chenjiajun on 2019/11/4.
*/
<template>
    <div class="index-wrapper">
        <el-upload
                :data="uploadData"
                class="upload-wrapper"
                drag
                action="/upload"
                multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传markdown文件，且不超过500kb</div>
        </el-upload>

        <div class="btn-wrapper">
            <el-button type="primary">下载markdown</el-button>
            <el-button type="primary">下载图片</el-button>
            <el-button type="primary">全部下载</el-button>
        </div>

        <el-table
                ref="multipleTable"
                :data="listData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="文件名称">
                <template slot-scope="scope">{{ scope.row }}</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        uploadData: {
          uid: ''
        },
        listData: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      async getData() {
        const uid = localStorage.getItem('uid');
        this.uploadData.uid = uid;
        let res = await this.$axios('/list', {
          params: {
            uid
          }
        });
        if (res.code === -1) {
          this.uploadData.uid = res.uid;
          localStorage.setItem('uid', res.uid);
        } else if (res.code === 0) {
          this.listData = res.list;
        }
      },
      handleSelectionChange(val) {
        console.log(val);
      }
    }
  };
</script>

<style lang="less">
    .index-wrapper {
        width: 800px;
        margin: 50px auto;

        .upload-wrapper {
            text-align: center;
        }

        .btn-wrapper{
            text-align: center;
            padding: 50px 0 30px 0;
        }
    }
</style>
