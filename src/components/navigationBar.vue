<script setup lang="ts">
const show = ref(false)
const navList = reactive([
  {
    name: '虚幻引擎',
    show: false,
    children: [
      { name: '概览' },
      { name: '功能' },
      { name: '许可' },
      { name: '常见问题' }
    ]
  },
  {
    name: '应用',
    show: false,
    width: 240,
    children: [
      { name: '更换至虚幻引擎' },
      { name: '3A游戏' },
      { name: '独立游戏' },
      { name: 'Unreal Editor Fortnite特别版' },
      { name: '电影与电视' },
      { name: '广播与实况活动' }
    ]
  },
  {
    name: '新闻',
    show: false
  },
  {
    name: '论坛',
    show: false
  }
]);
</script>

<template>
    <ul class="flex items-center gap-1">
        <li v-for="(item, index) in navList" :key="index">
            <el-popover popper-class="nav-popover-card" v-if="item.children && item.children.length" trigger="hover"
                :width="item.width || 160" v-model:visible="item.show" :show-arrow="false" placement="bottom-start">
                <template #reference>
                    <div class="px-4 py-2 flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300">
                        <span>{{ item.name }}</span>
                        <el-icon class="text-[12px] duration-300">
                            <i-ep-arrowUpBold v-if="item.show" />
                            <i-ep-arrowDownBold v-else />
                        </el-icon>
                    </div>
                </template>
                <ol>
                    <li v-for="(child, childIdx) in item.children" :key="childIdx">{{ child.name }}</li>
                </ol>
            </el-popover>
            <div class="px-4 py-2 flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300" v-else>
                <span>{{ item.name }}</span>
            </div>
        </li>
        <li>
            <el-popover popper-class="nav-popover-card" trigger="hover" :width="200" v-model:visible="show"
                :show-arrow="false" placement="bottom-start">
                <template #reference>
                    <div class="px-4 py-2 flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300">
                        <span>更多</span>
                        <el-icon class="text-[12px] duration-300">
                            <i-ep-arrowUpBold v-if="show" />
                            <i-ep-arrowDownBold v-else />
                        </el-icon>
                    </div>
                </template>
                <ol>
                    <li>文档</li>
                    <el-popover popper-class="nav-popover-card" trigger="hover" :width="160" :show-arrow="false"
                        placement="right-start">
                        <template #reference>
                            <li>
                                <div class="flex items-center justify-between">
                                    <span>学习</span>
                                    <el-icon class="text-[12px] duration-300">
                                        <i-ep-arrowRightBold />
                                    </el-icon>
                                </div>
                            </li>
                        </template>
                        <ol>
                            <li>学习资料库</li>
                            <li>立即开始</li>
                            <li>代码片段库</li>
                        </ol>
                    </el-popover>
                    <el-popover popper-class="nav-popover-card" trigger="hover" :width="160" :show-arrow="false"
                        placement="right-start">
                        <template #reference>
                            <li>
                                <div class="flex items-center justify-between">
                                    <span>交流</span>
                                    <el-icon class="text-[12px] duration-300">
                                        <i-ep-arrowRightBold />
                                    </el-icon>
                                </div>
                            </li>
                        </template>
                        <ol>
                            <li>活动</li>
                            <li>MegaGrants</li>
                            <li>会面</li>
                            <li>服务合作伙伴</li>
                            <li>学生与校园</li>
                            <li>训练与学术伙伴</li>
                        </ol>
                    </el-popover>
                    <li>商城</li>
                </ol>
            </el-popover>
        </li>
    </ul>
</template>