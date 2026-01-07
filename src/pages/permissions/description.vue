<route>{ meta: { title: "权限说明" } }</route>

<template>
  <el-tabs type="border-card" class="mt-3">
    <el-tab-pane label="English">
      <h2 class="text-[18px] font-semibold">Configuration Instructions for the File System Permission System</h2>

      <el-alert type="primary" class="mt-2" :closable="false" show-icon>
        <template #title>
          <p>This system's permission system is based on the file system's permission model, achieving access control of
            routing system resources through file permission settings.</p>
          <p>Each file and directory has a permission bit (number) that represents the access permissions of that file
            or route.</p>
          <p>The permission system's permission bits are implemented based on bitwise operations, so the backend only
            needs to store a single number.</p>
        </template>
      </el-alert>
      <p class="mt-3">Here's an example:</p>
      <section class="bg-[#000] text-white p-3">
        <p># Example 1</p>
        <p class="pl-[1.5em]">A = 10001001</p>
        <p class="pl-[1.5em]">B = 10010000</p>
        <p>A | B = 10011001</p>

        <p class="mt-3"># Example 2</p>
        <p class="pl-[1.5em]">A = 10001001</p>
        <p class="pl-[1.5em]">C = 10001000</p>
        <p>A | C = 10001001</p>
      </section>
      <p class="mt-3">A, B, and C represent the union of permission bits A, B, and C, i.e., all permissions of A, B, and
        C.
      </p>
      <p class="mt-3 font-semibold">
        Therefore, we need to coordinate with the backend to use numbers to represent menu
        permissions, and each menu's permission bit needs to be recorded. The frontend will then handle the permission
        verification.
      </p>
      <p class="mt-3">
        For calculating menu permissions, please use the methods encapsulated in:
        <em>src/composable/usePermissions.ts</em>
      </p>
      <ul class="mt-3">
        <li>
          Adding a new menu requires calling the <em>gen</em> method in <em>src/store/modules/settings.ts</em>. The
          return
          value of this method should be saved as the menu permission bit in the database and added to the `permission`
          property in the route meta of the menu's Vue file, for example:
          <pre class="bg-[#000] text-white p-3">
            // Add a new menu permission bit
            const permission = useSettingsStore().gen();

            // Add to the route meta permission of the menu's Vue file
            /
            <\route />\
            {
            meta: { title: "Homepage", permission: permission }
            }
            /
            <\ /route />\
          </pre>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="中文">
      <h2 class="text-[18px] font-semibold">针对文件系统权限系统的配置说明</h2>

      <el-alert type="primary" class="mt-2" :closable="false" show-icon>
        <template #title>
          <p>本系统权限系统基于文件系统的权限模型，通过对文件的权限设置，实现路由系统资源的访问控制。</p>
          <p>每个文件和目录都有一个权限位(数字)，用于表示该文件或路由的访问权限。</p>
          <p>权限系统权限位基于位运算实现，所以后台只需要保存一个数字即可</p>
        </template>
      </el-alert>
      <p class="mt-3">下面举个例子：</p>
      <section class="bg-[#000] text-white p-3">
        <p># 例子1</p>
        <p class="pl-[1.5em]">A = 10001001</p>
        <p class="pl-[1.5em]">B = 10010000</p>
        <p>A | B = 10011001</p>

        <p class="mt-3"># 例子2</p>
        <p class="pl-[1.5em]">A = 10001001</p>
        <p class="pl-[1.5em]">C = 10001000</p>
        <p>A | C = 10001001</p>
      </section>
      <p class="mt-3">A、B、C就相当于权限位A、B、C的并集，即A、B、C的所有权限。</p>
      <p class="mt-3 font-semibold">因此我们需要和后台协商好，菜单权限使用数字表示，并且需要记录每个菜单权限位。前端做好权限验证即可。</p>
      <p class="mt-3">
        对于菜单的权限计算，请使用: <em>src/composable/usePermissions.ts</em>内封装的方法
      </p>
      <ul class="mt-3">
        <li>
          新增菜单需要调用 <em>src/store/modules/settings.ts</em> 内的 <em>gen</em> 方法, 将方法返回值作为菜单权限位保存到数据库中和填入菜单vue文件的route meta
          permission中，例如：
          <pre class="bg-[#000] text-white p-3">
        // 新增菜单权限位
        const permission = useSettingsStore().gen();

        // 填入菜单vue文件的route meta permission中
        /
        <\route />\
        {
        meta: { title: "首页", permission: permission }
        }
        /
        <\ /route />\
      </pre>
        </li>
      </ul>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
//  a ==> 10 ==> 2
//  b ==> 100 ==> 4
const a = 2, b = 4;
console.log(usePermissions().verify(a))
console.log(usePermissions().gen())
console.log(usePermissions().verify(b))
</script>
