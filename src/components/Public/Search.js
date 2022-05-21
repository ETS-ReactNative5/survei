import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_CATEGORY,
	API_GLOBAL_SEARCH,
	FormatPrice,
	BASE_URL
} from "../Util";
import {
	Button,
	Row,
	Col,
	ProgressBar,
	Input,
	Preloader,
	Icon,
	Modal
} from "react-materialize";
import { EventItem } from "../Event/Catalog";
import { CourseItem } from "../Course/Catalog";
import { LearningPathItem } from "../LearningPath/Catalog";
import { Link } from "react-router-dom";
import { trans } from "../Lang";
import NewCourseCatalog from "../Course/NewCatalog";
import { filter, sort, bottom_sheet } from "../../assets";
import Notifications, { notify } from "react-notify-toast";

class Search extends Page {
	static LIMIT = 20;

	constructor(props) {
		super(props);
		let params = QueryParam();

		this.state = {
			courses: null,
			events: null,
			learningpaths: null,
			params: params
		};
	}

	componentDidMount() {
		$(".btn-help").hide();
		this.handleLoadData();
	}

	componentWillReceiveProps(props) {
		let params = QueryParam();
		this.setState({ params: params });
		this.handleLoadData(params);
	}

	handleLoadData = params => {
		if (!params) {
			params = this.state.params;
		}

		console.log("SEARCH handleLoadData >>> ", params);

		$.get(API_GLOBAL_SEARCH, params).then(result => {
			console.log("RESULT GLOBAL SEARCH >>>", result);
			this.setState({
				courses: result.payload.courses,
				events: result.payload.events,
				learningpaths: result.payload.learning_paths
			});
		});
	};

	activateFilter = () => {
		let { price_min, price_max } = store.get("price_range");
		let { pac_min, pac_max } = store.get("pac_range");
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
			this.setState({ params });
			this.handleLoadData(1);
			$("#scrolling-modal-close").click();
		}
	};

	render() {
		let courses = this.state.courses;
		let events = this.state.events;
		let learningpaths = this.state.learningpaths;
		let params = this.state.params;

		if (courses === null) {
			return super.render();
		}

		if (courses) {
			courses.map((item, i) => {
				console.log("COURSES ITEM >>> ", item);
			});
		}

		if (events) {
			events.map((item, i) => {
				console.log("EVENT ITEM >>> ", item);
			});
		}

		if (learningpaths) {
			learningpaths.map((item, i) => {
				console.log("LEARNING PATH ITEM >>> ", item);
			});
		}

		return (
			<div className="container-small mt-m pad-m">
				{/*<div className="bg-white row mb-0 border-bottom shadowed floating-bottom-bar">
					<Row>
						<Col l={6} m={6} s={6} className="valign-wrapper pad-m buttons-div">
							<img className="font-orange-red" src={filter}/>
							<Modal
								trigger={<span>Filter</span>}
								id="filter-modal"
								bottomSheet={true}
							>
								<div id="scrolling-modal-close" className="modal-close" onClick={ () => $(".reset-range").click() }>
									<i className="fa fa-close"/>
								</div>
								<br/>
								<NewCourseCatalog/>
								<Button className="btn-pa full-width-buttons" onClick={this.activateFilter}>Aktifkan Filter</Button>
							</Modal>
						</Col>
						<Col l={6} m={6} s={6} className="valign-wrapper pad-m buttons-div">
							<img className="font-orange-red" src={sort}/>
							<span>Sortir</span>
						</Col>
					</Row>
				</div>*/}
				<h5 className="mb-m">
					<span className="font-grey">
						{trans.search_result} {trans.for} :{" "}
					</span>
					{params.query}
				</h5>

				<h5>{trans.course_item}</h5>
				{courses.length === 0 && (
					<h5 className="font-grey font-light">
						{trans.course} {trans.not_found}
					</h5>
				)}
				{courses.length > 0 &&
					courses.map((item, i) => <CourseItem data={item} />)}

				{courses.length > 0 && (
					<div className="center mt-m">
						<Link
							className="btn btn-outline wide"
							to={"/course/catalog?" + $.param(params)}
						>
							{trans.see}{" "}
							<span className="hide-on-small-only">{trans.all}</span>{" "}
							{trans.course} "{params.query}"
						</Link>
					</div>
				)}

				<p>&nbsp;</p>

				<h5>Event</h5>
				{events.length === 0 && (
					<h5 className="font-grey font-light">
						{trans.event} {trans.not_found}
					</h5>
				)}

				{/* TODO Problem di sini */}
				{events.length > 0 &&
					events.map((item, i) => <EventItem data={item} />)}

				{events.length > 0 && (
					<div className="center mt-m">
						<Link
							className="btn btn-outline wide"
							to={"/event/catalog?" + $.param(params)}
						>
							{trans.see} {trans.all} {trans.event}
						</Link>
					</div>
				)}

				<p>&nbsp;</p>

				<h5>Learning Path</h5>
				{learningpaths.length === 0 && (
					<h5 className="font-grey font-light">
						{trans.event} {trans.not_found}
					</h5>
				)}

				{learningpaths.length > 0 &&
					learningpaths.map((item, i) => <LearningPathItem data={item} />)}

				{learningpaths.length > 0 && (
					<div className="center mt-m">
						<Link
							className="btn btn-outline wide"
							to={"/learning/catalog?" + $.param(params)}
						>
							{trans.see} {trans.all} {trans.learning_path}
						</Link>
					</div>
				)}

				<p>&nbsp;</p>
			</div>
		);
	}
}

export default Search;
