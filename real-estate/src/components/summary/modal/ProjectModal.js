import './Modal.css'
import ProjectSummaryTab from './tabs/ProjectSummaryTab';
import ProjectDetailTab from './tabs/ProjectDetailTab';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Card } from 'antd';
import { formatPrice } from '../../../utils/helpers';
import {Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
function ProjectModal (props) {
    const [activeTab, setActiveTab] = useState('summary');
    const [project, setProject] = useState(null);
    console.log(project)
    useEffect(() => {
        if (props.open)
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/modal/get_project_info?project_id=${props.open}`)
        .then(res => res.json())
        .then(data => setProject(data[0]))
    }, [])

    console.log(project)

    let tab;
    const items = [
        {
            label: 'Thông tin chung',
            key: 'summary',
            className: 'modal-menu'
        },
        {
            label: 'Phân tích chi tiết',
            key: 'detail',
            className: 'modal-menu'
        }
    ] 

    const handleClickTab = (e) => {
        setActiveTab(e.key);
      };
    if (activeTab === 'summary') {
        if (project)
            tab = <ProjectSummaryTab project={project}/>;
        else
            tab = null
    } else if (activeTab === 'detail') {
        if(project)
            tab = <ProjectDetailTab project={project}/>;
        else
            tab = null
    }
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    if (project)
    return (
        <>
            <Modal
                title={<span style={{fontSize: '24px', fontWeight: 600}}>{project.name}</span>}
                centered
                open={props.open}
                onOk={() => props.setOpen(false)}
                onCancel={() => props.setOpen(false)}
                width={1000}
            >
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
                        <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[activeTab]}
                        onClick={handleClickTab}
                        items={items}
                        className='modal-menu'
                        />
                    </Header>
                    <Content
                        style={{
                        padding: '10px 0px',
                        overflow: 'initial',
                        // height: '700px'
                        }}
                    >
                        <div
                        style={{
                            padding: 2,
                            background: colorBgContainer,
                           
                        }}
                        >
                        {tab}
                        </div>
                    </Content>
                </Layout>
            </Modal>
        </>
    )
    else
        return(
            <div>Loading....</div>
        )
}

export default ProjectModal;