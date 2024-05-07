<route>
{ meta: { title: "首页", layout: 'blank' } }
</route>

<template>
  <div class="wxsub-errorPage-site">
    <div class="icon-img">
      <img :alt="title" :src="TYPES" />
    </div>
    <div class="content-title">
      <h1>{{ title }}</h1>
    </div>
    <div class="content-sub">
      <div class="sub-text" v-html="content"></div>
    </div>
    <div class="content-sub">
      <el-button type="primary" round @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "errorPage",
  data: () => ({
    type: "notfound",
    title: "404，错误",
    content: "找不到您要查找的页面"
  }),
  computed: {
    TYPES() {
      const type = this.type;
      switch (type) {
        case "notfound":
          return "/images/redirect/404.png";
        case "inactive":
          return "/images/redirect/inactive.svg";
        case "rename":
          return "/images/redirect/rename.svg";
        case "warning":
          return "/images/redirect/error_page.svg";
        default:
          return "/images/redirect/notfound.svg";
      }
    }
  },
  created() {
    const { type, content, title } = this.$route.query;
    if (type) this.type = type;
    if (title) this.title = title;
    if (content) this.content = content;
    if (type === "ReName") {
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 10000);
    }
  }
};
</script>

<style lang="scss" scoped>
.wxsub-errorPage-site {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
  background: #fff;
  overflow-y: auto;
  .icon-img {
    max-width: 320px;
    @media (max-width: 768px) { width: 50% }
    img { width: 100% }
  }
  h1 {
    font-size: 26px;
    margin: 0.67em 0;
  }
  .content-sub {
    width: 100%;
    overflow: hidden;
    margin-bottom: 30px;
    text-align: center;
    .sub-text {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>
