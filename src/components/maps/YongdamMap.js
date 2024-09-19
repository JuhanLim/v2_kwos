

  import React, { useRef, useState, useEffect, useCallback } from 'react';
  import styled from 'styled-components';
  //components import
  
  import YongdamMapcontrol from '../controls/YongdamMapcontrol';
  //openlayers
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { Tile as TileLayer } from 'ol/layer';
  import { TileWMS, XYZ, OSM } from 'ol/source';
  import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
  import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
  import Draw from 'ol/interaction/Draw';
  import Overlay from 'ol/Overlay';
  import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text} from 'ol/style';
  import { LineString, Polygon } from 'ol/geom';
  import { Vector as VectorSource } from 'ol/source';
  import { Vector as VectorLayer } from 'ol/layer';
  import { getArea, getLength } from 'ol/sphere';
  
  import { unByKey } from 'ol/Observable';
  import { Feature } from 'ol';
  import Point from 'ol/geom/Point';
  import { Cluster } from 'ol/source';
  import { GeoJSON } from 'ol/format';
  import { Select } from 'ol/interaction';
  import 'ol/ol.css';
  //react-screenshot import
  import html2canvas from "html2canvas";
  import saveAs from "file-saver";
  // img
  import pin from '../../assets/pin.png'
  import panopin from '../../assets/panopin.png'
  import Yongdammeuncontroltest from '../controls/Youngdammencontroltest';
  import Yongdammeuncontrol from '../controls/Yongdammeuncontrol';

  //data
  import {geojsonData} from '../Data/geodata';
  import {geojsonGridData} from '../Data/griddata';


  const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI;

  //k워터 중분류 레이어 임시 데이터
 
  //용담댐 대상지 임시 데이터
  const Area = [
    {
      name: "호계리 306",
      acode: "p_1",
      image:'',
      coordinate: [127.4270171580025, 35.872378292494226],
      description: "간접지",
      indirectLand:'true',//간접지
      reservoirArea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "호계리 516-2",
      acode: "p_2",
      image:'',
      coordinate: [ 127.42881378857075, 35.872378292494226],
      description: "간접지",
      indirectLand:'true',//간접지
      reservoirArea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "월포리 1091-2",
      acode: "p_3",
      coordinate: [127.42881378857075, 35.87092242583634],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'true',//간접지
      reservoirArea:'true',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "노성리 1091-2",
      acode: "p_4",
      coordinate: [127.4270171580025, 35.8709224258363],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'true',//간접지
      reservoirArea:'false',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "갈현리 621-3",
      acode: "p_5",
      coordinate: [127.4270171580025, 35.872378292494226],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'false',//간접지
      reservoirArea:'false',//저수구역
      floodcontrolarea:'true',//홍수조절지
    },
    {
      name: "상전면 용평리 140",
      acode: "p_6",
      coordinate: [127.5071, 35.8759],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'true',//간접지
      reservoirArea:'true',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "상전면 용평리 1078",
      acode: "p_7",
      coordinate: [127.5016, 35.8798],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'true',//간접지
      reservoirArea:'true',//저수구역
      floodcontrolarea:'false',//홍수조절지
    },
    {
      name: "안천면 노성리 1505",
      acode: "p_8",
      coordinate: [127.5418, 35.898],
      image:'',
      description: "간접지+저수구역",
      indirectLand:'true',//간접지
      reservoirArea:'true',//저수구역
      floodcontrolarea:'false',//홍수조절지
    }
  ];

  const API_BASE_URL = '/api/yongdam';

  const YongdamMap = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const wmsLayer2Ref = useRef();
    const popupRef = useRef();
    const mapInstanceRef = useRef(null);
    const damLayerRef = useRef(null);
    const cadastralLayerRef = useRef(null);
    const cadastralGridLayerRef = useRef(null);
    const panoramaLayerRef = useRef(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [popupContent, setPopupContent] = useState('');
    const [mapType, setMapType] = useState('4');
    const [draw, setDraw] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [areaDraw, setAreaDraw] = useState(null);
    const [areaMeasurements, setAreaMeasurements] = useState([]);
    const [mapConfig, setMapConfig] = useState(null);
    const [tmsLayerVisible, setTmsLayerVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jcodes, setJcodes] = useState([]);

      // Callback to update jcodes based on checked items
      const updateJcodes = (checkedItems) => {
        setJcodes(checkedItems);
      };
      console.log(jcodes);

  



    //레이어 on/off
      const [visibleLayers, setVisibleLayers] = useState({
        wmsLayer1: true,
        wmsLayer2: true,
        clusterLayer: true,
        cadastralvectorLayer: false,
        cadastralvectorGridLayer: false,
      });
    
////////////////////////////////////////////////////////////// 댐 위치 표시 클러스터
      const jinanClusterData = [
        {
          coordinate: [127.5285, 35.945],  // 진안군 안천면 안용로 747의 좌표
          name: 'Jinan Cluster',
          image: 'url/to/image.jpg',  // 필요시 이미지 경로 추가
          description: 'Jinan Cluster description',
          page: 'url/to/page'  // 필요시 페이지 링크 추가
        }
      ];
      const jinanVectorSource = new VectorSource({
        features: jinanClusterData.map(area => new Feature({
          geometry: new Point(fromLonLat(area.coordinate)),
          name: area.name,
          image: area.image,
          description: area.description,
          page: area.page
        }))
      });
      
      const jinanClusterSource = new Cluster({
        distance: 40,
        source: jinanVectorSource
      });
    
      // 새로운 클러스터 레이어 생성
      const jinanClusterLayer = new VectorLayer({
        source: jinanClusterSource,
        style: (feature) => {
          const size = feature.get('features').length;
          return new Style({
            image: new Icon({
              src: pin,  // Replace with the path to your custom image
              scale: 0.2 + Math.min(size / 300, 0.5),  // Adjust scale based on cluster size
              anchor: [0.5, 0.5]
            }),
          });
        }
      });
        damLayerRef.current = jinanClusterLayer;



       



    // 면적 포맷팅 함수
      const formatArea = (area) => {
        if (area >= 1000000) {
            return `${(area / 1000000).toFixed(2)} km²`;
        } else {
            return `${area.toFixed(2)} m²`;
        }
      };

// 기존 레이어를 저장할 변수
let vectorLayer;
let vectorSource;

// 거리 측정 시작 함수
const startMeasureDistance = () => {
  if (!mapInstanceRef.current) return;

  if (!vectorSource) {
      vectorSource = new VectorSource();
  }
  if (!vectorLayer) {
      vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              stroke: new Stroke({
                  color: 'rgba(30, 167, 212, 1)',
                  width: 2,
              }),
          }),
      });
      mapInstanceRef.current.addLayer(vectorLayer);
  }

  const newDraw = new Draw({
      source: vectorSource,
      type: 'LineString',
  });

  newDraw.on('drawend', (evt) => {
      const geom = evt.feature.getGeometry();
      const coords = geom.getCoordinates();
      const overlays = [];

      let totalDistance = 0;
      coords.forEach((coord, index) => {
          if (index > 0) {
              const prevCoord = coords[index - 1];
              const segmentLength = getLength(new LineString([prevCoord, coord]));
              totalDistance += segmentLength;

              const distanceOverlay = new Overlay({
                  position: coord,
                  element: createOverlayElement(`${segmentLength.toFixed(2)} m`),
                  positioning: 'center-center',
                  offset: [0, -15],
              });

              overlays.push(distanceOverlay);
              mapInstanceRef.current.addOverlay(distanceOverlay);
          }
      });

      const lastCoord = coords[coords.length - 1];
      const finalCoord = [(lastCoord[0] + coords[0][0]) / 2, (lastCoord[1] + coords[0][1]) / 2];
      const totalDistanceOverlay = new Overlay({
          position: finalCoord,
          element: createOverlayElement(`<strong>Total: ${totalDistance.toFixed(2)} m</strong>`),
          positioning: 'center-center',
          offset: [0, -15],
      });

      overlays.push(totalDistanceOverlay);
      mapInstanceRef.current.addOverlay(totalDistanceOverlay);

      setMeasurements(prev => [...prev, ...overlays]);
      mapInstanceRef.current.removeInteraction(newDraw); // 측정 후 드로우 인터랙션 제거
  });

  mapInstanceRef.current.addInteraction(newDraw);
  setDraw(newDraw);
};

