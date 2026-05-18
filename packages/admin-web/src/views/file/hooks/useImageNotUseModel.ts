import { imageApi } from '@/api';
import { computed, h, ref, unref } from 'vue';
import { ApiImageItem } from '/#/api/image';
import { useApiType } from '@/hooks';
import { BasicColumn } from '/#/components/table';
import { NImage } from 'naive-ui';
import { getImgUrl } from '@/utils';
import { CStrOption } from '/#/common/config';

// 查询未使用的图片弹窗
export const useImageNotUseModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const showModal = ref(false);
  const btnLoading = ref(false);
  const tableData = ref<ApiImageItem[]>([]);
  // 获取接口数据
  const getTableData = async () => {
    tableData.value = await imageApi.getOntUse();
  };

  const { getImageSourceOption } = useApiType();

  const columns = computed<BasicColumn<ApiImageItem>[]>(() => [
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
      render(row) {
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
      render(row) {
        const find = unref(getImageSourceOption).find((f: CStrOption) => f.value === row.source);
        return find ? find.label : `*${row.source || ''}`;
      },
    },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
    },
  ]);
  // 初始化
  const init = async () => {
    showModal.value = true;
    await getTableData();
  };

  // 清空列表数据
  const clearList = () => {
    const imageIdArr = tableData.value.map((m: { imageId: string }) => m.imageId);
    imageApi.removePublicAndDataAll(imageIdArr).then(() => {
      showModal.value = false;
      emit('refresh');
    });
  };
  return {
    showModal,
    btnLoading,
    tableData,
    columns,
    init,
    clearList,
  };
};
