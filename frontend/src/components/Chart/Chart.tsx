import React, {useState} from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

type ChartType = "bar" | "line" | "doughnut" | "radar";

interface ChartComponentProps {
  type: ChartType;
  data: any;
  chartTitle?: string;
  legendPosition?: any;
  className?: string;
  accessor: {primary: string, secondary: string}
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, chartTitle, legendPosition="bottom", accessor, className }) => {

  const dateCount: any = {}
  const legendLabels: any[] = []
  const chartLabels: any[] = []
  const basePrimaryDatum: any = {}

  console.log('formattedPrimaryData => ', data, legendLabels)


  data?.forEach((datum: any)=>{

    const formattedPrimaryData = accessor?.primary?.toLowerCase()?.includes('date') ? datum?.[`${accessor?.primary}`]?.split('T')?.[0] : datum?.[`${accessor?.primary}`]
    const formattedSecondaryData = accessor?.secondary?.toLowerCase()?.includes('date') ? datum?.[`${accessor?.secondary}`]?.split('T')?.[0] : datum?.[`${accessor?.secondary}`]
    
    basePrimaryDatum[formattedPrimaryData] = 0

    if (!legendLabels.includes(formattedSecondaryData)) {
      legendLabels.push(formattedSecondaryData)
    }

    // if (!legendLabels.includes(formattedSecondaryData)) {
    //   legendLabels.push(formattedSecondaryData)
    // }    

    if (type=="doughnut") {
      
      if (!chartLabels.includes(formattedSecondaryData)) {
        chartLabels.push(formattedSecondaryData)
      }

      if (dateCount && Object.keys(dateCount)?.includes(formattedSecondaryData)) {
          dateCount[formattedSecondaryData] = dateCount[formattedSecondaryData] + 1
      } else {
          dateCount[formattedSecondaryData] = 1
      }

    } else {
      
      if (!chartLabels.includes(formattedPrimaryData)) {
        chartLabels.push(formattedPrimaryData)
      }

      if (dateCount && Object.keys(dateCount)?.includes(formattedSecondaryData[formattedPrimaryData])) {
        dateCount[formattedSecondaryData] = {...dateCount[formattedSecondaryData], [formattedPrimaryData]: dateCount[formattedPrimaryData] + 1}
      } else {
        // if () {
          dateCount[formattedSecondaryData] = {...dateCount[formattedSecondaryData], [formattedPrimaryData]: 1}
        // } else {
        //   dateCount[formattedSecondaryData] = {...dateCount[formattedSecondaryData], [formattedPrimaryData]: 0}
        // }
      }

      // if (dateCount && Object.keys(dateCount)?.includes(formattedPrimaryData)) {
      //   dateCount[formattedPrimaryData] = dateCount[formattedPrimaryData] + 1
      // } else {
      //   dateCount[formattedPrimaryData] = 1
      // }
      
      // if (dateCount && Object.keys(dateCount)?.includes(formattedPrimaryData)) {
      //   dateCount[formattedPrimaryData] = dateCount[formattedPrimaryData] + 1
      // } else {
      //   // if () {
      //     dateCount[formattedPrimaryData] = 1
      //   // } else {
      //     // dateCount[formattedSecondaryData][formattedPrimaryData] = 0
      //   // }
      // }

    }

  })

  console.log('dateCount +> ', dateCount, Object?.values(dateCount), legendLabels, basePrimaryDatum)

  const stackedDateCount = Object?.values(dateCount)?.map((datum:any)=>{
    let tempObj: any = {}
    Object?.keys(basePrimaryDatum)?.map((baseDatum)=>{
      if (Object?.keys(datum)?.includes(baseDatum)) {
        console.log('datum[baseDatum] +> ', Object?.keys(datum)?.includes(baseDatum), datum[baseDatum])
        tempObj[baseDatum] = datum[baseDatum]
      } else {
        tempObj[baseDatum] = 0
      }
    })
    return tempObj
  })

  console.log('stackedDateCount +> ', stackedDateCount)

  const chartDatasets = 
  type == "doughnut" 
  ?
  [{
    label: 'Count',
    data: Object.values(dateCount),
    backgroundColor: [
        "#f87171",
        "#60a5fa",
        "#facc15",
        "#34d399",
    ],
    borderWidth: 1,
  }]
  : type == "line" ?
  stackedDateCount?.map((stack, index)=> {
    return {
    label: legendLabels[index],
    data: Object.values(stack),
    fill: false,
    borderColor: index==0 ? '#f87171' : index==1 ? "#60a5fa" : index==2 ? "#facc15" : "#34d399",
    tension: 0.1,
    // backgroundColor: [
    //     index==0 && "#f87171",
    //     index==1 && "#60a5fa",
    //     
    //     // index==3 && "#34d399",
    // ],
    borderWidth: 1,
  }})
  : stackedDateCount?.map((stack, index)=> {
    return {
      label: legendLabels[index],
      data: Object.values(stack),
      fill: true,
      // 'rgba(255, 99, 132, 0.2)',
      backgroundColor: index==0 ? '#f87171' : index==1 ? "#60a5fa" : index==2 ? "#facc15" : "#34d399",
      borderColor: index==0 ? '#f87171' : index==1 ? "#60a5fa" : index==2 ? "#facc15" : "#34d399",
      pointBackgroundColor: index==0 ? '#f87171' : index==1 ? "#60a5fa" : index==2 ? "#facc15" : "#34d399",
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: index==0 ? '#f87171' : index==1 ? "#60a5fa" : index==2 ? "#facc15" : "#34d399",
    }})
  
  const chartData = {labels: chartLabels , datasets: chartDatasets}

  console.log('chart => ', chartData, chartDatasets)

  let maxCount = 0;
  Object?.values(stackedDateCount)?.map((datum)=>{
    Object?.values(datum)?.map((value)=>{
      if (maxCount < Number(value)) {
        maxCount = Number(value)
      }
    })
  })

  const chartOptions: ChartOptions<any> = type=="radar" ?
  {
    scales: {
      r: {
        beginAtZero: true,
        max: maxCount
      }
    }
  }
  :
  {
      responsive: true,
      plugins: {
          legend: {
              position: `${String(legendPosition)}` as const,
          },
          title: {
              display: true,
              text: `${String(chartTitle)}`,
          },
      },
  };

  const chartMap = {
    bar: <Bar data={chartData} options={chartOptions} />,
    line: <Line data={chartData} options={chartOptions} />,
    doughnut: <Doughnut data={chartData} options={chartOptions} />,
    radar: <Radar data={chartData} options={chartOptions} />,
  };

  return (
    <div className={`p-4 bg-white dark:bg-gray-900 rounded-lg shadow ${className}`}>
      {chartMap[type]}
    </div>
  );
};

export default ChartComponent;