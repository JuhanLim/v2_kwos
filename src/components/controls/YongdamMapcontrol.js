import React, { useState, useRef, useEffect } from 'react';
  import styled from 'styled-components';
  //bootstrap
  import { ButtonGroup, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
  import { Water, MapFill} from 'react-bootstrap-icons';
  //mui
  import basicmap from '../../assets/basicmap.png'
  import darkmap from '../../assets/darkmap.png'
  import satellitemap from '../../assets/satellitemap.png'
  import dmap from '../../assets/3dmap.png'
  import mapmode from '../../assets/mapmodeicon.png'
  import aoiicon from '../../assets/AOIicon.png'
  import watericon from '../../assets/Watericon.png'
  import gridicon from '../../assets/gridicon.png'
  import panoramaicon from '../../assets/panoramaicon.png'
  import distanceicon from '../../assets/Areaicon.png'
  import measureicon from '../../assets/Distanceicon.png'
  import captureicon from '../../assets/Captureicon.png'
  import cancellogo from '../../assets/cancellogo.png'
  import cadastralicon from '../../assets/cadastralicon.png'
  import clickaoiicon from '../../assets/clickaoiicon.png'
  import clickwatericon from '../../assets/clickwatericon.png'
  import clickgridicon from '../../assets/clickgridicon.png'
  import clickpanoramaicon from '../../assets/clickpanoramaicon.png'
  import clickcadastralicon from '../../assets/clickcadastralicon.png'
  
 


  const YongdamMapcontrol = ({ onSelectMapType, onLayerToggle, onMeasureDistance, onMeasureArea, onClearMeasurements , onCapture}) => {
    const handleSelect = (eventKey) => {
      onSelectMapType(eventKey);
    };

    const [isMapPopupVisible, setIsMapPopupVisible] = useState(false);
    const mappopupRef = useRef(null);

    // 팝업 외부를 클릭했을 때 팝업을 닫는 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mappopupRef.current && !mappopupRef.current.contains(event.target)) {
        setIsMapPopupVisible(false); // 팝업 외부를 클릭하면 팝업 닫기
      }
    };

    // document에 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMapPopup = () => {
    setIsMapPopupVisible(!isMapPopupVisible); // 버튼을 클릭하면 팝업 열거나 닫기
  };


  
    // 선택된 레이어 상태 관리
    const [activeLayer, setActiveLayer] = useState('');
  
    // 레이어 클릭 시 상태 업데이트 및 onLayerToggle 호출
  const handleLayerToggle = (layer) => {
    setActiveLayer(layer === activeLayer ? '' : layer);  // 같은 레이어를 클릭하면 비활성화
    onLayerToggle(layer);  // 레이어 토글 함수 호출
  };


    return (
      <>
       <Mapmode onClick={toggleMapPopup}>
              <Mapmodeimg src={mapmode} alt="지도 선택"/>
            </Mapmode>
            {isMapPopupVisible && (
              <MapPopupStyles ref={mappopupRef}>
                <MapBox>
                  <MapItem onClick={() => handleSelect('4')} >
                    <MapImg src={darkmap} alt="야간 지도" />
                    <MapTitle>야간</MapTitle>
                  </MapItem>
                  <MapItem onClick={() => handleSelect('1')} style={{paddingLeft:'8px'}}>
                    <MapImg src={basicmap} alt="일반 지도" />
                    <MapTitle>일반</MapTitle>
                  </MapItem>
                </MapBox>
                <MapBox>
                  <MapItem onClick={() => handleSelect('3')}>
                    <MapImg src={satellitemap} alt="위성 지도" />
                    <MapTitle>위성</MapTitle>
                  </MapItem>
                  <MapItem onClick={() => handleSelect('5')} style={{paddingLeft:'8px'}}>
                    <MapImg src={dmap} alt="3D 지도" />
                    <MapTitle>3D</MapTitle>
                  </MapItem>
                </MapBox>
              </MapPopupStyles>
            )}
  
  {/* //////////////////////////////지도 벡터 레이어 변경 리모콘(AOI,하천,하수 처리장)//////////////////////////// */}
        <Layercontrl>
                <LayerBox style={{ borderRadius: "5px 5px 0px 0px" }} onClick={() => handleLayerToggle('wmsLayer1')}>
                  <Mapmodeimg src={activeLayer === 'wmsLayer1' ? aoiicon : clickaoiicon} alt="AOI 아이콘" />
                </LayerBox>
                <LayerBox onClick={() => handleLayerToggle('wmsLayer2')}>
                  <Mapmodeimg src={activeLayer === 'wmsLayer2' ? watericon : clickwatericon} alt="AOI 아이콘" />
                </LayerBox> 
                <LayerBox onClick={() => handleLayerToggle('cadastralvectorLayer')}>
                  <Mapmodeimg src={activeLayer === 'cadastralvectorLayer' ? clickcadastralicon : cadastralicon} alt="AOI 아이콘" />
                </LayerBox> 
                <LayerBox onClick={() => handleLayerToggle('cadastralvectorGridLayer')}>
                  <Mapmodeimg src={activeLayer === 'cadastralvectorGridLayer' ? clickgridicon : gridicon} alt="AOI 아이콘" />
                </LayerBox> 
                <LayerBox onClick={() => handleLayerToggle('clusterLayer')} style={{ borderRadius: "0px 0px 5px 5px" }}>
                  <Mapmodeimg src={activeLayer === 'clusterLayer' ? panoramaicon : clickpanoramaicon} alt="AOI 아이콘" />
                </LayerBox> 
        </Layercontrl>   

        <Measurecontrol>
                <LayerBox style={{ borderRadius: "5px 5px 0px 0px" }}  onClick={onMeasureDistance}>
                  <Mapmodeimg src={measureicon} alt="거리측정아이콘"/>
                </LayerBox>
                <LayerBox  onClick={onMeasureArea}>
                  <Mapmodeimg src={distanceicon} alt="면적측정아이콘"/>
                </LayerBox>
                <LayerBox  onClick={onClearMeasurements}>
                  <Mapmodeimg src={cancellogo} alt="거리/면적 지우기아이콘"/>
                </LayerBox>
                <LayerBox style={{ borderRadius: "0px 0px 5px 5px" }} onClick={onCapture}>
                  <Mapmodeimg src={captureicon} alt="화면 캡쳐아이콘"/>
                </LayerBox>
        </Measurecontrol>
      </>
    );
  };

  export default YongdamMapcontrol;