// 면적 측정 시작 함수
const startMeasureArea = () => {
  if (!mapInstanceRef.current) return;

  if (!vectorSource) {
      vectorSource = new VectorSource();
  }
  if (!vectorLayer) {
      vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              stroke: new Stroke({
                  color: 'rgba(30, 167, 212, 1)',
                  width: 2,
              }),
              fill: new Fill({
                  color: 'rgba(30, 167, 212, 0.3)',
              }),
          }),
      });
      mapInstanceRef.current.addLayer(vectorLayer);
  }

  const newAreaDraw = new Draw({
      source: vectorSource,
      type: 'Polygon',
  });

  newAreaDraw.on('drawend', (evt) => {
      const geom = evt.feature.getGeometry();
      const coords = geom.getCoordinates()[0];
      const overlays = [];

      const totalArea = getArea(geom);

      coords.forEach((coord, index) => {
          if (index > 0) {
              const prevCoord = coords[index - 1];
              const line = new LineString([prevCoord, coord]);
              const segmentLength = getLength(line);

              const midPoint = line.getCoordinateAt(0.5);

              const distanceOverlay = new Overlay({
                  position: midPoint,
                  element: createOverlayElement(`${segmentLength.toFixed(2)} m`),
                  positioning: 'center-center',
                  offset: [0, -10],
              });

              overlays.push(distanceOverlay);
              mapInstanceRef.current.addOverlay(distanceOverlay);
          }
      });

      const interiorPoint = geom.getInteriorPoint().getCoordinates();

      const areaOverlay = new Overlay({
          position: interiorPoint,
          element: createOverlayElement(`<strong>Area: ${formatArea(totalArea)}</strong>`),
          positioning: 'center-center',
          offset: [0, 0],
      });

      overlays.push(areaOverlay);
      mapInstanceRef.current.addOverlay(areaOverlay);

      setAreaMeasurements(prev => [...prev, ...overlays]);
      mapInstanceRef.current.removeInteraction(newAreaDraw); // 측정 후 드로우 인터랙션 제거
  });

  mapInstanceRef.current.addInteraction(newAreaDraw);
  setAreaDraw(newAreaDraw);
};

