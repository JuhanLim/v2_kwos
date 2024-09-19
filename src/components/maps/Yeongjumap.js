  import React, { useRef, useState, useEffect } from 'react';
  import styled from 'styled-components';
  //components import
  import Mapcontrol from '../controls/Mapcontrol';
  import YeongjuMeuncontrol from '../controls/YeongjuMeuncontrol';
  //openlayers
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { Tile as TileLayer } from 'ol/layer';
  import { TileWMS, XYZ, OSM } from 'ol/source';
  import { fromLonLat } from 'ol/proj';
  import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
  import Draw from 'ol/interaction/Draw';
  import Overlay from 'ol/Overlay';
  import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text} from 'ol/style';
  import { Point, Circle as CircleGeom } from 'ol/geom';
  import { LineString, Polygon } from 'ol/geom';
  import { Vector as VectorSource } from 'ol/source';
  import { Vector as VectorLayer } from 'ol/layer';
  import { getArea, getLength } from 'ol/sphere';
  import { unByKey } from 'ol/Observable';
  import { Feature } from 'ol';
  import { Cluster } from 'ol/source';

  import 'ol/ol.css';
  //react-screenshot import
  import html2canvas from "html2canvas";
  import saveAs from "file-saver";
  // img
  // img
  import pin from '../../assets/pin.png'
  import panopin from '../../assets/warningpin.png'
  import panocircle from '../../assets/Ellipse11.png'
  import mappingcircle from '../../assets/Ellipse12.png'
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

  const Area = [
    {
      name: "감곡리 931",
      acode: "p_1",
      image:'',
      coordinate: [128.641, 36.93],
      description: "",
     
    },
    {
      name: "삼계리 129-4",
      acode: "p_2",
      image:'',
      coordinate: [128.7323, 36.8999],
      description: "",
      
    },
    {
      name: "원천리 109",
      acode: "p_3",
      coordinate: [128.7459, 36.7969],
      image:'',
      description: "",
      
    },
  ];

  const Yeongjumap = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const mapInstanceRef = useRef(null);
    const damLayerRef = useRef(null);
    const cadastralLayerRef = useRef(null);
    const panoramaLayerRef = useRef(null);
    const [measurements, setMeasurements] = useState([]);
    const [areaDraw, setAreaDraw] = useState(null);
    const [areaMeasurements, setAreaMeasurements] = useState([]);
    const [draw, setDraw] = useState(null);
    const [mapType, setMapType] = useState('4');
    const [visibleLayers, setVisibleLayers] = useState({
      wmsLayer1: true,
      wmsLayer2: true,
      wmsLayer3: true,
      wmsLayer4: false,
      wmsLayer5: false,
      clusterLayer: true,
    });
    const [additionalLayers, setAdditionalLayers] = useState(() => {
      const initialState = {};
      layerConfigurations.forEach((layer) => {
        initialState[layer.name] = false;
      });
      return initialState;
    });
    const yeongjudamClusterData = [
      {
        coordinate: [128.6552, 36.7234],  // 진안군 안천면 안용로 747의 좌표
        name: 'yeongjudam Cluster',
        image: 'url/to/image.jpg',  // 필요시 이미지 경로 추가
        description: 'yeongjudam Cluster description',
        page: 'url/to/page'  // 필요시 페이지 링크 추가
      }
    ];

    const yeongjudamVectorSource = new VectorSource({
      features: yeongjudamClusterData.map(area => new Feature({
        geometry: new Point(fromLonLat(area.coordinate)),
        name: area.name,
        image: area.image,
        description: area.description,
        page: area.page
      }))
    });

    const yeongjudamClusterSource = new Cluster({
      distance: 40,
      source: yeongjudamVectorSource
    });
    const yeongjudamClusterLayer = new VectorLayer({
      source: yeongjudamClusterSource,
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

    const scaleLineControl = new ScaleLine({
      units: 'metric',
    });

    const createMap = () => {
      const osmLayer = new TileLayer({
        source: new OSM(),
      });

      const vworldLayer = new TileLayer({
        source: new XYZ({
          url: `http://api.vworld.kr/req/wmts/1.0.0/{apikey}/Satellite/{z}/{y}/{x}.jpeg`.replace(
            '{apikey}',
            '9D1DA041-8CBA-3E86-9C6D-90178C0E1CE6'
          ),
        }),
        visible: mapType === '3',
      });

      const wmsLayer1 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yeongju/wms`,
          params: {
            'LAYERS': 'yeongju:yeongju_AOI_origin',
            'TILED': true,
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer1,
      });

      const wmsLayer2 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yeongju/wms`,
          params: {
            'LAYERS': 'yeongju:yeongju_waterline',
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer2,
      });

      const wmsLayer3 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yeongju/wms`,
          params: {
            'LAYERS': 'yeongju_sewage_treatment_plant',
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer3,
      });

      const wmsLayer4 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yeongju/wms`,
          params: {
            'LAYERS': 'yeongju:KwaterLargeCategoryAll',
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer4,
      });

      const wmsLayer5 = new TileLayer({
        source: new TileWMS({
          url: `${geoserverUrl}/yeongju/wms`,
          params: {
            'LAYERS': 'yeongju:KwaterMiddleCategoryAll',
          },
          serverType: 'geoserver',
          transition: 0,
        }),
        visible: visibleLayers.wmsLayer5,
      });

      

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
        source: vectorSources,
      });
      
      // Cluster layer with circle style
      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const features = feature.get('features');
          const size = features.length;
          const coordinate = feature.getGeometry().getCoordinates();
      
          // Radii in meters
          const radius500InMeters = 500;
          const radius250InMeters = 250;
      
          // Convert the radii from meters to map units (assuming EPSG:3857 - Web Mercator)
          const circle500 = new CircleGeom(coordinate, radius500InMeters);
          const circle250 = new CircleGeom(coordinate, radius250InMeters);
      
          // console.log('Cluster size:', size);
          // console.log('Cluster coordinate:', coordinate);
          // console.log('Circle 500m geometry:', circle500);
          // console.log('Circle 200m geometry:', circle200);
      
          return [
            // Style for the 500m circle around the cluster
            new Style({
              geometry: circle500,
              stroke: new Stroke({
                color: 'rgba(255, 92, 0, 0.8)', // Orange stroke color
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(255, 92, 0, 0.2)', // Light orange fill color
              }),
            }),
            // Style for the 200m circle around the cluster
            new Style({
              geometry: circle250,
              stroke: new Stroke({
                color: 'rgba(0, 0, 255, 0.8)', // Blue stroke color
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(0, 0, 255, 0.2)', // Light blue fill color
              }),
            }),
            // Style for the cluster icon
            new Style({
              image: new Icon({
                src: panopin, // Replace with the path to your custom image
                scale: 0.2 + Math.min(size / 300, 0.5), // Adjust scale based on cluster size
                anchor: [0.5, 0.5],
              }),
            }),
          ];
        },
        visible: visibleLayers.clusterLayer,
      });
      
      // panoramaLayerRef.current = clusterLayer;
      
      const additionalLayersConfig = layerConfigurations.reduce((acc, layerConfig) => {
        acc[layerConfig.name] = new TileLayer({
          source: new TileWMS({
            url: layerConfig.url,
            params: layerConfig.params,
            serverType: 'geoserver',
            transition: 0,
          }),
          visible: additionalLayers[layerConfig.name],
        });
        return acc;
      }, {});

      osmLayer.on('prerender', (evt) => {
        if (evt.context) {
          const context = evt.context;
          if (mapType === '4') {
            context.filter = 'grayscale(80%) invert(100%)';
          } else {
            context.filter = 'grayscale(0%) invert(0%)';
          }
          context.globalCompositeOperation = 'source-over';
        }
      });

      osmLayer.on('postrender', (evt) => {
        if (evt.context) {
          const context = evt.context;
          context.filter = 'none';
        }
      });

      const map = new Map({
        controls: defaultControls().extend([scaleLineControl]),
        target: mapRef.current,
        layers: [osmLayer, vworldLayer, wmsLayer1, wmsLayer2, wmsLayer3, wmsLayer4,wmsLayer5,yeongjudamClusterLayer, ...Object.values(additionalLayersConfig),clusterLayer],
        view: new View({
          center: fromLonLat([128.8, 36.8]),
          zoom: 11,
          minZoom: 10,
          maxZoom: 19,
        }),
        controls: defaultControls().extend([scaleLineControl]),
        
      });
      mapInstanceRef.current = map;
      mapInstance.current = { map, layers: { wmsLayer1, wmsLayer2, wmsLayer3, wmsLayer4,wmsLayer5, vworldLayer,yeongjudamClusterLayer, ...additionalLayersConfig,clusterLayer } };

          // Monitor the zoom level and set visibility of PanoCircleContainer
    map.getView().on('change:resolution', () => {
      const zoomLevel = map.getView().getZoom();
      setIsPanoCircleVisible(zoomLevel >= 15); // Set threshold zoom level for visibility
    });

    return map;
    };

    useEffect(() => {
      if (mapRef.current) {
        createMap();
      }
      return () => mapInstance.current?.map.setTarget(null);
    }, [mapType]);

    useEffect(() => {
      if (mapInstance.current) {
        const { wmsLayer1, wmsLayer2, wmsLayer3,wmsLayer4,wmsLayer5,clusterLayer } = mapInstance.current.layers;
        wmsLayer1.setVisible(visibleLayers.wmsLayer1);
        wmsLayer2.setVisible(visibleLayers.wmsLayer2);
        wmsLayer3.setVisible(visibleLayers.wmsLayer3);
        wmsLayer4.setVisible(visibleLayers.wmsLayer4);
        wmsLayer5.setVisible(visibleLayers.wmsLayer5);
        clusterLayer.setVisible(visibleLayers.clusterLayer);
      }
    }, [visibleLayers]);

    useEffect(() => {
      if (mapInstance.current) {
        Object.entries(additionalLayers).forEach(([layerName, visibility]) => {
          if (mapInstance.current.layers[layerName]) {
            mapInstance.current.layers[layerName].setVisible(visibility);
          }
        });
      }
    }, [additionalLayers]);

    const handleLayerVisibility = (layer) => {
      setVisibleLayers((prevState) => ({
        ...prevState,
        [layer]: !prevState[layer],
      }));
    };

    const handleAdditionalLayerVisibility = (layerName) => {
      setAdditionalLayers((prevState) => ({
        ...prevState,
        [layerName]: !prevState[layerName],
      }));
    };



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
    if (layer instanceof VectorLayer && layer !== cadastralLayerRef.current && layer !== panoramaLayerRef.current  && layer !== damLayerRef.current) {
          mapInstanceRef.current.removeLayer(layer);
      }
  });

  // 벡터 소스와 레이어 초기화
  vectorSource = null;
  vectorLayer = null;
};


