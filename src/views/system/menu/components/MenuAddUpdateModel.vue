<script lang="ts" setup>
  import { menuTypeOption } from '@/constant';
  import { MenuAddUpdateModelProps, useMenuAddUpdateModel } from '../hooks/useMenuAddUpdateModel';

  const props = defineProps(MenuAddUpdateModelProps);

  const {
    modelId,
    showModal,
    menuTypeName,
    modelFromRef,
    modelForm,
    modelRules,
    formBtnLoading,
    parentIdOptions,
    iconOptions,
    iconRenderLabel,
    init,
    confirmForm,
  } = useMenuAddUpdateModel(props);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="类型" path="menuType">
        <n-radio-group v-model:value="modelForm.menuType" name="radiogroup">
          <n-space>
            <n-radio v-for="item in menuTypeOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="`${menuTypeName}名称`" path="title">
        <n-input v-model:value="modelForm.title" :placeholder="`请输入${menuTypeName}名称`" />
      </n-form-item>
      <n-form-item label="上级菜单" path="parentId">
        <n-tree-select v-model:value="modelForm.parentId" filterable :options="parentIdOptions" clearable label-field="title" key-field="menuId" />
      </n-form-item>
      <n-form-item v-if="[7].includes(modelForm.menuType)" label="外链的链接" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入外链的链接" />
      </n-form-item>
      <n-form-item v-else label="标识" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入标识" />
      </n-form-item>
      <n-form-item v-if="![2, 6, 7].includes(modelForm.menuType)" label="位置" path="component">
        <n-input v-model:value="modelForm.component" placeholder="请输入位置" />
      </n-form-item>
      <n-form-item v-if="[6].includes(modelForm.menuType)" label="链接" path="iframeSrc">
        <n-input v-model:value="modelForm.iframeSrc" placeholder="请输入链接" />
      </n-form-item>
      <n-form-item label="图标" path="icon">
        <n-select v-model:value="modelForm.icon" :options="iconOptions" :render-label="iconRenderLabel" :virtual-scroll="false" placeholder="请选择"></n-select>
      </n-form-item>
      <n-form-item label="排序号" path="sort">
        <n-input-number v-model:value="modelForm.sort" class="w-full" />
      </n-form-item>
      <n-form-item label="是否隐藏" path="hidden">
        <n-switch v-model:value="modelForm.hidden" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss"></style>
