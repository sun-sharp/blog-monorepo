<template>
  <view>
    <list-page
      ref="listPageRef"
      :api-fn="articleAPi.getFindPage"
      search-placeholder="搜索文章"
      search-key="keywords"
      :dropdown-items="dropdownItems"
      show-fab
      @fabClick="goToAdd"
      @loaded="onLoaded">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.articleId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.title" :label="item.brief" @click="goToEdit(item.articleId)">
              <template #value>
                <view class="article-meta">
                  <u-tag v-if="item.isPrivate" text="加密" type="warning" size="mini" plain />
                  <text class="article-time">{{ item.createTime?.slice(0, 10) }}</text>
                </view>
              </template>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { articleAPi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import type { ApiArticleItem } from '/#/api/blog/article';
  import ListPage from '../../../components/list-page/list-page.vue';

  const apiTypeStore = useApiTypeStore();
  const listPageRef = ref();

  const articleCategoryOption = computed(() => apiTypeStore.getArticleCategoryOption);

  const dropdownItems = computed(() => [
    {
      title: '分类',
      key: 'categoryVal',
      options: [{ label: '全部分类', value: '' }, ...articleCategoryOption.value],
      value: '',
    },
    {
      title: '状态',
      key: 'isPrivate',
      options: [
        { label: '全部状态', value: '' },
        { label: '公开', value: false },
        { label: '加密', value: true },
      ],
      value: '',
    },
  ]);

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function onLoaded(_list: ApiArticleItem[]) {}

  function goToAdd() {
    uni.navigateTo({ url: '/pages/blog/article-edit/article-edit' });
  }

  function goToEdit(articleId: string) {
    uni.navigateTo({ url: `/pages/blog/article-edit/article-edit?id=${articleId}` });
  }

  function onSwipeClick(event: any, item: ApiArticleItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.articleId);
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除文章「${item.title}」？`,
        success: async (res) => {
          if (res.confirm) {
            await articleAPi.remove(item.articleId);
            listPageRef.value?.refresh();
          }
        },
      });
    }
  }

  onMounted(() => {
    apiTypeStore.getArticleCategory();
  });

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .article-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8rpx;
  }

  .article-time {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
