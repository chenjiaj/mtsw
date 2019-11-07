/**
* Created by chenjiajun on 2019/11/4.
*/
<template>
    <div class="index-wrapper">
        <el-upload
                ref="upload"
                :data="uploadData"
                class="upload-wrapper"
                drag
                action="/upload"
                :show-file-list="false"
                :on-success="successUpload"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :limit="10"
                multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传markdown文件，且不超过500kb</div>
        </el-upload>

        <div class="btn-wrapper">
            <el-button type="danger" @click="deleteFiles" :disabled="checkedArr<=0">批量删除</el-button>
            <el-button type="danger" @click="clearAll">全部清空</el-button>
            <el-button type="primary" @click="getData">刷新列表</el-button>
            <el-button type="primary" @click="download('markdown')" :disabled="checkedArr<=0">下载markdown</el-button>
            <el-button type="primary" @click="download('images')" :disabled="checkedArr<=0">下载图片</el-button>
            <el-button type="primary" @click="download" :disabled="checkedArr<=0">下载图片和markdown</el-button>
        </div>

        <el-table
                :data="listData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange" v-if="listData && listData.length>0">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    type="index"
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
        listData: [],
        checkedArr: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      /**
       * 获取文件列表数据
       */
      async getData() {
        if (this.loading === true) {
          return;
        }

        this.loading = true;
        const uid = localStorage.getItem('uid');
        this.uploadData.uid = uid;
        let res = await this.$axios('/list', {
          params: {
            uid
          }
        });
        this.loading = false;
        if (res.code === -1) {
          this.uploadData.uid = res.uid;
          localStorage.setItem('uid', res.uid);
        } else if (res.code === 0) {
          this.listData = res.list;
        }
      },
      /**
       * 上传之前 判断文件类型是否符合要求
       * @param file
       * @returns {boolean}
       */
      beforeUpload(file) {
        if (!/.*.md$/.test(file.name)) {
          this.$message({
            type: 'error',
            message: '只能上传markdown文件'
          });

          return false;
        }

        return true;
      },
      successUpload(res) {
        // if (this.listData.indexOf(res.fileName) === -1) {
        //   this.listData.push(res.fileName)
        // }
        this.getData();

      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      /**
       * 表格选项改变时
       * @param val
       */
      handleSelectionChange(val) {
        this.checkedArr = val;
      },
      async deleteFiles() {
        const res = await this.$axios.post('/deleteFiles', {
          fileNames: this.checkedArr,
          uid: this.uploadData.uid
        });

        if (res.code === 0) {
          this.getData();
        } else {
          this.$message({
            type: 'error',
            message: res.message || '删除失败'
          });
        }
      },
      async clearAll() {
        const res = await this.$axios.post('/clearAll', {
          uid: this.uploadData.uid
        });

        if (res.code === 0) {
          this.getData();
        } else {
          this.$message({
            type: 'error',
            message: res.message || '清空失败'
          });
        }
      },
      async download(type) {
        const res = await this.$axios.get('/download', {
          params: {
            fileNames: JSON.stringify(this.checkedArr),
            uid: this.uploadData.uid,
            type: type || ''
          }
        });

        if (res.code === 0) {
          window.location.href = res.url;
        }
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

        .btn-wrapper {
            text-align: center;
            padding: 50px 0 30px 0;
        }
    }
</style>
