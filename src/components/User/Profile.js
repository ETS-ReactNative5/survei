import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_PROFILE_BASE_URL,
	FormatPrice,
	CheckAuth,
	FormatDateIndo,
	BASE_URL
} from "../Util";
import {
	Row,
	Col,
	ProgressBar,
	Input,
	Tabs,
	Tab,
	Icon,
	Modal,
	Button,
	Preloader
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import ReactTooltip from "simple-react-tooltip";
import { trans } from "../Lang";
import { pa_green } from "../../assets";

const TabNames = {
	"0": trans.course + " Saya",
	"2": trans.course + " Favorit",
	"3": trans.learning_path + " Favorit",
	"4": "Tiket Saya",
	"5": "Kupon Saya"
};

class Profile extends Page {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			enrolled_courses: null,
			completed_courses: null,
			favourite_courses: null,
			events_ticket: null,
			coupons: null,
			favourite_learning_path: null
		};
		this.onTabChange = this.onTabChange.bind(this);
	}

	componentDidMount() {
		this.handleLoadData();
	}

	onTabChange = tabNumber => {
		console.log(tabNumber);
	};

	handleLoadData = e => {
		$.getJSON(API_PROFILE_BASE_URL).then(data => {
			this.setState({ data: data.payload });
			
			let promoKey = "promo_seen_" + data.payload.uuid;
			let isPromoSeen = store.get(promoKey);

			if (data.payload.voucher_deposit > 0 && !isPromoSeen) {
				// $("#promo-btn").trigger("click");
				store.set(promoKey, true);
			}
		});

		$.getJSON(API_PROFILE_BASE_URL + "/courses/enrollment").then(data => {
			this.setState({ enrolled_courses: data.payload });
		});

		$.getJSON(API_PROFILE_BASE_URL + "/courses/completed").then(data => {
			this.setState({ completed_courses: data.payload });
		});

		$.getJSON(API_PROFILE_BASE_URL + "/events/ticket").then(data => {
			this.setState({ events_ticket: data.payload }, () => {
				console.log("EVENT TICKET >>> ", this.state.events_ticket);
			});
		});

		$.getJSON(API_PROFILE_BASE_URL + "/coupons/list").then(data => {
			this.setState({ coupons: data.payload });
		});

		$.getJSON(API_PROFILE_BASE_URL + "/learningpaths/followed").then(data => {
			this.setState({ favourite_learning_path: data.payload });
		});
	};

	render() {
		var data = this.state.data;
		if (!data) {
			return super.render();
		}

		let learningPathFavorite = this.state.favourite_learning_path;

		data.enrolled_courses = this.state.enrolled_courses;
		data.favourite_courses = this.state.favourite_courses;
		data.completed_courses = this.state.completed_courses;
		data.events_ticket = this.state.events_ticket;
		data.coupons = this.state.coupons;

		console.log(data);
		return (
			<div>
				<div className="bg-academia font-white">
					<div className="container pad-m pad-l">
						<Row className="mb-0">
							<Col>
								<img src={CheckAuth().foto} className="small circle mr-s" />
							</Col>
							<Col l={6} s={6}>
								<div className="profile-info">
									<h5 className="font-white">{data.name}</h5>
									<div className="left">{data.email}</div>
								</div>
							</Col>
						</Row>
					</div>
				</div>

				<div className="bg-white">
					<Tabs className="no-shadow container" onChange={this.onTabChange}>
						<Tab title={`${trans.course} Saya`}>
							<TabContent
								items={data.enrolled_courses}
								type="course"
								emptyImage="img/profile-course-empty.png"
								emptyText="Meja Belajar Anda masih kosong"
							/>
						</Tab>

						<Tab className="hide" title={trans.course + " Favorit"}>
							<TabContent
								items={data.favourite_courses}
								type="course"
								emptyImage="img/profile-favorite-empty.png"
								emptyText={`Belum ada ${trans.course} yang Anda simpan`}
							/>
						</Tab>

						<Tab title={trans.learning_path + " Favorit"}>
							<TabContent
								items={learningPathFavorite}
								type="learning_path"
								emptyImage="img/profile-favorite-empty.png"
								emptyText={`Belum ada ${trans.learning_path} yang Anda ikuti`}
							/>
						</Tab>

						<Tab title={`${trans.course} Lulus`}>
							<TabContent
								items={data.completed_courses}
								type="completed_course"
								emptyImage="img/img_sertifikat.png"
								emptyText={`Belum ada ${trans.learning_path} yang lulus`}
							/>
						</Tab>

						<Tab title="Tiket Saya">
							<TabContent
								items={data.events_ticket}
								type="events_ticket"
								emptyImage="img/img_ticket_empty.png"
								emptyText="Belum ada tiket event yang dipesan"
							/>
						</Tab>
					</Tabs>
				</div>
				<Modal
					trigger={
						<Button id="promo-btn" className="hide">
							SUBMIT
						</Button>
					}
				>
					<div className="center almost-full">
						<img className="mb-s" src={BASE_URL + "/img/ic_prize.png"} />
						<h4 className="font-light">Selamat!</h4>

						<div className="mb-m">
							Anda mendapatkan poin belajar senilai Rp 300.000 untuk mendaftar
							di course Skydu Indonesia #OktoberBahagia
						</div>
						<a className="btn modal-close capitalize btn-outline">Oke</a>
					</div>
				</Modal>
			</div>
		);
	}
}

