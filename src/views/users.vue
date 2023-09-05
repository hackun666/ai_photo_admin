<template>
    <div class="info_box">

        <div class="eic_table">
            <el-table ref="multipleTable" :data="tableData" stripe border v-loading="loading">
                <el-table-column prop="id" width="80" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="ip" label="注册IP" align="center"></el-table-column>
                <el-table-column align="center" property="time" :formatter="dateFormat" label="注册时间"></el-table-column>
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

        async getData() {
            let res = await this.$http.get("/api/info/userlist", {
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
            if (date == undefined || date == 0) {
                return "";
            }
            return moment(date * 1000).format("YYYY-MM-DD HH:mm");
        },
    },
};
</script>

<style lang="less" scoped></style>