// 측정 초기화(지우기) 함수
const clearMeasurements = () => {
  if (!mapInstanceRef.current) return;

  // 거리 측정 초기화
  if (draw) {
      mapInstanceRef.current.removeInteraction(draw);
      setDraw(null);
  }

  // 면적 측정 초기화
  if (areaDraw) {
      mapInstanceRef.current.removeInteraction(areaDraw);
      setAreaDraw(null);
  }

  // 기존 오버레이 모두 제거
  measurements.forEach(overlay => {
      mapInstanceRef.current.removeOverlay(overlay);
  });
  setMeasurements([]);

  areaMeasurements.forEach(overlay => {
      mapInstanceRef.current.removeOverlay(overlay);
  });
  setAreaMeasurements([]);

  // 기존 벡터 레이어 모두 제거
  mapInstanceRef.current.getLayers().getArray().forEach((layer) => {
    if (layer instanceof VectorLayer && layer !== cadastralLayerRef.current && layer !== panoramaLayerRef.current  && layer !== damLayerRef.current && layer !== cadastralGridLayerRef.current) {
          mapInstanceRef.current.removeLayer(layer);
      }
  });

  // 벡터 소스와 레이어 초기화
  vectorSource = null;
  vectorLayer = null;
};

const fetchMapConfig = useCallback(async () => {
  try {
    const mapConfigs = await Promise.all(jcodes.map(async (jcode) => {
      const response = await fetch(`${API_BASE_URL}/get-xml/${jcode}/?apikey=QqwdkvdXWJIpodvmkqQWIHDshXNxweopSDA`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'application/xml');

      const tileSets = xmlDoc.getElementsByTagName('TileSet');
      const zoomLevels = Array.from(tileSets).map(tileSet => parseInt(tileSet.getAttribute('order'), 10));
      const minZoom = Math.min(...zoomLevels);
      const maxZoom = Math.max(...zoomLevels);

      const srs = xmlDoc.getElementsByTagName('SRS')[0].textContent;
      const boundingBox = xmlDoc.getElementsByTagName('BoundingBox')[0];
      const extents = [
        parseFloat(boundingBox.getAttribute('minx')),
        parseFloat(boundingBox.getAttribute('miny')),
        parseFloat(boundingBox.getAttribute('maxx')),
        parseFloat(boundingBox.getAttribute('maxy')),
      ];

      return { jcode, minZoom, maxZoom, extents, srs };
    }));

    setMapConfig(mapConfigs);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [jcodes]);




  ///////////////////////////////////지도 생성 코드
    const createMap = () => {
      const osmLayer = new TileLayer({
        source: new OSM(),
      });
  ///vworld 지도
      const vworldLayer = new TileLayer({

        source: new XYZ({
          url: `http://api.vworld.kr/req/wmts/1.0.0/{apikey}/Satellite/{z}/{y}/{x}.jpeg`.replace(
            '{apikey}',
            '9D1DA041-8CBA-3E86-9C6D-90178C0E1CE6'
          ),
        }),
        visible: mapType === '3',
      });

      
  // 지역 AOI
      const wmsLayer1 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yongdamAOI/wms`,
          params: {
            'LAYERS': 'yongdamAOI:yongdamCommonAOI',
            'TILED': true,
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer1,
      });
  // 하천 레이어
      const wmsLayer2 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yongdamAOI/wms`,
          params: {
            'LAYERS': 'yongdamAOI:yongdam_waterline',
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer2,
      });
      wmsLayer2Ref.current = wmsLayer2;
  
    
      //야간 지도 설정
      osmLayer.on('prerender', (evt) => {
        if (evt.context) {
          const context = evt.context;
          if (mapType === '4') {
            context.filter = 'grayscale(80%) invert(100%)';
          } else {
            context.filter = 'grayscale(0%) invert(0%)';
          }
          
        }
      });
      osmLayer.on('postrender', (evt) => {
        if (evt.context) {
          const context = evt.context;
          context.filter = 'none'; // 다른 레이어에 영향을 주지 않도록 필터 초기화
        }
      });

      /// 지도위 파노라마 촬영지 클러스터(마커 생성)
      const vectorSources = new VectorSource({
        features: Area.map(area => new Feature({
          geometry: new Point(fromLonLat(area.coordinate)),
          name: area.name,
          image: area.image,
          description: area.description,
          page: area.page
        })) 
      });

      const clusterSource = new Cluster({
        distance: 40,
        source: vectorSources
        
      });
      
      //클러스터 스타일 및 설정 
      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const size = feature.get('features').length;
          return new Style({
            image: new Icon({
              src: panopin,  // Replace with the path to your custom image
              scale: 0.2 + Math.min(size / 300, 0.5),  // Adjust scale based on cluster size
              anchor: [0.5, 0.5]
            }),
          });
        },
        visible: visibleLayers.clusterLayer,
      });
      panoramaLayerRef.current = clusterLayer;


      //////////////////200m grid 레이어 Source
      const defaultGridStyle = new Style({
        fill: new Fill({
            color: 'rgba(226, 239, 216, 0.1)',
        }),
        stroke: new Stroke({
            color: 'white',
            width: 1.5,
        }),
        text: new Text({
            font: '18px Arial',
            fill: new Fill({
                color: '#F43939'
            }), // 텍스트 색상
            stroke: new Stroke({
                color: '#F43939', // 텍스트 선 색상
                width: 3,
            }),
            offsetY: -10, // 레이블 위치 조정
            overflow: true,
            textAlign: 'center',
            textBaseline: 'middle',
        }),
    });
     
      
      
     
      
      // Create VectorSource using GeoJSON data
      const cadastralvectorGridSource = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonGridData, {
          featureProjection: 'EPSG:3857',
        }),
      });
      
      // Create VectorLayer with styles and source
      const cadastralvectorGridLayer = new VectorLayer({
        source: cadastralvectorGridSource,
        style: (feature) => {
          // 레이블 지정을 위한 ROWCOL 속성 가져오기
          const jibun = feature.get('ROWCOL');
          let style = defaultGridStyle;
  
          
       
  
          // 확대/축소 수준에 따라 텍스트 가시성 조정
          const zoom = mapInstanceRef.current.getView().getZoom();
          if (zoom < 16) {
              // 예: 확대/축소 수준 18 아래에서 텍스트 숨기기
              style.setText(null);
          } else {
              style.setText(new Text({
                  font: '18px Arial',
                  fill: new Fill({
                      color: '#F43939'
                  }),
                  stroke: new Stroke({
                      color: '#fff',
                      width: 2,
                  }),
                  text: jibun,
                  offsetY: -10,
                  overflow: true,
                  textAlign: 'center',
                  textBaseline: 'middle',
              }));
          }
          return style;
        },
       // Controlled by visibleLayers state
       visible: visibleLayers.cadastralvectorGridLayer,
      });
      cadastralGridLayerRef.current = cadastralvectorGridLayer;


      //////////////////////////지적도 레이어 Source
      const defaultStyle = new Style({
        fill: new Fill({
            color: 'rgba(226, 239, 216, 0.4)',
        }),
        stroke: new Stroke({
            color: '#787878',
            width: 2,
        }),
        text: new Text({
            font: '12px Arial',
            fill: new Fill({
                color: '#000'
            }), // 텍스트 색상
            stroke: new Stroke({
                color: '#fffFF', // 텍스트 선 색상
                width: 3,
            }),
            offsetY: -10, // 레이블 위치 조정
            overflow: true,
            textAlign: 'center',
            textBaseline: 'middle',
        }),
    });
      const otherStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 128, 0, 0.5)', // "유"로 끝나는 레이어의 색상
        }),
        stroke: new Stroke({
            color: '#008000',
            width: 2,
        }),
        text: new Text({
            font: '12px Arial',
            fill: new Fill({
                color: '#000'
            }), // 텍스트 색상
            stroke: new Stroke({
                color: '#fff', // 텍스트 선 색상
                width: 3,
            }),
            offsetY: -10, // 레이블 위치 조정
            overflow: true,
            textAlign: 'center',
            textBaseline: 'middle',
        }),
    });
      const specialStyle = new Style({
        fill: new Fill({
            color: 'rgba(89, 71, 1, 0.5)', // "답"으로 끝나는 레이어의 색상을 다르게 지정
        }),
        stroke: new Stroke({
            color: '#787878',
            width: 2,
        }),
        text: new Text({
            font: '12px Arial',
            fill: new Fill({
                color: '#000'
            }), // 텍스트 색상
            stroke: new Stroke({
                color: '#fff', // 텍스트 선 색상
                width: 3,
            }),
            offsetY: -10, // 레이블 위치 조정
            overflow: true,
            textAlign: 'center',
            textBaseline: 'middle',
        }),
    });
      
     
      
      // Create VectorSource using GeoJSON data
      const cadastralvectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonData, {
    dataProjection: 'EPSG:4326', // GeoJSON의 기본 좌표계가 WGS 84 (EPSG:4326)이라고 가정
    featureProjection: 'EPSG:3857', // 지도에서 사용할 좌표계
  }),
});
      
      // Create VectorLayer with styles and source
      const cadastralvectorLayer = new VectorLayer({
        source: cadastralvectorSource,
        style: (feature) => {
          // 레이블 지정을 위한 JIBUN 속성 가져오기
          const jibun = feature.get('JIBUN');
          let style = defaultStyle;
  
          // "답"으로 끝나는 JIBUN일 경우 specialStyle 적용
        if (jibun.endsWith('답')) {
          style = specialStyle;
          } 
          // "유"로 끝나는 JIBUN일 경우 otherStyle 적용
          else if (jibun.endsWith('유')) {
              style = otherStyle;
          }
    
  
          // 확대/축소 수준에 따라 텍스트 가시성 조정
          const zoom = mapInstanceRef.current.getView().getZoom();
          if (zoom < 18) {
              // 예: 확대/축소 수준 18 아래에서 텍스트 숨기기
              style.setText(null);
          } else {
              style.setText(new Text({
                  font: '12px Arial',
                  fill: new Fill({
                      color: '#000'
                  }),
                  stroke: new Stroke({
                      color: '#fff',
                      width: 2,
                  }),
                  text: jibun,
                  offsetY: -10,
                  overflow: true,
                  textAlign: 'center',
                  textBaseline: 'middle',
              }));
          }
          return style;
        },
        visible: visibleLayers.cadastralvectorLayer, // Controlled by visibleLayers state
      });
      cadastralLayerRef.current = cadastralvectorLayer;


      const scaleLineControl = new ScaleLine({
        units: 'metric',
      });
      //openlayers 지도 
      const map = new Map({
        controls: defaultControls().extend([scaleLineControl]),
        target: mapRef.current,
        layers: [osmLayer,vworldLayer, wmsLayer1, wmsLayer2,cadastralvectorLayer,cadastralvectorGridLayer,clusterLayer,  jinanClusterLayer],
        view: new View({
          center: fromLonLat([127.5256, 35.8848]),
          zoom: 11,
          minZoom: 11.5,
          maxZoom: 25,
        }),
      });
      mapInstanceRef.current = map;
      mapInstance.current = { map, layers: { wmsLayer1, wmsLayer2, vworldLayer,cadastralvectorLayer,cadastralvectorGridLayer,clusterLayer,jinanClusterLayer }
      
    };
    };

    useEffect(() => {
      if (!mapConfig || mapConfig.length === 0) return;
    
      const map = mapInstanceRef.current;
      const wmsLayer2 = wmsLayer2Ref.current;
      const wmsLayer2Index = map.getLayers().getArray().findIndex(layer => layer === wmsLayer2);
    
      // 기존 레이어 삭제 로직 (체크 해제된 jcode 레이어 삭제)
      const existingLayers = map.getLayers().getArray();
      existingLayers.forEach((layer) => {
        const layerJcode = layer.get('jcode');
        if (layer instanceof TileLayer && layerJcode && !jcodes.includes(layerJcode)) {
          map.removeLayer(layer); // 체크 해제된 jcode 레이어 제거
        }
      });
    
      if (jcodes.length === 0) {
        // 모든 체크가 해제되었을 때, 원래 줌 및 위치로 리셋
        const defaultCenter = fromLonLat([127.5256, 35.8848]); // 초기 좌표를 fromLonLat으로 변환
        map.getView().setZoom(11); // 원하는 초기 줌 레벨로 설정 (예시: 11)
        map.getView().setCenter(defaultCenter); // 초기 위치를 설정
        return; // 레이어 추가 로직을 더 이상 처리하지 않음
      }
    
      // 새로운 레이어 추가 로직 (체크된 jcode에 해당하는 레이어 추가)
      const newLayers = mapConfig
        .filter(({ jcode }) => jcodes.includes(jcode)) // 체크된 jcode만 처리
        .map(({ jcode, minZoom, maxZoom, extents, srs }) => {
          const extentsConverted = transformExtent(extents, srs, 'EPSG:3857');
    
          const tmsSource = new XYZ({
            url: `${API_BASE_URL}/get_v2_image/${jcode}/orthophoto/{z}/{x}/{-y}.png?apikey=QqwdkvdXWJIpodvmkqQWIHDshXNxweopSDA`,
            minZoom: minZoom,
            maxZoom: maxZoom,
            tilePixelRatio: 1,
            attributions: '© Your Attribution',
          });
    
          const tmsLayer = new TileLayer({
            source: tmsSource,
            visible: true,
            jcode, // jcode를 레이어에 저장
          });
    
          return tmsLayer;
        });
    
      // 새로운 레이어 추가
      newLayers.forEach(layer => {
        if (!existingLayers.find(existingLayer => existingLayer.get('jcode') === layer.get('jcode'))) {
          map.getLayers().insertAt(wmsLayer2Index + 1, layer); // 새로운 레이어 추가
        }
      });
    
      // 전체 extents로 맵 줌 및 위치 맞춤
if (newLayers.length > 0) {
  map.getView().fit(
    transformExtent(
      [
        Math.min(...mapConfig.map(cfg => cfg.extents[0])),
        Math.min(...mapConfig.map(cfg => cfg.extents[1])),
        Math.max(...mapConfig.map(cfg => cfg.extents[2])),
        Math.max(...mapConfig.map(cfg => cfg.extents[3])),
      ],
      mapConfig[0].srs,
      'EPSG:3857'
    ),
    {
      padding: [60, 60, 60, 60], // Adjust the padding values as needed (top, right, bottom, left)
    }
  );
}

    }, [mapConfig, jcodes]);
    
    
   
    useEffect(() => {
      fetchMapConfig();
    }, [jcodes, fetchMapConfig]);
    
    useEffect(() => {
      if (mapRef.current) {
        createMap();
      }
      return () => mapInstance.current?.map.setTarget(null);
    }, [mapType]);

    //지역AOI, 하천, 지적도, 파노라마 포인트 visible 관리
    useEffect(() => {
      if (mapInstance.current) {
        const { wmsLayer1, wmsLayer2, clusterLayer, cadastralvectorLayer,cadastralvectorGridLayer } = mapInstance.current.layers;
        wmsLayer1.setVisible(visibleLayers.wmsLayer1);
        wmsLayer2.setVisible(visibleLayers.wmsLayer2);    
        cadastralvectorLayer.setVisible(visibleLayers.cadastralvectorLayer);
        cadastralvectorGridLayer.setVisible(visibleLayers.cadastralvectorGridLayer);
        clusterLayer.setVisible(visibleLayers.clusterLayer);
      }
    }, [visibleLayers]);

   

    useEffect(() => {
      if (mapInstance.current) {
        const map = mapInstance.current.map;
    
        // Create and add select interaction for cadastral vector layer
        const selectInteractionCadastral = new Select({
          layers: [mapInstance.current.layers.cadastralvectorLayer],
        });
        map.addInteraction(selectInteractionCadastral);
    
        // Create and add select interaction for grid layer
        const selectInteractionGrid = new Select({
          layers: [mapInstance.current.layers.cadastralvectorGridLayer],
        });
        map.addInteraction(selectInteractionGrid);
    
        // Create and add popup overlay
        mapInstance.current.popupOverlay = new Overlay({
          element: popupRef.current,
          positioning: 'bottom-center',
          stopEvent: false,
          offset: [0, -10],
        });
        map.addOverlay(mapInstance.current.popupOverlay);
    
        // Handle feature selection for cadastral layer
        selectInteractionCadastral.on('select', (event) => {
          const selected = event.selected[0];
          if (selected) {
            const properties = selected.getProperties();
            setSelectedFeature(selected);
            setPopupContent(`PNU: ${properties.PNU}, 지번: ${properties.JIBUN}`);
    
            const coordinates = selected.getGeometry().getCoordinates();
            mapInstance.current.popupOverlay.setPosition(coordinates);
          } else {
            setSelectedFeature(null);
            setPopupContent('');
            mapInstance.current.popupOverlay.setPosition(undefined);
          }
        });
    
        // Handle feature selection for grid layer
selectInteractionGrid.on('select', (event) => {
  const selected = event.selected[0];
  if (selected) {
    const properties = selected.getProperties();
    const geometry = selected.getGeometry(); // Geometry 가져오기
    const coordinates = geometry.getCoordinates(); // Coordinates 추출

    // 각 좌표쌍을 EPSG:4326으로 변환하여 출력
    const lonLatCoords = coordinates[0][0].map((coordPair) => toLonLat(coordPair)); // EPSG:3857 -> EPSG:4326 변환

    // 경도와 위도 리스트 추출
    const lons = lonLatCoords.map((coord) => coord[0]); // 경도 리스트
    const lats = lonLatCoords.map((coord) => coord[1]); // 위도 리스트

    // 좌표 범위 계산
    const minLon = Math.min(...lons); // 최소 경도
    const minLat = Math.min(...lats); // 최소 위도
    const maxLon = Math.max(...lons); // 최대 경도
    const maxLat = Math.max(...lats); // 최대 위도

    // coord1 (최소 경도와 최소 위도)
    const coord1 = [minLon, minLat];
    // coord2 (최소 경도와 최소 위도) - 동일하게 최소값을 사용
    const coord2 = [minLon, minLat];
    // coord3 (최대 경도와 최대 위도)
    const coord3 = [maxLon, maxLat];
    // coord4 (최대 경도와 최대 위도) - 동일하게 최대값을 사용
    const coord4 = [maxLon, maxLat];

    // 결과 출력
    console.log(`coord1 (왼쪽 아래 X, 최소 경도): [${coord1[0]}]`);
    console.log(`coord2 (왼쪽 아래 Y, 최소 위도): [ ${coord2[1]}]`);
    console.log(`coord3 (오른쪽 위 X, 최대 경도): [${coord3[0]}]`);
    console.log(`coord4 (오른쪽 위 Y, 최대 위도): [ ${coord4[1]}]`);
  }
});

    
        // Cleanup function
        return () => {
          map.removeInteraction(selectInteractionCadastral);
          map.removeInteraction(selectInteractionGrid);
          if (mapInstance.current.popupOverlay) {
            map.removeOverlay(mapInstance.current.popupOverlay);
            mapInstance.current.popupOverlay = null;
          }
        };
      }
    }, [mapType]);
    
    // Hook for updating popup position
    useEffect(() => {
      if (mapInstance.current && selectedFeature) {
        const coordinates = selectedFeature.getGeometry().getCoordinates();
        mapInstance.current.popupOverlay.setPosition(coordinates);
      }
    }, [selectedFeature]);
    

    const handleLayerVisibility = (layer) => {
      setVisibleLayers((prevState) => ({
        ...prevState,
        [layer]: !prevState[layer],
      }));
    };

    /////현재 화면 screenshot 코드
    //screenshot을 할 영역 = divRef
    const divRef = useRef(null);
    // screenshot버튼 이벤트
    const handleDownload = async () => {
      if (!divRef.current) return;

      try {
        const div = divRef.current;
        const canvas = await html2canvas(div, { scale: 2 });
        canvas.toBlob((blob) => {
          if (blob !== null) {
            saveAs(blob, "result.png");
          }
        });
      } catch (error) {
        console.error("Error converting div to image:", error);
      }
    };
   
    return (
      <>
      <Container ref={divRef}>
       <Yongdammeuncontrol   onCheckedItemsChange={updateJcodes}/>
       {/* <Yongdammeuncontrol/> */}
        <YongdamMapcontrol onSelectMapType={setMapType} onLayerToggle={handleLayerVisibility} onMeasureDistance={startMeasureDistance} onMeasureArea={startMeasureArea} onClearMeasurements={clearMeasurements}  onCapture= {handleDownload}/>
          <div ref={mapRef} style={{ width: '100%', height: '100vh' }} ></div>
          {selectedFeature && (
            <div id="popup" class="ol-popup" ref={popupRef}>
              {/* <a href="#" id="popup-closer" class="ol-popup-closer"></a> */}
              <div id="popup-content"> {popupContent}</div>
            </div>
          )}
        </Container>
      </>
    );
  };

  export default YongdamMap;

  function createOverlayElement(content) {
    const element = document.createElement('div');
    element.innerHTML = content;
    element.style.padding = '5px';
    element.style.background = 'white';
    element.style.color = 'black';
    element.style.borderRadius = '3px';
    element.style.fontSize = '12px';
    element.style.whiteSpace = 'nowrap';
    return element;
  }



  const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
