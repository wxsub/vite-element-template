<route>{ meta: { title: "权限管理" } }</route>

<template>
  <div>
    <el-tree
        :data="data"
        show-checkbox
        :props="defaultProps"
        @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts">
interface Tree {
  label: string
  children?: Tree[]
}

//  a ==> 10 ==> 2
//  b ==> 100 ==> 4
const a = 2, b = 4;
console.log(usePermissions().verify(a))
console.log(usePermissions().value)
console.log(usePermissions().verify(b))

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
          {
            label: 'Level three 1-1-2',
          },
          {
            label: 'Level three 1-1-3',
          },
          {
            label: 'Level three 1-1-4',
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}
</script>
