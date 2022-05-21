import React from "react";
import store from "store";
import $ from "jquery";
import CourseRecap from "./Recap";
import { API_CERTIFICATE, CheckAuth, FormatDateIndo, BASE_URL } from "../Util";
import {
	Row,
	Col,
	ProgressBar,
	Input,
	Pagination,
	Button,
	Icon
} from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Image from "../Image";
import QuizHeader from "../Quiz/Header";
import FontAwesome from "react-fontawesome";
import { trans } from "../Lang";

import { ShareButtons, ShareCounts, generateShareIcon } from "react-share";

class CourseCertificate extends CourseRecap {
	constructor(props) {
		super(props);
	}

	render() {
		let data = this.state.data;
		if (!data) {
			return super.render();
		}

		return (
			<div>
				<QuizHeader data={data} />
				<CertificateItem data={data} />
			</div>
		);
	}
}

class CertificateItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			FacebookShareButton,
			GooglePlusShareButton,
			LinkedinShareButton,
			TwitterShareButton,
			TelegramShareButton,
			WhatsappShareButton,
			PinterestShareButton,
			VKShareButton,
			OKShareButton,
			RedditShareButton,
			EmailShareButton
		} = ShareButtons;

		var data = this.props.data;
		var url = BASE_URL + `/certificate.php?uuid=${data.uuid}`;
		var shareUrl = url;
		var shareContent = `Saya sudah menyelesaikan ${trans.course} ${data.title} di Skydu Indonesia`;
		var userdata = CheckAuth();
		var isOwner = CheckAuth() != "";

		return (
			<div>
				<div className="container-medium">
					<div className="bg-white pad-m bg-certificate shadowed">
						<div className="center">
							<p>&nbsp;</p>
							<img
								className="mb-m"
								style={{ width: "65px" }}
								src={BASE_URL + "/img/white-label/logo/logo.png"}
							/>
							<h4 className="capitalize">
								{userdata ? userdata.nama : data.student_name}
							</h4>
							<p>Telah menyelesaikan pembelajaran berjudul</p>

							<h5>{data.title}</h5>
							<div className="strong font-grey mb-m">{data.category.name}</div>
						</div>

						<Row>
							<Col
								className="offset-m3 center align-left offset-s3"
								m={4}
								s={10}
							>
								<Icon className="font-orange mb-s left mr-m" medium>
									person_outline
								</Icon>
								<h5 className="font-grey font-light">Mentor</h5>
								<h5>{data.instructor}</h5>
							</Col>
							<Col className="center align-left offset-s3" m={5} s={10}>
								<Icon className="font-orange mb-s left mr-m" medium>
									timeline
								</Icon>
								<h5 className="font-grey font-light">Nilai Akhir</h5>
								<h5>{data.final_grade} %</h5>
							</Col>
						</Row>
						<p>&nbsp;</p>
						<div className="center">
							Pada {trans.course_item} yang resmi terdaftar dalam aplikasi
							<br />
							GETI Incubator.
						</div>

						<Row className="center">
							<Col className="center mt-m" s={12}>
								<h5>{FormatDateIndo(data.completed_at)}</h5>
								<div className="mb-m font-grey">
									No. {data.certificate_number}
								</div>
							</Col>
							<Col className="center" s={12}>
								<img className="" src={BASE_URL + "/img/handsign.png"} />
								<h5>Amalia Prabowo S.Str. MM</h5>
								<div className="mb-m">Direktur GETI Incubator</div>
							</Col>
						</Row>
					</div>
					{isOwner && (
						<div className="strong mt-s pad-m-s font-grey mb-m">
							*Sertifikat yang sudah didapatkan dapat dilihat
							di{" "}
							<Link className="font-orange" to="/profile#tab_3">
								Profil Saya
							</Link>
						</div>
					)}
				</div>
				{isOwner && (
					<div className="bg-light-grey fixed-bottom">
						<div className="pad-m-s container-medium center-s">
							<span className="h5 font-grey mr-s hide-on-small-only">
								Bagikan ke
							</span>
							<h5 className="font-grey hide-on-med-and-up mb-s">Bagikan ke</h5>
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
							<TelegramShareButton
								className="btn btn-circle mr-xs"
								url={shareUrl}
								title={shareContent}
							>
								<FontAwesome name="telegram" />
							</TelegramShareButton>
							<GooglePlusShareButton
								className="btn btn-circle mr-xs"
								url={shareUrl}
								title={shareContent}
							>
								<FontAwesome name="google" />
							</GooglePlusShareButton>
							<WhatsappShareButton
								className="btn btn-circle mr-xs"
								url={shareUrl}
								title={shareContent}
							>
								<FontAwesome name="whatsapp" />
							</WhatsappShareButton>
							<LinkedinShareButton
								className="btn btn-circle mr-xs"
								url={shareUrl}
								title={shareContent}
							>
								<FontAwesome name="linkedin" />
							</LinkedinShareButton>
						</div>
					</div>
				)}

				{!isOwner && <p>&nbsp;</p>}
			</div>
		);
	}
}

export default CourseCertificate;
export { CertificateItem };
