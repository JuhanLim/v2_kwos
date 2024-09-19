import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';  // 추가된 TileWMS import
import XYZ from 'ol/source/XYZ';
import { fromLonLat, transformExtent } from 'ol/proj';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { useLocation } from 'react-router-dom';
import Loding from '../components/other/Loding';

const API_BASE_URL = '/api/yongdam';
const apikey = 'QqwdkvdXWJIpodvmkqQWIHDshXNxweopSDA';
const geoserverUrl = process.env.REACT_APP_GEOSERVER_URI;  // Geoserver URL
// const jcodes = ['j_237', 'j_251', 'j_243']; // Your list of jcodes

const getGridTemplate = (count) => {
  switch (count) {
    case 1: return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
    case 2: return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' };
    case 3: return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 4: return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 5: return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 6: return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 7: return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' };
    case 8: return { gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 9: return { gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
    case 10: return { gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
    default: return { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gridTemplateRows: 'repeat(auto-fit, minmax(200px, 1fr))' };
  }
};
// Function to get query parameters
const getQueryParams = (search) => {
  const params = new URLSearchParams(search);
  return params.getAll('jcode');
};

const TestCompare = () => {
  const location = useLocation();
  const jcodes = getQueryParams(location.search);
  const mapRefs = useRef([...jcodes, 'default'].map(() => React.createRef()));  // Now jcodes is defined
  const mapInstanceRefs = useRef([]);
  const [mapConfigs, setMapConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layerVisibility, setLayerVisibility] = useState(
    jcodes.map(() => ({
      osm: true,
      tms: true,
      vworld: false,
      cadastral: true,
      wmsLayer: true,  // 새로운 WMS 레이어 가시성 추가
    }))
  );
  const [syncMapIndex, setSyncMapIndex] = useState(null);

 

  // Use jcodes to render maps or other content
  console.log('Jcodes:', jcodes);
 

  

  const fetchMapConfig = useCallback(async () => {
    try {
      const configs = await Promise.all(
        jcodes.map(async (jcode) => {
          const response = await fetch(`${API_BASE_URL}/get-xml/${jcode}/?apikey=${apikey}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');

          const tileSets = xmlDoc.getElementsByTagName('TileSet');
          const zoomLevels = Array.from(tileSets).map((tileSet) => parseInt(tileSet.getAttribute('order'), 10));
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
        })
      );

      setMapConfigs(configs);
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
    if (!mapConfigs || mapConfigs.length === 0) return;

    mapConfigs.forEach((config, index) => {
      const { jcode, minZoom, maxZoom, extents, srs } = config;
      const mapRef = mapRefs.current[index];

      if (mapRef.current) {
        const layers = [
          new TileLayer({
            source: new XYZ({
              url: `http://api.vworld.kr/req/wmts/1.0.0/{apikey}/Satellite/{z}/{y}/{x}.jpeg`.replace(
                '{apikey}',
                '9D1DA041-8CBA-3E86-9C6D-90178C0E1CE6'
              ),
            }),
            visible: layerVisibility[index].vworld,
          }),
          new TileLayer({
            source: new TileWMS({
              url: `${geoserverUrl}/yongdamAOI/wms`,  // Geoserver WMS URL
              params: { 'LAYERS': 'yongdamAOI:20240610_RGB_super' },
              serverType: 'geoserver',
              transition: 0,
            }),
            visible: layerVisibility[index].wmsLayer,  // 새로운 WMS 레이어 가시성 조절
          }),
          new TileLayer({
            source: new XYZ({
              url: `${API_BASE_URL}/get_v2_image/${jcode}/orthophoto/{z}/{x}/{-y}.png?apikey=${apikey}`,
              minZoom: minZoom,
              maxZoom: maxZoom,
              tilePixelRatio: 1,
              attributions: '© Your Attribution',
            }),
            visible: layerVisibility[index].tms,
          }),
          
        ];

        const map = new Map({
          controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]),
          target: mapRef.current,
          layers: layers,
          view: new View({
            center: fromLonLat([(extents[0] + extents[2]) / 2, (extents[1] + extents[3]) / 2]),
            zoom: minZoom,
          }),
        });

        mapInstanceRefs.current[index] = map;

        map.getView().fit(transformExtent(extents, srs, 'EPSG:3857'), { size: map.getSize(), maxZoom: maxZoom });

        // Attach listeners for synchronization if this map is the sync map
        const view = map.getView();
        if (index === syncMapIndex) {
          view.on('change:center', () => handleSync(view));
          view.on('change:resolution', () => handleSync(view));
        }
      }
    });

    if (mapConfigs.length % 2 !== 0) {
      const defaultMapRef = mapRefs.current[mapConfigs.length];

      if (defaultMapRef.current) {
        const defaultMap = new Map({
          controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]),
          target: defaultMapRef.current,
          layers: [
            new TileLayer({
              source: new XYZ({
                url: `http://api.vworld.kr/req/wmts/1.0.0/{apikey}/Satellite/{z}/{y}/{x}.jpeg`.replace(
                  '{apikey}',
                  '9D1DA041-8CBA-3E86-9C6D-90178C0E1CE6'
                ),
              }),
              visible: true, // Always visible for the default map
            }),
          ],
          view: new View({
            center: fromLonLat([127.0, 37.5]),
            zoom: 7,
          }),
        });

        mapInstanceRefs.current[mapConfigs.length] = defaultMap;
      }
    }

    return () => {
      mapInstanceRefs.current.forEach((map, index) => {
        if (map) {
          map.setTarget(null);
          if (index === syncMapIndex) {
            const view = map.getView();
            view.un('change:center', () => handleSync(view));
            view.un('change:resolution', () => handleSync(view));
          }
        }
      });
    };
  }, [mapConfigs, layerVisibility, syncMapIndex]);

  const handleSync = (view) => {
    if (syncMapIndex === null) return;

    const targetCenter = view.getCenter();
    const targetZoom = view.getZoom();

    mapInstanceRefs.current.forEach((map, index) => {
      if (index !== syncMapIndex) {
        const mapView = map.getView();
        mapView.setCenter(targetCenter);
        mapView.setZoom(targetZoom);
      }
    });
  };

  const toggleLayerVisibility = (mapIndex, layerKey) => {
    setLayerVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[mapIndex][layerKey] = !newVisibility[mapIndex][layerKey];
      return newVisibility;
    });
  };

  const toggleSyncForMap = (mapIndex) => {
    if (syncMapIndex === mapIndex) {
      setSyncMapIndex(null); // Disable sync if the button is clicked again
    } else {
      setSyncMapIndex(mapIndex); // Set this map as the sync map
    }
  };

  if (loading) return <div><Loding/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <GridContainer style={getGridTemplate(mapConfigs.length + (mapConfigs.length % 2))}>
      {mapConfigs.map((config, index) => (
        <GridItem key={config.jcode}>
          <SyncContainer>
            <SyncBtn onClick={() => toggleSyncForMap(index)}>
              {syncMapIndex === index ? 'S' : 'E'}
            </SyncBtn>
          </SyncContainer>
          <ToggleContainer>
            <ToggleBtn onClick={() => toggleLayerVisibility(index, 'vworld')}>T</ToggleBtn>
            {/* Add toggle button for WMS layer */}
            <ToggleBtn onClick={() => toggleLayerVisibility(index, 'wmsLayer')}>W</ToggleBtn>
          </ToggleContainer>
          <div ref={mapRefs.current[index]} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Map rendering here */}
          </div>
        </GridItem>
      ))}

      {mapConfigs.length % 2 !== 0 && (
        <GridItem key="default-map">
          <div ref={mapRefs.current[mapConfigs.length]} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Default vworld map rendering here */}
          </div>
        </GridItem>
      )}
    </GridContainer>
  );
};

export default TestCompare;

// Styled Components
const GridContainer = styled.div`
  display: grid;
  gap: 2px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const SyncContainer = styled.div`
  position: absolute;
  top: 150px;
  left: 10px;
  z-index: 1;
`;

const GridItem = styled.div`
  border: 1px solid #ccc;
  position: relative;
  height: 100%;
`;

const ToggleContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 10px;
  z-index: 1;
`;

const ToggleBtn = styled.button`
  border: none;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SyncBtn = styled.button`
  border: none;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
