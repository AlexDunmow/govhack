import React, {Component} from 'react'
import Chart from './Chart'
import LoadingText from './LoadingText';

import ReactTooltip from 'react-tooltip'

import * as axios from 'axios';

export default class App extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			searchText: '',
			points: [0, 0, 0, 0, 0, 0],
			labels: [
				'Accessibility', 
				'Apocalypse Readiness', 
				'Community',
				'Culture', 
				'Safety', 
				'Services' 
				],
			searching: false,
			searchComplete: false,
			loaderMessage: '', 
			errorMessage: ''
		};
		this.search = this.search.bind(this);
		this.renderChart = this.renderChart.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
	}



	search(event) {
		this.setState({searching: true});
		setTimeout(() => {
			const query = this.state.searchText;
			const partialQuery = `/grade?address=${query}`;
			const fullQuery = `http://localhost:9000/grade?address=${query}`
			axios.get(partialQuery)
				.then((response) => {
					console.log('load complete');
					console.log(response);
					const currentState = this.state;
					const nextState = currentState;
					nextState.points = [
						response.data.accessibility,
						response.data.apocalypse,
						response.data.community,
						response.data.culture,
						response.data.safety,
						response.data.services
					];

					nextState.searchComplete = true;
					nextState.searching = false;
					this.setState(nextState);
				})
				.catch((err) => {
					console.log(`Error: ${err}`);
					this.setState({searching: false});
				});
		},3000)
	}
	handleChange(event) {
		this.setState({searchText: event.target.value});
	}

	handleEnter(event) {
		if (event.key === 'Enter') {
			this.search()
		}
	}

	render() {
		const chart = this.renderChart();
		const loader = this.renderLoader();
		const searching = this.state.searching;
		const searchComplete = this.state.searchComplete;
		let style = {};
		if (searching || searchComplete) {
			style = {
				top: 30,
				transform: 'translate(-50%)'
			}
		}

			
		return <div className="search-container" style={style}>
			<div className="logo" />
			<div className='search-box'>
				<input className='search-input' onChange={this.handleChange} onKeyDown={this.handleEnter}/>
				<button className='search-button' onClick={this.search}>Search</button>
			</div>
			<div style={{padding:20}}>
				<a href="http://policysimulator.com">discover the future with the policy simulator</a>
			</div>
			{loader}
			{chart}
		</div>
	}

	renderLoader() {
		if (this.state.searching) {
			return <div className='search-result'>
				<div className='loader'>
					<LoadingText searching={this.state.searching}/>
				</div>
			</div>
		}
	}

	renderChart() {
		if (this.state.searchComplete && !this.state.searching) {
			return (
				<span>
          <span data-tip data-for='chartxzzz'>
            <Chart points={this.state.points} labels={this.state.labels}/> 
          </span>
          <ReactTooltip id='chartxzzz'>
            <h4>Accessibility</h4>
            <span>Your ability to travel by both public & private transport</span>
            <h4>Apocalypse</h4>
            <span>This rating grades whether your home will survive zombies, climate change or alien invasion</span>
            <h4>Community</h4>
            <span>How happy & vibrant your community is</span>
            <h4>Culture</h4>
            <span>Shops, bars & restaurant availability</span>
            <h4>Safety</h4>
            <span>Crime & health</span>
            <h4>Services</h4>
            <span>Schools, places of worship & goverment facilities</span>
          </ReactTooltip>
        </span>
			)
		}
	}
}