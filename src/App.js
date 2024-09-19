  import { BrowserRouter, Route, Routes } from 'react-router-dom';
  //page import
  import MainPage from './pages/MainPage.js';
  import ComparePage from './pages/ComparePage.js';
  import KrpanoViewer from './pages/KrpanoViewer.js';
  import YongdamPage from './pages/YongdamPage.js';
  import PhotoSphere from './pages/Photospere.js';
  import YeongjuPage from './pages/YeongjuPage.js';
  import HeatmapMap from './components/maps/Hitmap.js';
  import MyComponent from './pages/TestPage.js';
  import CompareDronePage from './pages/CompareDronePage.js';
  import OrthophotoPage from './pages/OrthophotoPage.js';
  import TestCompare from './pages/TestCompare.js';
  
  //bootstrap css
  import 'bootstrap/dist/css/bootstrap.min.css';
import TestArcPage from './pages/TestArcGISpage.js';
import TestSwipe from './pages/TestSwipe.js';
import Testdropzone from './pages/TestDronzone.js';
import DashboardPage from './pages/DashboardPage.js';




  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/YeongjuPage' element={<YeongjuPage/>}/>
          <Route path='/YongdamPage' element={<YongdamPage/>}/>
          <Route path='/compare' element={<ComparePage/>}/>
          <Route path='/comparedrone' element={<CompareDronePage/>}/>
          <Route path='/orthophoto' element={<OrthophotoPage/>}/>
          <Route path='/krpano' element={<KrpanoViewer/>}/>
          <Route path='/hitmap' element={<HeatmapMap/>}/>
          <Route path='/photosphere' element={<PhotoSphere/>}/>
          <Route path='/testpage' element={<MyComponent/>}/>
          
          <Route path='/testcompare' element={<TestCompare/>}/>
          <Route path='/testarcgis' element={<TestArcPage/>}/>
          <Route path='/testswipe' element={<TestSwipe/>}/>
          <Route path='/testdropzone' element={<Testdropzone/>}/>
          <Route path='/dashboard' element={<DashboardPage/>}/>

        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
