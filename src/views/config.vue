<template>
  <div class="info_box">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="客服微信图片" prop="cover">
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="uploadLogo"
          :multiple="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="ruleForm.wx_img" :src="ruleForm.wx_img" width="200px" />
          <el-button v-else><i class="el-icon-upload2"></i> 点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            不超过1M 建议上传透明PNG图片
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="支付开关">
        <el-switch
          v-model="ruleForm.pay_sta"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
        <p class="tips">开启后提交结果将需要支付</p>
      </el-form-item>
      <el-form-item label="支付金额" prop="price">
        <el-input
          v-model="ruleForm.price"
          placeholder="请填写支付金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付说明" prop="pay_tips">
        <el-input type="textarea" :rows="5"
          v-model="ruleForm.pay_tips"
          placeholder="请填写支付说明"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存信息</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isSave: false,
      ruleForm: {},
    };
  },
  mounted() {

    this.getData();
  },
  computed: {},
  methods: {
    uploadLogo({ file }) {
      this.$ossClient.ossPut(file).then((res) => {
        for (let index = 0; index < res.requestUrls.length; index++) {
          const ossImg = res.requestUrls[index];
          this.ruleForm.wx_img = ossImg;
        }
      });
    },
    async getData() {
      let res = await this.$http.post("/api/info/getconfig", {
        token: localStorage.ai_token,
      });
      if (res.errcode == 0) {
        console.log(res.data);
        this.ruleForm = res.data;
      } else {
        this.$message.error(res.errmsg);
      }
    },
    beforeImgUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    async saveForm() {
      let res = await this.$http.post("/api/info/saveconfig", {
        info: this.ruleForm,
        token: localStorage.ai_token,
      });
      console.log(res);
      if (res.errcode == 0) {
        this.isSave = true;
        this.$message.success("基础资料保存成功");
      } else {
        this.$message.error(res.errmsg);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>