import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ShareButtons } from "react-share";
import { trans } from "../Lang";
import QuizHeader from "../Quiz/Header";
import ShareToEmailModal from "../Reuseables/ShareToEmailModal";
import { BASE_URL, CheckAuth } from "../Util";
import CourseRecap from "./Recap";
import "../../../src/styles/certificates.css";
import { CertificateItem as OldCertificateItem } from "./NewCertificate";
import { data } from "jquery";


class CompletionCertificate extends CourseRecap {
	constructor(props) {
		super(props);
	}

	isCertificateExist = (uuid) => {
		try {
		 return require(`../../assets/certificate-img/completion/${uuid}.png`) ? true : false;
		} catch (err) {
		 return false;
		}
	};

	renderCertificateComponent = (certificate_image, isCertExist, data) => {
		if (certificate_image) {
			return <CertificateItem data={ data } />
		} else if(isCertExist) {
			return <CertificateItem data={ data } />
		} else {
			return <OldCertificateItem data={ data } />
		}
	}

	render() {
		let data = this.state.data;
		let details = this.state.details;
		var isCertExist = this.isCertificateExist(data.course_uuid);

		if (!data) {
			return super.render();
		}

		return (
			<div>
				<QuizHeader data={data} slug={details.slug} />
				{ this.renderCertificateComponent(data.certificate_image, isCertExist, data) }
			</div>
		);
	}
}

class CertificateItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { urlImageExist: this.props.data.certificate_image ? true : false }
	}

	render() {
		const {
			LinkedinShareButton,
			TwitterShareButton,
			TelegramShareButton,
			WhatsappShareButton,
			EmailShareButton		} = ShareButtons;

		var data = this.props.data;
		var url = BASE_URL + `/certificate-completion/${data.uuid}`;
		var shareUrl = url;
		var shareContent = `Saya sudah menyelesaikan ${trans.course} ${data.title} di GETI Inkubator`;
		var isOwner = data.isOwner = CheckAuth() != "";
		var urlImageExist = data.urlImageExist = this.state.urlImageExist;
		data.isCertExist = this.props.isCertExist;
		
		return (
			<div>
				{
					urlImageExist ?
					(
						<CertImage data={ data } />
					) :
					(
						<CertWebPage data={ data } />
					)
				}
				{isOwner && (
					<div className={ urlImageExist ? '' : 'bg-light-grey '+ "fixed-bottom"}>
						<div className="pad-m-s container-medium center-s pt-s pb-s">
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
							<ShareToEmailModal reportUid={data.uuid} cid={data.cid} />
						</div>
					</div>
				)}

				{!isOwner && <p>&nbsp;</p>}
			</div>
		);
	}
}

class CertWebPage extends React.Component {
	renderCompletedAt = (date) => {
		return (date.split(' ')[0]).split('-').reverse().join('/');
	}

	renderBackgroundImage = (uuid) => {
		return require(`../../assets/certificate-img/completion/${uuid}.png`);
	}
	
	render() {
		var data = this.props.data;

		return (
			<div className="container-medium">
				<div className="bg-white pad-m bg-certificate shadowed" style={{
					backgroundImage: "url("+ this.renderBackgroundImage(data.course_uuid) +")",
				}}>
					<div className="completion-certificate-student-number">
						No. Seri : &nbsp;{data.certificate_number}
					</div>
					<div className="completion-certificate-student-name">
						<h4 className="capitalize completion-student">
							{data.student_name}
						</h4>
					</div>
					<div className="completion-certificate-date">
						<h5 className="completion-date">
							(Tanggal penyelesaian {this.renderCompletedAt(data.completed_at)})
						</h5>
					</div>
					{(data.final_grade <= 100 && data.final_grade > 0) && (
					<div className="completion-certificate-student-score">
						{/* {data.final_grade} */}
					</div>
					)}
				</div>
				{data.isOwner && (
					<div className="strong mt-s pad-m-s font-grey mb-m">
						*Sertifikat yang sudah didapatkan dapat dilihat
						di{" "}
						<Link className="font-orange" to="/profile#tab_3">
							Profil Saya
						</Link>
					</div>
				)}
			</div>
		)
	}
}

class CertImage extends React.Component {
	render() {
		var data = this.props.data;

		return (
			<div className="container-medium">
				<div className="pad-m">
					<img src={ data.certificate_image } className="cert-img"/>
				</div>
				{data.isOwner && (
					<div className="strong mt-s pad-m-s font-grey mb-m">
						*Sertifikat yang sudah didapatkan dapat dilihat
						di{" "}
						<Link className="font-orange" to="/profile#tab_3">
							Profil Saya
						</Link>
					</div>
				)}
			</div>
		)
	}
}

export default CompletionCertificate;
export { CertificateItem };