`;
  
 

  const Container = styled.div`
  display:flex;
  .ol-tooltip {
          position: relative;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          color: white;
          padding: 4px 8px;
          opacity: 0.7;
          white-space: nowrap;
          font-size: 12px;
          cursor: default;
          user-select: none;
        }
        .ol-tooltip-measure {
          opacity: 1;
          font-weight: bold;
        }
        .ol-tooltip-static {
          background-color: #ffcc33;
          color: black;
          border: 1px solid white;
        }
        .ol-tooltip-measure:before,
        .ol-tooltip-static:before {
          border-top: 6px solid rgba(0, 0, 0, 0.5);
          border-right: 6px solid transparent;
          border-left: 6px solid transparent;
          content: "";
          position: absolute;
          bottom: -6px;
          margin-left: -7px;
          left: 50%;
        }
        .ol-tooltip-static:before {
          border-top-color: #ffcc33;
        }

        .ol-popup {
          position: absolute;
          background-color: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #cccccc;
          top:10px;
          right:30px;
          min-width: 280px;
          z-index:100000;
        }
        .ol-popup:after, .ol-popup:before {
          top: 100%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }
        .ol-popup:after {
          border-top-color: white;
          border-width: 10px;
          left: 48px;
          margin-left: -10px;
        }
        .ol-popup:before {
          border-top-color: #cccccc;
          border-width: 11px;
          left: 48px;
          margin-left: -11px;
        }
        .ol-popup-closer {
          text-decoration: none;
          position: absolute;
          top: 2px;
          right: 8px;
        }
        .ol-popup-closer:after {
          content: "✖";
        }
  `


