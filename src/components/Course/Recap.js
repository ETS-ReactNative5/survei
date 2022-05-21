import $ from 'jquery';
import React from 'react';
import { Icon, Table } from 'react-materialize';
import { Link } from 'react-router-dom';
import store from 'store';
import Page from '../Page';
import QuizHeader from '../Quiz/Header';
import { API_COURSE_BASE_URL } from '../Util';

class CourseRecap extends Page {
	constructor(props) {
		super(props);
		this.state = { data: false, uuid: props.match.params.uuid };
	}

	componentDidMount() {
		this.handleLoadData();
		super.componentDidMount();
	}

	isCertificateExist = (uuid) => {
		try {
		 return require(`../../assets/certificate-img/completion/${uuid}.png`) ? true : false;
		} catch (err) {
		 return false;
		}
	};

	handleLoadData = (e) => {
		var data = store.get(`recap_${this.state.uuid}`);

		if (!data) {
			$.get(API_COURSE_BASE_URL + this.state.uuid + "/report")
				.then((data) => {
					var payload = data.payload;
					this.setState({ data: payload });
				});

			$.get(API_COURSE_BASE_URL + this.state.uuid)
				.then((data) => {
					this.setState({ details: data.payload });
				});
		} else {
			this.setState({ data: data });
		}
	}

	render() {
		let { data, details } = this.state;
		if (!data) {
			return super.render();
		}
		console.log('MAURENDER GAK')

		return (
			<div>
				<QuizHeader data={data} slug={details.slug} />
				<div className="container-small">
					<div className="mt-m">
						<Table className="mb-m bg-white" bordered>
							<tbody>
								<tr>
									<td className="bg-orange"></td>
									<td className="bg-orange pr-m">
										<span className="valign-wrapper right">
											<Icon small>timeline</Icon> &nbsp; Rekap Nilai
	  							</span>
									</td>
								</tr>
								{data.score_history.map((quiz, i) => {
									return <tr>
										<td className="pl-m">{quiz.title}</td>
										<td className="align-right pr-m"><h5>{quiz.score}%</h5></td>
									</tr>
								})}


								<tr><td className="pl-m font-orange">Akumulasi Nilai Akhir</td><td className="font-orange align-right pr-m"><h5>{data.final_grade}%</h5></td></tr>
							</tbody>
						</Table>

						{details && details.show_certificate && <div className="center">
							{/* <Link to={`/course/${this.state.uuid}/certificate`} className="btn modal-close capitalize">Lihat Sertifikats</Link> */}
							<Link to={`/course/${this.state.uuid}/completion-certificate`} className="btn modal-close capitalize">Lihat Sertifikat { this.state.data.uuid_competence ? 'Penyelesaian' : ''}</Link>
							{
								this.state.data.uuid_competence && (
										<Link
											to={`/course/${this.state.uuid}/${this.state.data.uuid_competence}/competence-certificate`}
											className="btn full-s capitalize ml-m"
										>
											Lihat Sertifikat Kelulusan
										</Link>
								)
							}
						</div>}
					</div>
				</div>
			</div>
		)
	}
}
export default CourseRecap
