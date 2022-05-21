import React from 'react'
import store from 'store'
import Page from '../Page'
import $ from 'jquery';
import {CertificateItem} from '../LearningPath/Certificate'
import { API_LP_CERTIFICATE, CheckAuth, FormatDateIndo , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Pagination, Button, Icon } from 'react-materialize'

class LPCertificate extends Page {
	constructor(props) {
	    super(props);
	    this.state = {uuid : props.match.params.uuid};
	}

	componentDidMount() {
	    this.handleLoadData();
	}

	handleLoadData = (e) => {
		$.getJSON(API_LP_CERTIFICATE + this.state.uuid)
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

export default LPCertificate
