import { Card, Row, Col } from 'antd';
import React from 'react';
import './Elements.css'
import { formatPrice } from '../../../utils/helpers';

function NewsCard (props) {
    const news = props.news
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
                fontWeight: 600, fontSize: '18px', width: '400px'
            }}
            data-project-id={news.news_id}
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

export default NewsCard