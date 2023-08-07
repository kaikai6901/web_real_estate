import React, { useState } from "react"
import { Divider, Row, Col } from 'antd';
import './Summary.css'
import StatisticGroup from "./elements/StatisticGroup";
import PriceHistChart from "./charts/PriceHistChart";
import DistrictBarChart from "./charts/DistrictBarChart";
import ProjectList from "./list/ProjectList";
import NewsList from "./list/NewsList";
import DistrictModal from "./modal/DistrictModal";
import ProjectModal from "./modal/ProjectModal";
function Summary () {
    const [district, setDistrict] = useState(null)
    const [project, setProject] = useState(null)
    return (
        <>
            {district && <DistrictModal open={district} setOpen={setDistrict}></DistrictModal>}
            {project && <ProjectModal open={project} setOpen={setProject}/>}
            <Divider orientation="left" className="page-divider">
                Thông tin chung
            </Divider>
            <Row justify='center' align='middle' gutter={24} className="statistic-pane">
                <Col span={8}>
                    <StatisticGroup />
                </Col>
                <Col span={16} justify='center' align='middle' style={{padding: '0 150px'}}>
                    <PriceHistChart />
                </Col>
            </Row>

            <Divider orientation="left" className="page-divider">
                Thông tin các quận
            </Divider>

            <Row justify='center' align='middle' gutter={24} className="district-pane">
               {/* <Col span={24} justify='center' align='middle' style={{padding: '0 0px', display: 'flex'}} > */}
                <DistrictBarChart open={district} setOpen={setDistrict}>

                </DistrictBarChart>
               {/* </Col> */}
            </Row>
            <Divider orientation="left" className="page-divider">
                Dự án có nhiều bài đăng
            </Divider>
            <Row justify='center' align='middle' gutter={24} className="project-list">
              <ProjectList open={project} setOpen={setProject}></ProjectList>
            </Row>
            <Divider orientation="left" className="page-divider">
                Bài viết đáng quan tâm
            </Divider>
            <Row justify='center' align='middle' gutter={24} className="news-list">
              <NewsList></NewsList>
            </Row>
        </>
    )
}

export default Summary