const [isPanoCircleVisible, setIsPanoCircleVisible] = useState(false);


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
        {isPanoCircleVisible && (
        <PanoCircleContainer>
        <PanoCircleSpan>
          <img src={mappingcircle} alt="Mapping Circle" style={{ marginRight: '10px',marginLeft:'10px' ,width:'20px', height:'20px'}} />
          250M 맵핑 촬영 구역
        </PanoCircleSpan>
        <PanoCircleSpan>
          <img src={panocircle} alt="Panorama Circle" style={{ marginRight: '10px',marginLeft:'10px',width:'20px', height:'20px'}} />
          500M 파노라마 촬영 구역
        </PanoCircleSpan>
      </PanoCircleContainer>
      )}
          <YeongjuMeuncontrol onLayerToggle={handleAdditionalLayerVisibility} onConvertLayerToggle={handleLayerVisibility}/>
          <Mapcontrol onSelectMapType={setMapType} onLayerToggle={handleLayerVisibility} onMeasureDistance={startMeasureDistance} onMeasureArea={startMeasureArea} onClearMeasurements={clearMeasurements}  onCapture= {handleDownload}/>
          <div ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
         
        </Container>
      </>
    );
  };

  export default Yeongjumap;
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

  const Container = styled.div`
    display:flex;
  `


  // Create a popup container
const popupContainer = document.createElement('div');
popupContainer.className = 'ol-popup';
document.body.appendChild(popupContainer);

// Create a popup content element
const popupContent = document.createElement('div');
popupContent.className = 'ol-popup-content';
popupContainer.appendChild(popupContent);

// Add some CSS for styling the popup
// const style = document.createElement('style');
// style.innerHTML = `
//   .ol-popup {
//     position: absolute;
//     background-color: white;
//     padding: 10px;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//     max-width: 200px;
//     pointer-events: none;
//   }
//   .ol-popup-content {
//     font-size: 14px;
//   }
// `;
// document.head.appendChild(style);

const PanoCircleContainer = styled.div`
position:absolute;
width:180px;
height:50px;
z-index:11000000;
bottom:100px;
right:20px;
background-color:white;
border-radius: 5px;
font-size:12px;
display:flex;
flex-direction:column;
justify-content:space-evenly;
`;
const PanoCircleSpan = styled.div``