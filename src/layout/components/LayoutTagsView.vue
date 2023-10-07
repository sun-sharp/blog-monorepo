<script lang="ts" setup>
  import { useLayoutTagsView } from '@/layout/hooks/useLayoutTagsView';
  import { LeftOutlined, CloseOutlined, RightOutlined, DownOutlined } from '@/utils';
  import Draggable from 'vuedraggable';

  const {
    activeKey,
    scrollable,
    dropdownX,
    dropdownY,
    showDropdown,
    navWrap,
    navScroll,
    tabsList,
    baseHome,
    goPage,
    closeTabItem,
    TabsMenuOptions,
    closeHandleSelect,
    scrollNext,
    scrollPrev,
    handleContextMenu,
    onClickOutside,
  } = useLayoutTagsView();
</script>

<template>
  <div class="layout-tabs-view">
    <div class="layout-tabs-view-main">
      <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
        <span class="tabs-card-prev" :class="{ 'tabs-card-prev-hide': !scrollable }" @click="scrollPrev">
          <n-icon size="16" color="#515a6e">
            <LeftOutlined />
          </n-icon>
        </span>
        <span class="tabs-card-next" :class="{ 'tabs-card-next-hide': !scrollable }" @click="scrollNext">
          <n-icon size="16" color="#515a6e">
            <RightOutlined />
          </n-icon>
        </span>
        <div ref="navScroll" class="tabs-card-scroll">
          <Draggable v-model="tabsList" animation="300" item-key="fullPath" class="flex">
            <template #item="{ element }">
              <div
                :id="`tag${element.fullPath.split('/').join('\/')}`"
                class="tabs-card-scroll-item"
                :class="{ 'active-item': activeKey === element.path }"
                @click.stop="goPage(element)"
                @contextmenu="handleContextMenu($event, element)"
              >
                <span>{{ element.meta.title }}</span>
                <n-icon v-if="element.path !== baseHome" size="14" @click.stop="closeTabItem(element)">
                  <CloseOutlined />
                </n-icon>
              </div>
            </template>
          </Draggable>
        </div>
      </div>
      <div class="tabs-close">
        <n-dropdown trigger="hover" placement="bottom-end" :options="TabsMenuOptions" @select="closeHandleSelect">
          <div class="tabs-close-btn">
            <n-icon size="16">
              <DownOutlined />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
      <n-dropdown
        :show="showDropdown"
        :x="dropdownX"
        :y="dropdownY"
        placement="bottom-start"
        :options="TabsMenuOptions"
        @clickoutside="onClickOutside"
        @select="closeHandleSelect"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .layout-tabs-view {
    display: flex;
    align-items: center;
    width: 100%;
    height: $tabs-view-height;
    padding: 0 5px;
    background-color: $tabs-view-back-color;
    transition: all 0.2s ease-in-out;

    &-main {
      display: flex;
      min-width: 100%;
      max-width: 100%;
      height: 32px;

      .tabs-card {
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: hidden;
        -webkit-box-flex: 1;

        .tabs-card-prev,
        .tabs-card-next {
          position: absolute;
          width: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;

          .n-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          }
        }

        .tabs-card-prev {
          left: 0;
        }

        .tabs-card-next {
          right: 0;
        }

        .tabs-card-next-hide,
        .tabs-card-prev-hide {
          display: none;
        }

        &-scroll {
          overflow: hidden;
          white-space: nowrap;

          &-item {
            position: relative;
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            height: 32px;
            margin-right: 6px;
            padding: 6px 16px 4px;
            color: $tabs-view-btn-text-color;
            background: $tabs-view-btn-back-color;
            border-radius: 3px;
            cursor: pointer;

            span {
              float: left;
              margin-right: 5px;
              vertical-align: middle;
            }

            &:hover {
              color: #515a6e;
            }
          }

          .active-item {
            color: $tabs-view-btn-active-text-color;
            background: $tabs-view-btn-active-back-color;
          }
        }
      }

      .tabs-card-scrollable {
        padding: 0 32px;
        overflow: hidden;
      }
    }

    .tabs-close {
      width: 32px;
      min-width: 32px;
      height: 32px;
      padding: 0 15px;
      line-height: 32px;
      text-align: center;
      background: $tabs-view-btn-back-color;
      border-radius: 2px;
      cursor: pointer;

      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: $tabs-view-btn-text-color;
      }
    }
  }
</style>
