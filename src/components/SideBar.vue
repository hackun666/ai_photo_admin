<!-- 左侧导航组件 -->
<!-- 使用说明：<side-bar></side-bar> -->
<template>
  <div id="sidebar-wrap" :class="{ collapsed: isFold }">
    <!-- 顶部图标 -->
    <div class="logo">
      <p v-if="isFold">后台</p>
      <p v-else>管理后台</p>
    </div>

    <!-- 侧栏菜单 -->
    <el-menu :default-active="$route.path" :unique-opened="true" :router="true" :collapse="isFold">
      <!-- <el-menu-item index="/dashboard">
        <i class="el-icon-s-home"></i>
        <span slot="title">管理后台</span>
      </el-menu-item> -->
      <!-- <el-menu-item index="/config">
        <i class="el-icon-s-tools"></i>
        <span slot="title">基础设置</span>
      </el-menu-item> -->
      <el-menu-item index="/mjtask">
        <i class="el-icon-picture"></i>
        <span slot="title">绘图任务</span>
      </el-menu-item>
      <el-menu-item index="/mjkeys">
        <i class="el-icon-s-finance"></i>
        <span slot="title">我的密钥</span>
      </el-menu-item>
      <el-menu-item v-if="uid == 3" index="/users">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户列表</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  data() {
    return {
      isMusicOn: false,
      uid: localStorage.userId,
      menu: localStorage.menu ? JSON.parse(localStorage.menu) : [],
    };
  },
  computed: {
    isFold() {
      return this.$store.state.common.isCollapse;
    },
  },
  created() { },
  methods: {},
};
</script>
<style scoped lang="less">
#sidebar-wrap {
  width: 180px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  max-height: 100vh;
  overflow-y: scroll;
  z-index: 5;
  transition: all 0.3s;
  background: #fff;
  border-right: 1px solid #efefef;
  box-sizing: border-box;

  &.collapsed {
    width: 64px;
    transition: all 0.3s;
  }

  .logo {
    color: #333;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      font-size: 20px;
      color: #232323;
      font-weight: bold;
      letter-spacing: 2px;
    }

    img {
      width: 40px;
    }
  }
}

#sidebar-wrap::-webkit-scrollbar {
  display: none;
}

.el-menu {
  height: 100%;
}

// 美化左侧导航的留白
.el-submenu .el-menu-item {
  padding: 0 20px;
  min-width: 160px;
  padding-left: 50px !important;
}
</style>
