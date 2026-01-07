<route>
{
  meta: { title: "动态参数路由" }
}
</route>

<template>
  <div>
    <h1>这是动态参数路由, 参数值为: {{ $route.params.id }}</h1>
    <p>This is dynamic parameter routing. parameter value: {{ $route.params.id }}</p>
  </div>
</template>
