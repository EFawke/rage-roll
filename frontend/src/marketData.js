import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarChart } from '@fortawesome/free-solid-svg-icons'
import { faLineChart } from '@fortawesome/free-solid-svg-icons'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { Line } from 'react-chartjs-2';


class PageBody extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            marketData: this.props.marketData,
            selectedMarketGraph: "prices",
            hub: "jita",
        }
    }

    componentDidMount() {
        this.setState({ selectedMarketGraph: "prices" })
    }

    render() {
        const lastSevenDaysPrices = this.props.priceLstSvn
        const jitaSellPrices = [];
        const jitaBuyPrices = [];
        const jitaManufacturingCosts = [];
        const amarrSellPrices = [];
        const amarrBuyPrices = [];
        const amarrManufacturingCosts = [];
        const lastSevenDaysQuantities = this.props.qtyLstSvn
        const jitaSellQuantities = [];
        const jitaBuyQuantities = [];
        const amarrSellQuantities = [];
        const amarrBuyQuantities = [];
        let lineBuy;
        let lineSell;
        let lineManufacture;
        let lineLabel;
        let barBuy;
        let barSell;

        //loop through the last 7 days
        const lastSevenDays = this.props.lstSvnDays

        for(let i = 0; i < lastSevenDays.length; i++) {
            if(!lastSevenDaysPrices[lastSevenDays[i]]) {
                console.log("no data for " + lastSevenDays[i]);
            }  else {
                console.log("data for " + lastSevenDays[i]);
            }
        }

        for(let i = 0; i < Object.keys(lastSevenDaysPrices).length; i++) {
            const vals = Object.values(lastSevenDaysPrices)[i]
            jitaSellPrices.push(vals.sell)
            jitaBuyPrices.push(vals.buy)
            jitaManufacturingCosts.push(vals.manufacture_cost_jita)
            amarrSellPrices.push(vals.amarr_sell)
            amarrBuyPrices.push(vals.amarr_buy)
            amarrManufacturingCosts.push(vals.manufacture_cost_amarr)
        }
        for(let i = 0; i < Object.keys(lastSevenDaysQuantities).length; i++) {
            const vals = Object.values(lastSevenDaysQuantities)[i]
            jitaSellQuantities.push(vals.sell)
            jitaBuyQuantities.push(vals.buy)
            amarrSellQuantities.push(vals.amarr_sell)
            amarrBuyQuantities.push(vals.amarr_buy)
        }
        if (this.state.hub === "jita") {
            lineLabel = "Jita"
            lineBuy = jitaBuyPrices;
            lineSell = jitaSellPrices;
            lineManufacture = jitaManufacturingCosts;
        } else {
            lineLabel = "Amarr"
            lineBuy = amarrBuyPrices;
            lineSell = amarrSellPrices;
            lineManufacture = amarrManufacturingCosts;
        }
        if (this.state.hub === "jita") {
            barBuy = jitaBuyQuantities;
            barSell = jitaSellQuantities;
        } else {
            barBuy = amarrBuyQuantities;
            barSell = amarrSellQuantities;
        }
        const priceData = {
            labels: this.props.lstSvnDays,
            datasets: [
                {
                    label: `${lineLabel} Sell`,
                    data: lineSell,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: `${lineLabel} Buy`,
                    data: lineBuy,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: `${lineLabel} Materials Cost`,
                    data: lineManufacture,
                    borderColor: 'rgb(230,230,250)',
                    backgroundColor: 'rgb(230,230,250)',
                },
            ],
        };
        const quantityData = {
            labels: this.props.lstSvnDays,
            datasets: [
                {
                    label: `${lineLabel} Sell Orders`,
                    data: barSell,
                    backgroundColor: 'RGB(179, 86, 78, 0.2)',
                    borderColor: '#ffffff36',
                    borderWidth: 1,
                },
                {
                    label: `${lineLabel} Buy Orders`,
                    data: barBuy,
                    backgroundColor: 'RGB(0, 128, 0, 0.2)',
                    borderColor: '#ffffff36',
                    borderWidth: 1,
                },
            ],
        }
        const quantityOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                },
                title: {
                    display: true,
                    text: `Buy and sell order volumes for ${this.props.name}`,
                    color: '#ffffffbd',
                    font: {
                        size: 12,
                    }
                },
            },
            animation: {
                duration: 0,
            }
        }
        const priceOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Price Data',
                    color: '#ffffffbd',
                    font: {
                        size: 12,
                    }
                },
            },
            animation: {
                duration: 0,
            }
        };

        ChartJS.register(
            ArcElement,
            CategoryScale,
            LinearScale,
            BarElement,
            Title,
            Tooltip,
            Legend,
            PointElement,
            LineElement,
        );

        if (this.state.selectedMarketGraph === "prices") {
            return (
                <div className="page_body">
                    <h1 className={this.props.mode + " product_name"}>Market Data</h1>
                    <div className="bottom_half_container">
                        <div className={this.props.mode + " the_data ui_box"}>
                            <Line data={priceData} options={priceOptions} />
                        </div>
                        <div className={this.props.mode + " graph_selector"}>
                            <button className="graph_button" onClick={() => this.setState({ selectedMarketGraph: "prices" })}>
                                <FontAwesomeIcon className="icon_svg" icon={faLineChart} size="lg" />
                                <p className="hide_before_hover">Price Data</p>
                            </button>
                            <button className="graph_button" onClick={() => this.setState({ selectedMarketGraph: "quantities" })}>
                                <FontAwesomeIcon className="icon_svg" icon={faBarChart} size="lg" />
                                <p className="hide_before_hover">Market Volume</p>
                            </button>
                            <button className="graph_button" onClick={() => {
                                //if this.state.hub is jita change to amarr and vice versa
                                if (this.state.hub === "jita") {
                                    this.setState({ hub: "amarr" })
                                } else {
                                    this.setState({ hub: "jita" })
                                }
                            }}>
                                <FontAwesomeIcon className="icon_svg" icon={faToggleOn} size="lg" />
                                <p className="hide_before_hover">Trade Hub</p>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.selectedMarketGraph === "quantities") {
            return (
                <div className="page_body">
                    <h1 className={this.props.mode + " product_name"}>Market Data</h1>
                    <div className="bottom_half_container">
                        <div className={this.props.mode + " the_data ui_box"}>
                            <Bar data={quantityData} options={quantityOptions} />
                        </div>
                        <div className={this.props.mode + " graph_selector"}>
                            <button className="graph_button" onClick={() => this.setState({ selectedMarketGraph: "prices" })}>
                                <FontAwesomeIcon className="icon_svg" icon={faLineChart} size="lg" />
                                <p className="hide_before_hover">Price Data</p>
                            </button>
                            <button className="graph_button" onClick={() => this.setState({ selectedMarketGraph: "quantities" })}>
                                <FontAwesomeIcon className="icon_svg" icon={faBarChart} size="lg" />
                                <p className="hide_before_hover">Market Volume</p>
                            </button>
                            <button className="graph_button" onClick={() => {
                                //if this.state.hub is jita change to amarr and vice versa
                                if (this.state.hub === "jita") {
                                    this.setState({ hub: "amarr" })
                                } else {
                                    this.setState({ hub: "jita" })
                                }
                            }}>
                                <FontAwesomeIcon className="icon_svg" icon={faToggleOn} size="lg" />
                                <p className="hide_before_hover">Trade Hub</p>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default PageBody;