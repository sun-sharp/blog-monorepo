import './index.scss';
import './mobile.scss';
import React, { Component } from 'react';
import { Layout, BackTop } from 'antd';
import Nav from './nav/nav';
import Middle from '../page/middle/middle';

const { Footer } = Layout;

class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let isIndexPage = false;
    if (this.props.location.pathname === '/middle') {
      isIndexPage = true;
    }
    return (
      <div className="Layouts">
        {!isIndexPage ? (
            <Layout>
              <Nav />
              {this.props.children}
              <Footer className="layouts-footer">
                ©2020<i className="icon-aixin layouts-footer--love"/>Mr.Yang | 黔ICP备20002802号
              </Footer>
              <BackTop />
            </Layout>
        ) : (
          <Middle />
        )}
      </div>
    );
  }
}

export default Layouts;

