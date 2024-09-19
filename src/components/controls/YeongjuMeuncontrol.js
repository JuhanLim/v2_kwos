  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  // bootstrap import
  import {Accordion, Button, Modal } from 'react-bootstrap';
  // mui import
  import { Box, Tab, Switch, Checkbox } from '@mui/material';
  import { TabContext, TabList, TabPanel } from '@mui/lab';
  import CompareIcon from '@mui/icons-material/Compare';
  import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
  import GridOnIcon from '@mui/icons-material/GridOn';
  import BloodtypeIcon from '@mui/icons-material/Bloodtype';
  import Grid4x4Icon from '@mui/icons-material/Grid4x4';


  import AccordionSummary from '@mui/material/AccordionSummary';
  import AccordionDetails from '@mui/material/AccordionDetails';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import Typography from '@mui/material/Typography';
  import List from '@mui/material/List';
  import ListItem from '@mui/material/ListItem';
  import ListItemText from '@mui/material/ListItemText';
  // apexcharts import
  import ReactApexChart from 'react-apexcharts';
  import axios from 'axios';
  import SwipeableMaps from '../../pages/TestSwipe';
  // .env import
  const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI;
  const openweatherapikey = process.env.REACT_APP_OPENWEATHER_APIKEY;
  //img
  // import tag4 from '../../assets/tag4.png'
  // import tag5 from '../../assets/tag5.png'
  // import tag6 from '../../assets/tag6.png'


  const YeongjuMeuncontrol = ({ onLayerToggle, onConvertLayerToggle }) => {


  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [fullshow, setFullshow] = useState(false);

  function handleShow(breakpoint) {
  setFullscreen(breakpoint);
  setFullshow(true);
  }


  const layerConfigurations = [
  { name: '전', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryField' } },
  { name: '답', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryRicepaddy' } },
  { name: '과수원', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryOrchard' } },
  { name: '목장용지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryPasture' } },
  { name: '임야', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryForest' } },
  { name: '광천지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryGwangcheonji' } },
  { name: '대지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryEarth' } },
  { name: '공장용지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryFactory' } },
  { name: '학교용지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategorySchool' } },
  { name: '주차장, 도로', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryRoad' } },
  { name: '주유소', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryGasstaion' } },
  { name: '체육용지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryAthletic' } },
  { name: '유원지', url: `${geoserverUrl}/yeongju/wms`, params: { 'LAYERS': 'yeongju:KwaterCategoryAmusementpark' } },
  ];

  const DroneTiff = [
  {
  name: "감곡리931",
  title:'A-1',
  acode: "p_1",
  coordinate: [127.4633, 35.9392],
  description: "",
  listgroup :[
      {
        jcode: 'j_272',
        type:'1',// 0: 위성 1: drone
        imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
        super:'false', //SuperResolution유무
        years:'2024', //촬영일 연도
        name:'감곡리931-M2P-RGB', //화면에 표시할 이름
        coordinate: [127.4633, 35.9392], //이미지의 좌표값
        zoom: 17,
        description: '', // 해당 데이터 설명
      },
      {
        jcode: 'j_273',
        type:'1',// 0: 위성 1: drone
        imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
        super:'false', //SuperResolution유무
        years:'2024', //촬영일 연도
        name:'감곡리931-M2P-Nir', //화면에 표시할 이름
        coordinate: [127.4633, 35.9392], //이미지의 좌표값
        zoom: 17,
        description: '', // 해당 데이터 설명
      },
      {
        jcode: 'j_243',
        type:'1',// 0: 위성 1: drone
        imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
        super:'false', //SuperResolution유무
        years:'2024', //촬영일 연도
        name:'감곡리931-M3M-RGB', //화면에 표시할 이름
        coordinate: [127.4633, 35.9392], //이미지의 좌표값
        description: '', // 해당 데이터 설명
      },
    ]
  },
  {
  name: "삼계리129",
  title:'A-2',
  acode: "p_2",
  coordinate: [127.4594, 35.9234],
  indirectland:'true',//간접지
  reservoirarea:'false',//저수구역
  floodcontrolarea:'false',//홍수조절지
  listgroup :[
  {
  jcode: 'j_275',
  type:'1',// 0: 위성 1: drone
  imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
  super:'false', // SuperResolution유무
  years:'2024', // 촬영일 연도
  name:'삼계리129-M2P-RGB', // 화면에 표시할 이름
  coordinate: [127.4594, 35.9234], // 이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  {
  jcode: 'j_276',
  type:'1',// 0: 위성 1: drone
  years:'2024', //촬영일 연도
  name:'삼계리129-M2P-Nir', //화면에 표시할 이름
  coordinate: [127.4594, 35.9234], //이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  {
  jcode: 'j_277',
  type:'1',// 0: 위성 1: drone
  imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
  years:'2024', //촬영일 연도
  name:'삼계리129-M3M-RGB', //화면에 표시할 이름
  coordinate: [127.4594, 35.9234], //이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  ]
  },
  {
  name: "원천리109",
  title:'A-3',
  acode: "p_3",
  coordinate: [127.5477, 35.8928],
  listgroup :[
  {
  jcode: 'j_254',
  type:'1',// 0: 위성 1: drone
  imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
  years:'2024', //촬영일 연도
  name:'안원천리109-M2P-RGB', //화면에 표시할 이름
  coordinate: [127.5477, 35.8928], //이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  {
  jcode: 'j_239',
  type:'1',// 0: 위성 1: drone
  imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
  years:'2024', //촬영일 연도
  name:'원천리109-M2P-Nir', //화면에 표시할 이름
  coordinate: [127.5477, 35.8928], //이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  {
  jcode: 'j_245',
  type:'1',// 0: 위성 1: drone
  imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
  years:'2024', //촬영일 연도
  name:'원천리109-M3M-RGB', //화면에 표시할 이름
  coordinate: [127.5477, 35.8928], //이미지의 좌표값
  description: '', // 해당 데이터 설명
  },
  ]
  },
  ];

  const [series, setSeries] = useState([
  {
  name: '강수량 (mm)',
  data: [ 1036, 1493, 1190, 2133, 1401, 987]
  },
  {
  name: '유입량 (백만m³)',
  data: [ 394, 765, 540, 1530, 641, 379]
  }
  ]);

  const [options, setOptions] = useState({
  chart: {
  height: 350,
  type: 'area'
  },
  dataLabels: {
  enabled: false
  },
  stroke: {
  curve: 'smooth'
  },
  xaxis: {
  type: 'datetime',
  categories: [
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022"
  ]
  },
  tooltip: {
  x: {
  format: 'dd/MM/yy HH:mm'
  }
  }
  });
  // 날씨


  const handleTabClick = (tabId) => {
  setCurrentTab(tabId);
  };




  const [currentTab, setCurrentTab] = useState('tab-1');

  const [show, setShow] = useState(false);
  const [value, setValue] = React.useState('1');
  const [checked, setChecked] = useState([]);
  /////////////////////////////////////////////
  const [layers, setLayers] = useState(() => {
  const initialState = {};
  layerConfigurations.forEach((layer) => {
  initialState[layer.name] = false;
  });
  return initialState;
  });

  const handleChange = (event, layerName) => {
  setLayers((prevState) => ({
  ...prevState,
  [layerName]: event.target.checked,
  }));
  onLayerToggle(layerName);
  };

  const handleTabChange = (event, newValue) => {
  setValue(newValue);
  };

  const handleDroneToggle = (jcode) => () => {
  const currentIndex = checked.indexOf(jcode);
  const newChecked = [...checked];

  if (currentIndex === -1) {
  newChecked.push(jcode);
  } else {
  newChecked.splice(currentIndex, 1);
  }

  setChecked(newChecked);
  };





  const apiKey = 'd54ed7be2166b4c8e8ffd5d6d223f28a'; // 여기에 API 키 입력
  const city = 'Yeongju';

  // React Hook을 조건 없이 최상단에서 호출
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeatherData = async () => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
  const response = await axios.get(url);
  setWeatherData(response.data); // 날씨 정보를 상태에 저장
  } catch (error) {
  console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
  } finally {
  setIsLoading(false); // 로딩 상태를 false로 설정
  }
  };

  useEffect(() => {
  fetchWeatherData(); // 컴포넌트가 마운트될 때 날씨 데이터 가져오기
  }, []);

  // 조건부 로직을 훅 호출 아래에 배치
  if (isLoading) {
  return <div>Loading...</div>; // 데이터가 아직 로딩 중일 때 표시
  }

  if (!weatherData) {
  return <div>Error fetching weather data.</div>; // 데이터 로드에 실패했을 때 표시
  }

  const { temp, temp_min, temp_max } = weatherData.main;
  const {icon} = weatherData.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;





  return (

  <>
    <MeunContainer>
      <Box sx={{ display: 'flex', height: '100vh' ,width:'350px', backgroundColor:'white'}}>
        <TabContext value={value}>
          <Box sx={{ borderRight: 1, borderColor: 'divider', Width: '70px' }}>
            <TabList orientation="vertical" onChange={handleTabChange} aria-label="Vertical tabs example">
              <Tab value="1" style={{ minWidth: '50px' }} icon={<CompareIcon />} />
              <Tab value="2" style={{minWidth:'50px'}} icon={<GridOnIcon />}/>
              <Tab value="3" style={{ minWidth: '50px' }} icon={<EmergencyShareIcon />} />
              <Tab value="4" style={{minWidth:'50px'}} icon={<BloodtypeIcon />}/>
            </TabList>
          </Box>
          <Box sx={{ flexGrow: 1, p: 3,  overflow:'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' } }>
              <TabPanel value="1" style={{padding:'0px'}}>
            <MenuTitle>위성 사진</MenuTitle>

            <Accordion style={{ width: '100%' }} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>2024</Accordion.Header>
                <Accordion.Body>

                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>2023</Accordion.Header>
                <Accordion.Body>


                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            </TabPanel>
            <TabPanel value="2" style={{padding:'0px'}}>
              <MenuTitle>토지 피복도</MenuTitle>

              {values.map((v, idx) => (
              <Button key={idx} className="me-2 mb-2" onClick={()=> handleShow(v)}>
                Full screen
                {typeof v === 'string' && `below ${v.split('-')[0]}`}
              </Button>
              ))}
              <Modal show={fullshow} fullscreen={fullscreen} onHide={()=> setFullshow(false)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body styled={{padding:"0px"}}>
                  <SwipeableMaps />
                </Modal.Body>
              </Modal>
              <Tabs>
                <TabLink className={currentTab==='tab-1' ? 'current' : '' } onClick={()=> handleTabClick('tab-1')}
                  >
                  환경부
                </TabLink>
                <TabLink className={currentTab==='tab-2' ? 'current' : '' } onClick={()=> handleTabClick('tab-2')}
                  >
                  K-WATER 분류
                </TabLink>

              </Tabs>

              <TabContent className={currentTab==='tab-1' ? 'current' : '' }>

                <Accordion style={{ width: '100%' }} alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>대분류 (7)</Accordion.Header>
                    <Accordion.Body>
                      {/* Container for the switch */}
                      <div>
                        {/* Switch Component for "1998년 말 대분류" */}
                        <CheckItem>
                          <Switch checked={layers['wmsLayer4'] || false} // Dynamically set the checked state onChange={(event)=> onConvertLayerToggle('wmsLayer4', event.target.checked)} // Call the function with layer ID and checked state
                            inputProps=
                            {{ 'aria-label': '1998년 말 대분류' }} // Accessibility label
                            />
                            <label htmlFor="wmsLayer4">1998년 말 대분류</label> {/* Label for the switch */}
                        </CheckItem>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header>중분류 (22)</Accordion.Header>
                    <Accordion.Body>
                      {/* Container for the switch */}
                      <div>
                        {/* Switch Component for "2022년 중분류" */}
                        <CheckItem>
                          <Switch checked={layers['wmsLayer5'] || false} // Dynamically set the checked state onChange={(event)=> onConvertLayerToggle('wmsLayer5', event.target.checked)} // Call the function with layer ID and checked state
                            inputProps=
                            {{ 'aria-label': '2022년 중분류' }} // Accessibility label
                            />
                            <label htmlFor="wmsLayer5">2023년 중분류</label> {/* Label for the switch */}
                        </CheckItem>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>세분류 (41)</Accordion.Header>
                    <Accordion.Body>

                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </TabContent>
              <TabContent className={currentTab==='tab-2' ? 'current' : '' }>
                <Accordion style={{ width: '100%' }} alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>중분류(임시)</Accordion.Header>
                    <Accordion.Body>
                      <div>
                        {layerConfigurations.map((layerConfig) => (
                        <CheckItem key={layerConfig.name}>
                          <Switch checked={layers[layerConfig.name] || false} onChange={(event)=> handleChange(event, layerConfig.name)}
                            inputProps=
                            {{ 'aria-label': layerConfig.name }}
                            />
                            <label htmlFor={layerConfig.name}>{layerConfig.name}</label>
                        </CheckItem>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                </Accordion>
              </TabContent>

            </TabPanel>
            <TabPanel value="3" style={{padding:'0px'}}>
              <MenuTitle>우선 관리 지역</MenuTitle>
              {/* {DroneTiff.map((item, index) => (
              <Accordion key={index} style={{ marginTop: '5px' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                >
                <Box display="flex" alignItems="center">
                  <Typography style={{ fontSize: '14px' }}>{item.name}</Typography>

                </Box>
                </AccordionSummary>
                <AccordionDetails style={{padding:'0px'}}>
                  <List>
                    {item.listgroup.map((listItem, listIndex) => (
                    <ListItem key={listIndex} button onClick={handleDroneToggle(listItem.name)}>
                      <Checkbox checked={checked.indexOf(listItem.name) !==-1} />
                      <ListItemText primary={listItem.name} />
                    </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              ))} */}
              <Accordion style={{ width: '100%' }} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>감곡리 931</Accordion.Header>
                  <Accordion.Body>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>삼계리 129</Accordion.Header>
                  <Accordion.Body>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>원천이 109</Accordion.Header>
                  <Accordion.Body>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

            </TabPanel>
            <TabPanel value="4" style={{padding:'0px'}}>
              <MenuTitle>수질 분석</MenuTitle>
              <Accordion style={{ width: '100%' }} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>수질 관련 정보</Accordion.Header>
                  <Accordion.Body>
                    <Button variant="primary" onClick={()=> setShow(true)}>
                      용담댐 강수량
                    </Button>
                    <Modal size="xl" centered show={show} onHide={()=> setShow(false)}
                      dialogClassName="modal-90w"
                      aria-labelledby="example-custom-modal-styling-title"
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          용담댐 강수량
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div id="chart">
                          <ReactApexChart options={options} series={series} type="area" height={350} />
                        </div>
                        <div id="html-dist"></div>
                      </Modal.Body>
                    </Modal>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </MeunContainer>
    <WeatherBox>
      <WeatherIcon>
        <img src={iconUrl} style={{width:"70%", height:"100%"}} />
      </WeatherIcon>
      <WeatherText>{temp.toFixed(1)}°C /
        <span style={{  marginLeft:'5px', marginRight:'5px'}}>
          최고 {weatherData.main.temp_min.toFixed(1)}°C
        </span> 
        /
        <span style={{  marginLeft:'5px', marginRight:'3px' }}>
          최저 {weatherData.main.temp_max.toFixed(1)}°C
        </span>
      </WeatherText>
    </WeatherBox>

  </>
  )
  }

  export default YeongjuMeuncontrol;

  const MeunContainer = styled.div`
  width: max-contents;
  height: 100%;
  background-color: white;
  display:flex;
  `

  const CheckItem = styled.div`
  width:100%;
  display:flex;
  font-size:15px;
  margin-top:5px;
  margin-bottom:5px;
  align-items: center;
  `

  const WeatherBox = styled.div`
  position: absolute;
  bottom:25px;
  background-color: white;
  right: 20px;
  z-index:1000;
  width: 300px;
  height: 60px;
  border-radius:5px;
  display:flex;
  align-items: center;
  justify-content: center;
  opacity:0.9;
  `

  const WeatherIcon = styled.div`
  width:20%;
  height:80%;
  display:flex;
  align-items: center;
  justify-content: center;
  `

  const WeatherText = styled.div`
  width:80%;
  height:100%;
  display:flex;
  align-items: center;
  font-size:14px;
  color: #1d1d1d
  `
  const Tabs = styled.ul`
  margin: 0px;
  padding: 0px;
  list-style: none;
  display: flex;
  `;

  const TabLink = styled.li`
  border-radius:5px 5px 0px 0px;
  font-size:13px;
  font-weight:0.8;
  display:flex;
  align-items:center;
  justify-content:center;
  width:50%;
  background: none;
  color: #222;
  padding: 10px 15px;
  cursor: pointer;
  &.current {
  background: #ededed;
  color: #222;
  }
  `;

  const TabContent = styled.div`
  display: none;
  margin-top: 10px;
  &.current {
  display: block;
  }
  `;
  const MenuTitle = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: 0.8;
  font-size: 20px;
  border-bottom: 2px solid gray;
  margin-bottom: 15px;
  `;