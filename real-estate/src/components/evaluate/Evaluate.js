import React, { useState, useEffect } from "react"
import ReactMapGL, {Marker}  from '@goongmaps/goong-map-react';
import {Button, Row, Col, Select, Drawer, Space, Divider, InputNumber} from 'antd'
import {PushpinOutlined, SearchOutlined, AreaChartOutlined} from '@ant-design/icons';
import ProjectModal from "../summary/modal/ProjectModal";
import { formatPrice } from "../../utils/helpers";
const GOONG_MAPTILES_KEY = `${process.env.REACT_APP_GOONG_MAPTILES_KEY}`;
let oldProjects = null;
let square = ''
let n_bedrooms = ''

function Evaluate (props) {
    const [projects, setProjects] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null)
    const [result, setResult] = useState('')
    const [lngLat, setLngLat] = useState({
        longitude: 105.8549172,
        latitude: 21.0234631
    })

    const evaluate = async () => {
        if (selectedProject === '' || isNaN(square) || isNaN(n_bedrooms)) {
            console.log('Please select a project and enter a valid number.');
            return;
        }

        try {
            const project_id = parseInt(selectedProject);
            const square_attr = parseInt(square);
            const n_bedrooms_attr = parseInt(n_bedrooms)

            const params = new URLSearchParams({})
            params.append('project_id', project_id)
            params.append('square', square_attr)
            params.append('n_bedrooms', n_bedrooms_attr)
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/project/evaluate?` + params)
            console.log(params.toString())
            const prediction = await response.json();
            setResult(formatPrice(prediction['predictions']))
        } catch (error) {
            console.error('Error : ', error);
        }

        console.log(selectedProject)
    }
    const squareChange = (e) => {
        square = e
        console.log(square)
    }
    const bedroomsChange = (e) => {
        n_bedrooms = e
    }
    const showModal = () => {
        setOpenModal(true)
    }
    const onChange = (value, option) => {
        const loc = option.loc
        setLngLat({
            longitude: loc['coordinates'][0],
            latitude: loc['coordinates'][1]
        })
        setViewport({
            longitude: loc['coordinates'][0],
            latitude: loc['coordinates'][1],
            zoom: 14
        })
        setSelectedProject(value)
    }
    const [viewport, setViewport] = useState({
        longitude: 105.8549172,
        latitude: 21.0234631,
        zoom: 13
    });
    useEffect(() => {
        if(!oldProjects)
            fetchProjects();
        else
            setProjects(oldProjects)
    }, [props]);

    const fetchProjects = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/project/get_projects`);
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
    };


    console.log(projects)
    return (
        <>
            <Row gutter={16}>
                <Col span={18} style={{height: '88vh'}}>
                    <ReactMapGL {...viewport} 
                        width="100%" 
                        height="100%" 
                        onViewportChange={setViewport} 
                        goongApiAccessToken={GOONG_MAPTILES_KEY}
                        style={{margin: '10px'}}   
                    >
                    <Marker latitude={lngLat.latitude} longitude={lngLat.longitude} width='15px' height='15px'>
                    <PushpinOutlined
                        style={{fontSize: '300%'}}
                    >
                    </PushpinOutlined>
                    </Marker>
                    </ReactMapGL>
                </Col>

                <Col span={6} style={{padding: '10px'}}>
                    <Divider orientation='center' className="modal-divider">
                        Dự án
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <Select
                            style={{ width: 400, fontSize: '16px'}}
                            placeholder="Chọn dự án"
                            onChange={onChange}
                            options={projects ? projects.map((item)=> ({value: item.project_id, label: item.name, loc: item.loc })) : []}
                            size='large'
                            popupMatchSelectWidth={300}
                            // defaultValue={getKeyByValue(objectiveList, order)}
                        ></Select>
                    </Row>
                    <Divider orientation='center' className="modal-divider">
                        Diện tích
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <InputNumber 
                            placeholder="Nhập diện tích"
                            size="large"
                            style={{width: 400}}
                            // onPressEnter={squareChange}
                            onChange={squareChange}
                        >
                        </InputNumber>
                    </Row>
                    
                    <Divider orientation='center' className="modal-divider">
                        Số phòng ngủ
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <InputNumber 
                            placeholder="Nhập số phòng ngủ"
                            size="large"
                            style={{width: 400}}
                            // onPressEnter={bedroomsChange}
                            onChange={bedroomsChange}
                        >
                        </InputNumber>
                    </Row>
                    <Divider orientation='center' className="modal-divider">
                   
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <Button 
                            type="primary" 
                            icon={<SearchOutlined />}
                            size='large'
                            style={{padding: '5px', margin: '0 5px', width: '200px'}}
                            onClick={evaluate}
                        >
                            Định giá
                        </Button>
                    </Row>
                    <Divider orientation='center' className="modal-divider">
                        Kết quả
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <div style={{width: '400px', textAlign: 'center'}}>
                            <span style={{fontSize: '22px', fontWeight: 550}}>{result}/ m2</span>
                        </div>
                    </Row>
                    <Divider orientation='center' className="modal-divider">
                    </Divider>
                    <Row justify={"center"} align='middle'>
                        <Button 
                            type="primary" 
                            icon={<AreaChartOutlined />}
                            size='large'
                            style={{padding: '10px', margin: '10px 5px', width: '200px'}}
                            onClick={showModal}
                        >
                            Xem chi tiết dự án
                        </Button>
                    </Row>
                    {openModal && <ProjectModal open={selectedProject} setOpen={setOpenModal}></ProjectModal>}
                </Col>
            </Row>
        </>
    )
}
export default Evaluate;