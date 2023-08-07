import { Card, Row, Col, Button } from 'antd';
import React from 'react';
import { formatPrice } from '../../../utils/helpers';

function ProjectResult (props) {
    console.log(props)
    const project = props.project
    const onClick = () => {
        props.onSave(project)
    }
    return (
        <Card
            className='project-card'
            title={<span onClick={(e) => props.setOpen(project.project_id)}>{project.name}</span>}
            bordered={true}
            style={{
                padding: '10px'
            }}
            headStyle={{
                fontWeight: 600, fontSize: '22px', width: '100%'
            }}
            data-project-id={project.project_id}
            extra={<Button type="primary" onClick={onClick}>{props.button}</Button>}
        >
            <Row gutter={16}>
                <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Giá: {formatPrice(project.avg_total_price)} ~ {formatPrice(project.avg_price_per_m2)} / m2
                </Col>
            </Row>
            <Row gutter={16}>
               <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Diện tích: {Math.floor(project.avg_square)} m2
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Số lượng bài viết: {project.n_news} bài
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24} className='long-word' style={{fontWeight: 550, fontSize: '16px'}}>
                    Địa chỉ: {project.address.address}
                </Col>
            </Row>
        </Card>
    )
}

export default ProjectResult;
