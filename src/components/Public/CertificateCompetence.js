import $ from 'jquery';
import React from 'react';
import { CertificateItem } from '../Course/CompetenceCertificate';
import Page from '../Page';
import { CheckAuth, API_UJIAN_PRAKTEK, API_CERTIFICATE } from '../Util';

class CertificateCompetence extends Page {
	constructor(props) {
		super(props);
		this.state = {
			uuid: props.match.params.uuid,
			isCertExist: false,
			cid: props.match.params.cid
		};
	}

	componentDidMount() {
		this.handleLoadData(); 
	}

	handleLoadData = (e) => {
		let isLogin = CheckAuth() != "";
		
		if (isLogin){
			$.getJSON(API_UJIAN_PRAKTEK + this.state.uuid + '/report')
			.then((_result) => {
				var payload = _result.payload;
				payload.course_uuid = _result.payload.uuid;
				this.setState({
					isCertExist: this.isCertificateExist(payload.course_uuid),
					data: payload
				})
			});
		}
		else {
			let params = {
				cid: this.state.cid,
				uuid: this.state.uuid
			}
			$.post(API_UJIAN_PRAKTEK + this.state.uuid +'/report', params)
				.then((_result) => {
					var payload = _result.payload;
					payload.course_uuid = _result.payload.uuid;
					this.setState({ data: payload, isCertExist: this.isCertificateExist(payload.course_uuid) });
				})
		}
		
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
		if (!data) {
			return super.render();
		}

		return <CertificateItem isCertExist={this.state.isCertExist} data={data} />
	}
}

export default CertificateCompetence
