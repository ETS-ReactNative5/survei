import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	QueryParam,
	API_TICKET_BASE_URL,
	FormatPrice,
	CheckAuth,
	FormatDateIndo,
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
	Button,
	Icon
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import EventMap from "./Map";
import EventDetail from "./Detail";

class EventTicket extends EventDetail {
	constructor(props) {
		super(props);
		this.state = { data: null, uuid: props.match.params.uuid };
	}

	componentDidMount() {
		console.log("tes");
		this.handleLoadData();
	}

	handleLoadData = e => {
		$.getJSON(API_TICKET_BASE_URL + "/" + this.state.uuid).then(data => {
			console.log("TICKET DATA >>> ", data);
			this.setState({ data: data.payload });
		});
	};

	render() {
		let data = this.state.data;
		console.log("STATE >>> ", this.state);

		if (!data) {
			return super.render();
			// return <div>{this.state}</div>;
		}

		return (
			<div className="container-medium">
				<div className="bg-white shadowed mb-m">
					<div className="pad-m">
						<Link className="valign-wrapper" to="/profile#tab_3">
							<Icon className="left font-orange" small>
								keyboard_arrow_left
							</Icon>
							<span className="strong font-grey"> Kembali ke tiket saya</span>
						</Link>
					</div>
					<Row className="bg-grey">
						<Col className="pad-m" m={8} s={12}>
							<h4>
								Detail Tiket{" "}
								<Link to={`/event/${data.event_uuid}`} className="font-orange">
									{data.title}
								</Link>
							</h4>
							<div className="strong font-grey">
								Booking Code {data.booking_code} pada{" "}
								{FormatDateIndo(data.purchased_at)}
							</div>
						</Col>
						<Col className="pad-m" m={4} s={12}>
							<a
								id="download-btn"
								href={API_TICKET_BASE_URL + "/" + this.state.uuid + "/download"}
								className="btn full"
							>
								LIHAT TIKET
							</a>
						</Col>
					</Row>
					<Row>
						<Col className="pad-m" m={8} s={12}>
							<h5>Pemesan</h5>
							<hr />
							<div className="strong">Nama</div>
							<div className="mb-s">{data.cp_name}</div>
							<div className="strong">Email</div>
							<div className="mb-s">{data.cp_email}</div>
							<div className="strong">No. Handphone</div>
							<div className="mb-s">{data.cp_phone}</div>
						</Col>
						<Col className="pad-m" m={4} s={12}>
							<h5>Tentang Event </h5>
							<hr />
							{this.getEventInfo()}

							<EventMap
								lat={data.location_lat}
								long={data.location_long}
								height="200px"
							/>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
export default EventTicket;
