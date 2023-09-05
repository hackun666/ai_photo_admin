<template>
    <div class="info_box">
        <div class="fliter">
            <div class="fliter_item">
                <el-button type="primary" icon="el-icon-goods" @click="buy">购买密钥</el-button>
            </div>
            <div class="fliter_item">
                <el-button type="success" icon="el-icon-key" @click="active">激活密钥</el-button>
            </div>
        </div>

        <div class="eic_table">
            <el-table ref="multipleTable" :data="tableData" stripe border v-loading="loading">
                <el-table-column type="index" width="80" label="编号ID" align="center"></el-table-column>
                <el-table-column prop="api_key" label="密钥口令" align="center"></el-table-column>
                <el-table-column prop="num" label="剩余次数" align="center"></el-table-column>
                <el-table-column align="center" property="time" :formatter="dateFormat" label="生成时间"></el-table-column>
            </el-table>
            <div class="pagination-wrap">
                <el-pagination background :current-page="paginationData.currentPage"
                    :page-size.sync="paginationData.pageSize" @current-change="handleCurrentChange"
                    layout="total, prev, pager, next, jumper" :total="paginationData.total"></el-pagination>
            </div>
        </div>
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
        };
    },
    computed: {},
    mounted() {
        this.getData();
    },
    methods: {
        buy() {
            window.open('https://shop.51fkba.com/details/8D43A80D');      
        },
        active(index, row) {
            this.$prompt("请输入购买到的密钥key", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(({ value }) => {
                    this.saveKey(value);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入",
                    });
                });
        },
        async saveKey(key) {
            let res = await this.$http.get("/api/info/active", {
                token: localStorage.ai_token,
                key: key,
            });
            if (res.errcode == 0) {
                this.$message.success("激活成功");
                this.getData();
            } else {
                this.$message({
                    message: res.errmsg,
                    type: "warning",
                });
            }
        },
        async getData() {
            let res = await this.$http.get("/api/info/keylist", {
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
