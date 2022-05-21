import React from 'react'
import store from 'store'
import $ from 'jquery';
import { QueryParam, CheckAuth, API_TICKET_URL , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Modal, Button } from 'react-materialize'
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Page from '../Page';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import FontAwesome from 'react-fontawesome';

class HelpForm extends Page {
	static TYPE_REPORT = 1;
	static TYPE_FEEDBACK = 2;

	constructor(props) {
	    super(props);
	}

	componentDidMount() {
	  $(".btn-help").hide();
  	}

	handleSubmitForm = (e) => {
		e.preventDefault();

		let formData = new FormData($("#form-ticket")[0]);

		$.ajax({
		    url: API_TICKET_URL,
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

		if (file && file.size > 1024*1024*3) {
			notify.show("File yang diupload maksimal 3MB", "warning");
			this.refs[target].value='';
			return;
		}
	}

	resetForm () {
		$("#attachment_url").val(null);
		$("#phone").val("");
	}

	getReportTypes() {
		return [
			{id : 1, title : "Akun & Info Personal"},
			{id : 2, title : "Deposit/Poin Belajar"},	
			{id : 3, title : "Modul"},
			{id : 4, title : "Academia Club"},
			{id : 5, title : "Event"},
			{id : 6, title : "Syllabus"},
			{id : 7, title : "Kupon"},
			{id : 8, title : "Komunitas"},
			{id : 9, title : "Lainnya"},
		];
	}

  	render() {
  		let communities = this.state.communities;
  		let userdata = CheckAuth();
  		let reportTypes = this.getReportTypes();

	    return (
	    <div>
		    <div className="pt-m mb-xl container-small">
			    <form id="form-ticket" className="bg-white" onSubmit={this.handleSubmitForm}>
			      	<div className="pad-m">
			      		{userdata && <h4 className="center">Hi, {userdata.nama}</h4>}
			      		<h5 className="font-grey center mb-m">Terima Kasih telah menghubungi kami. Kami di sini siap membantu Anda. <br/>Silakan pilih bantuan yang Anda butuhkan</h5>
			      		<br/>
			      		<Input onChange={this.handleInputChange} label="Apa yang bisa kami bantu?" name="type" id="type" l={3} m={12} s={12} type='select' defaultValue='' required>
			      			<option value=''>Pilih menu bantuan</option>
              				<option value='1'>Saya punya kendala/pertanyaan terkait penggunaan aplikasi Skydu Indonesia</option>
              				<option value='2'>Saya punya kritik/saran untuk pengembangan fitur Skydu Indonesia</option>
              			</Input>
              			{this.state.type == HelpForm.TYPE_REPORT &&
              			<Input onChange={this.handleInputChange} label="Bagian mana yang Anda ingin tanyakan?" name="report_type" id="report_type" l={3} m={12} s={12} type='select' value={this.state.report_type} required>
              				<option value=''>Pilih menu bantuan</option>
              				{reportTypes.map((item) =>
              					<option value={item.id}>{item.title}</option>
              				)}
              			</Input>
              			}

              			{((this.state.type == HelpForm.TYPE_REPORT && this.state.report_type) || this.state.type == HelpForm.TYPE_FEEDBACK) &&
              			<span>
					      	<Input placeholder={this.state.type == HelpForm.TYPE_REPORT ? "ex: Tidak dapat masuk aplikasi" : "ex : Minta tolong modul tentang manajemen diperbanyak"} onChange={this.handleInputChange} id="title" name="title" s={12} label={this.state.type == HelpForm.TYPE_REPORT ? "Kendala apa yang Anda alami?" : "Judul kritik/saran Anda"} required />

					        <Input type='textarea' onChange={this.handleInputChange} id="body" name="body" s={12} label={this.state.type == HelpForm.TYPE_REPORT ? "Silakan jelaskan kendala yang Anda alami" : "Silakan jelaskan kritik/saran yang ingin Anda sampaikan"} placeholder={this.state.type == HelpForm.TYPE_REPORT ? "Lebih banyak yang kami tahu, akan membuat kami lebih mudah dalam membantu Anda" : "Silahkan jelaskan lebih detail terkait dengan saran Anda"} required />

					        <label className="mb-xs block">Lampiran Pendukung (Max 3MB)</label>
					        <input className="border-dashed upload-area full mb-s" onChange={this.handleImageChange.bind(this)} name="attachment" type="file" id="attachment" ref="attachment" s={12} />

					        {!userdata &&
							<span>
								<h5 className="mb-s mt-s">Detail Kontak Anda</h5>
								<Row>
									<Input className="almost-full" s={12} m={6} name="requester[name]" label="Nama Anda" required />
								    <Input type="email" s={12} m={6} name="requester[email]" label="Email Anda" required />

								    <Input type="text" s={12} m={6} name="requester[username]" label="ID Paytren (opsional)" />
							    </Row>
							</span>
							}

					    </span>
						}

						{userdata &&
						<span>
							<input type="hidden" name="requester[name]" value={userdata.nama} />
						    <input type="hidden" name="requester[email]" value={userdata.email} />
						    <input type="hidden" name="requester[username]" value={userdata.agenid} />
						</span>
						}

					    <input type="hidden" name="user_agent" value={navigator.userAgent} />

				        <Col m={12}>&nbsp;</Col>
				        <div className="center mt-xs">
				        <button className="btn almost-full capitalize">Kirim Pesan Baru</button>
				        </div>

			        </div>
			    </form>
		    </div>
		    <Modal trigger={
            <Button id="popup-register-success" className="hide"></Button>
            }>
              <div className="center almost-full">
              	<img className="mb-s" src={BASE_URL + "/img/help/ic_cs.png"} />
                <h4>Terima Kasih</h4>
                <div>
                	Pertanyaan Anda telah terkirim! Kami akan membalas pesan Anda secepatnya.
                </div>
                <br/><br/>
                {userdata && <Link to="/help" className="btn modal-close capitalize btn-outline">LIHAT TIKET</Link>}
                {!userdata && <Link to="/" className="btn modal-close capitalize btn-outline">KEMBALI KE AULA</Link>}
              </div>
          </Modal>
	    </div>
	    )
	}
}
export default HelpForm
