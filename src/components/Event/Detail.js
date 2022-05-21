import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_EVENT_BASE_URL,
	FormatPrice,
	CheckAuth,
	FormatDateIndo,
	FormatDateRange,
	FormatTime,
	BASE_URL
} from "../Util";
import {
	Row,
	Col,
	ProgressBar,
	Input,
	Tabs,
	Tab,
	Button
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import EventMap from "./Map";
import EventConstants from "./Constants";
import FontAwesome from "react-fontawesome";
import { ShareButtons } from "react-share";
import { trans } from "../Lang";
import "../../styles/event-detail.css";
import { IconText } from "../Reuseables/MiniComponents";
import { pa_green, ic_rabat, ic_score } from "../../assets";

class EventDetail extends Page {
	static defaultProps = {
		center: { lat: 59.95, lng: 30.33 },
		zoom: 17
	};

	constructor(props) {
		super(props);
		this.state = { data: null, uuid: props.match.params.uuid };
	}

	componentDidMount() {
		this.handleLoadData();
		super.componentDidMount();
	}

	isEarly() {
		let data = this.state.data;
		return EventConstants.isEarly(data);
	}

	getPrice() {
		let data = this.state.data;
		return EventConstants.getPrice(data);
	}

	getEventInfo(data) {
		if (!data) {
			data = this.state.data;
		}

		return (
			<div>
				<div className="strong mb-xs">Waktu & Tempat</div>
				{data.ticket_time || FormatDateRange(data.held_at, data.held_to)}
				<br />
				<br />

				<div className="strong mb-xs">Lokasi</div>
				<div className="mb-xs">{data.location_detail}</div>

				<a
					className="link"
					target="_blank"
					href={`https://www.google.com/maps/search/?api=1&query=${data.location_lat},${data.location_long}`}
				>
					Lihat Peta
				</a>
				<br />
				<br />
			</div>
		);
	}

	handleLoadData = e => {
		$.getJSON(API_EVENT_BASE_URL + "/" + this.state.uuid).then(data => {
			console.log("EVENT DATA >>> ", data);
			data.payload.price = EventConstants.getPrice(data.payload);
			this.setState({ data: data.payload });
		});
	};

	render() {
		const { FacebookShareButton, TwitterShareButton } = ShareButtons;

		var data = this.state.data;
		var styles = [
			{
				featureType: "water",
				stylers: [{ color: "#DDDDDD" }, { visibility: "on" }]
			},
			{ featureType: "landscape", stylers: [{ color: "#f2f2f2" }] },
			{
				featureType: "road",
				stylers: [{ saturation: -100 }, { lightness: 45 }]
			},
			{ featureType: "road.highway", stylers: [{ visibility: "simplified" }] },
			{
				featureType: "road.arterial",
				elementType: "labels.icon",
				stylers: [{ visibility: "off" }]
			},
			{
				featureType: "administrative",
				elementType: "labels.text.fill",
				stylers: [{ color: "#444444" }]
			},
			{ featureType: "transit", stylers: [{ visibility: "off" }] },
			{ featureType: "poi", stylers: [{ visibility: "off" }] }
		];

		if (!data) {
			return super.render();
		}

		let heldAt = FormatDateIndo(data.held_at, false, false, true);
		let isEarly = this.isEarly();
		let shareUrl = window.location.origin + `/event.php?uuid=${data.uuid}`;
		let shareContent = `Event ${data.title} di ${data.location_detail}. Segera pesan di `;

		return (
			<div className="container-medium">
				<div className="bg-white shadowed mb-m">
					<div className="">
						<Row className="border-all mb-0">
							<Col m={5} s={12} className="full-s pad-m">
								<Image className="square-responsive" src={data.image_url} />
							</Col>
							<Col m={7} s={12} className="fullheight">
								<div className="pad-m height-70">
									<div className="right">
										<span className="h5 font-grey mr-s">Bagikan ke</span>
										{/* <FacebookShareButton
											className="btn btn-circle mr-xs"
											url={shareUrl}
											title={shareContent}
										>
											<FontAwesome name="facebook" />
										</FacebookShareButton> */}
										<TwitterShareButton
											className="btn btn-circle mr-xs"
											url={shareUrl}
											title={shareContent}
										>
											<FontAwesome name="twitter" />
										</TwitterShareButton>
									</div>
									<div className="short-date strong mb-s">
										{heldAt.date}
										<br />
										<span className="month">{heldAt.shortMonth}</span>
									</div>
									<div className="font-grey strong">
										{EventConstants.label(data.type)}
									</div>
									<h4 className="mb-s">{data.title}</h4>
									<div className="mb-s">By {data.organizer}</div>
									<h5 className="font-light mb-xs">
										Biaya Tiket{" "}
										{isEarly && (
											<span className="italic font-grey">
												(Early Bird sampai tanggal{" "}
												{FormatDateIndo(data.early_ticket_date)})
											</span>
										)}
									</h5>

									<h4 className="font-orange mb-xs valign-wrapper">
										{isEarly &&
											(data.early_ticket_price > 0
												? FormatPrice(data.early_ticket_price)
												: "GRATIS")}
										{!isEarly &&
											(data.ticket_price > 0
												? FormatPrice(data.ticket_price)
												: "GRATIS")}{" "}
										&nbsp;
										{isEarly && data.ticket_price > 0 && (
											<span className="h5 font-grey strike">
												{FormatPrice(data.ticket_price)}
											</span>
										)}
									</h4>
									<div className="font-orange italic font-small mb-s">
										{false && data.user_cashback > 0 && (
											<span>Cashback {FormatPrice(data.user_cashback)}</span>
										)}
									</div>

									{CheckAuth().is_businessman === 0 && (
										<div className="valign-wrapper non-partner-text">
											<p>
												<i className="material-icons">info_outline</i>
												<span>
													Silahkan daftar event ini melalui mitra paytren
												</span>
											</p>
										</div>
									)}

									{CheckAuth() && (
										<Link
											to={`/event/${data.slug}/order`}
											style={{ marginTop: "50px" }}
											className="btn mt-xs full"
										>
											BELI TIKET
										</Link>
									)}
								</div>
							</Col>
						</Row>
						<Row>
							<Col m={8} className="pad-m">
								<Row className="border-bottom">
									<Col m={3} s={12}>
										<p className="font-orange h5 mt-0">
											Tentang <br className="hide-on-small-only" /> Event
										</p>
									</Col>
									<Col m={9} s={12} className="mb-s">
										<div
											className="justify"
											dangerouslySetInnerHTML={{ __html: data.description }}
										></div>
									</Col>
								</Row>

								<Row>
									<Col m={3}>
										<h5 className="font-orange full-s">
											{data.instructor_type || "Pembicara"}
										</h5>
									</Col>
									<Col m={9} className="full-s">
										{data.speakers &&
											data.speakers.map((speaker, i) => (
												<div className="mb-s">
													{speaker.avatar_url && (
														<Image
															src={speaker.avatar_url}
															className="left small circle mr-s"
														/>
													)}
													<b>{speaker.name}</b>
													<br />
													{speaker.title}
												</div>
											))}
									</Col>
								</Row>
								{data.required_courses.length > 0 && (
									<Row>
										<Col m={3}>
											<h5 className="font-orange full-s almost-full">
												Syarat Mengikuti Event
											</h5>
										</Col>
										<Col m={9} className="full-s">
											<div className="mb-s">
												Untuk mengikuti event ini Anda harus menyelesaikan{" "}
												{trans.course} berikut:
											</div>
											<EventCourse data={data.required_courses} />
										</Col>
									</Row>
								)}
								{data.bonus_courses.length > 0 && (
									<Row>
										<Col m={3}>
											<h5 className="font-orange full-s almost-full">
												Paket Event
											</h5>
										</Col>
										<Col m={9} className="full-s">
											<div className="mb-s">
												Beli event ini dan dapatkan {trans.bundle}{" "}
												{trans.course} berikut GRATIS!
											</div>
											<EventCourse data={data.bonus_courses} />
										</Col>
									</Row>
								)}
							</Col>
							<Col m={4} className="pad-m">
								{this.getEventInfo(data)}
								<div className="strong mb-xs">Kontak Penyelenggara</div>
								{data.contact_person}
								{data.cp_phone && (
									<div className="mt-xs">
										<FontAwesome name="phone" /> &nbsp; {data.cp_phone}
									</div>
								)}
								{data.cp_email && (
									<div className="mt-xs">
										<FontAwesome name="envelope" />
										&nbsp; {data.cp_email}
									</div>
								)}
								<br />
								<br />
								<div className="strong mb-xs">Catatan Penting</div>

								{data.sop_detail.split("\n").map((item, key) => {
									return (
										<span key={key}>
											{item}
											<br />
										</span>
									);
								})}
								<br />
								<br />
							</Col>
							<Col m={12} className="full-s" id="map">
								<EventMap lat={data.location_lat} long={data.location_long} />
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}

class EventCourse extends React.Component {
	render() {
		let courses = this.props.data;

		return (
			<div>
				{courses &&
					courses.map((course, i) => (
						<Link to={`/course/${course.uuid}`}>
							<Row className="mb-s">
								{course.thumbnail && (
									<Image src={course.thumbnail} className="left square mr-s" />
								)}
								<h5>{course.title}</h5>
								<div>Oleh : {course.instructor}</div>
							</Row>
						</Link>
					))}
			</div>
		);
	}
}
export default EventDetail;
export { EventDetail, EventCourse };
