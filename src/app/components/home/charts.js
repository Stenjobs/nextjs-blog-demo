'use client';
import ReactECharts from 'echarts-for-react';
export default function Charts() {
    // 图表配置
    const chartOption = {
        grid: {
            top: 60,       // 增加顶部空间给图例
            right: 40,     // 增加右侧边距
            bottom: 40,    // 增加底部边距给x轴标签
            left: 40,      // 增加左侧边距给y轴
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            borderWidth: 1,
            padding: [8, 12],
            textStyle: {
                color: '#666'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            axisLine: {
                show: true,  // 显示x轴线
                lineStyle: {
                    color: '#E5E7EB'  // 使用浅灰色
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#666',
                margin: 12    // 增加标签与轴的距离
            },
            boundaryGap: true
        },
        yAxis: {
            type: 'value',
            show: true,    // 显示y轴
            min: -100,
            max: 100,
            splitLine: {   // 添加网格线
                show: true,
                lineStyle: {
                    color: '#E5E7EB',
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#666',
                margin: 12
            }
        },
        legend: {
            data: ['Maximum of focus', 'Min or lack of focus'],
            top: 0,
            left: 0,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        series: [
            {
                name: 'Maximum of focus',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                showSymbol: false,
                hoverAnimation: true,
                data: [30, 60, -20, -40, 30, 60, -20],
                lineStyle: {
                    color: '#FF9999',
                    width: 3
                },
                itemStyle: {
                    color: '#FF9999',
                    borderWidth: 2,
                    borderColor: '#FFF'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255, 153, 153, 0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 153, 153, 0)'
                        }]
                    }
                }
            },
            {
                name: 'Min or lack of focus',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                showSymbol: false,
                hoverAnimation: true,
                data: [-40, -10, 40, 20, -40, -10, 40],
                lineStyle: {
                    color: '#99CCFF',
                    width: 3
                },
                itemStyle: {
                    color: '#99CCFF',
                    borderWidth: 2,
                    borderColor: '#FFF'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(153, 204, 255, 0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(153, 204, 255, 0)'
                        }]
                    }
                }
            }
        ]
    };
    return <div className="animate__animated animate__lightSpeedInLeft mt-6 px-2 h-[600px]">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-semibold">Focusing</h2>
                <p className="text-sm text-gray-500">Productivity analytics</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Range:</span>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 appearance-none pr-8 hover:bg-gray-100 transition-colors cursor-pointer" style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                }}>
                    <option>Last month</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                </select>
            </div>
        </div>

        <div className="w-full h-[500px]">
            <ReactECharts
                opts={{ renderer: 'svg' }}
                option={chartOption}
                style={{
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    </div>
}
