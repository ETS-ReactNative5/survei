import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ShareButtons } from "react-share";
import { trans } from "../Lang";
import QuizHeader from "../Quiz/Header";
import ShareToEmailModal from "../Reuseables/ShareToEmailModal";
import { BASE_URL, CheckAuth } from "../Util";
import CourseRecap from "./Recap";


class WnewCertificate extends CourseRecap {
	constructor(props) {
		super(props);
	}

	render() {
		let data = this.state.data;
		let details = this.state.details;

		if (!data) {
			return super.render();
		}

		return (
			<div>
				<QuizHeader data={data} slug={details.slug} />
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
			LinkedinShareButton,
			TwitterShareButton,
			TelegramShareButton,
			WhatsappShareButton,
			EmailShareButton		} = ShareButtons;

		var data = this.props.data;
		var url = BASE_URL + `/certificate.php?uuid=${data.uuid}`;
		var shareUrl = url;
		var shareContent = `Saya sudah menyelesaikan ${trans.course} ${data.title} di GETI Inkubator`;
		var isOwner = CheckAuth() != "";

		return (
			<div>
				<div className="container-medium">
					<div className="bg-white pad-m bg-certificate-new2 shadowed">
                        
                        <div className="certificate-student-name-new">
                            <h4 className="capitalize student">
                                {data.student_name}
                            </h4>
                        </div>
                        <div className="certificate-student-title-new">
							{data.title}
						</div>
                        <div className="certificate-student-score-new">
							 {data.title2}
						</div>
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
							<ShareToEmailModal reportUid={data.uuid} />
						</div>
					</div>
				)}

				{!isOwner && <p>&nbsp;</p>}
			</div>
		);
	}
}

export default WnewCertificate;
export { CertificateItem };

