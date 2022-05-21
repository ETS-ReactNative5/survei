import $ from 'jquery';
import React from 'react';
import { CertificateItem } from '../Course/CompletionCertificate';
import { CertificateItem as OldCertificateItem } from "../Course/NewCertificate";
import Page from '../Page';
import { API_CERTIFICATE } from '../Util';

class CertificateCompletion extends Page {
	constructor(props) {
		super(props);
		this.state = {
			uuid: props.match.params.uuid,
			cid: props.match.params.cid
		};
	}

	componentDidMount() {
		this.handleLoadData(); 
	}

	handleLoadData = (e) => {
		$.get(API_CERTIFICATE + this.state.uuid)
			.then((data) => {
				var payload = data.payload;
				payload.course_uuid = data.payload.course_uuid;
				this.setState({ data: payload, uuid: data.payload.course_uuid });
			}).fail(() => {
				this.props.history.push("/certificate-competence/" + this.state.uuid, {needRefresh: false});
			});
	}

	isCertificateExist = (uuid) => {
		try {
			return require(`../../assets/certificate-img/completion/${uuid}.png`) ? true : false;
		} catch (err) {
			return false;
		}
	};

	renderCert = (isCertExist, data) => {
		if (data.certificate_image) {
			return <CertificateItem isCertExist={isCertExist} data={data} />
		} else {
			return isCertExist == true ? 
			(
				(<CertificateItem isCertExist={isCertExist} data={data} />)
			) :
			(
				<OldCertificateItem data={data} />
			)
		}
	}

	render() {

		let isCertExist = this.isCertificateExist(this.state.uuid);
		let data = this.state.data;
		if (!data) {
			return super.render();
		}

		return (
			this.renderCert(isCertExist, data)
		)
	}
}

export default CertificateCompletion
