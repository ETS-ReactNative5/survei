import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import { QueryParam, API_JOURNEY_BASE_URL, BASE_URL } from "../Util";
import {
	Row,
	Col,
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

class LearningPathCatalog extends Page {
	static LIMIT = 20;

	constructor(props) {
		super(props);
		let params = QueryParam();

		if (!params["time"]) {
			params["time"] = 0;
		}

		this.state = { list: [], params: params, offset: 0, end: false };
	}

	componentDidMount() {
		this.handleLoadData(1);
	}

	componentWillReceiveProps(props) {
		let params = QueryParam();
		this.setState({ params: params });
		this.handleLoadData(1, params);
	}

	handleLoadData = (reset, params) => {
		if (!params) {
			params = this.state.params;
		}

		params["limit"] = LearningPathCatalog.LIMIT;

		if (reset) {
			params["offset"] = 0;
			this.setState({ list: [], offset: params["offset"], end: false });
		} else {
			params["offset"] = this.state.offset;
		}

		this.toggleLoading(1);

		$.get(API_JOURNEY_BASE_URL, params).then(result => {
			if (!params["offset"]) {
				var list = result.payload;
			} else {
				var list = this.state.list;
				list.push(...result.payload);
			}

			if (
				result.payload.length == 0 ||
				result.payload.length < LearningPathCatalog.LIMIT
			) {
				this.setState({ end: true });
			}

			this.setState({
				list: list,
				offset: params["offset"] + LearningPathCatalog.LIMIT
			});
			this.toggleLoading();
		});
	};

	toggleLoading(on) {
		if (on) {
			$(".load-more").show();
		} else {
			$(".load-more").hide();
		}
	}

	handleFilterType = e => {
		let params = this.state.params;
		params["type"] = e.target.value;
		this.setState({ params: params });
		this.handleLoadData(1);
	};

	_loadMoreContent = e => {
		if (!this.state.end) {
			this.handleLoadData();
		}
	};

	render() {
		var list = this.state.list;
		var params = this.state.params;

		return (
			<div>
				<div className="explanation">
					<div className="container pad-l font-white">
						<h4 className="font-white">{trans.learning_path}</h4>
						<span>Pelajari skill khusus secara menyeluruh</span>
					</div>
				</div>
				<div className="description">
					<div className="container pad-l">
						<div className="justify">
							{trans.learning_path} adalah salah satu fitur Skydu Indonesia yang
							memberikan kesempatan bagi Akademia untuk mempelajari sesuatu
							secara lebih menyeluruh dengan konsep Collective Learning.
							Akademia juga akan mendapatkan sertifikasi khusus setelah
							mengikuti {trans.learning_path} ini.
						</div>
					</div>
				</div>
				<div className="">
					<Row className="container pt-m">
						<Col m={4} s={12} className="mb-m">
							<h5 className="mb-m valign-wrapper">
								<Icon className="mr-xs" small>
									tune
								</Icon>
								Filter
							</h5>
							<div className="strong mb-s">Urutkan Berdasarkan</div>
							<Input
								onChange={this.handleFilterType}
								name="type"
								value=""
								type="radio"
								label="Terbaru"
								className="with-gap"
								checked={!this.state.params.type}
							/>
							<br />
							<br />
							<Input
								onChange={this.handleFilterType}
								name="type"
								value="1"
								type="radio"
								label="Terpopuler"
								className="with-gap"
								checked={this.state.params.type == 1}
							/>
						</Col>
						<Col m={8} s={12} className="mb-xl">
							{params.query && (
								<h5 className="mb-m">
									<span className="font-grey">Search Result for : </span>
									{params.query}
								</h5>
							)}
							{!params.query && (
								<h5 className="mb-m">Jelajah {trans.learning_path}</h5>
							)}
							{list.length === 0 && this.state.end && (
								<span>
									{trans.learning_path} {trans.not_found}
								</span>
							)}

							{list.length > 0 &&
								list.map((item, i) => <LearningPathItem data={item} />)}

							<Waypoint onEnter={this._loadMoreContent} />

							{!this.state.end && (
								<div className="center load-more mt-m">
									<Preloader size="medium" />
								</div>
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

class LearningPathItem extends React.Component {
	render() {
		let data = this.props.data;
		let className = this.props.className;
		let listCategoryLength = this.props.data.categories
			? this.props.data.categories.length
			: 0;
		let listCategory =
			listCategoryLength > 0
				? this.props.data.categories.map((category, i) => (
						<span>
							{i == listCategoryLength - 1
								? category.name
								: category.name + ", "}
						</span>
				  ))
				: "";

		return (
			<Link to={`/learning-path/${data.slug}`}>
				<div
					className={className || "bg-white pad-m mb-s section-card hoverable"}
				>
					<Image
						src={data.image_url ? data.image_url : data.thumbnail}
						className="square"
					/>
					<div className="content">
						<div className="right font-grey mb-s hide">
							<Icon>share</Icon>
						</div>
						<h5 className="ellipsis hidden-overflow mh-40">{data.title}</h5>
						<div className="font-grey mb-s valign-wrapper">
							<Icon tiny className="icon-course">
								book_material
							</Icon>{" "}
							{data.course_count} {trans.course_item}
						</div>
						{listCategoryLength > 0 && (
							<div className="mb-s ellipsis hidden-overflow">
								<b>Skills: </b>
								{listCategory}
							</div>
						)}
					</div>
				</div>
			</Link>
		);
	}
}

export default LearningPathCatalog;
export { LearningPathItem };
