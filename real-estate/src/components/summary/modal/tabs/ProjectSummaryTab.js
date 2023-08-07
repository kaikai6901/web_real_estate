import React, {useState, useEffect} from "react";
import { formatPrice } from "../../../../utils/helpers";

import {Card, Row, Col, Divider} from 'antd'
import NewsCard from "../../elements/NewsCard";

function ProjectSummaryTab (props) {
    const [news, setNews] = useState(null)

    const project = props.project

    const fetchNews = async (project_id) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/project/${project_id}/get_news`);
          const data = await response.json();
          setNews(data);
  
        } catch (error) {
          console.error('Error fetching projects:', error)
        }
    }

    useEffect(() => {
        fetchNews(project.project_id)
    }, [])
    
    if (project)
    return(
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <Card 
                        bordered={true}
                        title={'Khoảng giá bán'}
                        style={{
                            padding: '10px'

                        }}
                        headStyle={{
                            fontWeight: 600, fontSize: '22px', width: '400px'
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Trung bình: {formatPrice(project.avg_total_price)}
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ: {formatPrice(project.min_total_price)} - {formatPrice(project.max_total_price)}
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card 
                        bordered={true}
                        title={'Đơn giá theo m2'}
                        style={{
                            padding: '10px'

                        }}
                        headStyle={{
                            fontWeight: 600, fontSize: '22px', width: '400px'
                        }}
                    >
                         <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Trung bình: {formatPrice(project.avg_price_per_m2)} / m2
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ: {formatPrice(project.min_price_per_m2)} - {formatPrice(project.max_price_per_m2)} / m2
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card 
                        bordered={true}
                        title={'Diện tích'}
                        style={{
                            padding: '10px'

                        }}
                        headStyle={{
                            fontWeight: 600, fontSize: '22px', width: '400px'
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Trung bình: {Math.floor(project.avg_square)} m2
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ: {Math.floor(project.min_square)} - {Math.floor(project.max_square)} m2
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Divider orientation="left" className="modal-divider">
                Danh sách bài viết
            </Divider>
            <Row gutter={16}>
                <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: 'flex', marginLeft: '24px', marginRight: '24px' }}>
                    {news && 
                            news.map((item) => 
                                (
                                   <NewsCard news={item}></NewsCard>
                                )
                            )
                        }

                </div>
            </Row>
        </>
    )
    else
        return(
            <div>
                Loading.....
            </div>
        )

}

export default ProjectSummaryTab;
