/*
 * @LastEditTime: 2023-12-04 11:26:50
 * @FilePath: \alone-blog-api\nest.config.js
 * @Description: 打包之前处理
 */

// 修改打包文件夹名称
import { useCustomConfig } from './config';
import * as tsconfig from './tsconfig.json';
import { writeFileSync } from 'node:fs';

const customConfig = useCustomConfig();
const { buildOutDirName, buildOutDirPosition } = customConfig;

const buildOutDir = `${buildOutDirPosition}${buildOutDirName}`;
tsconfig.compilerOptions.outDir = buildOutDir;
writeFileSync('./tsconfig.json', JSON.stringify(tsconfig, null, 2), { encoding: 'utf-8' });
