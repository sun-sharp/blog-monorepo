import './classify.scss';
import React, { Component } from 'react';
import axios from 'axios';
import API from "../../plugins/api";
import {
  Layout,
} from 'antd';
import {isMobileOrPc} from "../../utils/utils";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {Link} from "react-router-dom";

const { Content, Sider } = Layout;

class Classify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classifyValue: null,
      classifyList: [{title: "全部", value: null}],
      articleCurrent: 1,
      articleList: [],
      articleTotal: 0,
    };
  }
  componentDidMount() {
    const self = this;
    self.getClassify(); // 获取分类列表
    self.getArticleList(); // 获取文章列表
  }

  // 获取分类列表
  getClassify = ()=> {
    const self = this;
    axios.get(API.CATEGORY_FIND_ALL)
      .then(({ data }) =>{
        const classifyList = [...self.state.classifyList,...data];
        self.setState({
          classifyList
        });
      })
  };
  // 获取文章列表
  getArticleList = (current)=> {
    const self = this;
    const params = {
      current,
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
    // 循环导航列表
    const classifyHtml = this.state.classifyList.map((item,index) =>
      <p
        className={this.state.classifyValue===item.value?'active':''}
        key={index}
        onClick={this.classifyChange.bind(this,item.value)}
      >{item.title}</p>
    );
    // 循环文章列表
    let articleItem = [];
    this.state.articleList.forEach((item) =>{
      // 将简介中加入省略号
      const outline = item.outline.length> 100
        ? `${item.outline.slice(0, 100)}...` : item.outline;
      // 处理连接跳转
      // const linkTo = { path :"/articleDetails",query: { id: item._id } };
      const linkTo = `/articleDetails?articleId=${item._id}`;
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
    // 返回页面
    return (
      <Layout className="classify">
        {!isShowSlider ? (
          <header className="classify-header">
            { classifyHtml }
          </header>
        ) : (
          <Sider width={330} className="classify-slider">
            { classifyHtml }
          </Sider>
        )}
        <Content className="classify-main">
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
      </Layout>
    );
  }
}

export default Classify;
