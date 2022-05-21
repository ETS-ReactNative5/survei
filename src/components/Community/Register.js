import React from 'react'
import store from 'store'
import $ from 'jquery';
import { QueryParam, CheckAuth, API_COMMUNITY_BASE_URL, API_COMMUNITY_REGISTER_MEMBERSHIP, API_SHORT_PROFILE , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Modal, Button } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Page from '../Page';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import FontAwesome from 'react-fontawesome';

class CommunityRegister extends Page {
	constructor(props) {
	    super(props);
	}

	componentDidMount() {
      this.handleLoadCommunityList();
  	}

  	handleLoadCommunityList() {
  		$.get(API_COMMUNITY_BASE_URL, {limit : 100}).then((result) => {   
	        this.setState({communities : result.payload});
      	});
  	}

	handleSubmitForm = (e) => {
		e.preventDefault();

		let formData = new FormData($("#form-login")[0]);

		$.ajax({
		    url: API_COMMUNITY_REGISTER_MEMBERSHIP,
		    data: formData,
		    type: 'POST',
		    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
		    processData: false, // NEEDED, DON'T OMIT THIS
		    // ... Other options like success and etc
		}).then((data) => {
			$("#popup-register-success").trigger("click");
			this.resetForm();
			this.scrollToTop();
		});
	}

	handleImageChange = (e) => {
		let target = e.target.id;
		let form = this.refs[target];

		if (!form.files) {
			return;
		}
		var file = form.files[0];

		if (file.size > 1024*1024*3) {
			notify.show("File yang diupload maksimal 3MB", "warning");
			this.refs[target].value='';
			return;
		}
	}

	resetForm () {
		$("#attachment_url").val(null);
		$("#phone").val("");
	}

  	render() {
  		let communities = this.state.communities;

	    return (
	    <div>
		    <div className="pt-m mb-xl">
			    <form id="form-login" className="bg-white" onSubmit={this.handleSubmitForm}>
			      	<div className="pad-m">
			      		<h4>Form Pendaftaran Anggota Komunitas</h4>
			      		<br/>
				      	<Input disabled value={CheckAuth().nama} onChange={this.handleInputChange} id="name" name="name" s={12} label="Nama Lengkap" required />
				        <Input disabled value={CheckAuth().email} type="email" name="email" onChange={this.handleInputChange} id="email" s={12} label="Email" required />
				        <Input type="text" onChange={this.handleInputChange} id="phone" s={12} label="No Telepon" required />
				        <Input label="Pilih Komunitas" name="community_uuid" l={3} m={12} s={12} type='select' defaultValue='0' required>
			              {communities && communities.map(function(community, i) {
			                return <option value={community.uuid}>{community.title}</option>
			              })}
			            </Input>
			            <label>Upload bukti pembayaran (Max 3MB)</label>
			            <input className="mt-xs" onChange={this.handleImageChange.bind(this)} name="attachment_url" type="file" id="attachment_url" ref="attachment_url" s={12} required /> 
				        <Col m={12}>&nbsp;</Col>
				        <button className="btn s12 full">Daftar</button>

			        </div>
			    </form>
		    </div>
		    <Modal trigger={ 
            <Button id="popup-register-success" className="hide"></Button>
            }>
              <div className="center almost-full">
              	<img className="mb-s" src={BASE_URL + "/img/community/ic-register-success.png"} />
                <h4>Terima Kasih</h4>
                <div>
                	Data Anda sudah kami terima, & akan segera kami proses. Kami akan menghubungi Anda melalui email.
                </div>
                <br/><br/>
                <a className="btn modal-close capitalize btn-outline">OKE</a>  
              </div>
          </Modal>
	    </div>
	    )
	}
}
export default CommunityRegister
