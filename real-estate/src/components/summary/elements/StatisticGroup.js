import {React, useState, useEffect} from "react";
import { Col, Row, Statistic, Card } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './Elements.css'
import { formatPrice} from "../../../utils/helpers";
function StatisticGroup () {
    const [statistic, setStatistic] = useState({
        current: 42390000,
        changeOneMonthBefore: 1.75,
        changeTwoMonth: 12.41
    })
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/summary/price_of_month`)
        .then(res => res.json())
        .then(statistic => {
            setStatistic(statistic)
        })
        console.log(statistic)
    }, [])
    return (
       <>
       <Row gutter={16}>
            <Col span={24}>
                <Card bordered={false}>
                    <Statistic 
                        title={<span style={{fontSize: '30px', fontWeight: 600}}>Giá trung bình</span>}
                        value={formatPrice(statistic.current) + ' /m2'} 
                        // value={'42.39 triệu / m2'}
                        style={{textAlign: 'center'}}
                        valueStyle={{fontWeight: 600, fontSize: '30px'}}
                    />
                </Card>
            </Col>
       </Row>
       <Row gutter={16}>
            <Col span={12}>
                <Card bordered={false}>
                    <Statistic 
                        title={<span style={{fontSize: '22px', fontWeight: 550}}>So với tháng trước</span>}
                        value={statistic.changeOneMonthBefore}
                        precision={2}
                        prefix={statistic.changeOneMonthBefore > 0 ? (<ArrowUpOutlined />) : (< ArrowDownOutlined/>)}
                        suffix="%"
                        style={{textAlign: 'center'}}
                        valueStyle={{fontWeight: 600, fontSize: '24px'}}
                    />
                 </Card>
            </Col>

            <Col span={12}>
                <Card bordered={false}>
                    <Statistic 
                        title={<span style={{fontSize: '22px', fontWeight: 550}}>So với 2 tháng trước</span>}
                        value={statistic.changeTwoMonth}
                        precision={2}
                        prefix={statistic.changeTwoMonth < 0 ? (<ArrowDownOutlined />) : (<ArrowUpOutlined />)}
                        suffix="%" 
                        style={{textAlign: 'center'}}
                        valueStyle={{fontWeight: 600, fontSize: '24px'}}
                    />
                 </Card>
            </Col>
       </Row>
       </>
    )
}
export default StatisticGroup;