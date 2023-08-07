import './Search.css'
import React, { useEffect, useState } from 'react';
import ReactMapGL, {Marker}  from '@goongmaps/goong-map-react';
import {Button, Row, Col, Select, Drawer, Space, Divider} from 'antd'
import { SearchOutlined, AreaChartOutlined, PushpinOutlined, SaveOutlined } from '@ant-design/icons';
import ProjectResult from './results/ProjectResult';
import NewsResults from './results/NewsResult';
import ProjectModal from '../summary/modal/ProjectModal';
import SavedDrawer from './drawer/SavedDrawer';
import StatisticModal from './modal/StatisticModal';
const GOONG_MAPTILES_KEY = `${process.env.REACT_APP_GOONG_MAPTILES_KEY}`;

const radiusRange = {
    'Mặc định': 1e3,
    '2 km': 2e3,
    '3 km': 3e3,
    '5 km': 5e3,
    '10 km': 10e3
}

const squareRange = {
    'Mặc định': '',
    'Nhỏ hơn 50 m2': ',50',
    'Từ 50 đến 75 m2': '50,75',
    'Từ 75 đến 100 m2': '75,100',
    'Từ 100 đến 150 m2': '100,150',
    'Trên 150 m2': '150,'
}

const objectiveList = {
    'Mặc định': '',
    'Giá từ thấp đến cao': 'total_price,1',
    'Giá từ cao đến thấp': 'total_price,-1',
    'Giá trên m2 thấp đến cao': 'price_per_m2,1',
    'Giá trên m2 cao đến thấp': 'price_per_m2,-1',
    'Gần đến xa': 'distance,1',
    'Xa đến gần': 'distance,-1',
    'Diện tích bé đến lớn': 'square,1',
    'Diện tích lớn đến bé': 'square,-1'
}
const typeList = {
    'Bài viết': '1',
    'Dự án': '2',
}

const priceRange = {
    'Mặc định': '',
    'Nhỏ hơn 500 triệu': ',500000000',
    'Từ 500 triệu đến 1 tỷ': '500000000,1000000000',
    'Từ 1 tỷ đến 1 tỷ 500 triệu': '1000000000,1500000000',
    'Từ 1 tỷ 500 triệu đến 2 tỷ': '1500000000,2000000000',
    'Trên 2 tỷ': '2000000000,'
}
let radius = 1e3
let square = ''
let price = ''
let type = '1'
let order = ''
let savedNews = []
let savedProject = []

