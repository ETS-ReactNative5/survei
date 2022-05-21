import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_CATEGORY,
	API_SEARCH,
	FormatPrice,
	BASE_URL
} from "../Util";
import {
	Button,
	Row,
	Col,
	Modal,
	ProgressBar,
	Input,
	Preloader,
	Icon
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import Waypoint from "react-waypoint";
import { trans } from "../Lang";
import { filter, sort, bottom_sheet } from "../../assets";
import NewCourseCatalog from "./NewCatalog";
import "../../styles/course-catalog.css";
import { pa_green } from "../../assets";
import Beforeunload from "react-beforeunload";

class CourseCatalog extends Page {
	static LIMIT = 20;

	constructor(props) {
		super(props);
		let params = QueryParam();

		if (!params["time"]) {
			params["time"] = 0;
		}

		this.state = { list: [], params: params, offset: 0, end: false };
		this.activateFilter = this.activateFilter.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		let { params } = this.state;
		let prev_params = prevState.params;
		const { search } = this.props.location;
		const prev_search = prevProps.location.search;
		let { price_min, price_max } = params;
		if (price_min !== prev_params["price_min"]) {
			this.handleLoadData(1);
		} else if (prev_search !== search) {
			params.category_id = QueryParam().category_id;
			this.handleLoadData(1, params);
		}
	}

	componentDidMount() {
		let price_range = store.get("price_range");
		let pac_range = store.get("pac_range");
		if (!price_range || !pac_range) {
			this.handleLoadData(1);
			store.set("price_range", { price_min: 0, price_max: 200000 });
			store.set("pac_range", { pac_min: 0, pac_max: 100 });
		} else if (this.state.params) {
			let { params } = this.state;
			let price_range = store.get("price_range");
			let pac_range = store.get("pac_range");
			let { price_min, price_max } = price_range
				? price_range
				: { price_min: 0, price_max: 200000 };
			let { pac_min, pac_max } = pac_range
				? pac_range
				: { pac_min: 0, pac_max: 0 };
			params["price_min"] = price_min;
			params["price_max"] = price_max;
			params["pac_min"] = pac_min;
			params["pac_max"] = pac_max;
			this.setState({ params });
			this.handleLoadData(1, params);
		}
		$(".btn-help").hide();
		$("#filter-button-div").click(function() {
			$("#filter-modal-button").trigger("click");
		});
	}

	/*componentWillReceiveProps(props) {
		console.log('cwrp');
		let params = QueryParam();
		let price_range = store.get("price_range");
		let pac_range = store.get("pac_range");
		let { price_min, price_max } = price_range? price_range: {price_min: 0, price_max: 200000};
		let { pac_min, pac_max } = pac_range? pac_range: {pac_min: 0, pac_max: 0};
		params["price_min"] = price_min;
		params["price_max"] = price_max;
		params["pac_min"] = pac_min;
		params["pac_max"] = pac_max;
		this.setState({params});
		this.handleLoadData(1, params);
	}*/

	handleLoadData = (reset, params) => {
		if (!params) {
			params = this.state.params;
		}
		params["limit"] = CourseCatalog.LIMIT;

		if (reset) {
			params["offset"] = 0;
			this.setState({ list: [], offset: params["offset"], end: false });
		} else {
			params["offset"] = this.state.offset;
		}

		this.toggleLoading(1);
		$.get(API_SEARCH, params).then(result => {
			if (!params["offset"]) {
				var list = result.payload;
			} else {
				var list = this.state.list;
				list.push(...result.payload);
			}

			if (
				result.payload.length == 0 ||
				result.payload.length < CourseCatalog.LIMIT
			) {
				this.setState({ end: true });
			}
			console.log(result.payload);
			this.setState({
				list: list,
				offset: params["offset"] + CourseCatalog.LIMIT
			});
			this.toggleLoading();
		});
	};

	activateFilter = () => {
		const { price_min, price_max } = store.get("price_range");
		const { pac_min, pac_max } = store.get("pac_range");
		const course_category = store.get("course_category");
		if (price_max < price_min) {
			notify.show(
				"Harga maksimal harus lebih besar dari harga minimal",
				"warning"
			);
		} else if (pac_max < pac_min) {
			notify.show("PAC maksimal harus lebih besar dari PAC minimal", "warning");
		} else {
			let { params } = this.state;
			params["price_min"] = price_min;
			params["price_max"] = price_max;
			params["pac_min"] = pac_min;
			params["pac_max"] = pac_max;
			params["category_id"] = course_category;
			this.setState({ params });
			this.handleLoadData(1);
			$("#scrolling-modal-close").click();
		}
	};

	toggleLoading(on) {
		if (on) {
			$(".load-more").show();
		} else {
			$(".load-more").hide();
		}
	}

	// handleFilterType = (e) => {
	// 	let params = this.state.params;
	// 	params["type"] = e.target.value;
	// 	this.setState({params : params});
	// 	this.handleLoadData(1);
	// }

	_loadMoreContent = e => {
		if (!this.state.end) {
			this.handleLoadData();
		}
	};

	/*onResetClick = () => {
		$(".reset-range").click();
		this.handleLoadData(1, {category_id: 0});
	}*/

	render() {
		var list = this.state.list;
		var params = this.state.params;
		const activate_button = (
			<Button
				className="btn-pa full-width-buttons"
				onClick={this.activateFilter}
			>
				Aktifkan Filter
			</Button>
		);

		return (
			<div>
				<Beforeunload
					onBeforeunload={() => {
						store.remove("price_range");
						store.remove("pac_range");
					}}
				/>
				<div className="bg-white row mb-0 border-bottom shadowed floating-bottom-bar">
					<Row>
						<Col
							l={6}
							m={6}
							s={6}
							className="valign-wrapper pad-m buttons-div"
							id="filter-button-div"
						>
							<img className="font-orange-red" src={filter} />
							<span>Filter</span>
						</Col>
						<Col l={6} m={6} s={6} className="valign-wrapper pad-m buttons-div">
							<img className="font-orange-red" src={sort} />
							<span>Sortir</span>
						</Col>
					</Row>
					<Modal
						trigger={
							<span id="filter-modal-button" className="hide">
								Filter
							</span>
						}
						id="filter-modal"
						bottomSheet={true}
					>
						<div id="scrolling-modal-close" className="modal-close">
							<i className="fa fa-close" />
						</div>
						<br />
						<NewCourseCatalog />
						{activate_button}
					</Modal>
				</div>
				<Row className="container pt-m">
					<Col m={4} l={3} id="desktop-filter">
						<div className="left">
							<h5 className="valign-wrapper font-heavy">
								<Icon className="mr-xs" small>
									tune
								</Icon>
								{trans.filter}
							</h5>
						</div>
						<div className="right" onClick={() => $(".reset-range").click()}>
							<span id="reset-filter-desktop">Reset</span>
						</div>
						<NewCourseCatalog />
						{activate_button}
						{/*	  			<div className="strong mb-s">{trans.type}</div>
  				<Input onChange={this.handleFilterType} name='type' value="" type='radio' label={trans.all + " " + trans.course} className='with-gap' checked={!this.state.params.type} />
				<br/ ><br/ >
				<Input onChange={this.handleFilterType} name='type' value="1" type='radio' label={trans.free_course} className='with-gap' checked={this.state.params.type == 1} />
				<br/ ><br/ >
				<Input onChange={this.handleFilterType} name='type' value="2" type='radio' label={trans.paid_course} className='with-gap' checked={this.state.params.type == 2} />*/}
					</Col>
					<Col l={9} m={8} s={12} className="mb-xl" id="courses-placement">
						{params.query && (
							<h5 className="mb-m">
								<span className="font-grey">
									{trans.search_result} {trans.for} :{" "}
								</span>
								{params.query}
							</h5>
						)}
						{!params.query && (
							<h5 className="mb-m font-heavy catalog-title">
								Semua Kelas
							</h5>
						)}
						{list.length === 0 && this.state.end && (
							<span>
								{trans.course} {trans.not_found}
							</span>
						)}

						{list.length > 0 &&
							list.map((item, i) => <CourseItem data={item} />)}

						<Waypoint onEnter={this._loadMoreContent} />

						{!this.state.end && (
							<div className="center load-more mt-m">
								<Preloader size="medium" />
							</div>
						)}
					</Col>
				</Row>
			</div>
		);
	}
}

class CourseItem extends React.Component {
	render() {
		let data = this.props.data;
		let className = this.props.className;

		return (
			<Link to={`/course/${data.slug}`}>
				<div
					className={className || "bg-white pad-m mb-s section-card hoverable"}
				>
					<Image src={data.thumbnail} className="square" />
					<div className="content">
						<h5>{data.title}</h5>
						{/*}<div className="font-grey mb-s">{data.categories && data.categories.map(o => o["name"]).join(", ")}</div>*/}
						<span className="course-card-instructor">{data.instructor}</span>
						{/*data.enrolled && <span className="font-orange"><br/><br/>{trans.enrolled}</span>*/}
						<h5 className="course-card-price font-orange">
							{data.price ? FormatPrice(data.price) : trans.free}
						</h5>
					</div>
				</div>
			</Link>
		);
	}
}

export default CourseCatalog;
export { CourseItem };
