import React, {useState, useEffect} from "react";
import { formatPrice } from "../../../../utils/helpers";

import {Card, Row, Col, Divider} from 'antd'
import { Line, Bar } from "react-chartjs-2";
function ProjectDetailTab (props) {
    const [data, setData] = useState(null)
    const project = props.project


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/modal/get_detail_project?project_id=${project.project_id}`)
        .then(res => res.json())
        .then(data => setData(data))
        console.log(data)
    }, [])

    const processToLineChartData = () => {
        if (!data) {
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

        const labels = data.history.map((item) => item._id);
        const prices = data.history.map((item) => item.averagePricePerM2);
        const counts = data.history.map((item) => item.count);
        
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

    const processToBarChartData = () => {
        if (!data) {
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

        const bins = data.distribute.filter(obj => obj.range.length > 0);
        const labels = bins.map((bin, index) => {
            if (index % 3 === 0) {
                return `${bin.range[0]}`
            } else {
                return '';
            }
        })

        const barChartData = {
            labels: labels,
            datasets: [
            {
                label: 'Số lượng bài viết',
                data: bins.map((bin) => bin.count),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                // indexAxis: 'triệu / m2'
            },
            ],
        };
        return barChartData
    }

    const lineChartOption = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thang'
                }
            }
        }
    }
    const barChartOption = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Đơn giá theo m2 (triệu / m2)'
                }
            }
        }
    }
    if (data)
    return (
        <>
            <Divider orientation="left" className="modal-divider">
                Thống kê xung quanh 1km
            </Divider>
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
                            Trung bình: {formatPrice(data.around_property[0].averagePricePerM2)}
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} style={{fontWeight: 550, fontSize: '16px'}}>
                            Dao động từ:  {formatPrice(data.around_property[0].minPricePerM2)} m2 - {formatPrice(data.around_property[0].maxPricePerM2)} /m2
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
            <Divider orientation="left" className="modal-divider">
                Phân bố giá
            </Divider>
            <Row gutter={16}>
                <Bar data={processToBarChartData()} options={barChartOption}/>
            </Row>
            <Divider orientation="left" className="modal-divider">
            Dữ liệu lich sử
            </Divider>
            <Row gutter={16}>
                <Line data={processToLineChartData()} options={lineChartOption}/>
            </Row>
        </>
    )
    else
        return(
            <div>Loading....</div>
        )
}

export default ProjectDetailTab;
