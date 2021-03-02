import './nav.scss';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Layout,
  Row,
  Tooltip,
} from 'antd';
import { isMobileOrPc } from '../../utils/utils';

const { Header } = Layout;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      visible: false,
      placement: 'top',
      current: null,
      menuCurrent: '',
      login: false,
      register: false,
      navPath: '/',
      code: '',
      isLoading: false,
      navMenuArr: [
        {
          title: "首页",
          path: "/",
        },
        {
          title: "分类",
          path: "/classify"
        }
      ]
    };
  }
  componentDidMount() {
    const self = this;
    if (isMobileOrPc()) {
      self.setState({
        isMobile: true
      });
    }
    self.setState({
      navPath: self.props.location.pathname
    });
  }

  toNavChange(item) {
    this.setState({
      navPath: item.path
    });
  }
  render() {

    return (
      <Header className="nav">
        <Row className="nav-row" type="flex" justify="space-between">
          {/*<Col xs={24} sm={24} md={10} lg={10} xl={10}>*/}
            <Tooltip title="点击可进入过渡页面" overlayClassName="nav-tool">
              <Link to="/middle" className="nav-logo">
                <img className="nav-logo--img" src="https://6672-frist-ixdkl-1300617104.tcb.qcloud.la/blog/www/logo.jpg" alt="Yang Ruirui logo" />
                <span className="nav-logo--name">Mr.Yang</span>
              </Link>
            </Tooltip>
          {/*</Col>*/}
          {/*<Col xs={0} sm={0} md={14} lg={8} xl={6}>*/}
            <ul className="nav-menu">
              {
                this.state.navMenuArr.map((item, index) =>
                  <li className="nav-menu--item" key={index}>
                    <Link className={this.state.navPath === item.path?'active':''} to={item.path} onClick={this.toNavChange.bind(this,item)}>
                      { item.title }
                    </Link>
                  </li>
                )
              }
            </ul>
          {/*</Col>*/}
        </Row>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
