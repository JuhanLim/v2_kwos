  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';
  import styled from 'styled-components';
  // openlayers import
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { Tile as TileLayer } from 'ol/layer';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj';
  import { Vector as VectorLayer } from 'ol/layer';
  import VectorSource from 'ol/source/Vector';
  import { Feature } from 'ol';
  import Point from 'ol/geom/Point';
  import { Cluster } from 'ol/source';
  import { Style, Text, Fill, Stroke, Icon } from 'ol/style';
  import Overlay from 'ol/Overlay';
  // img import
  import dam from '../assets/dam.png'
  import pin from '../assets/pin.png'
  import kwaterlogo from '../assets/kwaterlogo.png'



  // MainPage component
  const MainPage = () => {
    const mapRef = useRef();
    const popupRef = useRef();
    const navigate = useNavigate();
    const [popupContent, setPopupContent] = useState('');
    const [popupImage, setPopupImage] = useState('');
    const [adress, setPopupAdress] = useState('');
    const [popupPosition, setPopupPosition] = useState(null);

    //댐 임시 데이터
    const Area = [
      {
        name: "영주댐",
        acode: "a_1",
        image:'https://img.khan.co.kr/news/2023/08/22/news-p.v1.20221003.a1d343957d8643ffa86dc376aef74701_P1.webp',
        coordinate: [128.6552, 36.7234],
        description: "영주댐지사",
        adress: "(36174) 경북 영주시 평은면 강동로 53",
        page:"YeongjuPage"
      },
      {
        name: "용담댐",
        acode: "a_2",
        coordinate: [127.5256, 35.9448],
        description: "용담댐지사",
        adress: "(55406) 전북 진안군 안천면 안용로 747",
        page:"YongdamPage"
      },
      {
        name: "서울댐",
        acode: "a_3",
        coordinate: [127.269311, 37.413294],
        description: "서울댐입니다",
        adress: "(36174) 경북 영주시 평은면 강동로 53",
        page:"testdropzone"
      },
      {
        name: "부산댐",
        acode: "a_4",
        coordinate: [128.7384361, 35.3959361],
        description: "부산댐입니다",
        adress: "(36174) 경북 영주시 평은면 강동로 53",
        page:"testcompare"
      }
    ];

    useEffect(() => {
      const rasterLayer = new TileLayer({
        source: new OSM(),
      });

      const vectorSource = new VectorSource({
        features: Area.map(area => new Feature({
          geometry: new Point(fromLonLat(area.coordinate)),
          name: area.name,
          image: area.image,
          description: area.description,
          adress:area.adress,
          page: area.page
        }))
      });

      const clusterSource = new Cluster({
        distance: 40,
        source: vectorSource
      });

      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const size = feature.get('features').length;
          return new Style({
            image: new Icon({
              src: pin,  // Replace with the path to your custom image
              scale: 0.25 + Math.min(size / 300, 0.5),  // Adjust scale based on cluster size
              anchor: [0.5, 0.5]
            }),
          });
        }
      });

      const map = new Map({
        target: mapRef.current,
        layers: [rasterLayer, clusterLayer],
        view: new View({
          center: fromLonLat([127.7669, 35.9078]),
          zoom: 8,
          minZoom: 8,
          maxZoom: 19,
        })
      });

      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      map.addOverlay(overlay);

      map.on('pointermove', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          const features = feature.get('features');
          if (features.length === 1) {
            const image = features[0].get('image');
            const description = features[0].get('description');
            const adress = features[0].get('adress');
            setPopupImage(image);
            setPopupContent(description);
            setPopupAdress(adress);
            setPopupPosition(coordinates);
            overlay.setPosition(coordinates);
          } else {
            overlay.setPosition(undefined);
          }
        } else {
          overlay.setPosition(undefined);
        }
      });

      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
        if (feature) {
          const features = feature.get('features');
          if (features.length === 1) {
            const page = features[0].get('page');
            navigate(`/${page}`);
          }
        }
      });

      return () => map.setTarget(null);
    }, [navigate]);
    
    return (
      <MapContainer ref={mapRef}>
        <Popup ref={popupRef}>
          <PopupImageBox>
            <PopupImage src={kwaterlogo} alt="Popup Image" />
            
            </PopupImageBox>
          <PopupContent>{popupContent}</PopupContent>
          <PopupAdress>{adress}</PopupAdress>
        </Popup>
      </MapContainer>
    );
  };

  export default MainPage;






  // Styled components
  const MapContainer = styled.div`
    width: 100%;
    height: 100vh;
  `;

  const Popup = styled.div`
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 5px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 20px;
    left: -40px;
    min-width: 200px;
    min-height: 150px;
    &:after, &:before {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    &:after {
      border-top-color: white;
      border-width: 10px;
      left: 50%;
      margin-left: -10px;
    }
    &:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 50%;
      margin-left: -11px;
    }
  `;



  const PopupContent = styled.div`
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 14px;
    margin-top:5px;
  `;
  const PopupAdress = styled.div`
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 11px;
  `;

  const PopupImageBox = styled.div`
    width:100%;
    height: 80px;
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
    display:flex;
    align-items:center;
    justify-content:center;

  `;

  const PopupImage = styled.img`
  /* 이미지 크기를 조정할 수 있습니다 */
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지가 박스 안에 잘 맞도록 조정 */
`;