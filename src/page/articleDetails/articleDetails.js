import './articleDetails.scss';
import React, { Component } from 'react';
import axios from 'axios';
import API from "../../plugins/api";
import {
  Layout,
  Affix
} from 'antd';
import {
  getQueryStringByName,
} from '../../utils/utils';
import ReactMarkdown from 'react-markdown'
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';

const { Content, Sider } = Layout;

class articleDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleId: getQueryStringByName('articleId'),
      articleData: {
        htmlContent: '',
        markdownContent: ''
      },
    };
  }
  componentDidMount() {
    const self = this;
    self.getArticleDetails(); // 获取详情数据
  }

  // 获取详情数据
  getArticleDetails = ()=> {
    const self = this;
    const params = {
      articleId: this.state.articleId
    };
    axios.get(API.ARTICLE_DETAILS, { params })
      .then(({ data }) =>{
        if (data.code === 0) {
          const articleData = data.result;
          self.setState({
            articleData,
          });
        }
      })
  };

  render() {
    const articleData = this.state.articleData;
    // 返回页面
    return (
      <Layout className="article-detail">
        <Content className="article-cont">
          <p className="article-cont--title">{ articleData.title }</p>
          <div className="article-cont--author">
            <i className="icon-touxiang author01" />
            <span>{ articleData.authorNickname }</span>
            <i className="icon-rili author02" />
            <span>{ articleData.createTime }</span>
          </div>
          <div className="article-cont--about">
            <strong>简介</strong>
            { articleData.brief }
          </div>
          <div className="article-markdown">
            <ReactMarkdown
              source={articleData.markdownContent}
              escapeHtml={false}
            />
          </div>
          {/* <div dangerouslySetInnerHTML={{__html: articleData.htmlContent }} /> */}
        </Content>
        <Sider width={330} className="article-side">
          <Affix offsetTop={5}>
            <div className="article-catalog">
              <p className="article-catalog--title">文章目录</p>
              <MarkNav
                className="article-menu"
                source={articleData.markdownContent}
                ordered={false}
              />
            </div>
          </Affix>
        </Sider>
      </Layout>
    );
  }
}

export default articleDetails;
