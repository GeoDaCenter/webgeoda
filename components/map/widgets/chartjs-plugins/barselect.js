import Chart from 'chart.js/auto';
import {valueOrDefault} from 'chart.js/helpers';

var defaultOptions = {
	select: {
		enabled: true,
		selectboxBackgroundColor: 'rgba(66,133,244,0.2)',
		selectboxBorderColor: '#48F',
	},
	callbacks: {
		beforeSelect: function (startX, endX) {
			return true;
		},
		afterSelect: function (startX, endX, datasets) {
			
		}
	}
}

function getOption(chart, category, name) {
	if(category in chart.config.options.plugins.barselect && name in chart.config.options.plugins.barselect[category]){
		return chart.config.options.plugins.barselect[category][name];
	}
	return defaultOptions[category][name];
}


function getXScale(chart) {
	return chart.data.datasets.length ? chart.scales[chart.getDatasetMeta(0).xAxisID] : null;
}
function getYScale(chart) {
	return chart.scales[chart.getDatasetMeta(0).yAxisID];
}


function doSelect(chart, startX, endX) {
	// swap start/end if user dragged from right to left
	if (startX > endX) {
		const tmp = startX;
		startX = endX;
		endX = tmp;
	}
	// notify delegate
	var beforeSelectCallback = valueOrDefault(chart.options.plugins.barselect.callbacks ? chart.options.plugins.barselect.callbacks.beforeSelect : undefined, defaultOptions.callbacks.beforeSelect);
	
	if (!beforeSelectCallback) {
		return false;
	}

	var datasets = [];
	// filter dataset
	for (let datasetIndex = 0; datasetIndex < chart.data.datasets.length; datasetIndex++) {
		const sourceDataset = chart.data.datasets[datasetIndex];
		const min = Math.min(Math.max(startX, 0), sourceDataset.data.length);
		const max = Math.min(Math.max(endX, 0), sourceDataset.data.length);
		const selectedDataset = {
			minIndex: min,
			maxIndex: max,
			data: sourceDataset.data.slice(min, max + 1)
		};
		datasets.push(selectedDataset);
	}

	chart.barselect.start = startX;
	chart.barselect.end = endX;

	// chart.update();
	// workaround - add the current datasets to the chart as a property, allowing access via Ref
	chart.barselect.selection = datasets
	const afterSelectCallback = getOption(chart, 'callbacks', 'afterSelect');
	afterSelectCallback(startX, endX, datasets);
}

function drawSelectbox(chart) {

	const borderColor = getOption(chart, 'select', 'selectboxBorderColor');
	const fillColor = getOption(chart, 'select', 'selectboxBackgroundColor');
	const direction = getOption(chart, 'select', 'direction');
	chart.ctx.beginPath();
	let xStart, xSize;
	const xScale = getXScale(chart);
	const yScale = getYScale(chart);
	const yStart = yScale.getPixelForValue(yScale.max);
	const ySize = yScale.getPixelForValue(yScale.min) - yScale.getPixelForValue(yScale.max);

	if(chart.barselect.dragStarted){
		xStart = chart.barselect.dragStartX;
		xSize = chart.barselect.x - chart.barselect.dragStartX;
	} else {
		if(!getOption(chart, 'state', 'display')) return;
		xStart = xScale.getPixelForValue(getOption(chart, 'state', 'xMin'));
		const xMax = xScale.getPixelForValue(getOption(chart, 'state', 'xMax'));
		xSize = xMax - xStart;
	}

	// x y width height
	chart.ctx.rect(xStart, yStart, xSize, ySize);
	chart.ctx.lineWidth = 1;
	chart.ctx.strokeStyle = borderColor;
	chart.ctx.fillStyle = fillColor;
	chart.ctx.fill();
	chart.ctx.fillStyle = '';
	chart.ctx.stroke();
	chart.ctx.closePath();
}

const barselectPlugin = {

	id: 'barselect',

	afterInit: function (chart) {

		if (chart.options.plugins.barselect === undefined) {
			chart.options.plugins.barselect = defaultOptions;
		}

		chart.barselect = {
			enabled: false,
			x: null,
			y: null,
			dragStarted: false,
			dragStartX: null,
			dragEndX: null,
			dragStartY: null,
			dragEndY: null,
			suppressTooltips: false
		};

	},

	afterEvent: function (chart, e) {

		const chartType = chart.config.type;
		if (chartType !== 'bar') return;
		
		// fix for Safari
		const buttons = e.event.native.buttons;
		chart.barselect.enabled = true;

		// handle drag to select
		const selectEnabled = getOption(chart, 'select', 'enabled');

		if (buttons === 1 && !chart.barselect.dragStarted && selectEnabled) {
			chart.barselect.dragStartX = e.event.x;
			chart.barselect.dragStartY = e.event.y;
			chart.barselect.dragStarted = true;
		}

		// handle drag to select
		if (chart.barselect.dragStarted && buttons === 0) {
			chart.barselect.dragStarted = false;

			const xScale = getXScale(chart);
			let startX = xScale.getValueForPixel(chart.barselect.dragStartX);
			let endX = xScale.getValueForPixel(chart.barselect.x);

			doSelect(chart, startX, endX);
		}

		chart.barselect.x = e.event.x;
		chart.barselect.y = e.event.y;

		chart.draw();
	},

	afterDraw: function (chart) {

		if (!chart.barselect.enabled) {
			return;
		}

		drawSelectbox(chart);
		return true;
	},

	beforeTooltipDraw: function (chart) {
		// suppress tooltips on dragging
		return !chart.barselect.dragStarted && !chart.barselect.suppressTooltips;
	},

};

// Chart.plugins.register(barselectPlugin);
export default barselectPlugin;