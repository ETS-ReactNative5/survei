import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	API_JOURNEY_BASE_URL,
	CheckAuth,
	FormatDateIndo,
	BASE_URL
} from "../Util";
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

class CourseCertificate extends Page {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			uuid: props.match.params.uuid
		};
	}

	componentDidMount() {
		$.getJSON(
			API_JOURNEY_BASE_URL + "/" + this.state.uuid + "/certificate"
		).then(data => {
			this.setState({ data: data.payload });
		});
	}

	render() {
		let data = this.state.data;
		if (!data) {
			return super.render();
		}

		return (
			<div>
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
		var uuid = data.learningpath_uuid;
		var certificateUuid = data.certificate_uuid;
		var url = BASE_URL + `/certificate.php?uuid=${certificateUuid}&lp=1`;
		var shareUrl = url;
		var shareContent = `Saya sudah menyelesaikan ${trans.learning_path} ${data.title} di Skydu Indonesia`;
		var userdata = CheckAuth();
		var isOwner = CheckAuth() != "";

		return (
			<div>
				<div className="certificate">
					<div className="container-large padl-s">
						{data && (
							<span className="font-white left font-medium valign-wrapper mt-s">
								<Link to={`/`}>
									<Icon small className="icon-course">
										home_material
									</Icon>
								</Link>
								&emsp;
								<Icon small className="icon-course">
									keyboard_arrow_right_material
								</Icon>
								&emsp;<Link to={`/learning-path/${uuid}`}>{data.title}</Link>
								&emsp;
								<Icon small className="icon-course">
									keyboard_arrow_right_material
								</Icon>
								&emsp;Sertifikat Kemahiran
							</span>
						)}
					</div>
					<div className="container-large pad-xl padl-s font-white">
						<h4 className="font-white">Sertifikat Kemahiran</h4>
						<span>Selamat Anda telah lulus {trans.learning_path} ini!</span>
					</div>
				</div>
				<div className="container-large">
					<div className="bg-white pad-m bg-certificate-lp shadowed br-s mb-l">
						<div className="left pad-s ml-s">
							<img
								className="mb-m"
								src={BASE_URL + "/img/white-label/logo/logo-horizontal.png"}
								style={{ width: "120px" }}
							/>
						</div>
						<div className="container right pad-s mr-s">
							<Row>
								<Col m={12}>
									<p className="bold right mb-0">
										{FormatDateIndo(data.created_at)}
									</p>
								</Col>
							</Row>
							<Row>
								<Col m={12}>
									<p className="font-grey right mt-0">
										No. {data.certificate_number}
									</p>
								</Col>
							</Row>
						</div>
						<div className="center">
							<p>&nbsp;</p>
							<p>&nbsp;</p>
							<p>&nbsp;</p>
							<h3 className="bold">Sertifikat Kemahiran</h3>
							<p className="font-grey font-medium">
								Diberikan kepada Saudara/i
							</p>

							<h4 className="bold">{data.student_name}</h4>
							<hr className="w50 center" />
							<p className="font-grey font-medium">
								Karena telah menyelesaikan {trans.learning_path} berjudul
							</p>
							<h4 className="bold">{data.title}</h4>
						</div>

						<Row className="pad-m">
							<Col
								className="offset-m2 center align-left offset-s2"
								m={1}
								s={10}
							></Col>
							<Col className="center align-left offset-m5" m={7} s={12}>
								<Icon className="font-orange mb-s left mr-m" medium>
									timeline
								</Icon>
								<h5 className="font-grey font-light">Nilai Rata-Rata</h5>
								<h5>{data.average_score}%</h5>
							</Col>
						</Row>
						<div className="center font-grey font-medium">
							Pada {trans.course_item} yang resmi terdaftar dalam aplikasi
							<br />
							Skydu Indonesia.
						</div>
						<p>&nbsp;</p>
						{data.principal_handsign && (
							<Row className="center">
								<Col className="center" s={6}>
									<img className="pad-m" src={BASE_URL + "/img/handsign.png"} />
									<h5>Dr. Deddi Nordiawan</h5>
									<div className="mb-m">Headmaster</div>
								</Col>
								<Col className="center" s={6}>
									<img className="pad-m" src={data.principal_handsign} />
									<h5>{data.principal_name}</h5>
									<div className="mb-m">{data.principal_title}</div>
								</Col>
							</Row>
						)}

						{!data.principal_handsign && (
							<Row className="center">
								<Col className="center" s={12}>
									<img className="pad-m" src={BASE_URL + "/img/handsign.png"} />
									<h5>Dr. Deddi Nordiawan</h5>
									<div className="mb-m">Headmaster</div>
								</Col>
							</Row>
						)}
					</div>
					{isOwner && (
						<div className="strong mt-s pad-m-s font-grey mb-m hide">
							*Sertifikat yang sudah didapatkan dapat dilihat
							di{" "}
							<Link className="font-orange" to="/profile#tab_3">
								Profil Saya
							</Link>
						</div>
					)}
				</div>
				{isOwner && (
					<div className="bg-light-grey fixed-bottom pad-l">
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