const getKeyByValue = (obj, value) => {
    for (const key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null; // Return null if the value is not found in the object.
}

function Search () {
    const [reloadKey, setReloadKey] = useState(0);
    const onChangeRadius = (value) => {
        radius =  value
        console.log(radius)
    }
    const onChangeSquare = (value) => {
        square =  value
        console.log(square)
    }
    const onChangePrice = (value) => {
        price =  value
        console.log(price)
    }
    const onChangeType = (value) => {
        type =  value
        console.log(type)
    }
    const onChangeOrder = (value) => {
        order = value
        fetchNews()
        console.log(order)
    };
    const [results, setResults] = useState(null)

    const handleSaveNews = (item) => {
        console.log(savedNews)
        if (savedNews) savedNews.push(item)
        else savedNews = [item]
        if (results) setResults((prevList) => prevList.filter((i) => i !== item))
    }
    const handleSaveProject = (item) => {
        console.log(savedProject)
        if (savedProject) savedProject.push(item)
        else savedProject = [item]
        if (results) setResults((prevList) => prevList.filter((i) => i !== item))
    }
    const handleUnSaveNews = (item) => {
        savedNews = savedNews.filter((element) => element !== item);
        setReloadKey((prevKey) => prevKey + 1);
    }
    const handleUnSaveProject = (item) => {
        savedProject = savedProject.filter((element) => element !== item);
        setReloadKey((prevKey) => prevKey + 1);
    }
    console.log(results)
    const [openSave, setOpenSave] = useState(false)
    const [openSearch, setOpenSearch] = useState(false)
    const [openProjectModal, setOpenProjectModal] = useState(false)
    const [openStatisticModal, setOpenStatisticModal] = useState(false)
    const [statistic, setStatistic] = useState(null)

    const showSearchDrawer = () => {
        setOpenSearch(true)
    }
    const hideSearchDrawer = () => {
        setOpenSearch(false)
    }
    const showSaveDrawer = () => {
        setOpenSave(true)
    }

    const hideSaveDrawer = () => {
        setOpenSave(false)
    }

    const showStatisticModal = () => {
        setOpenStatisticModal(true)
    }

    const [lngLat, setLngLat] = useState({
        longitude: 105.8549172,
        latitude: 21.0234631
    })

    const [viewport, setViewport] = useState({
        longitude: 105.8549172,
        latitude: 21.0234631,
        zoom: 13
    });
    let params;
    const fetchNews = async () => {
        try {
            const longitude = lngLat.longitude
            const latitude = lngLat.latitude
            params = new URLSearchParams({longitude, latitude})
            console.log(price, square, radius, type)
            if (radius !== '') {
                params.append('radius', radius)
            } else {
                params.append('radius', 1000)
            }

            if (square !== '') {
                var bound_square = square.split(',')
                if (bound_square[0] !== '')
                    params.append('min_square', bound_square[0])
                if (bound_square[1] !== '')
                    params.append('max_square', bound_square[1])
            }

            if (price !== '') {
                var bound_price = price.split(',')
                if (bound_price[0] !== '')
                    params.append('min_price', bound_price[0])
                if (bound_price[1] !== '')
                    params.append('max_price', bound_price[1])
            }

            if (order !== '') {
                var [objective_key, ord] = order.split(',')
                params.append(objective_key, ord)
            }

            console.log(params.toString())
            if (type === '1') {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/news/get_news?` + params );
                const data = await response.json()
                console.log(data)
                setResults(data);
            } else {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/news/get_projects?` + params );
                const data = await response.json()
                console.log(data)
                setResults(data);
            }
            
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/news/get_statistic?` + params );
            const statistc = await response.json()
            console.log(statistc)
            setStatistic(statistc)
        } catch (error) {
            console.error('Error : ', error);
        }
    }
    const handleMapClick = (event) => {
        const {lngLat} = event;
        console.log('Clicked at:', lngLat);
        setViewport({
            longitude: lngLat[0],
            latitude: lngLat[1],
            zoom: 15
        })
        setLngLat(
            {
                longitude: lngLat[0],
                latitude: lngLat[1],
                zoom: 15
            }
        )
        fetchNews();
        console.log(results)
        console.log(params.toString())
    };

    return (
        <>
        {openProjectModal && <ProjectModal open={openProjectModal} setOpen={setOpenProjectModal}/>}
        {openStatisticModal && <StatisticModal open={openStatisticModal} setOpen={setOpenStatisticModal} statistic={statistic}/>}
        <SavedDrawer 
            savedNews={savedNews}
            savedProject={savedProject}
            openSave={openSave} 
            hideSaveDrawer={hideSaveDrawer}
            handleUnSaveNews={handleUnSaveNews}
            handleUnSaveProject={handleUnSaveProject}
            openProjectModal={openProjectModal}
            setOpenProjectModal={setOpenProjectModal}
        ></SavedDrawer>
        <Drawer
            title='Bộ lọc tìm kiếm'
            placement='left'
            width={400}
            onClose={hideSearchDrawer}
            open={openSearch}
            extra={
                <Space>
                  <Button type="primary" onClick={hideSearchDrawer}>
                    OK
                  </Button>
                </Space>
            }
        >
            <Divider orientation='left' className="modal-divider">
                Loại tìm kiếm
            </Divider>
                <Row gutter={16}>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Chọn loại tìm kiếm"
                        onChange={onChangeType}
                        options={Object.entries(typeList).map(([label, value]) => ({value, label}))}
                        size='large'
                        popupMatchSelectWidth={300}
                        defaultValue={getKeyByValue(typeList, type)}
                    ></Select>
                </Row>
            <Divider orientation='left' className="modal-divider">
                Khoảng cách
            </Divider>
                <Row gutter={16}>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Chọn khoảng cách"
                        onChange={onChangeRadius}
                        options={Object.entries(radiusRange).map(([label, value]) => ({value, label}))}
                        size='large'
                        popupMatchSelectWidth={300}
                        defaultValue={getKeyByValue(radiusRange, radius)}
                    ></Select>
                </Row>
            <Divider orientation='left' className="modal-divider">
                Giá 
            </Divider>
                <Row gutter={16}>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Chọn khoảng giá"
                        onChange={onChangePrice}
                        options={Object.entries(priceRange).map(([label, value]) => ({value, label}))}
                        size='large'
                        popupMatchSelectWidth={300}
                        defaultValue={getKeyByValue(priceRange, price)}
                    ></Select>
                </Row>
            <Divider orientation='left' className="modal-divider">
                Diện tích
            </Divider>
                <Row gutter={16}>
                    <Select
                        style={{ width: 300 }}
                        placeholder="Chọn khoảng diện tích"
                        onChange={onChangeSquare}
                        options={Object.entries(squareRange).map(([label, value]) => ({value, label}))}
                        size='large'
                        popupMatchSelectWidth={300}
                        defaultValue={getKeyByValue(squareRange, square)}
                    ></Select>
                </Row>

        </Drawer>

        <Row gutter={18}>
            <Col span={16}>
            <Button 
                type="primary" 
                icon={<SearchOutlined />}
                size='large'
                style={{padding: '5px', margin: '0 5px'}}
                onClick={showSearchDrawer}
            >
                Bộ lọc tìm kiếm
            </Button>
            <Button 
                type="primary" 
                icon={<AreaChartOutlined />}
                size='large'
                style={{padding: '5px', margin: '0 5px'}}
                onClick={showStatisticModal}
            >
                Thống kê
            </Button>

            <Button 
                type="primary" 
                icon={<SaveOutlined />}
                size='large'
                style={{padding: '5px', margin: '0 5px'}}
                onClick={showSaveDrawer}
            >
                Bài viết đã lưu
            </Button>
            </Col>
            <Col span={4} offset={4}>
                <Select
                    style={{ width: 300 }}
                    placeholder="Sắp xếp kết quả theo"
                    onChange={onChangeOrder}
                    options={Object.entries(objectiveList).map(([label, value]) => ({value, label}))}
                    size='large'
                    popupMatchSelectWidth={300}
                    defaultValue={getKeyByValue(objectiveList, order)}
                ></Select>
            </Col>
        </Row>
        <Row gutter={18}>
            <Col span={18} style={{height: '82vh'}}>
                <ReactMapGL {...viewport} 
                    width="100%" 
                    height="100%" 
                    onViewportChange={setViewport} 
                    goongApiAccessToken={GOONG_MAPTILES_KEY}
                    onClick={handleMapClick}
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
                <div style={{overflowY: 'auto', height: '80vh'}}>
                    {type === '1' && results && results.length > 0 &&results[0].news_id && 
                        results.map(item => 
                            (
                            
                                <NewsResults news={item} onSave={handleSaveNews} button={'Lưu'}/>
                            )
                            
                            )
                    }
                    {type === '2' && results && results.length > 0 &&results[0].project_id && 
                        results.map(item => 
                            (
                                <ProjectResult project={item}  open={openProjectModal} setOpen={setOpenProjectModal} onSave={handleSaveProject} button={'Lưu'}/>
                            )
                            
                            )
                    }
                </div>
            </Col>
        </Row>
        </>
    )
}


export default Search;