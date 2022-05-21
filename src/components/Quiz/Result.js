import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	API_COURSE_BASE_URL,
	API_QUIZ_BASE_URL,
	CheckAuth,
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
import QuizHeader from "./Header";
import { trans } from "../Lang";
import RatingModal from "../Reuseables/RatingModal";
import "../../styles/course-rating-modal.css";

class QuizResult extends Page {
	constructor(props) {
		super(props);
		this.state = {
			data: false,
			uuid: props.match.params.uuid,
			recap: props.match.params.recap
		};
	}

	componentDidMount() {
		this.handleLoadData();
		super.componentDidMount();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.data && !prevState.data) {
			$.get(API_COURSE_BASE_URL + this.state.data.course_slug).then(reply => {
				this.setState({ course_detail: reply.payload });
			});
		}
	}

	componentWillReceiveProps(props) {
		this.setState({ recap: props.match.params.recap });
		super.componentWillReceiveProps(props);
	}

	handleLoadData = e => {
		var data = store.get(`result_${this.state.uuid}`);

		console.log(
			"API_QUIZ_BASE_URL >>> ",
			API_QUIZ_BASE_URL + this.state.uuid + "/submissions"
		);

		// if (!data) {
		$.get(API_QUIZ_BASE_URL + this.state.uuid + "/submissions", {
			answers: this.state.answers
		})
			.then(data => {
				console.log("QUIZ RESULT PAYLOAD DATA 1 >>> ", data);
				console.log("UUID >>> ", this.state.uuid);
				console.log("SLUG >>> ", data.payload.course_slug);
				let payload = data.payload;
				payload.uuid = data.payload.course_uuid;
				this.setState({ data: payload }, () => {
					console.log("QUIZ STATE DATA 1 >>> ", this.state.data);
				});
			})
			.fail(err => {
				console.log("ERROR >>> ", err);
			});
		// }
		// else {
		// 	console.log("QUIZ RESULT PAYLOAD DATA 2 >>> ", data);
		// 	data.uuid = data.payload.course_slug;
		// 	this.setState({ data: data }, () => {
		// 		console.log("QUIZ STATE DATA 2 >>> ", this.state.data);
		// 	});
		// }
	};

	render() {
		var { data, uuid } = this.state;

		if (this.state.recap == 1) {
			return (
				<div>
					<QuizHeader data={data} slug={data.course_slug} />
					<div className="bg-orange pad-m pad-xl">
						<div className="container-small">
							<h3 className="font-white font-light mb-m">
								Review kembali materi {trans.course} yang ada untuk memperluas
								pemahaman
							</h3>
							<h5 className="font-white font-light">
								Anda menjawab {data.correct_answer_count} dari{" "}
								{data.question_count} pertanyaan dengan benar
							</h5>
						</div>
					</div>
					<div className="bg-white pad-m pad-l">
						<div className="container-small">
							{data.correct_questions.length > 0 && (
								<div>
									<h5>Yang sudah Anda pahami</h5>
									<ul className="strip-list mb-m">
										{data.correct_questions.map((item, i) => (
											<li>{item}</li>
										))}
									</ul>
								</div>
							)}

							{data.incorrect_questions.length > 0 && (
								<div>
									<h5>Yang harus Anda Pelajari Lagi</h5>

									<ul className="strip-list">
										{data.incorrect_questions.map((item, i) => (
											<li>{item}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
					<div className="pad-m pad-l align-right container">
						<Link
							className="btn capitalize full-s"
							to={`/quiz/result/${uuid}`}
						>
							Kembali ke hasil kuis
						</Link>
					</div>
				</div>
			);
		}

		var score = Math.round(
			(data.correct_answer_count * 100) / data.question_count
		);
		var pass = score >= data.pass_mark;
		var actionBtn = (
			<Link to={`/quiz/${uuid}`} className="btn full-s capitalize">
				Ulang Kuis
			</Link>
		);
		var resultText = "";

		if (pass) {
			if(data.is_last_chapter && data.title.toLowerCase() == "ujian akhir/post test") {
				actionBtn = (
					<div>
						{/* <Link to={`/quiz/${uuid}`} className="btn full-s capitalize">
							Ulang Kuis
						</Link>
						{" "} */}
						<Link
							to={`/course/${data.course_slug}/completion-certificate`}
							// to={`/course/${data.course_uuid}#${data.uuid}`}
							className="btn full-s capitalize"
						>
							Lihat Sertifikat Penyelesaian
						</Link>
						<div className="mt-xs"></div>
						<Link
							to={`/course/${data.course_slug}/${data.uuid_competence}/competence-certificate`}
							className="btn full-s capitalize"
						>
							Lihat Sertifikat Kelulusan
						</Link>
					</div>
				);
				resultText = (
					<div>
						Selamat, Anda telah menyelesaikan semua BAB dan dinyatakan lulus di kelas ini.<br />Berikan rating dan ulasan terbaik kamu tentang kelas ini, dan dapatkan sertifikat kelulusanmu.
					</div>
				);
			} else if (data.is_last_chapter) {
				actionBtn = (
					<Link
						to={`/course/${data.course_uuid}/certificate`}
						className="btn full-s capitalize"
					>
						Lembar Sertifikat
					</Link>
				);

				actionBtn = (
					<Link
						to={`/course/${data.course_slug}/completion-certificate`}
						// to={`/course/${data.course_uuid}#${data.uuid}`}
						className="btn full-s capitalize"
					>
						Berikan Rating dan Lihat Sertifikat
					</Link>
				);
				resultText = (
					<div>
						Selamat, Anda telah menyelesaikan semua Bab di kelas ini.
						<br />
						{/* <br /> */}
						{/* Apabila tidak puas dengan nilai yang diperoleh, Anda dapat mengulang untuk mengerjakan
						<Link to={`/course/${data.course_slug}`} className="font-orange">
							{" "}{data.title}
						</Link> kembali. */}
					</div>
				);
			} else {
				actionBtn = (
					<Link
						to={`/course/${data.course_slug}#${data.quiz_uuid}`}
						className="btn full-s capitalize"
					>
						Lanjut {trans.chapter}
					</Link>
				);

				if(data.chapter_title.toLowerCase() == "praujian/pre-test") {
					resultText = (
						<div>
							Slamat Anda telah menyelesaikan sesi
							<br />
							<br />
							<h4> {data.chapter_title} </h4>
						</div>
					);
				} else {
					resultText = (
						<div>
							Selamat Anda menyelesaikan
							<br />
							Kuis pada Chapter ini<p className="font-small">{data.title}</p>
							<h4>{data.chapter_title}</h4>
						</div>
					);
				}
			}
		} else {
			if (data.is_last_chapter && data.title.toLowerCase() == "ujian akhir/post test") {
				resultText = (
					<div>
						Sayang sekali Anda belum dinyatakan lulus dari Kelas ini. Namun Anda akan tetap mendapatkan sertifikat penyelesaian kelas.<br />Jangan khawatir, kami akan memberikan kesempatan kepada Anda untuk melakukan ujian ulang, sampai Anda mendapatkan Sertifikat Kelulusan.
					</div>
				);

				actionBtn = (
					<div>
						<Link to={`/quiz/${uuid}`} className="btn full-s capitalize">
							Ulang Post Test
						</Link>
						<div className="mt-xs"></div>
						<Link
							to={`/course/${data.course_slug}/completion-certificate`}
							// to={`/course/${data.course_uuid}#${data.uuid}`}
							className="btn full-s capitalize"
						>
							Lihat Sertifikat Penyelesaian
						</Link>
					</div>
				);
			} else if (data.is_last_chapter) {
				resultText = (
					<div>
						Sayang sekali Anda belum dinyatakan lulus dari {trans.course} ini.
						Namun jangan khawatir, kami memberikan kesempatan untuk ujian ulang.
						Dan Anda dapat membuka kembali materi-materi{" "}
						<Link to={`/course/${data.course_slug}`} className="font-orange">
							{data.chapter_title}
						</Link>
					</div>
				);
			} else {
				resultText = (
					<div>
						Sayang sekali, Anda belum dinyatakan lulus dari Bab ini dan belum dapat meneruskan ke Bab selanjutnya.
						<br />
						<br />
						Namun jangan khawatir, kami memberikan kesempatan untuk mengerjakan kembali. Anda dapat membuka kembali modul kelas (materi presentasi, video pelatihan, soal) pada :<br />
						<Link to={`/course/${data.course_slug}`} className="font-orange">
							{data.chapter_title}
						</Link>
					</div>
				);
			}
		}

		return (
			<div>
				<QuizHeader data={data} slug={data.course_slug} />
				<div className="bg-gradient pad-l center">
					<div className="container-small">
						<Image className="medium circle centered" src={CheckAuth().foto} />
						<br />
						{/* <h4 className="font-white">{!pass && "BELUM"} LULUS !</h4> */}

						{pass && (
							<img className="convetti" src={BASE_URL + "/img/convetti.png"} />
						)}
					</div>
				</div>
				<div className="bg-white pad-m center">
					<div className="container-small pad-l">
						{
							typeof data.chapter_title != "undefined" && (
								// data.chapter_title.toLowerCase() != "praujian/pre-test" && 
								// (
									<div>
										<Row>
											<Col className="offset-m3 center" m={3} s={6}>
												{/* <Icon className="font-orange mb-s" medium>
													check_circle
												</Icon> */}
												<svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24">
													<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
												</svg>
												<h4>
													{data.correct_answer_count} / {data.question_count}
												</h4>
												<h5 className="font-grey font-light">Pertanyaan</h5>
											</Col>
											<Col className="center" m={3} s={6}>
												{/* <Icon className="font-orange mb-s" medium>
													timeline
												</Icon> */}
												<svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24">
													<path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/>
												</svg>
												<h4>{score} %</h4>
												<h5 className="font-grey font-light">
													Nilai Anda
												</h5>
											</Col>
										</Row>
										<hr className="mtb-m" />	
									</div>
								// )
							)
						}
						<p className="h5 font-light centered max-400 pb-m">{resultText}</p>
						{/* <Link
							className="btn capitalize btn-outline full-s"
							to={`/quiz/result/${uuid}/1`}
						>
							Ulasan Kuis
						</Link> */}
						{" "}
						&nbsp; {actionBtn}
						<p></p>
					</div>
				</div>
			</div>
		);
	}
}
export default QuizResult;
