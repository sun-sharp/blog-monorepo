import { imageApi } from '@/api';
import { getImgUrl } from '@/utils';
import { NImage } from 'naive-ui';
import { h, ref } from 'vue';
import { ReadImageItem } from '/#/api/capital/image';
import { BasicColumn } from '/#/components/table';

// 处理只有图片文件的数据 弹窗
export const useImageOnlyPublicModel = () => {
  const showModal = ref(false);
  const btnLoading = ref(false);
  const imageOnlyData = ref<ReadImageItem[]>([]);
  // 获取接口数据
  const getOnlyPublicData = async () => {
    imageOnlyData.value = await imageApi.getOnlyPublic();
  };

  const columns: BasicColumn<ReadImageItem>[] = [
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
  ];

  // 初始化
  const init = async () => {
    showModal.value = true;
    await getOnlyPublicData();
  };

  // 清空列表数据
  const clearList = () => {
    const fileNameArr = imageOnlyData.value.map((m: { fileName: string }) => m.fileName);
    imageApi.removePublicAll(fileNameArr).then(() => {
      showModal.value = false;
    });
  };

  return {
    showModal,
    btnLoading,
    imageOnlyData,
    columns,
    init,
    clearList,
  };
};
