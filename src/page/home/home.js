import './home.scss';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from "../../plugins/api";
import {
  Avatar,
  Carousel,
  Input,
  Layout,
  Select,
} from 'antd';
import {isMobileOrPc} from "../../utils/utils";
import headSculptureImage from '../../assets/head_sculpture.jpg';



const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleCurrent: 1,
      articleList: [],
      articleTotal: 0,
      bannerData: [],
      classifyValue: null,
      classifyList: []
    };
  }
  componentDidMount() {
    const self = this;
    self.getBanner(); // 获取banner图
    self.getArticleList(); // 获取文章列表
    self.getClassify(); // 获取分类列表
  }

  // 查询banner图
  getBanner = ()=> {
    const self = this;
    const params = {
      parentId: 1
    };
    axios.get(API.BANNER_FIND, { params })
      .then(({ data }) =>{
        if (data.code === 0) {
          const bannerData = data.result;
          self.setState({
            bannerData,
          });
        }
      })
  };
  // 获取文章列表
  getArticleList = (keyword)=> {
    const self = this;
    const params = {
      keyword,
      category: self.state.classifyValue
    };
    axios.get(API.ARTICLE_FIND, { params })
      .then(({ data }) =>{
        if (data.code === 0) {
          const { list, total } = data.result;
          self.setState({
            articleList: list,
            articleTotal: total
          });
        }
      })
  };
  // 获取分类列表
  getClassify = ()=> {
    const self = this;
    axios.get(API.CATEGORY_FIND_ALL)
      .then(({ data }) =>{
        const listData = JSON.parse(JSON.stringify(data));
        listData.unshift({
          title: "全部",
          value: null
        });
        self.setState({
          classifyList: listData
        });
      })
  };

  // 搜索
  onSearch = (value)=> {
    const self = this;
    self.getArticleList(value);
  };

  // 分类选择
  classifyChange = (value)=> {
    const self = this;
    self.setState({
      classifyValue: value
    },() => {
      self.getArticleList();
    });
  };


  render() {
    // 检测屏幕
    let isShowSlider = false;
    if (!isMobileOrPc()) {
      isShowSlider = true;
    }
    // 循环文章列表
    let articleItem = [];
    this.state.articleList.forEach((item) =>{
      // 将简介中加入省略号
      const outline = item.outline.length> 100
        ? `${item.outline.slice(0, 100)}...` : item.outline;
      // 处理连接跳转
      // const linkTo = { path :"/articleDetails",query: { articleId: item.id } };
      const linkTo = `/articleDetails?articleId=${item.id}`;
      const image = "";
      // 处理循环样式
      articleItem.push({
        title: item.title,
        outline,
        createTime: item.createTime,
        linkTo,
        image,
        category: item.category,
        categoryName: item.categoryName,
      })
    });
    //标签云
    const cloudList = [];
    // 返回页面
    return (
      <Layout className="home">
        <Content className="home-main">
          {/*轮播图*/}
          <div className="home-carousel">
            {/*{bannerList.length>1?<LeftOutlined className="home-carousel--prev" onClick={this.carouselPrev} />:''}*/}
            <Carousel autoplay autoplaySpeed={10000} ref='imgCarousel'>
              {
                this.state.bannerData.map((item, index) =>
                  <a href={item.linkUrl || "#"}  title={item.title} key={index}>
                    <img className="home-carousel--banner" src={item.image} alt="轮播图"/>
                  </a>
                )
              }
            </Carousel>
            {/*{bannerList.length>1?<RightOutlined className="home-carousel--next" onClick={this.carouselNext} />:''}*/}
          </div>
          {/*文章列表*/}
          <ul className="article">
            {
              articleItem.map((item, index) =>
                <ReactCSSTransitionGroup
                  key={index}
                  transitionName="example"
                  transitionAppear={true}
                  transitionAppearTimeout={1000}
                  transitionEnterTimeout={1000}
                  transitionLeaveTimeout={1000}
                >
                  <li className="article-item">
                    <div className="item-cont">
                      {item.image?
                        (
                          <div className="item-cont--img">
                            <Link to={item.linkTo} title={item.title}>
                              <img src={item.image} alt={item.title} />
                            </Link>
                          </div>
                        ) : ""
                      }
                      <div>
                        <Link to={item.linkTo}>
                          <p className="item-cont--title">
                            {item.title}
                          </p>
                        </Link>
                        <p className="item-cont--info">{item.outline}</p>
                      </div>
                    </div>
                    <div className="item-author">
                      <span className="lm">
                        <i className="icon-tag2" />
                        { item.categoryName }
                      </span>
                      <span className="time"><i className="icon-time1" />{ item.createTime }</span>
                      {/*<span className="num">浏览（<a href="/">12</a>）</span>*/}
                      { !isShowSlider ? (
                        ''
                      ): (
                        <span className="more">
                          <Link to={item.linkTo}>阅读原文</Link>
                        </span>
                      )}
                    </div>
                  </li>
                </ReactCSSTransitionGroup>
              )
            }
          </ul>
        </Content>
        {!isShowSlider ? (
          ''
        ) : (
          <Sider width={330} className="home-slider">
            {/*简介*/}
            <div className="slider-about">
              <div className="slider-about--avatar">
                <Avatar size={100} src={headSculptureImage} />
              </div>
              <p className="slider-about--name">Mr.Yang</p>
              <p className="slider-about--position">Web前端工程师</p>
              <div className="slider-about--text"> 一个90后草根站长！18年入行。一直潜心研究web前端技术，一边工作一边积累经验，分享一些个人工作的经历，以及遇到的问题和解决方法。</div>
            </div>
            {/*搜索*/}
            <div className="slider-search">
              <Search
                placeholder="请输入关键字"
                enterButton="搜索"
                size="default"
                onSearch={this.onSearch}
              />
            </div>
            {/*分类选择*/}
            <div className="slider-classify">
              <Select
                showSearch
                defaultValue={this.state.classifyValue}
                className="slider-classify--select"
                onChange={this.classifyChange}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  this.state.classifyList.map((item,index) =>
                    <Option value={item.value} key={index}>{item.title}</Option>
                  )
                }
              </Select>
            </div>
            {/*标签云*/}
            {
              cloudList.length>1 ? (
                <div className="slider-cloud">
                  <h2 className="slider-cloud--title">标签云</h2>
                  <ul>
                    {/*<a href="/e/tags/?tagname=%B8%F6%C8%CB%B2%A9%BF%CD%C4%A3%B0%E5&amp;tempid=3" target="_blank">个人博客模板</a>
            <a href="/e/tags/?tagname=css%B6%AF%BB%AD&amp;tempid=3" target="_blank">css动画</a>
            <a href="/e/tags/?tagname=%B2%BC%BE%D6&amp;tempid=3" target="_blank">布局</a>*/}
                    {/*<a href="/e/tags/?tagname=%C4%D0%B3%CC%D0%F2%D4%B1&amp;tempid=3" target="_blank">男程序员</a>*/}
                    {/*<a href="/e/tags/?tagname=SEO&amp;tempid=3" target="_blank">SEO</a>
            <a href="/e/tags/?tagname=%C5%AE%B3%CC%D0%F2%D4%B1&amp;tempid=3" target="_blank">女程序员</a>
            <a href="/e/tags/?tagname=%D0%A1%CA%C0%BD%E7&amp;tempid=3" target="_blank">小世界</a>
            <a href="/e/tags/?tagname=%B8%F6%C8%CB%B2%A9%BF%CD&amp;tempid=3" target="_blank">个人博客</a>
            <a href="/e/tags/?tagname=%C9%E8%BC%C6&amp;tempid=3" target="_blank">设计</a>*/}
                  </ul>
                </div>
              ) : ''
            }

          </Sider>
        )}
      </Layout>
    );
  }
}

export default Home;
