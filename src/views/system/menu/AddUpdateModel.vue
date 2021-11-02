<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="80">
      <n-form-item label="类型" path="menuType">
        <n-radio-group v-model:value="modelForm.menuType" name="radiogroup">
          <n-space>
            <n-radio v-for="item in menuTypeOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="名称" path="name">
        <n-input v-model:value="modelForm.title" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="上级菜单" path="parentId">
        <n-tree-select v-model:value="modelForm.parentId" filterable :options="parentIdOptions" clearable label-field="title" key-field="_id" />
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

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { menuTypeOption } from '@/enums/apiEnum';
  import { useMessage } from 'naive-ui';

  export default defineComponent({
    props: {
      tableData: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const message = useMessage();
      const showModal = ref(false);
      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive({
        menuType: 1,
        title: '',
        sort: 0,
        parentId: '0',
        hidden: false,
      });
      const modelRules = {
        menuType: {
          type: 'number',
          required: true,
          trigger: ['change', 'blur'],
          message: '请选择类型',
        },
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入名称',
        },
        parentId: {
          required: true,
          trigger: 'change',
          message: '请输入地址',
        },
        sort: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入排序号',
        },
      };
      const modelId = ref();
      const parentIdOptions = [
        {
          _id: '0',
          title: '根目录',
          children: props.tableData || [],
        },
      ];

      // 初始化
      const init = (row) => {
        showModal.value = true;
        if (row) {
          modelForm.menuType = row.menuType;
          modelForm.title = row.title;
          modelForm.sort = row.sort;
          modelForm.parentId = row.parentId;
          modelForm.hidden = row.hidden;
          console.log(row);
        }
      };

      // 提交
      const confirmForm = (e) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors) {
            message.success('新建成功');
          } else {
            message.error('请填写完整信息');
          }
          formBtnLoading.value = false;
        });
      };

      return {
        modelId,
        showModal,
        modelFromRef,
        modelForm,
        modelRules,
        formBtnLoading,
        menuTypeOption,
        parentIdOptions,
        init,
        confirmForm,
      };
    },
  });
</script>
