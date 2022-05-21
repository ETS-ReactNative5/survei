/* eslint-disable */

import React from 'react'
import $ from 'jquery';
import { QueryParam, API_PASSWORD_RESET } from '../Util'
import { Button, Col, Collapsible, CollapsibleItem, Collection, CollectionItem, Icon, Input, Modal, Row, Tab, Tabs } from "react-materialize";
import {notify} from 'react-notify-toast';
import Login from './Login';

class ResetPassword extends Login {
	constructor(props) {
	    super(props);
	    this.state = {params : QueryParam(),error_msg:''};
	}

	handlePasswordChange = (e) => {
		this.handleInputChange(e);
		this.validatePassword();
	}

	validatePassword = (e) => {
		var password = document.getElementById("password"), confirm_password = document.getElementById("confirm_password");

		if(password.value != confirm_password.value) {
		    confirm_password.setCustomValidity("Passwords Don't Match");
		  } else {
		    confirm_password.setCustomValidity('');
		}
	}

	handleSubmitForm = (e) => {
		e.preventDefault();

		let param = {
			email : this.state.params['email'],
			token : this.state.params['token'],
			password : this.state.password,
			password_confirmation : this.state.confirm_password
		}
	    $.post(API_PASSWORD_RESET, param).then((data) => {
			// this.props.history.push("/login");
			let status=data.payload.status
			if(status=='success'){
				this.setState({error_msg:''})
				this.modalSuccessChanePass();
			} 
	    }).catch((err)=>{
			console.log(err)
			let error_500=err.responseJSON.message
			let status_500=(error_500=='Server Error')?'Token Expired':error_500;
			this.setState({error_msg:status_500})
		})

		
	}
	modalSuccessChanePass = () => {
			$("#btn-modal-info").trigger("click");
			$(".loading").hide();
	  };
	  redirectLoginForm = () => {
			this.props.history.push("/login");
	  };

  	render() {
	    return (
	    <div>
		    <div className="pt-m pad-xl fullheight bg-cover" style={{backgroundImage:"url('../img/login/bg.png')"}}>
			    <form id="form-login" className="form-auth bg-white" onSubmit={this.handleSubmitForm}>
			      	<div className="px-l py-m">
			      		<div className="center mb-m mt-s">
			      			<h4>Reset Password</h4>
							  {
								  this.state.error_msg !=''?
								<p style={{color:'white',background:'#ff9800',borderRadius:'6px',textAlign:'center'}}>{this.state.error_msg}</p>:''
							  }
			      		</div>
			      		<p className="mb-s">Masukkan password baru Anda</p>
				        <Input onChange={this.handlePasswordChange} type="password" id="password" s={12} label="Password" required />
				        <Input onChange={this.handlePasswordChange} type="password" id="confirm_password" s={12} label="Password Confirmation" required />
				        <button className="btn s12 full">RESET PASSWORD</button>
			        </div>
			    </form>
		    </div>

			<Modal trigger={<Button className="hide" id="btn-modal-info" />}
					modalOptions={{ dismissible: false }}
					options={{
						endingTop: '10%',
						inDuration: 250,
						onCloseEnd: null,
						onCloseStart: null,
						onOpenEnd: null,
						onOpenStart: null,
						opacity: 0.5,
						outDuration: 250,
						preventScrolling: true,
						startingTop: '4%'
					}}
				>
					<div className="center almost-full">
							<h5 style={{color:'#134b95'}}><i className="material-icons">done</i> Password berhasil diganti ! </h5>
							<div className="mb-m">
									Silahkan login dengan password baru Anda
							</div>
							<Button type='button' className="btn modal-close" onClick={()=>this.redirectLoginForm()}>
								LOGIN SEKARANG <i className="material-icons small" style={{fontSize:'18px'}}>east</i>
							</Button>
						</div>
				</Modal>

	    </div>
	    )
	}
}
export default ResetPassword
