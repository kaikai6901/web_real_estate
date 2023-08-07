import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { formatPrice } from '../../../utils/helpers';

function DistrictModal (props) {
    console.log(props)
    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/modal/get_summary_district?district=${props.open}`)
        .then(res => res.json())
        .then(data => setChartData(data))
        console.log(chartData)
    }, [])

    const options = {
        plugins: {
            title: {
                text: 'Biểu đồ lịch sử giá và số bài viết',
                display: true,
                padding: 0,
                font: {
                    size: 24,
                    family: 'sans-serif'
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tháng',
                    font: {
                        size: 18,
                        family: 'sans-serif'
                    },

                },
            },
            yAxes: [
                {
                id: 'y-axis-price',
                type: 'linear',
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Average Price per m2'
                }
                },
                {
                id: 'y-axis-count',
                type: 'linear',
                position: 'right',
                scaleLabel: {
                    display: true,
                    labelString: 'Document Count'
                }
                }
            ]
        }
    }
    const processToChartData = () => {
        if (!chartData) {
            return {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                    }
                ]
            };
        }
        const labels = chartData.history.map((item) => item._id);
        const prices = chartData.history.map((item) => item.averagePricePerM2);
        const counts = chartData.history.map((item) => item.count);
        
        return  {
            labels: labels,
            datasets: [
              {
                label: 'Giá trung bình / m2',
                data: prices,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-price'
              },
              {
                label: 'Số lượng bài viết',
                data: counts,
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderColor: 'rgba(192, 75, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-count'
              }
            ]
        };
    }
    return(
        <>
        <Modal
            title={<span style={{margin: '10px', fontSize: '24px', fontWeight: 600}}>{props.open}</span>}
            centered
            open={props.open}
            onOk={() => props.setOpen(false)}
            onCancel={() => props.setOpen(false)}
            width={1000}
        >
            {chartData && <Row gutter={16}>
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
                            Trung bình: {formatPrice(chartData.summary[0].averageTotalPrice)}
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ: {formatPrice(chartData.summary[0].minTotalPrice)} - {formatPrice(chartData.summary[0].maxTotalPrice)}
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
                            Trung bình: {formatPrice(chartData.summary[0].averagePricePerM2)} / m2
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ: {formatPrice(chartData.summary[0].minPricePerM2)} - {formatPrice(chartData.summary[0].maxPricePerM2)} / m2
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>}

            <Row justify={'center'} align={'middle'} gutter={16} style={{padding: '10px'}}>
                {/* <Col ju span={24}> */}
                {chartData ? (
                        <Line
                        data={processToChartData()}
                        options={options}
                        />
                    ) : (
                        <div>Loading chart data...</div>
                    )}
                {/* </Col> */}
            </Row>
        </Modal>
        </>
    )
}

export default DistrictModal