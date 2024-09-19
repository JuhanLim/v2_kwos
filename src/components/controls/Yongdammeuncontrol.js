  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  // bootstrap import

  // mui import
  import { Box, Tab} from '@mui/material';
  import Typography from '@mui/material/Typography';
  import { TabContext, TabList, TabPanel } from '@mui/lab';
  import CompareIcon from '@mui/icons-material/Compare';
  import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
  import List from '@mui/material/List';
  import ListItem from '@mui/material/ListItem';
  import ListItemText from '@mui/material/ListItemText';
  import ListItemAvatar from '@mui/material/ListItemAvatar';
  import Avatar from '@mui/material/Avatar';
  import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import FmdGoodIcon from '@mui/icons-material/FmdGood';
  import Accordion from '@mui/material/Accordion';
  import AccordionActions from '@mui/material/AccordionActions';
  import AccordionSummary from '@mui/material/AccordionSummary';
  import AccordionDetails from '@mui/material/AccordionDetails';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import ListItemButton from '@mui/material/ListItemButton';
  import Checkbox from '@mui/material/Checkbox';
  import Button from '@mui/material/Button';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  
  import { useNavigate } from 'react-router-dom';
  import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

  import axios from 'axios';



  // apexcharts import
  // .env import
  const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI;


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
  
  // 용담댐 대상지 임시 데이터
  const DroneTiff = [
    {
      name: "용담면 호계리 306",
      title:'A-1',
      acode: "p_1",
      coordinate: [127.4633, 35.9392],
      description: "간접지",
      indirectland:'true',//간접지 유무
      reservoirarea:'false',//저수구역 유무
      floodcontrolarea:'false',//홍수조절지 유무
      listgroup :[
        {
          title: 'yeongju:YD01_NIR',
          jcode: 'j_251',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'용담면 호계리 306_NIR', //화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD01_RGB',
          jcode: 'j_237',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'용담면 호계리 306_RGB', //화면에 표시할 이름
         
        },
        {
          title: 'yeongju:YD01_RGB_M3M',
          jcode: 'j_243',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'용담면 호계리 306_RGB_M3M', //화면에 표시할 이름
       
        },
      ]
    },
    {
      name: "용담면 호계리 516",
      title:'A-2',
      acode: "p_2",
      coordinate: [127.4594, 35.9234],
      indirectland:'true',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD02_NIR',
          jcode: 'j_253',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', // SuperResolution유무
          years:'2024',  // 촬영일 연도
          name:'용담면 호계리 516_NIR', // 화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD02_RGB',
          jcode: 'j_238',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'용담면 호계리 516_RGB', //화면에 표시할 이름
          
        },
        {
          title: 'yeongju:YD02_RGB_M3M',
          jcode: 'j_244',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'용담면 호계리 516_RGB_M3M', //화면에 표시할 이름
         
        },
      ]
    },
    {
      name: "안천면 노성리 1163",
      title:'A-3',
      acode: "p_3",
      coordinate: [127.5477, 35.8928],
      indirectland:'true',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD03_NIR',
          jcode: 'j_254',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1163_NIR', //화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD03_RGB',
          jcode: 'j_239',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1163_RGB', //화면에 표시할 이름
         
        },
        {
          title: 'yeongju:YD03_RGB_M3M',
          jcode: 'j_245',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1163_RGB_M3M', //화면에 표시할 이름
        
        },
      ]
    },
    {
      name: "상전면 월포리 1091",
      title:'A-4',
      acode: "p_4",
      coordinate: [127.4811, 35.8635],
      indirectland:'true',//간접지
      reservoirarea:'true',//저수구역
      floodcontrolarea:'false',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD04_NIR',
          jcode: 'j_255',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 월포리 1091_NIR', //화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD04_RGB',
          jcode: 'j_242',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 월포리 1091_RGB', //화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD04_RGB_M3M',
          jcode: 'j_246',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 월포리 1091_RGB_M3M', //화면에 표시할 이름
     
        },
      ]
    },
    {
      name: "상전면 갈현리 621",
      title:'A-5',
      acode: "p_5",
      coordinate: [127.4758, 35.8241],
      indirectland:'false',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'true',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD05_NIR',
          jcode: 'j_256',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 갈현리 621_NIR', //화면에 표시할 이름
         
        },
        {
          title: 'yeongju:YD05_RGB',
          jcode: 'j_241',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 갈현리 621_RGB', //화면에 표시할 이름
         
        },
        {
          title: 'yeongju:YD05_RGB_M3M',
          jcode: 'j_247',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 갈현리 621_RGB_M3M', //화면에 표시할 이름
       
        },
        {
          title: 'yeongju:YD05_M3M_Nir',
          jcode: 'j_299',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 갈현리 621_M3M_Nir', //화면에 표시할 이름
         
        },
      ]
    },
    {
      name: "상전면 용평리 140",
      title:'A-6',
      acode: "p_6",
      coordinate: [127.4758, 35.8241],
      indirectland:'false',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'true',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD06_NIR',
          jcode: 'j_257',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 140_NIR', //화면에 표시할 이름
         
        },
        {
          jcode: 'j_260',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 140_RGB', //화면에 표시할 이름
          
        },
        {
          jcode: 'j_265',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 140_RGB_M3M', //화면에 표시할 이름
        
        },
      ]
    },
    {
      name: "상전면 용평리 1078",
      title:'A-7',
      acode: "p_7",
      coordinate: [127.4758, 35.8241],
      indirectland:'false',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'true',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD07_NIR',
          jcode: 'j_258',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 1078_NIR', //화면에 표시할 이름
      
        },
        {
          title: 'yeongju:YD07_RGB',
          jcode: 'j_261',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 1078_RGB', //화면에 표시할 이름
 
        },
        {
          title: 'yeongju:YD07_RGB_M3M',
          jcode: 'j_263',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'상전면 용평리 1078_RGB_M3M', //화면에 표시할 이름
          
        },
      ]
    },
    {
      name: "안천면 노성리 1505",
      title:'A-8',
      acode: "p_8",
      coordinate: [127.4594, 35.9234],
      indirectland:'true',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD08_NIR',
          jcode: 'j_259',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', // SuperResolution유무
          years:'2024',  // 촬영일 연도
          name:'안천면 노성리 1505_NIR', // 화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD08_RGB',
          jcode: 'j_262',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1505_RGB', //화면에 표시할 이름
         
        },
        {
          title: 'yeongju:YD08_RGB',
          jcode: 'j_264',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1505_RGB_M3M', //화면에 표시할 이름
         
        },
      ]
    },
    {
      name: "안천면 노성리 1190",
      title:'A-9',
      acode: "p_9",
      coordinate: [127.4594, 35.9234],
      indirectland:'true',//간접지
      reservoirarea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
      listgroup :[
        {
          title: 'yeongju:YD08_NIR',
          jcode: 'j_270',
          type:'1',// 0: 위성 1: drone
          imgtype: '1', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', // SuperResolution유무
          years:'2024',  // 촬영일 연도
          name:'안천면 노성리 1190_NIR', // 화면에 표시할 이름
     
        },
        {
          title: 'yeongju:YD08_RGB',
          jcode: 'j_267',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1190_RGB', //화면에 표시할 이름
        
        },
        {
          title: 'yeongju:YD08_RGB',
          jcode: 'j_269',
          type:'1',// 0: 위성 1: drone
          imgtype: '0', // 0:rgb 1:nir 2:ndvi 3:ndwi
          super:'false', //SuperResolution유무
          years:'2024',  //촬영일 연도
          name:'안천면 노성리 1190_RGB_M3M', //화면에 표시할 이름
       
        },
      ]
    },
  ];

  // 용담댐 임시 위성사진
  const Tiff = [
    {
      title: 'yongdamAOI:20230422_NIR',
      type: 'nir',
      years:'2023',
      name:'20230422_NIR',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_NIR',
    },
    {
      title: 'yongdamAOI:20230422_RGB',
      type: 'rgb',
      years:'2023',
      name:'20230422_RGB',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_RGB',
    },
    {
      title: 'yongdamAOI:20230422_NDVI',
      type: 'ndvi',
      years:'2023',
      name:'20230422_NDVI',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_NDVI',
    },
    {
      title: 'yongdamAOI:20230422_NDWI',
      type: 'ndwi',
      years:'2023',
      name:'20230422_NDWI',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_NDWI',
    },
    {
      title: 'yongdamAOI:20230422_NIR_super',
      type: 'rgb',
      years:'2023',
      name:'20230422_NIR_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers:'yongdamAOI:20230422_NIR_super',
    },
    {
      title: 'yongdamAOI:20230422_RGB_super',
      type: 'nir',
      years:'2023',
      name:'20230422_RGB_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_RGB_super',
    },
    {
      title: 'yongdamAOI:20230422_NDVI_super',
      type: 'ndvi',
      years:'2023',
      name:'20230422_NDVI_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_NDVI_super',
    },
    {
      title: 'yongdamAOI:20230422_NDWI_super',
      type: 'ndwi',
      years:'2023',
      name:'20230422_NDWI_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20230422_NDWI_super',
    },
    {
      title: 'yongdamAOI:20240610_NIR',
      type: 'nir',
      years:'2024',
      name:'20240610_NIR',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_NIR',
    },
    {
      title: 'yongdamAOI:20240610_RGB',
      type: 'rgb',
      years:'2024',
      name:'20240610_RGB',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_RGB',
    },
    {
      title: 'yongdamAOI:20240610_NDVI',
      type: 'ndvi',
      years:'2024',
      name:'20240610_NDVI',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_NDVI',
    },
    {
      title: 'yongdamAOI:20240610_NDWI',
      type: 'ndwi',
      years:'2024',
      name:'20240610_NDWI',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_NDWI',
    },
    {
      title: 'yongdamAOI:20240610_NIR_super',
      type: 'rgb',
      years:'2024',
      name:'20240610_NIR_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers:'yongdamAOI:20240610_NIR_super',
    },
    {
      title: 'yongdamAOI:20240610_RGB_super',
      type: 'nir',
      years:'2024',
      name:'20240610_RGB_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_RGB_super',
    },
    {
      title: 'yongdamAOI:20240610_NDVI_super',
      type: 'ndvi',
      years:'2024',
      name:'20240610_NDVI_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_NDVI_super',
    },
    {
      title: 'yongdamAOI:20240610_NDWI_super',
      type: 'ndwi',
      years:'2024',
      name:'20240610_NDWI_super',
      coordinate: [127.5256, 35.9448],
      zoom: 10,
      description: '',
      layers: 'yongdamAOI:20240610_NDWI_super',
    },
  ];


  const Yongdammeuncontrol = ({ onCheckedItemsChange,onLayerToggle }) => {

    
        
      
        const [value, setValue] = React.useState('1');

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


      const [checked, setChecked] = useState([]);
      const [orderedCheckedItems, setOrderedCheckedItems] = useState([]); // State to track reordered checked items
      const navigate = useNavigate();


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCompare = () => {
    if (checked.length >= 2 && checked.length <= 10) {
      // 선택된 항목을 비교 페이지로 전달
      navigate(`/compare?images=${checked.join(',')}`);
    } else {
      alert('2개에서 8개의 이미지를 선택해주세요.');
    }
  };



  const handleDroneToggle = (jcode) => () => {
    const currentIndex = checked.indexOf(jcode);
    const newChecked = [...checked];
  
    if (currentIndex === -1) {
      // jcode를 배열의 앞에 추가 (사용자가 클릭한 순서대로)
      newChecked.unshift(jcode);
    } else {
      // 이미 체크된 항목을 클릭하면 제거
      newChecked.splice(currentIndex, 1);
    }
  
    setChecked(newChecked);
    // Notify the parent component about the checked items
    onCheckedItemsChange(newChecked);
  };

  const handleDroneCompare = () => {
    // Convert selected `checked` values to query parameters
    const jcodeParams = checked.map(code => `jcode=${encodeURIComponent(code)}`).join('&');
    
    // Navigate to /testcompare with jcode parameters
    navigate(`/testcompare?${jcodeParams}`);
  };

 // Function to handle reordering of checked items
 const handleReorder = (reorderedItems) => {
  setOrderedCheckedItems(reorderedItems); // Set the reordered items in state
};

const handleRemoveCheckedItem = (jcode) => {
  const updatedChecked = checked.filter(item => item !== jcode);
  setChecked(updatedChecked);
  // Notify the parent component about the updated checked items
  onCheckedItemsChange(updatedChecked); // Call the parent handler to update jcodes in YoungdamMap.js
};

// Checked items based on the `checked` state
// const checkedItems = checked.map((jcode) => 
//   DroneTiff.flatMap(item => item.listgroup).find(listItem => listItem.jcode === jcode)
// );

// const checkedItems = DroneTiff.flatMap(item =>
//   item.listgroup.filter(listItem => checked.includes(listItem.jcode))
// );

const checkedItems = DroneTiff.flatMap(item => 
  item.listgroup?.filter(listItem => listItem && checked.includes(listItem.jcode)) || []
);


 

  const filterByYear = (year) => {
    return Tiff.filter(item => item.years === year);
  };


  const renderListItems = (items) => {
    return items.map((item, index) => (
      <ListItem key={index} button onClick={handleToggle(item.title)}>
        <Checkbox
          edge="start"
          checked={checked.indexOf(item.title) !== -1}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={item.name} />
      </ListItem>
    ));
  };

  const tiff2023 = filterByYear('2023');
  const tiff2024 = filterByYear('2024');

  

  // LayerItem component (Drag and Drop)
  const LayerItem = ({ checkedItems, onReorder, onRemove }) => {
    const handleOnDragEnd = (result) => {
      if (!result.destination) return;
  
      const items = Array.from(checkedItems);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      onReorder(items); // 부모 컴포넌트로 업데이트된 순서 전달
    };
  
    return (
      <div>
        {checkedItems.length === 0 ? (
          <p>No items selected.</p>
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {checkedItems.map((item, index) => (
                    <Draggable key={item.jcode} draggableId={item.jcode} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            padding: '4px',
                            margin: '4px', 
                            borderRadius: '4px',
                            border:'1.6px solid #767676',
                            cursor: 'move',
                            display: 'flex', // Flexbox to align the text and button
                            justifyContent: 'space-between', // Space between text and button
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            {item.name}
                          </div>
                          <button
                            onClick={() => onRemove(item.jcode)}
                            style={{
                              width:'30px',
                              marginLeft: '8px',
                              backgroundColor:'white',
                              color: '#767676',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            𝗫
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    );
  };
  


      const apiKey = 'd54ed7be2166b4c8e8ffd5d6d223f28a'; // 여기에 API 키 입력
      const city = 'Yongdam-myeon';
      
      // React Hook을 조건 없이 최상단에서 호출
      const [weatherData, setWeatherData] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
    
      const fetchWeatherData = async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
        try {
          const response = await axios.get(url);
          console.log(response.data);
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
                    <Tab value="2" style={{ minWidth: '50px' }} icon={<EmergencyShareIcon />} />
                  </TabList>
                </Box>
                <Box sx={{ flexGrow: 1, p: 3,  overflow:'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' } }>
                    <TabPanel value="1" style={{padding:'0px'}}>
                
                          전체지역
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={handleCompare}
                              disabled={checked.length < 2 || checked.length > 10}
                              style={{marginLeft:'90px'}}
                            >
                              비교하기
                            </Button>
                        <Accordion style={{marginTop:"5px"}}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            2024년
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {renderListItems(tiff2024)}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                          >
                            2023년
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {renderListItems(tiff2023)}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                    </TabPanel>
                    <TabPanel value="2" style={{ padding: '0px' }}>
      대상지역
      <LocalizationProvider dateAdapter={AdapterDayjs}>
     
      
        {/* <DatePicker label={'"month" and "year"'} views={['month', 'year']} /> */}

    </LocalizationProvider>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleDroneCompare}
        disabled={checked.length < 2 || checked.length > 10}
        style={{ marginLeft: '90px' }}
      >
        비교하기
      </Button>
      {DroneTiff.map((item, index) => (
        <Accordion key={index} style={{ marginTop: '5px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Box display="flex" alignItems="center">
              <Typography style={{ fontSize: '16px' }}>{item.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails style={{ padding: '0px' }}>
            <List>
              {item.listgroup.map((listItem, listIndex) => (
                <ListItem key={listIndex} button onClick={handleDroneToggle(listItem.jcode)}>
                  <Checkbox
                    checked={checked.indexOf(listItem.jcode) !== -1}
                  />
                  <ListItemText
                    primary={listItem.name}
                    primaryTypographyProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </TabPanel>
                </Box>
              </TabContext>
            </Box>
          </MeunContainer>


          {checkedItems.length > 0 && (
            <LayerContainer>
              Selected Images
              <LayerControl>
                <LayerItem checkedItems={checkedItems} onReorder={handleReorder} onRemove={handleRemoveCheckedItem}/>
              </LayerControl>

            </LayerContainer>
              
            )}
          <WeatherBox>
       <WeatherIcon>
        <img src={iconUrl} style={{width:"80%", height:"100%"}}/>
       </WeatherIcon>
        <WeatherText> {temp.toFixed(1)}°C /
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

  export default Yongdammeuncontrol;

      const MeunContainer = styled.div`
        width: max-contents;
        height: 100%;
        background-color: white;
        display:flex;

  
      `

      const WeatherBox = styled.div`
          position: absolute;
          bottom:25px;
          background-color: white;
          right: 20px;
          z-index:1000;
          width: 18vw;
          height: 3vw;
          border-radius:5px;
          display:flex;
          align-items: center;
          justify-content: center;
          
  `;
      
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
    font-size:0.8vw;
    color: #1d1d1d
  `

  const LayerContainer = styled.div`
    z-index:1000;
    position: absolute;
    width:15vw;
    right: 5vw;
    top:6.5vh;
    background-color:white;
    border-radius:5px;
    padding:16px;
  `;


  const LayerControl = styled.div`
    width:100%;
    height:max-contents;
    max-height: 280px;
    font-size:0.8vw;
    overflow:hidden;
    overflow:scroll;
  `;


  