const Mapmode =styled.div`
  position: absolute;
  z-index:10;
  background-color:white;
  width:3vw;
  height:3vw;
  min-width:40px;
  min-height:40px;
  top: 6.5vh;
  right:20px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:6px;
  /* 1024x720 해상도를 위한 미디어 쿼리 */
  @media screen and (max-width: 1024px) and (max-height: 720px) {
    width:52px;
    height:52px;
  }
`;
const Mapmodeimg =styled.img`
  width:80%;
  height:80%;
`;

const MapPopupStyles = styled.div`
  position: absolute;
  width:168px;
  height:202px;
  top:6.5vh;
  right: 5vw;
  background-color: white;
  z-index: 1001;
  border-radius:6px;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:16px;
`;
  
  const MapBox = styled.div`
  width:100%;
  height:50%;
  display:flex;
`;

const MapItem =styled.div`
  width:50%;
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
`;
const MapImg = styled.img`
  width:3vw;
  height:3vw;
  margin-bottom:6px;
  box-shadow: 0px 0px 3px black;
  border-radius:7px;
`;

const MapTitle = styled.div`
  width:3vw;
  height:16px;
  display:flex;
  justify-content:center;
  font-size:11px;
  text-align : center;
`;


  const Layercontrl = styled.div`
  position: absolute;
    z-index:10;
    width: 3vw;
    height: 250px;
    right:20px;
    top:16vh;
    border-radius:5px;
    color: #c3c3c3;
    @media screen and (max-width: 1024px) and (max-height: 720px) {
      width:52px;
      
    }
  `;

  const LayerBox = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3vw;
    background-color:white;
    color: #c3c3c3;
    @media screen and (max-width: 1024px) and (max-height: 720px) {
     
      height:52px;
    }
   
  `;

  const Measurecontrol = styled.div`
      position: absolute;
      z-index:10;
      width: 3vw;       
      height: 250px;
      right:20px;
      top:48vh;
      border-radius:5px;
      color: #c3c3c3;
      @media screen and (max-width: 1024px) and (max-height: 720px) {
        width:52px;
        
      }
    `;
