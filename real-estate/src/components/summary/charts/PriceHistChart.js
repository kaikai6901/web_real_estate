import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';


const PriceHistChart = () => {
    const [bins, setBins] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/summary/get_list_prices`)
        .then(res => res.json())
        .then(bins => {
            setBins(bins)
        })
    }, []);

    // const labels = bins.map((bin) => `${bin.range[0].toFixed(2)} - ${bin.range[1].toFixed(2)}`);
    const labels = bins.map((bin, index) => {
        if (index % 3 === 0) {
            return `${bin.range[0]}`
        } else {
            return '';
        }
    })
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Số lượng bài viết',
            data: bins.map((bin) => bin.count),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            // indexAxis: 'triệu / m2'
            // yAxisID: 'yAxis',
            // xAxisID: 'xAxis'
        },
        ],
    };

    const barChartOption = {
        plugins: {
            title: {
                text: 'Biểu đồ phân bố giá',
                display: true,
                padding: 0,
                font: {
                    size: 24,
                    family: 'sans-serif'
                }
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 18,
                        family: 'sans-serif'
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Đơn giá theo m2 (triệu / m2)',
                    font: {
                        size: 18,
                        family: 'sans-serif'
                    },

                },
                ticks: {
                    display: true,
                    major: false
                },
                grid: {
                    display: false,
                    drawTicks: false
                }
            }
        }
    }
    console.log(data)

    return (
    <>
        {
            bins ? (
                <Bar data={data} options={barChartOption}/>
            ) : (
            <p>Loading chart...</p>
            )
        }
    </>
    )
}

export default PriceHistChart