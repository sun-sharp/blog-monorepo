import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user/user.service';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { RoleService } from './role/role.service';
import { MenuService } from './menu/menu.service';
import { logger } from 'src/common/journal';
import { ConfigurationService } from './configuration/configuration.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { CreateConfigurationDto } from './configuration/dto/create-configuration.dto';
import { IResponse } from 'types/common';
import { ApiCapitalLoginResult } from 'types/capital';
import { ApiMenuItem } from 'types/capital/menu';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { useCustomConfig } from 'src/config';
import { WaitForDoService } from './wait-for-do/wait-for-do.service';
import { ImageService } from './image/image.service';
import { CategoryService } from './category/category.service';

const customConfig = useCustomConfig();
const { staticDirPosition, staticDirName } = customConfig;

@Injectable()
export class CapitalService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly menuService: MenuService,
    private readonly waitForDoService: WaitForDoService,
    private readonly imageService: ImageService,
    private readonly configurationService: ConfigurationService,
    private readonly categoryService: CategoryService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description 登录
   * @param {LoginUserDto} loginUserDto
   * @return {Promise<IResponse>}
   */
  public login(loginUserDto: LoginUserDto): Promise<IResponse> {
    return (
      Promise.resolve(loginUserDto)
        // 判断用户名是否存在,密码是否正确
        .then(async (res) => {
          const { username } = res;
          const user = await this.userService.findOneByName(username);
          if (!user) {
            throw {
              code: ApiCode.ERROR,
              message: '用户尚未注册',
            };
          }
          if (await comparePassword(res.password, user.password)) {
            return {
              _id: user._id,
            };
          } else {
            throw {
              code: ApiCode.ERROR,
              message: '密码错误',
            };
          }
        })
        // 修改登录时间
        .then(async (res) => {
          await this.userService.updateLoginDate(res._id);
          logger.log(`修改登录时间`);
          return {
            _id: res._id,
          };
        })
        // 创造token
        .then((res) => {
          const token = this.jwtService.sign(res);
          logger.log(`创造token，请求成功！${token}`);
          const result: ApiCapitalLoginResult = {
            token,
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '请求成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`返回错误 ${err}`);
          return {
            code: err.code || ApiCode.ERROR,
            message: err.message || '请求失败！',
          };
        })
    );
  }

  /**
   * @description 注册用户
   * @param {CreateUserDto} body
   * @return {Promise<IResponse>}
   */
  public signUp(body: CreateUserDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 判断username 是否为合法字符
        .then(async (body) => {
          const { result: userId, code, message } = await this.userService.create(body);
          if (code !== ApiCode.SUCCESS) {
            throw {
              code: ApiCode.ERROR,
              message: message || '创建用户失败',
            };
          }
          // 默认配置信息
          const defaultConfigInfo: CreateConfigurationDto = {
            // 系统主题
            appTheme: 'light',
            // 系统主题色
            appThemeColor: '#2d8cf0',
            // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
            navMode: 'vertical',
            // 侧边栏样式
            siderIsDark: false,
            // 顶栏样式
            headIsDark: false,
            // 固定顶栏
            headFixed: true,
            // 固定标签页
            tabsViewShow: true,
            // 固定标签页
            tabsViewFixed: true,
            // 显示页脚
            footerShow: true,
            // 固定页脚
            footerFixed: true,
            // 显示重载页面按钮
            headerReloadShow: true,
            // 显示面包屑导航
            headerBreadcrumbShow: true,
            // 显示面包屑显示图标
            headerBreadcrumbShowIcon: true,
            // 页面跳转动画
            hasPageAnimate: true,
            // 页面跳转动画类型
            pageAnimateType: 'zoom-fade',
          };
          const { code: configCode, message: configMessage } = await this.configurationService.save(userId, defaultConfigInfo);
          if (configCode !== ApiCode.SUCCESS) {
            throw {
              code: ApiCode.ERROR,
              message: configMessage || '创建配置信息失败',
            };
          }
          return {
            code: ApiCode.SUCCESS,
            result: userId,
            message: '注册成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '注册失败！',
          };
        })
    );
  }

  /**
   * @description: 路由权限获取管理系统菜单列表
   * @param {string} roleCode
   * @return {Promise<IResponse>}
   */
  public roleMenu(roleCode: string): Promise<IResponse> {
    return (
      Promise.resolve(roleCode)
        // 判断用户名是否存在,密码是否正确
        .then(async (roleCode) => {
          const routeFind = await this.roleService.findOneByRoleCode(roleCode);
          if (!routeFind) {
            throw {
              code: ApiCode.ERROR,
              message: '查询角色失败',
            };
          }
          // 如果你是管理员账号，那就获取全部菜单
          if (routeFind.roleType === 1) {
            const response = await this.menuService.findAll();
            if (response.code === ApiCode.SUCCESS) {
              return response;
            }
          }
          // 不是管理员账号，执行下面
          const routePermission = routeFind.menuPermission;
          const findArr = await this.menuService.findByMenuPermission(routePermission);
          if (findArr.length > 0) {
            const result: ApiMenuItem[] = findArr.map((m) => ({
              menuId: m._id,
              name: m.name,
              title: m.title,
              sort: m.sort,
              icon: m.icon,
              parentId: m.parentId,
              iframeSrc: m.iframeSrc,
              component: m.component,
              menuType: m.menuType,
              hidden: m.hidden,
              externalLink: m.externalLink,
              noKeepAlive: m.noKeepAlive,
            }));
            return {
              code: ApiCode.SUCCESS,
              result,
              message: '查询成功！',
            };
          }
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 删除用户和用户相关数据
   * @param {string} userId
   * @return {Promise<IResponse>}
   */
  public removeUser(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          const { code: userCode, message: userMessage } = await this.userService.remove(userId);
          if (userCode !== ApiCode.SUCCESS) {
            throw {
              code: ApiCode.ERROR,
              message: userMessage || '删除用户失败',
            };
          }
          const { code: configCode, message: configMessage } = await this.configurationService.remove(userId);
          if (configCode !== ApiCode.SUCCESS) {
            throw {
              code: ApiCode.ERROR,
              message: configMessage || '删除用户配置信息失败',
            };
          }
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 备份数据库Capital数据
   * @return {Promise<IResponse>}
   */
  public backupsCapital(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          // 判断json/capital目录是否路径存在
          const capitalDir = `${staticDirPosition}${staticDirName}/json/capital`;
          const hasDir = existsSync(capitalDir);
          if (!hasDir) {
            // 创建json/capital目录
            mkdirSync(capitalDir);
          }
          // 备份capital/user
          const userData = await this.userService.findAllToData();
          const userStr = JSON.stringify(userData, null, '\t');
          writeFileSync(`${capitalDir}/user.json`, userStr);
          logger.log('备份数据库capital/user数据');
          // 备份capital/role
          const roleData = await this.roleService.findAllToData();
          const roleStr = JSON.stringify(roleData, null, '\t');
          writeFileSync(`${capitalDir}/role.json`, roleStr);
          logger.log('备份数据库capital/role数据');
          // 备份capital/menu
          const menuData = await this.menuService.findAllToData();
          const menuStr = JSON.stringify(menuData, null, '\t');
          writeFileSync(`${capitalDir}/menu.json`, menuStr);
          logger.log('备份数据库capital/menu数据');
          // 备份capital/waitForDo
          const waitForDoData = await this.waitForDoService.findAllToData();
          const waitForDoStr = JSON.stringify(waitForDoData, null, '\t');
          writeFileSync(`${capitalDir}/waitForDo.json`, waitForDoStr);
          logger.log('备份数据库capital/waitForDo数据');
          // 备份capital/image
          const imageData = await this.imageService.findAllToData();
          const imageStr = JSON.stringify(imageData, null, '\t');
          writeFileSync(`${capitalDir}/image.json`, imageStr);
          logger.log('备份数据库capital/image数据');
          // 备份capital/configuration
          const configurationData = await this.configurationService.findAllToData();
          const configurationStr = JSON.stringify(configurationData, null, '\t');
          writeFileSync(`${capitalDir}/configuration.json`, configurationStr);
          logger.log('备份数据库capital/configuration数据');
          // 备份capital/category
          const categoryData = await this.categoryService.findAllToData();
          const categoryStr = JSON.stringify(categoryData, null, '\t');
          writeFileSync(`${capitalDir}/category.json`, categoryStr);
          logger.log('备份数据库capital/category数据');
          return {
            code: ApiCode.SUCCESS,
            message: '备份成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '备份失败！',
          };
        })
    );
  }
}
