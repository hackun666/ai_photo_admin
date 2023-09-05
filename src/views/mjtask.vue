<template>
  <div class="info_box">
    <div class="fliter">
      <div class="fliter_item">
        <el-button type="primary" icon="el-icon-plus" @click="add">新建绘图任务</el-button>
      </div>
        <div class="fliter_item">
          <el-button type="primary" icon="el-icon-refresh" @click="getData">刷新数据</el-button>
        </div>
    </div>

    <div class="eic_table">
      <el-table ref="multipleTable" :data="tableData" stripe border v-loading="loading">
        <el-table-column type="index" width="80" label="编号ID" align="center"></el-table-column>
        <el-table-column align="center" property="addtime" :formatter="dateFormat" label="提交时间"
          width="160"></el-table-column>
        <el-table-column prop="task_id" label="任务ID" align="center" width="160"></el-table-column>
        <el-table-column prop="prompt" label="描述文字" align="center"></el-table-column>
        <el-table-column align="center" label="参考图" width="120">
          <template slot-scope="scope">
            <el-image v-if="scope.row.base_img" :src="scope.row.base_img" :preview-src-list="[scope.row.base_img]"
              style="width: 80px; height: 80px" fit="contain" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="150">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="绘图结果" width="120">
          <template slot-scope="scope">
            <el-image v-if="scope.row.status == 'finished'" :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]" style="width: 80px; height: 80px" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 'finished' && scope.row.api_type == 1 && scope.row.u_task == 0">
              <div>
                <el-tooltip class="item" effect="dark" content="获取左上高清图" placement="top">
                  <el-button @click="update(scope.row.id, 'u1')" type="text" size="small">U1</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="获取右上高清图" placement="top">
                  <el-button @click="update(scope.row.id, 'u2')" type="text" size="small">U2</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="获取左下高清图" placement="top">
                  <el-button @click="update(scope.row.id, 'u3')" type="text" size="small">U3</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="获取右下高清图" placement="top">
                  <el-button @click="update(scope.row.id, 'u4')" type="text" size="small">U4</el-button>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="根据左上图继续创作" placement="top">
                  <el-button @click="update(scope.row.id, 'v1')" type="text" size="small">V1</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="根据右上图继续创作" placement="top">
                  <el-button @click="update(scope.row.id, 'v2')" type="text" size="small">V2</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="根据左下图继续创作" placement="top">
                  <el-button @click="update(scope.row.id, 'v3')" type="text" size="small">V3</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="根据右下图继续创作" placement="top">
                  <el-button @click="update(scope.row.id, 'v4')" type="text" size="small">V4</el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination background :current-page="paginationData.currentPage" :page-size.sync="paginationData.pageSize"
          @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper"
          :total="paginationData.total"></el-pagination>
      </div>
    </div>

    <el-dialog title="填写绘图信息" :visible.sync="qBox" width="600px">
      <el-alert title="提示：图片平均生成时间约1-3分钟" type="info" show-icon>
      </el-alert>
      <br />
      <el-form ref="producerform" label-width="100px">
        <el-form-item label="预设模板">
          <el-select v-model="temp_id" placeholder="请选择" @change="setPrompt">
            <el-option v-for="item in templates" :key="item.id" :label="item.name" :value="item.prompt">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绘图提示">
          <el-input type="textarea" v-model="prompt" :rows="5" placeholder="输入绘图提示词"> </el-input>
        </el-form-item>
        <el-form-item label="参照图片" prop="base_img">
          <el-upload action="" :show-file-list="false" :http-request="uploadHttp" :multiple="false"
            :before-upload="beforeImgUpload">
            <img v-if="base_img" :src="base_img" width="200px" />
            <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议不超过5MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="绘图接口">
          <el-select v-model="api_type" placeholder="请选择">
            <el-option v-for="item in apiList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qBox = false">取 消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="填写绘图信息" :visible.sync="qBox" width="600px">
      <el-form ref="producerform" label-width="100px">
        <el-form-item label="描述">
          <el-input type="textarea" v-model="prompt" :rows="5" placeholder="输入问题prompt"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qBox = false">取 消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </span>
    </el-dialog> -->


    <el-dialog title="预览图片" :visible.sync="previewBox" width="600px">
      <el-image width="100%" :src="img_src" :preview-src-list="[img_src]" fit="contain" />
      <!-- <div>

      </div> -->
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");
export default {
  components: {},
  data() {
    return {
      loading: true,
      tableData: [],
      paginationData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      qBox: false,
      prompt: "",
      base_img: "",
      id: 0,
      img_src: "",
      previewBox: false,
      now_data: {},
      templates: [],
      temp_id: "",
      api_type: "",
      apiList: [
        {
          id: 1,
          name: 'Midjourney Fast',
        },
        {
          id: 2,
          name: 'SDXL 1.0',
        },
      ]
    };
  },
  computed: {},
  mounted() {
    this.getTemplates();
    this.getData();
  },
  methods: {
    update(id, action) {
      this.$confirm("此操作将创建新的任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateTask(id, action);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        })
    },
    async updateTask(id, action) {
      let res = await this.$http.get("/api/info/updatetask", {
        id: id,
        action: action,
        token: localStorage.ai_token,
      });
      if (res.errcode == 0) {
        this.$message.success("任务提交成功");
        this.getData();
      } else {
        this.$message.warning(res.errmsg);
      }
    },
    setPrompt(e) {
      console.log(e)
      this.prompt = e
    },
    async getTemplates() {
      let res = await this.$http.get("/api/info/templates", {
        token: localStorage.ai_token,
      });
      if (res.errcode == 0) {
        this.templates = res.data;
      }
    },
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt10M;
    },
    uploadHttp({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.base_img = ossImg;
        }
      });
    },
    preview(data) {
      this.now_data = data
      this.img_src = data.image_url;
      this.previewBox = true;
    },
    async view(item) {
      if (this.prompt.length < 1) {
        this.$message.warning("画图描述不能为空");
        return;
      }
      let res = await this.$http.get("/api/info/taskinfo", {
        id: item.id,
        token: localStorage.ai_token,
      });
      if (res.errcode == 0) {
        this.result = res.result
        this.result_box = true;
      }
    },
    async saveData() {
      if (this.prompt.length < 1) {
        this.$message.warning("描述词不能为空");
        return;
      }
      let res = await this.$http.get("/api/info/savedata", {
        prompt: this.prompt,
        base_img: this.base_img,
        api_type: this.api_type,
        token: localStorage.ai_token,
      });
      if (res.errcode == 0) {
        this.qBox = false;
        this.prompt = "";
        this.base_img = "";
        this.id = 0;
        this.$message.success("任务提交成功");
        this.getData();
      } else {
        this.$message.warning(res.errmsg);
      }
    },
    add() {
      this.prompt = "";
      this.base_img = "";
      this.id = 0;
      this.qBox = true;
    },
    async getData() {
      let res = await this.$http.get("/api/info/tasklist", {
        token: localStorage.ai_token,
        currentPage: this.paginationData.currentPage,
        pageSize: this.paginationData.pageSize,
      });
      this.loading = false;
      this.tableData = res.data;
      this.paginationData.total = res.total;
    },
    handleCurrentChange(num) {
      this.paginationData.currentPage = num;
      this.getData();
    },
    dele(id) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteInfo(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    async deleteInfo(id) {
      const loading = this.$loading({
        lock: true,
        text: "请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.5)",
      });
      let res = await this.$http.post("/api/info/deleq", {
        token: localStorage.ai_token,
        id: id,
      });
      if (res.errcode == 0) {
        this.$message.success("删除成功");
        loading.close();
        this.getData();
      } else {
        this.$message({
          message: res.msg,
          type: "warning",
        });
      }
    },
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date * 1000).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>

<style lang="less" scoped></style>
