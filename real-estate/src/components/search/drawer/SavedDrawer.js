import React, { useEffect, useState } from "react";
import {Row, Col, Drawer,Divider, Space, Button} from 'antd'
import ProjectResult from "../results/ProjectResult";
import NewsResults from "../results/NewsResult";
function SavedDrawer (props) {
    const [savedNews, setSavedNews] = useState(null)
    const [savedProject, setSavedProject] = useState(null)

    useEffect(() => {
        if (props.savedNews) setSavedNews(props.savedNews)
        if (props.savedProject) setSavedProject(props.savedProject)
    })
    return (
        <>
         <Drawer
            title='Bài viết đã lưu'
            placement='top'
            width={'100%'}
            height={'50%'}
            onClose={props.hideSaveDrawer}
            open={props.openSave}
            extra={
                <Space>
                <Button type="primary" onClick={props.hideSaveDrawer}>
                    OK
                </Button>
                </Space>
            }
        >
            <Divider orientation='left' className="modal-divider">
                Bài viết đã lưu
            </Divider>
            <Row gutter={16}>
                <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: 'flex', marginLeft: '24px', marginRight: '24px', width: '100%' }}>
                    {

                        savedNews && savedNews.map((news) => (
                            <Col span={6} padding='10px'>
                                 <NewsResults news={news}  onSave={props.handleUnSaveNews} button={'Hủy lưu'} />
                            </Col>
                        ))
                    }
                </div>
            </Row>
            <Divider orientation='left' className="modal-divider">
                Dự án đã lưu
            </Divider>
            <Row gutter={16}>
                <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: 'flex', marginLeft: '24px', marginRight: '24px', width: '100%' }}>
                    {
                        savedProject && savedProject.map((project) => (
                            <Col span={6} padding='10px'>
                            <ProjectResult project={project} open={props.openProjectModal} setOpen={props.setOpenProjectModal} onSave={props.handleUnSaveProject} button={'Hủy lưu'} />
                            </Col>
                        ))
                    }
                </div>
            </Row>
        </Drawer>
        </>
    )
}

export default SavedDrawer