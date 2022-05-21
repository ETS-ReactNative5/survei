import $ from 'jquery';
import React from 'react';
import { CertificateItem } from '../Course/WnewCertificate';
import Page from '../Page';
import { API_CERTIFICATE,API_WCERTIFICATE } from '../Util';

class WCertificate extends Page {
	constructor(props) {
	    super(props);
	    this.state = {uuid : props.match.params.uuid};
	}

	componentDidMount() {
	    this.handleLoadData();
	}

	handleLoadData = (e) => {
		$.getJSON(API_WCERTIFICATE + this.state.uuid)
	      .then((data) => {
	        this.setState({ data: data.payload });
	    });
	  }

  	render() {
  		let data = this.state.data;
  		if (!data) {
  			return super.render();
  		}

  		return <CertificateItem data={data} />
	}
}

export default WCertificate