class TabContent extends React.Component {
	render() {
		let items = this.props.items;
		let type = this.props.type;
		let emptyImage = this.props.emptyImage;
		let emptyText = this.props.emptyText;

		return (
			<div className="bg-grey ptb-s">
				<div className="container">
					<Row>
						{items &&
							items.map((item, i) => {
								switch (type) {
									case "course":
										return <CourseItem data={item} />;
									case "completed_course":
										return <CompletedCourseItem data={item} />;
									case "learning_path":
										return <LearningPathItem data={item} />;
									case "events_ticket":
										return <EventTicketItem data={item} />;
									case "coupon":
										return <CouponItem data={item} />;
								}
							})}
					</Row>

					{items == null && (
						<center>
							<Preloader className="mtb-m" size="medium" />
						</center>
					)}

					{items && items.length == 0 && (
						<div className="pad-xl center">
							<img src={emptyImage} />
							<div className="strong font-grey mt-s">{emptyText}</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

class CompletedCourseItem extends React.Component {
	render() {
		let data = this.props.data;

		return (
			<Col l={6} s={12}>
				<Link to={`/course/${data.slug}/recap`}>
					<div className="hoverable pad-m border-bottom bg-white mg-s">
						<h5 className="right font-orange">
							<span className="font-grey">Nilai : </span> {data.final_grade}%
						</h5>
						<div className="content">
							<h5 style={{ height: "40px" }}>{data.title}</h5>
							{trans.by} : {data.instructor}
						</div>
					</div>
				</Link>
			</Col>
		);
	}
}

class CourseItem extends React.Component {
	render() {
		let data = this.props.data;

		return (
			<Col l={6} s={12}>
				<Link to={`/course/${data.slug}`}>
					<div className="hoverable pad-m section-card border-bottom bg-white mg-s">
						<Image src={data.thumbnail} className="square" />
						<div className="content">
							<h5>{data.title}</h5>
							Oleh : {data.instructor}
						</div>
					</div>
				</Link>
			</Col>
		);
	}
}

class EventTicketItem extends React.Component {
	render() {
		let data = this.props.data;

		return (
			<Col l={6} s={12}>
				<Link to={`/event/${data.uuid}/ticket`}>
					<div className="hoverable pad-m section-card border-bottom bg-white mg-s">
						<Image src={data.image_url} className="square" />
						<div className="content">
							<h5>{data.title}</h5>
							<div className="mb-s valign-wrapper">
								<Icon className="left" tiny>
									event
								</Icon>{" "}
								{FormatDateIndo(data.held_at, false, true)}{" "}
							</div>
							<div className="strong">
								Dibeli pada {FormatDateIndo(data.purchased_at)}
								<br />
								Booking Code : {data.booking_code}{" "}
							</div>
						</div>
					</div>
				</Link>
			</Col>
		);
	}
}

class CouponItem extends React.Component {
	render() {
		let data = this.props.data;
		let quota = data.quota ? data.quota - data.used_count : null;

		return (
			<Col l={6} s={12}>
				<Link to={`/coupon/${data.uuid}`}>
					<div className="hoverable pad-m section-card border-bottom bg-white mg-s">
						<Image src={data.course_image} className="square" />
						<div className="content">
							<div className="font-tiny font-grey strong valign-wrapper mb-xs">
								<Icon tiny>card_giftcard</Icon>
								<span>
									&nbsp;Kupon
									{data.qty > 0 && <span> x {data.qty}</span>}
								</span>
							</div>
							<h5 className="h-20 hidden-overflow">{data.course_title}</h5>
							<div>{data.course_instructor || "Ust Yusuf Mansyur"}</div>
							<div className="mt-xs right-align">
								Sisa Kuota Kupon :&nbsp;
								<span className="font-orange strong">
									{data.quota - data.used_count}
								</span>
							</div>
						</div>
					</div>
				</Link>
			</Col>
		);
	}
}

class LearningPathItem extends React.Component {
	render() {
		let data = this.props.data;
		let className = this.props.className;
		let listCategoryLength = this.props.data.categories.length;
		let listCategory = this.props.data.categories.map((category, i) => (
			<span>
				{i == listCategoryLength - 1 ? category.name : category.name + ", "}
			</span>
		));

		return (
			<Col l={6} s={12}>
				<Link to={`/learning-path/${data.slug}`}>
					<div
						className={
							className ||
							"bg-white mg-s pad-m mb-s section-card hoverable valign-wrapper"
						}
					>
						<Image src={data.thumbnail} className="square" />
						<div className="content">
							<div className="right font-grey mb-s hide">
								<Icon>share</Icon>
							</div>
							<h5
								className="ellipsis hidden-overflow"
								style={{ height: "40px" }}
							>
								{data.title}
							</h5>
							<div className="font-grey mb-s valign-wrapper">
								<Icon tiny className="icon-course">
									book_material
								</Icon>{" "}
								{data.course_count} {trans.course_item}
							</div>
							{listCategoryLength > 0 && (
								<div className="mb-s ellipsis h-20">
									<b>Skills: </b>
									{listCategory}
								</div>
							)}
						</div>
					</div>
				</Link>
			</Col>
		);
	}
}

export default Profile;
export { CouponItem };
