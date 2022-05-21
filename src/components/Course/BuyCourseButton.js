import React from "react";
import { CheckAuth, BASE_URL } from "../Util";
import {Col, Modal, Row } from "react-materialize";
import $ from "jquery";
// import RatingModal from "../Reuseables/RatingModal";
import StarRatings from "react-star-ratings";
import { trans } from "../Lang";
import { Link } from "react-router-dom";
// import UserConstants from "../User/Constants";

class BuyCourseButton extends React.Component {
	NotCommunityRedeemableContent({ title, website_url }) {
		return (
			<div className="center almost-full">
				<img className="mt-s mb-m" src={BASE_URL + "/img/img-popup.png"} alt="popup" />
				<div className="mb-m">
					<h4 className="center">
						<b>Gabung Komunitas</b>
					</h4>
					Maaf, {trans.course} ini hanya bisa diakses oleh anggota komunitas{" "}
					<b>{title}</b>
					<br />
					Untuk mengetahui informasi lebih lanjut silakan klik tombol di bawah
					ini
				</div>
				<Link
					to={website_url}
					target="_blank"
					className="btn modal-close capitalize"
				>
					Info Lebih Lanjut
				</Link>
			</div>
		);
	}

	RightAlignedButton(click_function) {
		const default_function = e => e.preventDefault();
		return (
			<a
				onClick={click_function ? click_function : default_function}
				className="btn right"
			>
				Daftar <span className="hide-on-small-only">{trans.course}</span>
			</a>
		);
	}

	RequiredCourseContent({ uuid, title }) {
		return (
			<div className="center almost-full">
				<h4 className="font-light">Perhatian</h4>
				<div className="mb-m">
					Anda perlu menyelesaikan {trans.course} syarat{" "}
					<Link
						className="font-orange strong modal-close"
						to={`/course/${uuid}`}
					>
						{title}
					</Link>{" "}
					untuk mengikuti {trans.course} ini.
				</div>
				<Link
					to={`/course/${uuid}`}
					className="btn modal-close capitalize btn-outline"
				>
					Oke
				</Link>
			</div>
		);
	}

	render() {
		const userdata = CheckAuth();
		// const { data, requiredCourse } = this.props;
		const { data } = this.props;
		console.log("USERDATA >>> ", userdata);
		console.log("DATA >>> ", data);

		if (data.communities.length > 0 && !data.community_redeemable) {
			const { title, website_url } = data.communities[0];
			return (
				<Modal
					trigger={
						<a
							className="btn right"
							style={
								userdata.is_businessman === 0
									? { marginTop: "1.25rem" }
									: { marginTop: "auto" }
							}
						>
							Daftar <span className="hide-on-small-only">{trans.course}</span>
						</a>
					}
				>
					{this.NotCommunityRedeemableContent({ title, website_url })}
				</Modal>
			);
		}

		// CEK SYARAT KULIAH
		// if (data.price == 0) {
		// if (!requiredCourse || requiredCourse.completed) {
		// 	return this.RightAlignedButton(this.props.onEnroll);
		// } else {
		// 	const { uuid, title } = data.required_course;
		// 	return (
		// 		<Modal trigger={this.RightAlignedButton()}>
		// 			{this.RequiredCourseContent({ uuid, title })}
		// 		</Modal>
		// 	);
		// }
		// }

		return (
				<div style={{display:'inline-block'}}>
					{/* If Course Not Completed Yet */}
					{!data.completed && (
						<div className="right">
							<a className="btn btn-prakerja hide-on-small-only show-on-med-and-up btn-prakerja-digital" onClick={this.props.onEnroll} id="prakerja">
								REDEEM VOUCHER DI SINI
							</a>
							{/*<Button onClick={this.props.onEnroll} className="btn-buy">
								Beli <span className="hide-on-small-only">{trans.course}</span>
							</Button>*/}
							<a
							className="btn btn-prakerja show-on-small hide-on-med-and-up"
							onClick={this.props.onEnroll} id="prakerja"
							style={{marginRight:0,marginTop:5,fontSize:15}}
							>
								REDEEM VOUCHER DI SINI
							</a>
						</div>
					)}

					{/* If Course Has Been Completed */}
					{data.completed && (
						<Row>
							<Col
								l={12}
								m={12}
								s={12}
								className="valign-wrapper right"
								id="floating-buttons"
							>
								{!data.has_reviewed && (
									<div>
										<a
											className="btn"
											href="#course_rating_modal"
											id="give-rating-button"
											onClick={() =>
												$("#course_rating_button").trigger("click")
											}
										>
											Beri Rating
										</a>
									</div>
								)}
								{data.has_reviewed && data.user_rating && (
									<div id="user-course-rating-div">
										<span id="user-course-rating-head" className="font-heavy">
											Rating Darimu
										</span>
										<br />
										<StarRatings
											rating={data.user_rating}
											starDimension={"1.25rem"}
											starRatedColor={"#f2c94c"}
											starSpacing={"1px"}
										/>
									</div>
								)}
								<div>
									<Link
										to={`/course/${data.slug}/recap`}
										className="btn modal-close"
										id="floating-recap-button"
									>
										Rekap Nilai
									</Link>
								</div>
							</Col>
						</Row>
					)}
				</div>
		);
	}
}

export default BuyCourseButton;
