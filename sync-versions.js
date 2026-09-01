const fs = require('fs');
const path = require('path');
// 使用 json5 库解析宽松的 JSON（支持注释、尾随逗号等）
// 先安装：npm install json5
const JSON5 = require('json5');

const newVersion = '4.5.6';
const newVersionCode = 4506;

// ---------- package.json 列表 ----------
const packageFiles = [
  './package.json',
  './packages/admin-mobile/package.json',
  // './packages/admin-mobile-x/package.json',
  './packages/admin-web/package.json',
  './packages/node-server/package.json',
  './packages/website/package.json',
  './packages/shared/package.json',
];

// ---------- manifest.json 列表 ----------
const manifestFiles = [
  './packages/admin-mobile/manifest.json',
  './packages/admin-mobile-x/manifest.json',
];

// 工具函数：更新 JSON 文件（支持严格 JSON 和 JSON5 两种读取方式）
function updateJsonFile(filePath, updateFn, useJson5 = false) {
  const absolutePath = path.resolve(filePath);

  // 1. 检查文件是否存在
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️  跳过不存在的文件: ${filePath}`);
    return;
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    // 根据参数选择解析方式
    const data = useJson5 ? JSON5.parse(content) : JSON.parse(content);
    
    // 执行更新回调
    updateFn(data);
    
    // 序列化时保持严格 JSON 格式（2空格缩进）
    const output = JSON.stringify(data, null, 2) + '\n';
    fs.writeFileSync(absolutePath, output);
    console.log(`✅ 已更新: ${filePath}`);
  } catch (err) {
    console.error(`❌ 更新失败: ${filePath}`, err.message);
  }
}

// 更新所有 package.json
packageFiles.forEach((file) => {
  updateJsonFile(file, (pkg) => {
    pkg.version = newVersion;
  }, false); // package.json 通常是严格 JSON，不用 JSON5
});

// 更新所有 manifest.json（使用 JSON5 解析，兼容注释和尾逗号）
manifestFiles.forEach((file) => {
  updateJsonFile(file, (manifest) => {
    manifest.versionName = newVersion;
    manifest.versionCode = newVersionCode;
  }, true); // 使用 JSON5
});