import { h, reactive, unref, computed } from 'vue';
import TableAction from '@/components/Table/table-action.vue';
import { imageApi } from '@/api';
import { NImage } from 'naive-ui';
import { getImgUrl } from '@/utils';
import { COption } from '/#/config';

export const imageConfigure = ({ reloadTable, getImageSourceOption }) => {
  // 查询配置
  const searchSchemas = computed(() => [
    {
      field: 'name',
      component: 'NInput',
      label: '图片名称',
      componentProps: {
        placeholder: '请输入图片名称',
      },
    },
    {
      field: 'source',
      component: 'NSelect',
      label: '图片来源',
      componentProps: {
        defaultValue: '',
        clearable: false,
        placeholder: '请选择图片名称',
        options: [{ value: '', label: '全部' }].concat(unref(getImageSourceOption)),
      },
    },
  ]);

  // 表格字段配置
  const columns = computed(() => [
    {
      title: '图片名称',
      key: 'name',
      align: 'center',
    },
    {
      title: '图片展示',
      key: 'url',
      align: 'center',
      width: 100,
      render(row: Recordable) {
        return h(NImage, {
          src: getImgUrl(row.url),
          alt: '图片文件不存在',
        });
      },
    },
    {
      title: '图片全称',
      key: 'fileName',
      align: 'center',
    },
    {
      title: '图片类型',
      key: 'imageType',
      align: 'center',
    },
    {
      title: '图片来源',
      key: 'source',
      align: 'center',
      render(row: Recordable) {
        const find = unref(getImageSourceOption).find((f: COption) => f.value === row.source);
        return find ? find.label : `*${row.source || ''}`;
      },
    },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
    },
  ]);

  /**
   * 表格按钮操作配置
   *  */
  // 删除图片和数据
  const removePublicAndData = (row: Recordable) => {
    imageApi.removePublicAndData(row.imageId).then(() => {
      reloadTable();
    });
  };
  // 删除没有图片文件的数据
  const removeData = (row: Recordable) => {
    imageApi.removeData(row.imageId).then(() => {
      reloadTable();
    });
  };
  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render(row: Recordable) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除图片和数据',
            type: 'error',
            onClick: removePublicAndData.bind(null, row),
            ifShow: () => {
              return row.exists;
            },
          },
          {
            label: '删除数据',
            type: 'error',
            onClick: removeData.bind(null, row),
            ifShow: () => {
              return !row.exists;
            },
          },
        ],
        // 更多
        /* dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        }, */
      });
    },
  });

  return {
    searchSchemas,
    columns,
    actionColumn,
  };
};
