import React, { useState } from 'react';
import YongdamMap from '../components/maps/YongdamMap_copy';
import ReactApexChart from 'react-apexcharts';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';


const DashboardPage = () => {
    // Column widths
    const [widthA, setWidthA] = useState(15);
    const [widthB, setWidthB] = useState(20);
    const [widthC, setWidthC] = useState(50);
    const [widthD, setWidthD] = useState(15);

    // Row heights for columns with rows
    const [heightB1, setHeightB1] = useState(33); // For Column B Row 1
    const [heightB2, setHeightB2] = useState(33); // For Column B Row 2
    const [heightC1, setHeightC1] = useState(65); // For Column C Row 1

    const [isDragging, setIsDragging] = useState({ horizontal: false, vertical: null });

    const handleMouseMove = (e) => {
        if (isDragging.horizontal) {
            const { column } = isDragging;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (column === 'A') setWidthA(newWidth);
            if (column === 'B') setWidthB(newWidth);
            if (column === 'C') setWidthC(newWidth);
            if (column === 'D') setWidthD(newWidth);
        } else if (isDragging.vertical) {
            const newHeight = (e.clientY / window.innerHeight) * 100;
            if (isDragging.vertical === 'B1') setHeightB1(newHeight);
            if (isDragging.vertical === 'B2') setHeightB2(newHeight);
            if (isDragging.vertical === 'C1') setHeightC1(newHeight);
        }
    };

    const handleMouseUp = () => setIsDragging({ horizontal: false, vertical: null });
    const handleMouseDownHorizontal = (column) => setIsDragging({ horizontal: true, column });
    const handleMouseDownVertical = (row) => setIsDragging({ horizontal: false, vertical: row });



    ///////////////
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

    const [series, setSeries] = useState([
        {
            name: '강수량 (mm)',
            data: [1036, 1493, 1190, 2133, 1401, 987]
        },
        {
            name: '유입량 (백만m³)',
            data: [394, 765, 540, 1530, 641, 379]
        }
    ]);

    const seriesA = {
        data: [2, 3, 1, 4, 5],
        label: 'Chicken',
      };
      const seriesB = {
        data: [3, 1, 4, 2, 1],
        label: 'Cow',
      };
      const seriesC = {
        data: [3, 2, 4, 5, 1],
        label: 'Pig',
      };

      const MUI_X_PRODUCTS = [
        {
          id: 'grid',
          label: 'Data Grid',
          children: [
            { id: 'grid-community', label: '@mui/x-data-grid' },
            { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
            { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
          ],
        },
        {
          id: 'pickers',
          label: 'Date and Time Pickers',
          children: [
            { id: 'pickers-community', label: '@mui/x-date-pickers' },
            { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
          ],
        },
        {
          id: 'charts',
          label: 'Charts',
          children: [{ id: 'charts-community', label: '@mui/x-charts' }],
        },
        {
          id: 'tree-view',
          label: 'Tree View',
          children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
        },
      ];

    return (
        <div
            style={{ display: 'flex', width: '100%', height: '100vh', color:'white' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Column 1 */}
            <div style={{ width: `${widthA}%`, backgroundColor: '#1C1F23' }}>
                <div style={{ height: '100%' }}><Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView style={{color:"white"}} items={MUI_X_PRODUCTS} />
    </Box></div>
            </div>

            {/* Horizontal resizer between Column 1 and Column 2 */}
            <div
                style={{
                    width: '3px',
                    cursor: 'ew-resize',
                    backgroundColor: 'grey',
                }}
                onMouseDown={() => handleMouseDownHorizontal('A')}
            ></div>

            {/* Column 2 (with 3 rows) */}
            <div style={{ width: `${widthB}%`, display: 'flex', flexDirection: 'column', backgroundColor: '#1C1F23' }}>
                {/* Row 1 */}
                <div style={{ height: `${heightB1}%`, backgroundColor: '#1C1F23' }}>
                    Section B1
                </div>
                {/* Vertical resizer between Row 1 and Row 2 */}
                <div
                    style={{
                        height: '5px',
                        cursor: 'ns-resize',
                        backgroundColor: 'grey',
                    }}
                    onMouseDown={() => handleMouseDownVertical('B1')}
                ></div>
                {/* Row 2 */}
                <div style={{ height: `${heightB2}%`, backgroundColor: '#1C1F23' }}>
                <BarChart style ={{color:'white'}}
      width={320}
      height={250}
      series={[
        { ...seriesA, stack: 'total' },
        { ...seriesB, stack: 'total' },
        { ...seriesC, stack: 'total' },
      ]}
    />
                </div>
                {/* Vertical resizer between Row 2 and Row 3 */}
                <div
                    style={{
                        height: '5px',
                        cursor: 'ns-resize',
                        backgroundColor: 'grey',
                    }}
                    onMouseDown={() => handleMouseDownVertical('B2')}
                ></div>
                {/* Row 3 */}
                <div style={{ height: `${100 - heightB1 - heightB2}%`, backgroundColor: '#1C1F23' }}>
                    Section B3
                </div>
            </div>

            {/* Horizontal resizer between Column 2 and Column 3 */}
            <div
                style={{
                    width: '5px',
                    cursor: 'ew-resize',
                    backgroundColor: 'grey',
                }}
                onMouseDown={() => handleMouseDownHorizontal('B')}
            ></div>

            {/* Column 3 (with 2 rows) */}
            <div style={{ width: `${widthC}%`, display: 'flex', flexDirection: 'column', backgroundColor: '#1C1F23' }}>
                {/* Row 1 */}
                <div style={{ height: `${heightC1}%`, backgroundColor: '#1C1F23' }}>
                    <YongdamMap />
                </div>
                {/* Vertical resizer between Row 1 and Row 2 */}
                <div
                    style={{
                        height: '5px',
                        cursor: 'ns-resize',
                        backgroundColor: 'grey',
                    }}
                    onMouseDown={() => handleMouseDownVertical('C1')}
                ></div>
                {/* Row 2 */}
                <div style={{ height: `${100 - heightC1}%`, backgroundColor: '#1C1F23', paddingTop: "20px"}}>
                    <div id="chart">
                        <ReactApexChart options={options} series={series} type="area" height={250} />
                    </div>
                    <div id="html-dist"></div>
                </div>
            </div>

            {/* Horizontal resizer between Column 3 and Column 4 */}
            <div
                style={{
                    width: '5px',
                    cursor: 'ew-resize',
                    backgroundColor: 'grey',
                }}
                onMouseDown={() => handleMouseDownHorizontal('C')}
            ></div>

            {/* Column 4 (with 2 rows) */}
            <div style={{ width: `${widthD}%`, display: 'flex', flexDirection: 'column', backgroundColor: '#1C1F23' }}>
                {/* Row 1 */}
                <div style={{ height: '50%', backgroundColor: '#1C1F23' }}>Section D1</div>
                {/* Vertical resizer between Row 1 and Row 2 */}
                <div
                    style={{
                        height: '5px',
                        cursor: 'ns-resize',
                        backgroundColor: 'grey',
                    }}
                    onMouseDown={() => handleMouseDownVertical('D1')}
                ></div>
                {/* Row 2 */}
                <div style={{ height: '50%', backgroundColor: '#1C1F23' }}>Section D2</div>
            </div>
        </div>
    );
};

export default DashboardPage;
