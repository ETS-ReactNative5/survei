import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_CATEGORY,
	API_EVENT_BASE_URL,
	FormatPrice,
	FormatDateIndo,
	BASE_URL
} from "../Util";
import {
	Row,
	Col,
	ProgressBar,
	Input,
	Preloader,
	Icon
} from "react-materialize";
import { EventCategories } from "../Consts";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import Waypoint from "react-waypoint";
import EventConstants from "./Constants";
import sortJsonArray from "sort-json-array";

class EventCatalog extends Page {
	static LIMIT = 20;

	constructor(props) {
		super(props);

		let params = {};

		if (!params["time"]) {
			params["time"] = 0;
		}
		this.state = { data: null, params: params, offset: 0, end: false };
	}

	componentDidMount() {
		this.handleLoadData();
	}

	handleFilterTime = e => {
		if (e.target.disabled) {
			return;
		}

		let params = this.state.params;
		let data = this.state.data;

		if (params.time != e.target.value) {
			params.time = e.target.value;
			data.available_courses = [];
			this.setState({ params: params });

			this.handleLoadData(true);
		}
	};

	handleFilterCategory = e => {
		if (e.target.disabled) {
			return;
		}

		let params = this.state.params;
		let data = this.state.data;

		params.category = e.target.value;
		data.available_courses = [];
		this.setState({ params: params });

		this.handleLoadData(true);
	};

	handleFilterLocation = e => {
		if (e.target.disabled) {
			return;
		}

		let params = this.state.params;
		let data = this.state.data;

		params.province = e.target.value;
		data.available_courses = [];
		this.setState({ params: params });

		this.handleLoadData(true);
	};

	handleLoadData = reset => {
		let params = this.state.params;
		params["limit"] = EventCatalog.LIMIT;

		if (reset) {
			params["offset"] = 0;
			this.setState({ offset: params["offset"], end: false });
		} else {
			params["offset"] = this.state.offset;
		}

		this.toggleLoading(1);

		$.get(API_EVENT_BASE_URL, params).then(result => {
			if (!params["offset"]) {
				var data = { name: params["query"], available_courses: result.payload };
			} else {
				var data = this.state.data;
				data.available_courses.push(...result.payload);
			}

			if (
				result.payload.length == 0 ||
				result.payload.length < EventCatalog.LIMIT
			) {
				this.setState({ end: true });
			}

			this.setState({
				data: data,
				offset: params["offset"] + EventCatalog.LIMIT
			});
			this.toggleLoading();
		});
	};

	_loadMoreContent = e => {
		if (!this.state.end) {
			this.handleLoadData();
		}
	};

	toggleLoading(on) {
		$(".load-more").toggle();

		if (on) {
			$("input").attr("disabled", "disabled");
		} else {
			$("input").removeAttr("disabled");
		}
	}

	render() {
		var data = this.state.data;
		var params = this.state.params;
		let eventTimes = EventConstants.getTimes();
		let provinces = store.get("provinces");
		provinces = sortJsonArray(provinces, "name");

		if (!data) {
			return super.render();
		}

		return (
			<div>
				<Row className="container pt-m">
					<Col m={4} s={12} className="mb-m">
						<h5 className="mb-m valign-wrapper">
							<Icon className="mr-xs" small>
								tune
							</Icon>
							Filter
						</h5>

						<div className="strong">Kategori</div>
						<div className="form-bordered mb-m">
							<Input
								onChange={this.handleFilterCategory}
								className="bg-white mr-s"
								id="event_location"
								m={12}
								s={12}
								type="select"
								value={params.category}
								defaultValue="0"
							>
								<option value="0">Semua Kategori</option>
								{EventCategories.map(function(category, i) {
									return <option value={category.id}>{category.name}</option>;
								})}
							</Input>
						</div>

						<div className="strong">Lokasi</div>

						<div className="form-bordered mb-m">
							<Input
								onChange={this.handleFilterLocation}
								className="bg-white mr-s"
								id="event_location"
								m={12}
								s={12}
								type="select"
								value={params.province}
								defaultValue="0"
							>
								<option value="0">Semua Lokasi</option>
								{provinces &&
									provinces.map(function(province, i) {
										return <option value={province.id}>{province.name}</option>;
									})}
							</Input>
						</div>

						<div className="strong mb-s">Waktu</div>
						{Object.keys(eventTimes).map(key => {
							return (
								<div>
									<Input
										onChange={this.handleFilterTime}
										checked={params.time == key}
										name="time"
										value={key}
										type="radio"
										label={eventTimes[key]}
										className="with-gap"
									/>
									<br />
									<br />
								</div>
							);
						})}
						<br />
						<div className="hide">
							<div className="strong mb-s">Harga</div>
							<Input
								name="is_free"
								value="1"
								type="radio"
								label="Event Gratis"
								className="with-gap"
								checked
							/>
							<br />
							<br />
							<Input
								name="is_free"
								value="0"
								type="radio"
								label="Event Berbayar"
								className="with-gap"
							/>
						</div>
					</Col>
					<Col m={8} s={12} className="mb-xl">
						{data.name && (
							<h5 className="mb-m">
								<span className="font-grey">Search Result for : </span>
								{data.name}
							</h5>
						)}
						{!data.name && <h5 className="mb-m">Jelajah Event</h5>}

						{data.available_courses.length === 0 && this.state.end && (
							<div id="empty-state">Event tidak ditemukan</div>
						)}

						{data.available_courses &&
							data.available_courses.map((item, i) => {
								return <EventItem data={item} />;
							})}

						<Waypoint onEnter={this._loadMoreContent} />

						<div className="center load-more mt-m">
							<Preloader size="medium" />
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

class EventItem extends React.Component {
	render() {
		let data = this.props.data;
		let price = EventConstants.getPrice(data);

		console.log("PROPS DATA >>> ", data);
		return (
			<Link to={`/event/${data.slug}`}>
				<div className="section-card hoverable pad-m border-bottom bg-white mb-s">
					<Image src={data.image_url} className="square" />
					<div className="content">
						<h5 className="right font-orange">
							{price ? FormatPrice(price) : "FREE"}
						</h5>
						<h5>{data.title}</h5>
						{data.category && (
							<div className="strong mb-s font-grey">
								{EventConstants.getCategory(data.category)}
							</div>
						)}
						<div className="font-grey">
							{FormatDateIndo(data.held_at, false, true)}
						</div>
						<div className="strong">{data.location}</div>
						{data.enrolled && (
							<span className="font-orange">
								<br />
								<br />
								Sudah terdaftar
							</span>
						)}
					</div>
				</div>
			</Link>
		);
	}
}

export default EventCatalog;
export { EventItem };
