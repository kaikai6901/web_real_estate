import { Card, Row, Col, Button } from 'antd';
import React from 'react';
import { formatPrice } from '../../../utils/helpers';

function NewsResults (props) {
    const news = props.news
    const onClick= () => {
        props.onSave(news)
    }
    return (
        <Card
            className='project-card'
            title={<a href={news.news_url} className='item title'>
                        {news.title}
                    </a>}
            bordered={true}
            style={{
                padding: '10px'
            }}
            headStyle={{
                fontWeight: 600, fontSize: '18px', width: '100%'
            }}
            data-project-id={news.news_id}
            extra={<Button type="primary" onClick={onClick}>{props.button}</Button>}
        >
            <Row gutter={16}>
                <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Giá: {formatPrice(news.total_price)} ~ {formatPrice(news.price_per_m2)} / m2
                </Col>
            </Row>
            <Row gutter={16}>
               <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Diện tích: {Math.floor(news.square)} m2
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                Số phòng ngủ: {news.n_bedrooms ? news.n_bedrooms: '---'}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24} className='long-word' style={{fontWeight: 550, fontSize: '16px'}}>
                    Địa chỉ: {news.address}
                </Col>
            </Row>
        </Card>
    )
}

export default NewsResults