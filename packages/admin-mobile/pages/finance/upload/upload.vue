<template>
  <view class="upload-page">
    <!-- ====== 上传界面 ====== -->
    <template v-if="step === 'upload'">
      <scroll-view scroll-y class="upload-scroll" :style="scrollStyle">
        <view class="upload-section card">
          <text class="upload-section-title">导入账单</text>
          <text class="upload-section-desc">选择账单类型并上传对应的账单文件</text>
        </view>

        <view class="upload-types card">
          <u-radio-group v-model="uploadType" placement="column">
            <view v-for="item in uploadTypeOptions" :key="item.value" class="upload-type-item" @click="uploadType = item.value">
              <u-radio :name="item.value" :label="item.label" active-color="#007aff" />
              <text class="upload-type-desc">{{ item.desc }}</text>
            </view>
          </u-radio-group>
        </view>

        <view v-if="uploadType === 3" class="upload-types card">
          <text class="upload-types-label">选择银行类型</text>
          <u-radio-group v-model="selectBankType" placement="column">
            <view v-for="item in bankTypeOptions" :key="item.value" class="upload-type-item" @click="selectBankType = item.value">
              <u-radio :name="item.value" :label="item.label" active-color="#007aff" />
            </view>
          </u-radio-group>
        </view>

        <view class="upload-action card">
          <view v-if="uploadType === 3" class="upload-download" @click="handleDownloadBankFile">
            <u-icon name="download" size="32" :color="selectBankType ? '#007aff' : '#999'" />
            <text class="upload-download-text" :class="selectBankType ? '' : 'disabled'">下载该银行模版</text>
          </view>
          <u-button type="primary" icon="file-text" :disabled="uploadType === 3 && !selectBankType" @click="chooseFile">选择文件</u-button>
          <text class="upload-tip">支持 CSV、XLSX、XLS 格式文件</text>
          <!-- #ifdef MP-WEIXIN -->
          <view class="upload-mp-guide">
            <text class="upload-mp-guide-title">小程序文件导入步骤：</text>
            <view class="upload-mp-guide-step">
              <text class="upload-mp-guide-num">1</text>
              <text class="upload-mp-guide-text">在微信中打开「文件传输助手」，将账单文件发送到聊天中</text>
            </view>
            <view class="upload-mp-guide-step">
              <text class="upload-mp-guide-num">2</text>
              <text class="upload-mp-guide-text">点击上方「选择文件」，从聊天记录中选取该文件</text>
            </view>
          </view>
          <!-- #endif -->
        </view>

        <view v-if="selectedFileName" class="upload-file card">
          <view class="upload-file-info">
            <u-icon name="file-text" size="40" color="#007aff" />
            <view class="upload-file-detail">
              <text class="upload-file-name">{{ selectedFileName }}</text>
              <text class="upload-file-size">已选择文件</text>
            </view>
            <u-icon name="close" color="#999" @click="clearFile" />
          </view>
        </view>

        <view v-if="uploading" class="upload-progress card">
          <u-line-progress :percent="uploadProgress" active-color="#007aff" />
          <text class="upload-progress-text">上传中 {{ Math.floor(uploadProgress) }}%</text>
        </view>

        <view class="upload-submit">
          <u-button type="primary" :loading="uploading" :disabled="!selectedFileName" @click="handleUpload">开始导入</u-button>
        </view>

        <view v-if="uploadType === 1" class="upload-help card">
          <text class="upload-help-title">微信账单导入说明</text>
          <view class="upload-help-item">
            <text class="upload-help-text">
              在微信“我的”-“服务”-“钱包”-“账单”里，右上角三个点“...”里下载账单，选择“用于个人对账”，交易类型选择“全部账单”，文件类型为xlsx，上传的文件限制为 CSV
              或者 XLSX 文件。
            </text>
          </view>
        </view>

        <view v-else-if="uploadType === 2" class="upload-help card">
          <text class="upload-help-title">支付宝账单导入说明</text>
          <view class="upload-help-item">
            <text class="upload-help-text">
              在支付宝“我的”-“账单”里的“...”更多里账单工具“开具交易流水证明”，申请用于个人对账，需选择交易对手信息和展示商品说明信息，接收方式为邮箱，去邮箱下载并输入密码解压，最后看文件里开头的行数是多少，文件类型为csv，上传的文件限制为
              CSV 文件。
            </text>
          </view>
        </view>

        <view v-else-if="uploadType === 3" class="upload-help card">
          <text class="upload-help-title">银行账单导入说明</text>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">
              工商银行：下载并登录工商银行APP，点击查看账号，在账号服务里有“明细打印”，选择账户，交易币种和交易类型选“全部”，勾选“显示对方户名和账号”和“明细文件加密”，确认并去邮箱里下载PDF文件，再上传该银行的
              XLSX 模版文件
            </text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">农业银行：下载并登录农业银行APP，再上传该银行的 XLSX 模版文件</text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">建设银行：下载并登录建设银行APP，再上传该银行的 XLSX 模版文件</text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">民生银行：下载并登录民生银行APP，再上传该银行的 XLSX 模版文件</text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">招商银行：下载并登录招商银行APP，再上传该银行的 XLSX 模版文件</text>
          </view>
        </view>

        <!-- <view class="upload-help card">
          <text class="upload-help-title">使用说明</text>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">微信账单：选择 CSV 或者 XLSX 文件后导入上传</text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">支付宝账单：选择 CSV 文件后导入上传</text>
          </view>
          <view class="upload-help-item">
            <u-icon name="checkmark-circle" size="28" color="#4cd964" />
            <text class="upload-help-text">银行账单：先选择银行，再上传该银行的 XLSX 文件，请分别导入 5 家银行</text>
          </view>
        </view> -->
      </scroll-view>
    </template>

    <!-- ====== 结果预览 ====== -->
    <template v-else>
      <view class="import-header">
        <text class="import-header-title">{{ uploadTypeLabel }}</text>
        <text class="import-header-count">{{ tableData.length }} / {{ excelUploadTotal }} 条</text>
      </view>

      <scroll-view scroll-y class="import-scroll" :style="scrollStyle">
        <view v-for="(item, idx) in tableData" :key="idx" :class="['import-card', isRowIncomplete(idx) ? 'import-card-incomplete' : '']">
          <view class="import-card-header">
            <text class="import-card-index">#{{ idx + 1 }}</text>
          </view>

          <!-- WeChat 字段 -->
          <template v-if="uploadType === 1">
            <view class="import-card-row">
              <text class="label">交易时间</text>
              <text class="value">{{ item.tradeTime || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易类型</text>
              <text class="value">{{ item.tradeType || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易对方</text>
              <text class="value">{{ item.tradeOtherPerson || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">商品</text>
              <text class="value">{{ item.goods || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">收/支</text>
              <text :class="['value', item.incomeOrPay === '支出' ? 'money-outflow' : 'money-inflow']">{{ item.incomeOrPay || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">金额</text>
              <text class="value money">&yen;{{ item.moneyAmount || 0 }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">支付方式</text>
              <text class="value">{{ item.paymentMethod || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">当前状态</text>
              <text class="value">{{ item.currentStatus || '--' }}</text>
            </view>
            <view v-if="item.remarks" class="import-card-row">
              <text class="label">备注</text>
              <text class="value">{{ item.remarks }}</text>
            </view>
          </template>

          <!-- AliPay 字段 -->
          <template v-if="uploadType === 2">
            <view class="import-card-row">
              <text class="label">交易时间</text>
              <text class="value">{{ item.tradeTime || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易类型</text>
              <text class="value">{{ item.tradeType || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易对方</text>
              <text class="value">{{ item.tradeOtherPerson || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">商品说明</text>
              <text class="value">{{ item.productDescription || '--' }}</text>
            </view>
            <view v-if="item.oppositeAccount" class="import-card-row">
              <text class="label">对方账号</text>
              <text class="value">{{ item.oppositeAccount }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">收/支</text>
              <text :class="['value', item.incomeOrPay === '支出' ? 'money-outflow' : 'money-inflow']">{{ item.incomeOrPay || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">金额</text>
              <text class="value money">&yen;{{ item.moneyAmount || 0 }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">收/付款方式</text>
              <text class="value">{{ item.paymentMethod || '--' }}</text>
            </view>
            <view v-if="item.tradeStatus" class="import-card-row">
              <text class="label">交易状态</text>
              <text class="value">{{ item.tradeStatus }}</text>
            </view>
          </template>

          <!-- Bank 字段 -->
          <template v-if="uploadType === 3">
            <view class="import-card-row">
              <text class="label">交易时间</text>
              <text class="value">{{ item.tradeTime || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易类型</text>
              <text class="value">{{ item.tradeType || '--' }}</text>
            </view>
            <view v-if="item.voucherNo" class="import-card-row">
              <text class="label">凭证号码</text>
              <text class="value">{{ item.voucherNo }}</text>
            </view>
            <view v-if="item.voucherType" class="import-card-row">
              <text class="label">凭证类型</text>
              <text class="value">{{ getVoucherTypeLabel(item.voucherType) }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">交易对方</text>
              <text class="value">{{ item.tradeOtherPerson || '--' }}</text>
            </view>
            <view v-if="item.tradeOtherPersonAccount" class="import-card-row">
              <text class="label">对方账号</text>
              <text class="value">{{ item.tradeOtherPersonAccount }}</text>
            </view>
            <view v-if="item.tradeOtherPersonRemarks" class="import-card-row">
              <text class="label">交易对方备注</text>
              <text class="value">{{ item.tradeOtherPersonRemarks }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">收/支</text>
              <text :class="['value', item.incomeOrPay === '支出' ? 'money-outflow' : 'money-inflow']">{{ item.incomeOrPay || '--' }}</text>
            </view>
            <view class="import-card-row">
              <text class="label">金额</text>
              <text class="value money">&yen;{{ item.moneyAmount || 0 }}</text>
            </view>
            <view v-if="item.balance !== undefined" class="import-card-row">
              <text class="label">余额</text>
              <text class="value">&yen;{{ item.balance }}</text>
            </view>
            <view v-if="item.explain" class="import-card-row">
              <text class="label">账单说明</text>
              <text class="value">{{ item.explain }}</text>
            </view>
            <view v-if="item.place" class="import-card-row">
              <text class="label">交易地点</text>
              <text class="value">{{ item.place }}</text>
            </view>
          </template>

          <!-- 可编辑区 -->
          <view class="import-card-divider" />

          <view class="import-card-radio">
            <text class="required">流入 / 流出</text>
            <u-radio-group v-model="item.inflowOrOutflow" placement="row">
              <u-radio :name="1" label="流入" active-color="#4cd964" />
              <u-radio :name="2" label="流出" active-color="#ff3b30" />
            </u-radio-group>
          </view>

          <template v-if="uploadType !== 3">
            <view class="import-card-select" @click="openSelect(idx, 'billType')">
              <text class="required">账单类型</text>
              <text :class="['import-card-select-value', !item.billType && 'placeholder']">
                {{ getLabel('billType', item.billType) || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
            <view class="import-card-select" @click="openSelect(idx, 'billMethod')">
              <text class="required">账单方式</text>
              <text :class="['import-card-select-value', !item.billMethod && 'placeholder']">
                {{ getLabel('billMethod', item.billMethod) || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </template>

          <template v-if="uploadType === 3">
            <view class="import-card-select" @click="openSelect(idx, 'bankBillType')">
              <text class="required">银行账单类型</text>
              <text :class="['import-card-select-value', !item.bankBillType && 'placeholder']">
                {{ getLabel('billType', item.bankBillType) || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
            <view class="import-card-select">
              <text class="required">银行类型</text>
              <text :class="['import-card-select-value', !selectBankType && 'placeholder']">
                {{ getLabel('bankType', selectBankType) || '请选择' }}
              </text>
            </view>
          </template>
        </view>
      </scroll-view>

      <view class="import-footer">
        <u-button @click="goBackToUpload">重新导入</u-button>
        <u-button type="primary" :loading="saving" :disabled="saveDisabled" @click="handleSave">确认保存</u-button>
      </view>
    </template>

    <!-- 共用搜索选择器 -->
    <searchable-select v-model="selectVisible" :title="selectTitle" :list="selectList" :current-value="selectCurrentValue" @confirm="onSelectConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onLoad, onBackPress } from '@dcloudio/uni-app';
  import { weChatApi, aliPayApi, bankApi } from '../../../api';
  import { useUserStore, useApiTypeStore } from '../../../store';
  import { voucherTypeOption } from '../../../../shared/src/constants/api-type';
  import SearchableSelect from '../../../components/searchable-select/searchable-select.vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag.ts';

  const userStore = useUserStore();
  const apiTypeStore = useApiTypeStore();

  // ---- 状态 ----
  const step = ref<'upload' | 'preview'>('upload');
  const uploadType = ref(1);
  const selectedFile = ref<File | null>(null);
  const selectedFilePath = ref('');
  const selectedFileName = ref('');
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const uploadTimeout = ref(false);
  const uploadTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const selectBankType = ref<number | undefined>(undefined);

  const tableData = ref<any[]>([]);
  const excelUploadTotal = ref(0);
  const saving = ref(false);

  const selectVisible = ref(false);
  const selectIndex = ref(-1);
  const selectField = ref('');
  const selectList = ref<{ label: string; value: number }[]>([]);
  const selectTitle = ref('');

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => {
    const offset = scrollTopOffset.value;
    if (offset > 0) {
      return {};
    }
    return {};
  });

  const selectCurrentValue = computed(() => {
    if (selectIndex.value < 0 || !selectField.value) return undefined;
    return (tableData.value[selectIndex.value] as any)?.[selectField.value];
  });

  const uploadTypeOptions = [
    { value: 1, label: '微信账单', desc: '微信支付导出的账单文件' },
    { value: 2, label: '支付宝账单', desc: '支付宝导出的账单文件' },
    { value: 3, label: '银行账单', desc: '先选择银行，再上传该银行的账单文件' },
  ];

  const bankTypeOptions = computed(() => apiTypeStore.getBankTypeOption.map((o) => ({ label: o.label, value: o.value })));

  // ---- 计算属性 ----
  const uploadTypeLabel = computed(() => {
    return uploadTypeOptions.find((o) => o.value === uploadType.value)?.label || '';
  });

  const hasFile = computed(() => !!selectedFileName.value);

  const saveDisabled = computed(() => {
    if (tableData.value.length === 0) return true;
    if (uploadType.value === 3) {
      return tableData.value.some((item) => !item.inflowOrOutflow || !item.bankBillType);
    }
    return tableData.value.some((item) => !item.inflowOrOutflow || !item.billMethod || !item.billType);
  });

  // ---- 初始化 ----
  onMounted(() => {
    calcScrollHeight();
  });

  onLoad(async () => {
    await Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod(), apiTypeStore.getBankType()]);
  });

  onBackPress(() => {
    if (step.value === 'preview') {
      step.value = 'upload';
      return true; // 拦截返回
    }
    return false;
  });

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const footerHeight = 60;
      scrollTopOffset.value = statusBarHeight + navBarHeight + footerHeight;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  // ---- 标签解析 ----
  function getLabel(field: string, value: number | undefined): string {
    if (value === undefined || value === null || value === 0) return '';
    let options: { label: string; value: number }[] = [];
    if (field === 'billType' || field === 'bankBillType') {
      options = apiTypeStore.getBillTypeOption;
    } else if (field === 'billMethod') {
      options = apiTypeStore.getBillMethodOption;
    } else if (field === 'bankType') {
      options = apiTypeStore.getBankTypeOption;
    }
    return options.find((o) => o.value === value)?.label || '';
  }

  function getVoucherTypeLabel(value: number): string {
    const found = voucherTypeOption.find((o) => o.value === value);
    return found ? found.label : '--';
  }

  // ---- 文件选择 ----
  function clearFile() {
    selectedFile.value = null;
    selectedFilePath.value = '';
    selectedFileName.value = '';
  }

  const VALID_EXTS = ['.csv', '.xlsx', '.xls'];

  function checkFileExt(name: string): boolean {
    const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
    if (!VALID_EXTS.includes(ext)) {
      uni.showToast({ title: '请选择 CSV 或 XLSX 或 XLS 文件', icon: 'none' });
      return false;
    }
    return true;
  }

  function chooseFile() {
    // #ifdef H5
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file && checkFileExt(file.name)) {
        selectedFile.value = file;
        selectedFileName.value = file.name;
      }
    };
    input.click();
    // #endif

    // #ifdef MP-WEIXIN
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        if (res.tempFiles?.[0]) {
          const temp = res.tempFiles[0] as any;
          const name = temp.name || '';
          if (checkFileExt(name)) {
            selectedFilePath.value = temp.path || '';
            selectedFileName.value = name;
          }
        }
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) return;
        uni.showToast({ title: '选择文件失败', icon: 'none' });
      },
    });
    // #endif

    // #ifndef H5 || MP-WEIXIN
    uni.chooseFile({
      count: 1,
      extension: VALID_EXTS,
      success: (res) => {
        const files = Array.isArray(res.tempFiles) ? res.tempFiles : [];
        if (files[0]) {
          const temp = files[0] as any;
          const name = temp.name || '';
          if (checkFileExt(name)) {
            selectedFilePath.value = temp.path || '';
            selectedFileName.value = name;
          }
        }
      },
      fail: (err) => {
        if (err.errMsg?.includes('cancel')) return;
        uni.showToast({ title: '选择文件失败', icon: 'none' });
      },
    });
    // #endif
  }

  // ---- 平台检测 ----
  function isH5Platform(): boolean {
    try {
      return uni.getSystemInfoSync().uniPlatform === 'web';
    } catch {
      return false;
    }
  }

  // ---- 上传地址 ----
  function getUploadUrl(): string {
    const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || '';
    const BASE_URL = import.meta.env.VITE_BASE_URL || '';
    const base = isH5Platform() ? BLOG_API_URL : `${BASE_URL}${BLOG_API_URL}`;
    const paths: Record<number, string> = {
      1: '/money/we-chat/upload',
      2: '/money/ali-pay/upload',
      3: '/money/bank/upload',
    };
    return `${base}${paths[uploadType.value] || ''}`;
  }

  // ---- 上传逻辑 ----
  function uploadH5(): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve, reject) => {
      if (!selectedFile.value) {
        reject(new Error('未选择文件'));
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile.value);
      if (uploadType.value === 3 && selectBankType.value) {
        formData.append('bankType', String(selectBankType.value));
      }
      const token = userStore.getToken;
      const authHead = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';
      const xhr = new XMLHttpRequest();
      xhr.open('POST', getUploadUrl());
      xhr.setRequestHeader('Authorization', authHead + token);
      xhr.timeout = 300000;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          uploadProgress.value = Math.ceil((e.loaded / e.total) * 100);
        }
      };
      xhr.onload = () => {
        clearUploadTimer();
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.code === 0) {
            resolve(res.result);
          } else {
            reject(new Error(res.message || '上传失败'));
          }
        } catch {
          reject(new Error('解析响应失败'));
        }
      };
      xhr.onerror = () => {
        clearUploadTimer();
        reject(new Error('网络错误'));
      };
      xhr.ontimeout = () => {
        uploadTimeout.value = true;
        reject(new Error('上传超时（5分钟）'));
      };
      uploadTimer.value = setTimeout(() => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.abort();
          uploadTimeout.value = true;
          reject(new Error('上传超时（5分钟）'));
        }
      }, 300000);
      xhr.send(formData);
    });
  }

  function uploadNative(): Promise<{ list: any[]; total: number }> {
    return new Promise((resolve, reject) => {
      if (!selectedFilePath.value) {
        reject(new Error('未选择文件'));
        return;
      }
      const token = userStore.getToken;
      const authHead = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';
      const task = uni.uploadFile({
        url: getUploadUrl(),
        filePath: selectedFilePath.value,
        name: 'file',
        formData: uploadType.value === 3 && selectBankType.value ? { bankType: String(selectBankType.value) } : {},
        header: { Authorization: authHead + token },
        success: (res) => {
          clearUploadTimer();
          try {
            const resp = JSON.parse(res.data);
            if (resp.code === 0) {
              resolve(resp.result);
            } else {
              reject(new Error(resp.message || '上传失败'));
            }
          } catch {
            reject(new Error('解析响应失败'));
          }
        },
        fail: (err) => {
          clearUploadTimer();
          if (uploadTimeout.value) return;
          reject(new Error(err.errMsg || '上传失败'));
        },
      });
      task.onProgressUpdate((res) => {
        uploadProgress.value = res.progress;
      });
      uploadTimer.value = setTimeout(() => {
        uploadTimeout.value = true;
        task.abort();
        reject(new Error('上传超时（5分钟）'));
      }, 300000);
    });
  }

  function clearUploadTimer() {
    if (uploadTimer.value) {
      clearTimeout(uploadTimer.value);
      uploadTimer.value = null;
    }
  }

  async function handleUpload() {
    if (!hasFile.value) return;
    if (uploadType.value === 3 && !selectBankType.value) {
      uni.showToast({ title: '请先选择银行类型', icon: 'none' });
      return;
    }
    uploading.value = true;
    uploadProgress.value = 0;
    uploadTimeout.value = false;
    try {
      const rawData = isH5Platform() ? await uploadH5() : await uploadNative();
      uploadProgress.value = 100;
      if (Array.isArray(rawData.list) && rawData.list.length > 0) {
        excelUploadTotal.value = rawData.total || rawData.list.length;
        tableData.value = rawData.list.map((item: any) => {
          const row = { ...item };
          row.inflowOrOutflow = item.inflowOrOutflow || undefined;
          if (uploadType.value !== 3) {
            row.billMethod = item.billMethod || undefined;
            row.billType = item.billType || undefined;
          } else {
            row.bankBillType = item.bankBillType || undefined;
            row.bankType = selectBankType.value;
          }
          return row;
        });
        step.value = 'preview';
      } else {
        uni.showToast({ title: '未解析到账单数据', icon: 'none' });
      }
    } catch (e: any) {
      uni.showToast({ title: e.message || '上传失败', icon: 'none', duration: 3000 });
    } finally {
      clearUploadTimer();
      uploading.value = false;
    }
  }

  // ---- 选择器逻辑 ----
  function openSelect(index: number, field: string) {
    selectIndex.value = index;
    selectField.value = field;
    if (field === 'billType' || field === 'bankBillType') {
      selectList.value = apiTypeStore.getBillTypeOption;
      selectTitle.value = '选择账单类型';
    } else if (field === 'billMethod') {
      selectList.value = apiTypeStore.getBillMethodOption;
      selectTitle.value = '选择账单方式';
    } else if (field === 'bankType') {
      selectList.value = apiTypeStore.getBankTypeOption;
      selectTitle.value = '选择银行类型';
    }
    selectVisible.value = true;
  }

  function onSelectConfirm(item: { label: string; value: number | string }) {
    if (selectIndex.value >= 0 && selectField.value) {
      (tableData.value[selectIndex.value] as any)[selectField.value] = item.value;
    }
    selectVisible.value = false;
  }

  // ---- 行状态 ----
  function isRowIncomplete(index: number): boolean {
    const item = tableData.value[index];
    if (uploadType.value === 3) {
      return !item.inflowOrOutflow || !item.bankBillType;
    }
    return !item.inflowOrOutflow || !item.billMethod || !item.billType;
  }

  // ---- 保存 ----
  async function handleSave() {
    saving.value = true;
    try {
      const batches = tableData.value as any[];
      if (uploadType.value === 1) {
        await weChatApi.batchSave({ batches });
      } else if (uploadType.value === 2) {
        await aliPayApi.batchSave({ batches });
      } else if (uploadType.value === 3) {
        await bankApi.batchSave({ batches });
      }
      uni.showToast({ title: '导入成功', icon: 'success' });
      setRefreshFlag('bill');
      setTimeout(() => uni.navigateBack(), 1000);
    } catch {
      // request 内部已 toast
    } finally {
      saving.value = false;
    }
  }

  function goBackToUpload() {
    step.value = 'upload';
    tableData.value = [];
    excelUploadTotal.value = 0;
    // clearFile();
  }

  const downloadFile = (downloadUrl: string, authHead: string, token: string, fileName = '银行统一数据模版.xlsx') => {
    const xhr = new XMLHttpRequest();
    // 将 POST 改为 GET
    xhr.open('GET', downloadUrl);
    xhr.setRequestHeader('Authorization', authHead + token);
    xhr.responseType = 'blob';
    xhr.timeout = 60000; // 超时 60 秒

    uni.showLoading({ title: '下载中...', mask: true });

    xhr.onload = () => {
      uni.hideLoading();
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        // 尝试从响应头获取文件名（后端可返回 Content-Disposition）
        const disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            fileName = decodeURIComponent(match[1].replace(/['"]/g, ''));
          }
        }

        const eLink = document.createElement('a');
        eLink.download = fileName;
        eLink.style.display = 'none';
        eLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eLink);
        eLink.click();
        // 延迟释放 URL 确保下载触发
        setTimeout(() => {
          URL.revokeObjectURL(eLink.href);
          document.body.removeChild(eLink);
        }, 100);
        uni.showToast({ title: '下载成功', icon: 'success' });
      } else {
        uni.showToast({ title: `下载失败（${xhr.status}）`, icon: 'none' });
      }
    };

    xhr.onerror = () => {
      uni.hideLoading();
      uni.showToast({ title: '网络异常，下载失败', icon: 'none' });
    };

    xhr.ontimeout = () => {
      uni.hideLoading();
      uni.showToast({ title: '下载超时，请重试', icon: 'none' });
      xhr.abort();
    };

    xhr.send(); // GET 请求无需传递数据
  };

  function handleDownloadBankFile() {
    if (!selectBankType.value) {
      // uni.showToast({ title: '请先选择银行类型', icon: 'none' });
      return;
    }
    const downloadUrl = bankApi.getDownloadUrl(selectBankType.value);
    const token = userStore.getToken;
    const authHead = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';

    if (isH5Platform()) {
      downloadFile(downloadUrl, authHead, token);
    } else {
      uni.downloadFile({
        url: downloadUrl,
        method: 'GET',
        header: { Authorization: authHead + token },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.openDocument({
              filePath: res.tempFilePath,
              fileType: 'xlsx',
              showMenu: true,
              fail: () => uni.showToast({ title: '打开文件失败', icon: 'none' }),
            });
          } else {
            uni.showToast({ title: '下载失败', icon: 'none' });
          }
        },
        fail: () => uni.showToast({ title: '下载失败', icon: 'none' }),
      });
    }
  }
</script>

<style lang="scss" scoped>
  .upload-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .upload-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .upload-section {
    text-align: center;
    padding: 40rpx 24rpx;
  }

  .upload-section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    display: block;
  }

  .upload-section-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
    display: block;
  }

  .upload-type-item {
    display: flex;
    flex-direction: column;
    padding: 16rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    // &:last-child {
    //   border-bottom: none;
    // }
  }

  .upload-types-label {
    font-size: $uni-font-size-base;
    font-weight: bold;
    display: block;
    margin-bottom: 8rpx;
  }

  .upload-type-desc {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
    padding-left: 48rpx;
  }

  .upload-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 24rpx;
  }

  .upload-download {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .upload-download-text {
    font-size: $uni-font-size-sm;
    color: $uni-color-primary;
    margin-left: 8rpx;

    &.disabled {
      color: $uni-text-color-grey;
    }
  }

  .upload-tip {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
  }

  .upload-mp-guide {
    margin-top: 20rpx;
    padding: 20rpx;
    background-color: #fff8e6;
    border-radius: 12rpx;
    width: 100%;
  }

  .upload-mp-guide-title {
    font-size: $uni-font-size-sm;
    font-weight: bold;
    color: #ff9900;
    display: block;
    margin-bottom: 12rpx;
  }

  .upload-mp-guide-step {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10rpx;
  }

  .upload-mp-guide-num {
    width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    text-align: center;
    border-radius: 50%;
    background-color: #ff9900;
    color: #fff;
    font-size: 22rpx;
    flex-shrink: 0;
    margin-right: 12rpx;
  }

  .upload-mp-guide-text {
    font-size: 24rpx;
    color: #666;
    flex: 1;
    line-height: 1.5;
  }

  .upload-file-info {
    display: flex;
    align-items: center;
  }

  .upload-file-detail {
    flex: 1;
    margin-left: 16rpx;
  }

  .upload-file-name {
    font-size: $uni-font-size-base;
    display: block;
  }

  .upload-file-size {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    display: block;
    margin-top: 4rpx;
  }

  .upload-progress {
    padding: 24rpx;
  }

  .upload-progress-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
    text-align: center;
    display: block;
  }

  .upload-submit {
    margin: 30rpx 10rpx;
  }

  .upload-help-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    display: block;
    margin-bottom: 16rpx;
  }

  .upload-help-item {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .upload-help-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-left: 12rpx;
    line-height: 1.6;
  }

  // ---- 预览区 ----
  .import-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid $uni-border-color;
  }

  .import-header-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .import-header-count {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .import-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .import-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    transition: background-color 0.2s;
  }

  .import-card-incomplete {
    background-color: #fef0f0;
  }

  .import-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  .import-card-index {
    font-size: $uni-font-size-base;
    font-weight: bold;
    color: $uni-color-primary;
  }

  .import-card-row {
    display: flex;
    align-items: flex-start;
    padding: 8rpx 0;

    .label {
      width: 140rpx;
      flex-shrink: 0;
      font-size: 26rpx;
      color: $uni-text-color-grey;
    }

    .value {
      flex: 1;
      font-size: 26rpx;
      color: $uni-text-color;
      word-break: break-all;

      &.money {
        font-weight: bold;
      }
    }
  }

  .import-card-divider {
    height: 1rpx;
    background-color: $uni-border-color;
    margin: 16rpx 0;
  }

  .import-card-radio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12rpx 0;

    .required {
      font-size: 26rpx;
      color: $uni-text-color;
      font-weight: bold;

      &::before {
        content: '* ';
        color: #ff3b30;
      }
    }
  }

  .import-card-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    &:last-child {
      border-bottom: none;
    }

    .required {
      font-size: 26rpx;
      color: $uni-text-color;
      font-weight: bold;

      &::before {
        content: '* ';
        color: #ff3b30;
      }
    }

    .import-card-select-value {
      flex: 1;
      text-align: right;
      font-size: 26rpx;
      color: $uni-text-color;
      margin-right: 8rpx;

      &.placeholder {
        color: $uni-text-color-grey;
      }
    }
  }

  .import-footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
    background-color: #fff;
    border-top: 1rpx solid $uni-border-color;
  }
</style>
