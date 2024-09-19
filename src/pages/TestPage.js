import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS'; // TileWMS를 추가
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import { GeoJSON } from 'ol/format';
import { fromLonLat, transformExtent } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { LineString } from 'ol/geom';
import { getLength, getArea } from 'ol/sphere';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { geojsonGridData } from '../components/Data/griddata';
import { geojsonData } from '../components/Data/geodata';
import Yongdammeuncontrol from '../components/controls/Yongdammeuncontrol';


const API_BASE_URL = '/api/yongdam';
const apikey = 'QqwdkvdXWJIpodvmkqQWIHDshXNxweopSDA';
const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI; // Geoserver URL 환경 변수
const jcode = 'j_265';

const TestPage = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vworldLayerRef = useRef(null);
  const cadastralLayerRef = useRef(null);
  const cadastralGridLayerRef = useRef(null);
  const [mapConfig, setMapConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [osmLayerVisible, setOsmLayerVisible] = useState(true);
  const [tmsLayerVisible, setTmsLayerVisible] = useState(true);
  const [vworldLayerVisible, setVworldLayerVisible] = useState(true);
  const [cadastralLayerVisible, setCadastralLayerVisible] = useState(true);
  const [draw, setDraw] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [areaDraw, setAreaDraw] = useState(null);
  const [areaMeasurements, setAreaMeasurements] = useState([]);

  const jcodes = ['j_299', 'j_269'];

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
  }, []);

  useEffect(() => {
    fetchMapConfig();
  }, [fetchMapConfig]);

  useEffect(() => {
    if (!mapConfig || mapConfig.length === 0) return;

    const layers = mapConfig.map(({ jcode, minZoom, maxZoom, extents, srs }) => {
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
        visible: tmsLayerVisible,
      });

      return tmsLayer;
    });

    const wmsLayer1 = new TileLayer({
      source: new TileWMS({
        url: `${geoserverUrl}/yongdam/wms`,
        params: {
          'LAYERS': 'yongdam:YongdamGrid',
          'TILED': true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: true,  // 기본적으로 가시성을 true로 설정합니다.
      opacity: 0.5, // Adjust the opacity here (0.5 is 50% transparent)
    });

    // VWorld 레이어 추가
    const vworldLayer = new TileLayer({
      source: new XYZ({
        url: `http://api.vworld.kr/req/wmts/1.0.0/{apikey}/Satellite/{z}/{y}/{x}.jpeg`.replace(
          '{apikey}',
          '9D1DA041-8CBA-3E86-9C6D-90178C0E1CE6'
        ),
      }),
      visible: vworldLayerVisible,
    });

    vworldLayerRef.current = vworldLayer; 

    const scaleLineControl = new ScaleLine({
      units: 'metric',
    });


          //////////////////////////지적도 레이어 Source
          const defaultGridStyle = new Style({
            fill: new Fill({
                color: 'rgba(226, 239, 216, 0.1)',
            }),
            stroke: new Stroke({
                color: '#787878',
                width: 1.5,
            }),
            text: new Text({
                font: '12px Arial',
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
              // 레이블 지정을 위한 JIBUN 속성 가져오기
              const jibun = feature.get('UI24');
              let style = defaultGridStyle;
      
              // "답"으로 끝나는 JIBUN일 경우 specialStyle 적용
           
      
              // 확대/축소 수준에 따라 텍스트 가시성 조정
              const zoom = mapInstanceRef.current.getView().getZoom();
              if (zoom < 16) {
                  // 예: 확대/축소 수준 18 아래에서 텍스트 숨기기
                  style.setText(null);
              } else {
                  style.setText(new Text({
                      font: '12px Arial',
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
          });
          cadastralGridLayerRef.current = cadastralvectorGridLayer;


           //////////////////////////지적도 레이어 Source
      const defaultStyle = new Style({
        fill: new Fill({
            color: 'rgba(226, 239, 216, 0.4)',
        }),
        stroke: new Stroke({
            color: '#FFFFFF',
            width: 1,
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
      const otherStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 128, 0, 0.5)', // "유"로 끝나는 레이어의 색상
        }),
        stroke: new Stroke({
            color: '#FFFFFF',
            width: 1,
        }),
        text: new Text({
            font: '9px Arial',
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
            color: '#FFFFFF',
            width: 1,
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
      
      const selectStyle = new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
        stroke: new Stroke({
          color: '#0000ff',
          width: 2,
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
          if (zoom < 16) {
              // 예: 확대/축소 수준 18 아래에서 텍스트 숨기기
              style.setText(null);
          } else {
              style.setText(new Text({
                  font: '5px Arial',
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
       
      });
      cadastralLayerRef.current = cadastralvectorLayer;

    
    
    
          
    

    // OpenLayers의 Map 인스턴스 생성 및 mapInstanceRef에 저장
    const map = new Map({
      controls: defaultControls().extend([scaleLineControl]),
      target: mapRef.current,
      layers: [
        
        // WMS 레이어를 추가합니다.
        ...layers,
        cadastralvectorLayer,
        cadastralvectorGridLayer,
      ],
      view: new View({
        center: fromLonLat([
          (mapConfig[0].extents[0] + mapConfig[0].extents[2]) / 2,
          (mapConfig[0].extents[1] + mapConfig[0].extents[3]) / 2
        ]),
        zoom: Math.min(...mapConfig.map(cfg => cfg.minZoom)),
      }),
    });

    map.getView().fit(transformExtent(
      [
        Math.min(...mapConfig.map(cfg => cfg.extents[0])),
        Math.min(...mapConfig.map(cfg => cfg.extents[1])),
        Math.max(...mapConfig.map(cfg => cfg.extents[2])),
        Math.max(...mapConfig.map(cfg => cfg.extents[3]))
      ],
      mapConfig[0].srs,
      'EPSG:3857'
    ));

    mapInstanceRef.current = map; // mapInstanceRef에 Map 인스턴스 저장

    return () => {
      map.setTarget(null);
    };
  }, [mapConfig]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MapContainer ref={mapRef} />
  );
};

export default TestPage;

// 스타일 정의
const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  z-index:1000;
  display:flex;
  flex-direction:column;
  width:30px;
  top:100px;
  left:5px;
`;

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
`;

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






