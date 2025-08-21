<template>
  <div class="bg-#efefef min-h-100vh">
    <CustomLoading />
    <el-header class="sm:hidden">
        <AdminHeader></AdminHeader>
      </el-header>
    <el-container>
     
      <el-menu>
        <AdminAsideMenu></AdminAsideMenu>
      </el-menu>

      <NuxtPage />
    </el-container>
  </div>
</template>
