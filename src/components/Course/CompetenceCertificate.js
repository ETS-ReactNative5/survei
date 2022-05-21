import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ShareButtons } from "react-share";
import { trans } from "../Lang";
import QuizHeader from "../Quiz/Header";
// import ShareToEmailModal from "../Reuseables/ShareToEmailModal";
import ShareToEmailUjianPrakteModal from "../Reuseables/ShareToEmailUjianPrakteModal";

import { BASE_URL, CheckAuth } from "../Util";
import CourseRecapCompletion from "./RecapCompletion";
import CourseRecap from "./Recap";

import "../../../src/styles/certificates.css";
import { data } from "jquery";
//import { CertificateItem as OldCertificateItem } from "./NewCertificate";


class CompetenceCertificate extends CourseRecapCompletion {
	constructor(props) {
		super(props);
	}

	isCertificateExist = (uuid) => {
		try {
		 return require(`../../assets/certificate-img/competence/${uuid}.png`) ? true : false;
		} catch (err) {
		 return false;
		}
	};

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
				<CertificateItem isCertExist={isCertExist} data={data} />
			</div>
		);
	}
}

class CertificateItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { urlImageExist: this.props.data.certificate_image ? true : false };
	}

	render() {
		const {
			LinkedinShareButton,
			TwitterShareButton,
			TelegramShareButton,
			WhatsappShareButton,
			EmailShareButton		} = ShareButtons;

		var data = this.props.data;
		var url = BASE_URL + `/certificate-competence/${data.competence_uuid}`;
		var shareUrl = url;
		var shareContent = `Saya sudah menyelesaikan ujian praktek ${trans.course} ${data.title} di GETI Inkubator`;
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
							<ShareToEmailUjianPrakteModal reportUid={data.uuid} cid={data.cid} />
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
		if(this.props.data.isCertExist)
			return require(`../../assets/certificate-img/competence/${uuid}.png`);
		else 
			return require(`../../assets/certificate-img/competence/default-certificate.png`);
	}
	
	render() {
		var data = this.props.data;

		return (
			<div className="container-medium">
				<div className="bg-white pad-m bg-certificate shadowed" style={{
					backgroundImage: "url("+ this.renderBackgroundImage(data.course_uuid) +")",
				}}>
					<div className="competence-certificate-student-number">
						No. Seri : &nbsp;{data.certificate_number}
					</div>
					<div className="competence-certificate-student-name">
						<h4 className="capitalize competence-student">
							{data.student_name}
						</h4>
					</div>
					<div className="competence-certificate-date">
						<h5 className="competence-date">
							(Tanggal penyelesaian {this.renderCompletedAt(data.completed_at)})
						</h5>
					</div>
					{(data.final_grade <= 100 && data.final_grade > 0) && (
					<div>
						<div className="competence-certificate-score-title">
							NILAI
						</div>
						<div className="competence-certificate-student-score">
							{data.final_grade}
						</div>
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

export default CompetenceCertificate;
export { CertificateItem };

