import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM'; // 기본 OSM 타일 소스 추가
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import 'ol-ext/control/Swipe.css';
import Swipe from 'ol-ext/control/Swipe';

const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI; // Geoserver URL

const SwipeableMaps = () => {
  const leftMapRef = useRef(null);
  const rightMapRef = useRef(null);
  const [map, setMap] = useState(null);

  

  

  useEffect(() => {
    // 기본 OSM 타일 레이어 생성
    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    // WMS 레이어 생성
    const wmsLayer7 = new TileLayer({
      source: new TileWMS({
        url: `${geoserverUrl}/yeongju/wms`,
        params: { 'LAYERS': 'yeongju:KwaterLargeCategoryAll' },
        serverType: 'geoserver',
        transition: 0,
      }),
    });

    const wmsLayer8 = new TileLayer({
      source: new TileWMS({
        url: `${geoserverUrl}/yeongju/wms`,
        params: { 'LAYERS': 'yeongju:KwaterMiddleCategoryAll' },
        serverType: 'geoserver',
        transition: 0,
      }),
    });

    // OpenLayers 지도 생성 및 레이어 추가
    const olMap = new Map({
      target: leftMapRef.current, // 왼쪽 지도의 대상 요소
      layers: [baseLayer, wmsLayer7, wmsLayer8], // 기본 지도 레이어를 맨 아래에 추가
      view: new View({
        center: fromLonLat([127.5, 35.8]), // 지도 중심 (예: 한국)
        zoom: 8, // 초기 줌 레벨
      }),
      controls: defaultControls({
        attributionOptions: {
          collapsible: false,
        },
      }),
    });

    setMap(olMap);

    // 스와이프 컨트롤 생성 및 적용 (WMS 레이어에만 적용)
    const swipe = new Swipe({
      layers: wmsLayer8, // 스와이프할 레이어 설정
      right: true,
    });
    olMap.addControl(swipe);

    return () => {
      // 컴포넌트 언마운트 시 지도 정리
      if (map) {
        map.setTarget(null);
      }
    };
  }, [geoserverUrl]);

  return (
    <div style={{ width: '200%', height: '100vh', position: 'relative' }}>
      <div ref={leftMapRef} style={{ width: '50%', height: '100%', position: 'absolute', left: 0 }} />
      <div ref={rightMapRef} style={{ width: '50%', height: '100%', position: 'absolute', right: 0 }} />
    </div>
  );
};

export default SwipeableMaps;
