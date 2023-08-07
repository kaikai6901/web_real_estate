import React, { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js'
import 'chart.js/auto';
import { Bar, getElementsAtEvent } from 'react-chartjs-2';
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

function DistrictBarChart(props) {

    const [chartData, setChartData] = useState(null)

    const chartRef = useRef();
    const handleClick = (event) => {
        if(getElementsAtEvent(chartRef.current, event).length > 0) {
            const datasetIndexNum = getElementsAtEvent(chartRef.current, event)[0].datasetIndex
            const dataPoint = getElementsAtEvent(chartRef.current, event)[0].index
            console.log(chartData.labels[dataPoint])
            // Enable modal here
            props.setOpen(chartData.labels[dataPoint])
        }
    }
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/summary/price_by_district`)
        .then(res => res.json())
        .then(districts => processChartData(districts))
        .then(data => setChartData(data))
    }, [])

    const processChartData = (districts) => {
        if (!districts) {
            return {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                    }
                ]
            };
        }

        const sortedData = districts.sort((a, b) => b.average_price_per_m2 - a.average_price_per_m2);
        
        const top10Districts = sortedData.slice(0, 10);

        const topFilteredDistricts = top10Districts.filter(item => item.count > 50)
        const districtNames = topFilteredDistricts.map((district) => district._id);
        const averagePrices = topFilteredDistricts.map(
          (district) => district.average_price_per_m2
        );
        
        const data = {
            labels: districtNames,
            datasets: [
                {
                    label: 'Đơn giá theo m2',
                    data: averagePrices,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                },
            ],
        };

        return data
        
    }

    const options = {
        plugins: {
            title: {
                text: 'Biểu đồ giá trung bình giữa các quận',
                display: true,
                padding: 0,
                font: {
                    size: 24,
                    family: 'sans-serif'
                },
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 18,
                        family: 'sans-serif'
                    }
                },
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Quận/Huyện',
                    font: {
                        size: 18,
                        family: 'sans-serif'
                    },


                },
                // ticks: {
                //     display: true,
                //     major: false
                // },
                // grid: {
                //     display: false,
                //     drawTicks: false
                // }
                // y: {
                //     title: {
                //         display: true,
                //         text: 'triệu / m2',
                //         font: {
                //             size: 18,
                //             family: 'sans-serif'
                //         },
                //         position: 'top'
    
                //     }
                // }
            }
        }
    };

    return (
       <>
            {
                chartData ? (
                    <Bar data={chartData} options={options} ref={chartRef} onClick={handleClick}/>
                ) : (
                <p>Loading chart...</p>
            )}
       </>
    )
};

export default DistrictBarChart;