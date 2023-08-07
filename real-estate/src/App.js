import React, { useState } from 'react';
import Summary from './components/summary/Summary';
import Evaluate from './components/evaluate/Evaluate';
import Search from './components/search/Search';
import './App.css'
import {Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;

const App = () => {
  const [activeTab, setActiveTab] = useState('summary');
  let content;
  const items = [
    {
      label: 'Tổng quan',
      key: 'summary',
      className: 'page-menu'
    },
    {
      label: 'Tìm kiếm',
      key: 'search',
      className: 'page-menu'
    },
    {
      label: 'Định giá',
      key: 'evaluate',
      className: 'page-menu'
    }
  ]
  
  if (activeTab === 'summary') {
    content = <Summary />;
  } else if (activeTab === 'search') {
    content = <Search />;
  } else if (activeTab === 'evaluate') {
    console.log('project')
    content = <Evaluate />;
  }

  const onClick = (e) => {
    console.log('click', e);
    setActiveTab(e.key);
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      className='site-layout'
    >
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[activeTab]}
          onClick={onClick}
          items={items}
          className='page-menu'
        />
      </Header>
      <Content
        style={{
          padding: '10px 0px',
          overflow: 'initial'
        }}
      >
        <div
          style={{
            padding: 2,
            background: colorBgContainer,
            // height: '100%'
          }}
        >
          {content}
        </div>
      </Content>
      {/* <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©2023 Created by Ant UED
      </Footer> */}
    </Layout>
  );
};
export default App;