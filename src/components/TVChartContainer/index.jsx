import React, { useEffect, useRef } from 'react';
import './index.css';
import { widget } from '../../charting_library';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


export const TVChartContainer = () => {
	const chartContainerRef = useRef();
	const chartRef = useRef();

	const defaultProps = {
		symbol: 'AAPL',
		interval: 'D',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: true,
		autosize: true,
		studiesOverrides: {
			"volume.volume.color.0": "#00FFFF",
			"scalesProperties.showSymbolLabels": true,
			"scalesProperties.showStudyPlotLabels": false,
			" scalesProperties.axisHighlightColor": "#FF0000"
		},
		customFormatters: {
			timeFormatter: {
				format: (date) => {
					const _format_str = '%h:%m';
					return _format_str
						.replace('%h', date.getUTCHours(), 2)
						.replace('%m', date.getUTCMinutes(), 2)
						.replace('%s', date.getUTCSeconds(), 2);
				}
			},
			dateFormatter: {
				format: (date) => {
					return date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
				}
			},
			tickMarkFormatter: (date, tickMarkType) => {
				switch (tickMarkType) {
					case 'Year':
						return 'Y' + date.getUTCFullYear();
			
					case 'Month':
						return 'M' + (date.getUTCMonth() + 1);
			
					case 'DayOfMonth':
						return 'D' + date.getUTCDate();
			
					case 'Time':
						return 'T' + date.getUTCHours() + ':' + date.getUTCMinutes();
			
					case 'TimeWithSeconds':
						return 'S' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
				}
			
				throw new Error('unhandled tick mark type ' + tickMarkType);
			},
			priceFormatterFactory: (symbolInfo, minTick) => {
				if (symbolInfo?.fractional || minTick !== 'default' && minTick.split(',')[2] === 'true') {
					return {
						format: (price, signPositive) => {
							// return the appropriate format
						},
					};
				}
				return null; // this is to use default formatter;
			},
			studyFormatterFactory: (format, symbolInfo) => {
				if (format.type === 'price') {
					const numberFormat = new Intl.NumberFormat('en-US', { notation: 'scientific' });
					return {
						format: (value) => numberFormat.format(value)
					};
				}
			
				if (format.type === 'volume') {
					return {
						format: (value) => (value / 1e9).toPrecision(format?.precision || 2) + 'B'
					};
				}
			
				if (format.type === 'percent') {
					return {
						format: (value) => `${value.toPrecision(format?.precision || 4)} percent`
					};
				}
			
				return null; // this is to use default formatter;
			},
			},
		custom_indicators_getter
	};

	function custom_indicators_getter(PineJS) {
		const pinejsStd = PineJS.Std;
		var labelText = ''
		var labelList = [];
		return Promise.resolve([
			{
				name: 'Alphastag',
				metainfo: {
					_metainfoVersion: 51,
	
					id: "Alphastag@tv-basicstudies-1",
					name: "Alphastag",
					description: "Alphastag - Rook Trading Group",
					shortDescription: "Alphastag - Rook Trading Group",
	
					isCustomIndicator: true,
					// isTVScript: true,
					// linkedToSeries: true,
					is_price_study: true,
					// isHidden: true,
	
					format: {
						type: 'price',
						precision: 2,
					},
	
					defaults: {
						inputs: {
							prev_ath: 0,
							number_of_shares: 1,
							sell_target: 0,
							isSell: true,
							excel_data: false
						},
						styles: {
							sales: {
								lineStyle: 0,
								lineWidth: 0,
								plottype: 0,
								visible: true,
								color: '#363A45',
								transparency: 0,
							},
							sold: {
								lineStyle: 0,
								lineWidth: 0,
								plottype: 0,
								visible: true,
								color: '#363A45',
								transparency: 0,
							},
							labels: {
								color: '#F23645',
								textColor: '#FFFFFF',
								plottype: 'shape_label_down',
								visible: true,
								transparency: 0,
								text: 'Sell'
							}
						},
						palettes: {
							palette_bar_color: {
								colors: [
									{ color: '#5D606B' },
									{ color: '#F23645' },
								]
							}
						},
						precision: 2
					},
					inputs: [
						{
							id: 'prev_ath',
							name: 'What was the previous ath?',
							type: 'float',
							defval: 0,
						},
						{
							id: 'number_of_shares',
							name: 'How many coins/shares do you have?',
							type: 'float',
							defval: 1,
						},
						{
							id: 'sell_target',
							name: 'where would sell the remaining?',
							type: 'float',
							defval: 0
						},
						{
							id: 'isSell',
							name: 'Sell',
							type: 'bool',
							defval: false
						},
						{
							id: 'excel_data',
							name: 'Excel data',
							type: 'bool',
							defval: false
						}
					  ],
					plots: [
						{
							id: 'Bar color',
							type: 'bar_colorer',
							palette: 'palette_bar_color',
						},
						// {
						// 	id: 'sales',
						// 	type: 'line',
						// },
						// {
						// 	id: 'sold',
						// 	type: 'line',
						// },
						{
							id: 'labels',
							type: 'shapes',
							text: 'Sell'
						}
					],
					palettes: {
						palette_bar_color: {
							colors: [
								{ name: 'Color 0' },
								{ name: 'Color 1' },
							],
							valToIndex: {
								100: 0,
								200: 1
							}
						},
						palette_0: {
							colors: [
								{ name: 'Color 0' },
								{ name: 'Color 1' },
								{ name: 'Color 2' },
								{ name: 'Color 3' }
							],
	
							// the mapping between the values that
							// are returned by the script and palette colors
							valToIndex: {
								100: 0,
								200: 1
							}
						}
					},
					styles: {
						labels: {
							isHidden: false,
							location: 'Absolute',
							size: 'large',
							text: 'Sell',
							title: 'Labels',
							opacity: '100%'
						}
					}
				},
				constructor: function() {
					var counterph = 0;
					var counterpl = 0;
					var sum = 0;
					var countDot = 0    
					var countSqr = 0
	
					this.init = function(context, input) {
						this._context = context;
						this._input = input;
					}
					this.main = function(context, input) {
						this._context = context;
						this._input = input;
	
						var multi = this._input(0);
						var multi1 = this._input(1);
						var multi2 = this._input(2);
						var a = this._input(3);
						var excelData = this._input(4);
	
						var high = pinejsStd.high(this._context);
						var low = pinejsStd.low(this._context);
						var open = pinejsStd.open(this._context);
						var close = pinejsStd.close(this._context);

						var highSeries = this._context.new_var(pinejsStd.high(this._context));
						var lowSeries = this._context.new_var(pinejsStd.low(this._context));
						var closeSeries = this._context.new_var(pinejsStd.close(this._context));
	
						var src = pinejsStd.ohlc4(this._context);
						var srcSeries = this._context.new_var(src);

						var anchor = 1;
						var bblength = 30;
						var mult = 2.0;
						var tf_mult = 1;
						// BB calculations
						var sma_1 = this._context.new_var(pinejsStd.sma(srcSeries, 30, this._context))
						var ema_1 = this._context.new_var(pinejsStd.ema(srcSeries, bblength, this._context))
						var basis = anchor === 1 ? sma_1 : ema_1

						var dev = this._context.new_var(mult * pinejsStd.stdev(srcSeries, bblength * tf_mult, this._context));
	
						// Squeeze - Expansion calulations, (C) 2019-now Joris Duyck (JD)
						var price = this._context.new_var(srcSeries > basis ? (highSeries - basis) * 2 / dev : (lowSeries - basis) * 2 / dev);
	
						var under2 = this.crossunder(price, 2)

						var under3 = this.crossunder(price, 3)
	
						var conund = price.get(2) - 1 > 2
						var conund1 = price.get(2) - 1 > 1
	
						var b = close < multi + (multi * 0.65);
						var e = under3 && conund;
						var h = under2 && conund1;
	
	
	
						var g = counterph < 1
	
	
						var len = 13
						var src2 = close
						var out = this._context.new_var(pinejsStd.sma(this._context.new_var(src2), len, this._context))
						var cond = this.crossunder(closeSeries, out)

						var candleColor = 100;
	
						if (cond || (under2 && conund1) || (under3 && conund)) {
							candleColor = 200;
						}
	
						var del = (multi1 - sum) <= 0
						// console.log(g)
						if (e && !b && !del) {
							console.log(e, b)

						}
	 
						var q =  e && !b && !del; 
						 var r =  h && !b && !del;
						var labels = NaN
	
	
						 if (q) {
							counterph += 1
							console.log(counterph)
							labels = high;
							if (counterph <= 2 && counterph >= 1.5)
								sum += (multi1 -sum) * 0.25
							if (counterph <= 3 && counterph >= 2.5)
								sum += (multi1 -sum) * 0.3
							if (counterph <= 4 && counterph >= 3.5)
								sum += (multi1 -sum) * 0.4
							if (counterph <= 5 && counterph >= 4.5)
								sum += (multi1 -sum) * 0.5
							if (counterph <= 6 && counterph >= 5.5)
								sum += (multi1 -sum) * 0.6
							if (counterph <= 7 && counterph >= 6.5)
								sum += (multi1 -sum) * 0.7
							if (counterph <= 8 && counterph >= 7.5)
								sum += (multi1 -sum) * 0.8
							if (counterph <= 9 && counterph >= 8.5)
								sum += (multi1 -sum) * 0.9
							if (counterph <= 10 && counterph >= 9.5)
								sum += (multi1 -sum)
						}
	
						if (r) {
							counterpl += 1
							labels = high;
							if (counterpl <= 1 && counterpl >= 0.5)
								sum += multi1 * 0.15 //add after each if condition
							if (counterpl <= 2 && counterpl >= 1.5)
								sum += (multi1 -sum) * 0.20
							if (counterpl <= 3 && counterpl >= 2.5)
								sum += (multi1 -sum) * 0.30
							if (counterpl <= 4 && counterpl >= 3.5)
								sum += (multi1 -sum) * 0.40
							if (counterpl <= 5 && counterpl >= 4.5)
								sum += (multi1 -sum) * 0.50
							if (counterpl <= 6 && counterpl >= 5.5)
								sum += (multi1 -sum) * 0.60
							if (counterpl <= 7 && counterpl >= 6.5)
								sum += (multi1 -sum) * 0.70
							if (counterpl <= 8 && counterpl >= 7.5)
								sum += (multi1 -sum) *0.80
							if (counterpl <= 9 && counterpl >= 8.5)
								sum += (multi1 -sum) * 0.90 //typ o multi1*0.0 ?
							if (counterpl <= 10 && counterpl >= 9.5)
								sum += multi1 -sum
						}
	
						var variable = counterpl === 1 ? 0.15 : counterpl / 10;
						var bong = Math.max(variable, 0);

						var variable1 = counterph === 1 ? 0 : counterph === 2 ? 0.25 : counterph / 10;
						var bong1 = Math.max(variable1, 0);

						var bong2 = Math.max(bong1, bong);
	
    
						if (!b && countDot > 0) {
							countSqr += 1
						}
						
						if ((q || r) && !b) {
							countDot += 1
							countSqr = 0
						}
	
						var w = cond && !b && countSqr == 1
	
						if (w)
							labels = high
							sum += (multi1 - sum[1])  * (bong2 + 0.15)

						var sellall = closeSeries < multi * 0.75 &&  !del && counterph >=1
						if (sellall) {
							labels = high
						}

						var sellall1 = closeSeries < multi2 && !del && counterph >=1
						if (sellall1) {
							labels = high
						}
	
						// var sales = excelData ? 0 - sum : NaN;
						// var sold = excelData ? (0 - sum) * close : NaN;
						labelText = 'see'
						var time = this._context.new_var(pinejsStd.time(this._context, pinejsStd.period(this._context)))
						
	
						return [candleColor, labels]
					}
					this.crossunder = function (series1, series2) {
						for (let i = 1; i < series1.hist?.length; i++) {
						  if (typeof series2 === 'number') {
								return series1.get(i) < series2 && series1.get(i - 1) >= series2
						  }
						  if (series1.get(i) < series2.get(i) && series1.get(i - 1) >= series2.get(i - 1)) {
								return true;
						  }
						}
						return false;
					}
				}
				
			}
		]);
	};
	

	useEffect(() => {
		const widgetOptions = {
			symbol: defaultProps.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
			interval: defaultProps.interval,
			container: chartContainerRef.current,
			library_path: defaultProps.libraryPath,

			locale: getLanguageFromURL() || 'en',
			timeframe: {from: new Date('2021-01-01'), to: new Date()},
			toolbar_bg: '#f4f7f9',
			// disabled_features: ['use_localstorage_for_settings'],
			// enabled_features: ['study_templates'],
			charts_storage_url: defaultProps.chartsStorageUrl,
			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
			client_id: defaultProps.clientId,
			user_id: defaultProps.userId,
			fullscreen: defaultProps.fullscreen,
			autosize: defaultProps.autosize,
			studies_overrides: defaultProps.studiesOverrides,
			custom_formatters: defaultProps.customFormatters,
			custom_indicators_getter
		};

		const tvWidget = new widget(widgetOptions);

		tvWidget.onChartReady(() => {
			tvWidget.chart().createStudy('zlphastag - Rook Trading Group', false, true);
			chartRef.current = tvWidget.activeChart();
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

				button.innerHTML = 'Check API';
			});
			
		});

		return () => {
			tvWidget.remove();
		};
	});

	return (
		<div
			ref={chartContainerRef}
			className={'TVChartContainer'}
		/>
	);
}
