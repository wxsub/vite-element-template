<route>
{
  meta: { title: "嵌套路由" }
}
</route>

<template>
  <div>

    <ul class="flex gap-2">
        <li class="bg-[#f5f5f5] px-2 py-1 rounded-md"><router-link to="/nested/1">嵌套路由1</router-link></li>
        <li class="bg-[#f5f5f5] px-2 py-1 rounded-md"><router-link to="/nested/2">嵌套路由2</router-link></li>
    </ul>

    <section class="mt-4">
        <router-view />
    </section>
  </div>
</template>
