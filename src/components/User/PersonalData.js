import React from "react";
import store from "store";
import $ from "jquery";
import Page from "../Page";
import {
	CheckAuth,
	BASE_URL,
	API_GET_EDUCATION,
	API_GET_CITY,
	API_DETAIL_PROFILE,
	API_UPDATE_PROFILE,
	API_GET_PROVINCE
} from "../Util";
import {
	Row,
	Col,
	Icon,
	Modal,
	Button,
	Input
} from "react-materialize";
import { notify } from "react-notify-toast";
import "../../styles/personal-data.css";
import "../../styles/register.css";

class PersonalData extends Page {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			edit: false,
			title: ''
		};
	}

	componentDidMount() {
		this.handleLoadData();
	}

	handleLoadData = e => {
		$.post(API_DETAIL_PROFILE).then(data => {
			this.setState({ data: data.payload.data[0] });
		});
	};

	changeView = () => {
		this.setState({ edit: !this.state.edit });
	}

	render() {
		var data = this.state.data;
		if (!data) {
			return super.render();
		}

		return (
			<div>
                {/* profile header */}
				<div className="bg-academia font-white">
					<div className="container pad-m pad-l">
						<Row className="mb-0">
							<Col>
								<img src={CheckAuth().foto} className="small circle mr-s" />
							</Col>
							<Col l={6} s={6}>
								<div className="profile-info">
									<h5 className="font-white">{data.name}</h5>
									<div className="left">{data.email}</div>
								</div>
							</Col>
						</Row>
					</div>
				</div>

                <div className="bg-white no-shadow container pad-m">
                    <Row>
                        <Col s={11} m={11} l={11}>
                            <h5>{ this.state.edit ? 'Edit ' : '' }Data Pribadi</h5>
                        </Col>
                        <Col s={1} m={1} l={1} className="text-center flex-jc-center align-items-center btn-hovered" onClick={this.changeView}>
                            <Icon className={ this.state.edit ? 'text-danger' : 'font-grey' }>{ this.state.edit ? 'close' : 'edit' }</Icon>
                            <h5 className={ (this.state.edit ? 'text-danger' : 'font-grey') + " mb-0 font-normal-weight" }> { this.state.edit ? 'Cancel' : 'Edit' }</h5>
                        </Col>
                    </Row>
                    <hr />
					{ this.state.edit == false ? <ViewProfile data={ data } /> : <EditProfile data={ data } handleLoadData={ this.handleLoadData } changeView={ this.changeView } /> }
			    </div>

				<Modal
					trigger={
						<Button id="promo-btn" className="hide">
							SUBMIT
						</Button>
					}
				>
					<div className="center almost-full">
						<img className="mb-s" src={BASE_URL + "/img/ic_prize.png"} />
						<h4 className="font-light">Selamat!</h4>

						<div className="mb-m">
							Anda mendapatkan poin belajar senilai Rp 300.000 untuk mendaftar
							di course Skydu Indonesia #OktoberBahagia
						</div>
						<a className="btn modal-close capitalize btn-outline">Oke</a>
					</div>
				</Modal>
			</div>
		);
	}
}

class ViewProfile extends React.Component {
	renderGender = (gender) => {
		return gender == "L" ? 'Laki-Laki' : gender  == "P" ? 'Perempuan' : ' - ';
	}

	renderDate = (date) => {
		if (date) {
			date = date.split("-");

			if(date.length == 3) {
				return `${date[2]} - ${date[1]} - ${date[0]}`;
			} else {
				return " - ";
			}
		}
	}

	render() {
		let data = this.props.data;

		return (
			<div className="view-data">
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Nama Lengkap</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ data.name || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Email</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ data.email || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Nomor Telepon</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ data.phone || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Tanggal Lahir</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ this.renderDate(data.birth_date) || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Pendidikan</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ data.education || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Jenis Kelamin</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ this.renderGender(data.gender) || " - " }</p>
                    </Col>
                </Row>
                <Row>
                    <Col s={3} m={2} l={2}>
                        <p>Domisili</p>
                    </Col>
                    <Col s={9} m={10} l={10} className="list-data">
                        <p>{ data.city || " - " }</p>
                    </Col>
                </Row>
				{/* <Row style={{marginTop:20}}>
					<Col s={11} m={11} l={11}>
						<h5 style={{marginBottom:5}}>Data Pekerjaan</h5>
					</Col>
				</Row>
				<hr /> */}
				<Row>
                    <Col s={2} m={2} l={2}>
                        <p>Alamat</p>
                    </Col>
                    <Col s={10} m={10} l={10} className="list-data">
                        <p>{ data.address || " - " }</p>
                    </Col>
                </Row>
				<Row>
                    <Col s={2} m={2} l={2}>
                        <p>Pekerjaan</p>
                    </Col>
                    <Col s={10} m={10} l={10} className="list-data">
                        <p>{ data.occupation || " - " }</p>
                    </Col>
                </Row>
            </div>
		);
	}
}

class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dateFormType: 'text',
			autoCompleteVisibility: {
				province: false,
				city: false
			},
			autoCompleteActive: {
				province: false,
				city: false
			},
			startEditDomisili: false,
			pointer: {
				province: 0,
				city: 0,
			},
			startPointer: false,
			educationsData: [],
			citiesData: [],
			provincesData: [],
			provincesData_filtered: [],
			genderData: ["L", "P"],
			formData: {
				name: '',
				phone: '',
				birth_date: '',
				gender: '',
				education: '',
				city: '',
				city_id: '',
				province: '',
				province_id: '',
				address:'',
				occupation:'',
			},
			formErrors: {
				errorFullname: "",
				errorPhoneNumber: "",
				errorDateOfBirth: "",
				errorStudy: "",
				errorGender: "",
				errorDomisili: "",
				errorProvince: "",
				errorAlamat: "",
				errorOccupation: ""
			},
		};

		this.regexFullname = RegExp(/^[A-Za-z ]+$/);
		this.regexDate = RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);
		this.clientToken = "aa6d8694eea3d1b52aa6e4169b0a822665b56fc4";
	}

	componentDidMount() {
		this.loadEducationsData();
		this.loadProvincesData();
		this.setState({ formData: this.props.data })
	}

	selectProvince = (e, province) => {
		if(typeof province != "undefined") {
			this.loadCitiesData(null, province.province_id);
			let formData = this.state.formData;
			formData.province = province.name;
			formData.province_id = province.province_id;
			formData.city = '';
			formData.city_id = '';

			this.setState({ 
				autoCompleteVisibility: {
					province: false,
					city: false
				},
			});
		}
	}

	selectCity = (city) => {
		if(typeof city != 'undefined') {
			let formData = this.state.formData;
			formData.city = city.name;
			formData.city_id = city.city_id;

			this.setState({ 
				formData: formData, 
				autoCompleteVisibility: {
					province: false,
					city: false
				}
			});
		}
	}

	loadEducationsData = () => {
		$.getJSON(API_GET_EDUCATION).then(
			(data) => {
				this.setState({
					educationsData: data.payload
				})
			}
		);
	}

	loadProvincesData = () => {
		$.getJSON(API_GET_PROVINCE).then(
			(data) => {
				this.setState({
					provincesData: data.payload
				})
			}
		);
	}

	loadProvincesData_filtered = (keyword) => {
		let result = this.state.provincesData.filter(province => province.name.toLowerCase().includes(keyword.toLowerCase()));

		this.setState({ provincesData_filtered: result })
	}

	loadCitiesData = (keyword, province_id) => {
		$.post(API_GET_CITY, { keyword, province_id }).then(
			(data) => {
				this.setState({
					citiesData: data.payload
				});
			}
		)
	}

	handleFocus = (type, state) => {
		let { autoCompleteVisibility } = this.state;
		autoCompleteVisibility[type] = state;

		this.setState({ autoCompleteVisibility });

		if(!this.state.formData[type]) {
			this.setState({ provincesData_filtered: this.state.provincesData })
		}
	}

	handleChange = e => {
		let { value, name } = e.target;
		let { formData } = this.state;

		switch (name) {
			case "fullname":
				formData.name = value;
				break;
			case "phoneNumber":
				formData.phone = value;
				break;
				break;
			case "dateOfBirth":
				formData.birth_date = value;
				break;
			case "domisili":
				formData.city = value;
				this.loadCitiesData(value, this.state.formData.province_id);
				this.setState({ autoCompleteVisibility: {
						province: false,
						city: true
					},
					startEditDomisili: true
				});
				break;
			case "provinsi":
				formData.province = value;
				this.loadProvincesData_filtered(value)
				this.setState({ autoCompleteVisibility: {
						province: true,
						city: false
					}
				});
				this.state.pointer.province = 0;
				break;
			case "study":
				formData.education = value;
				break;
			case "gender":
				formData.gender = value;
				break;
			case "address":
				formData.address = value;
				break;
			case "occupation":
				formData.occupation = value;
				break;
			default:
				break;
		}

		this.setState({ formData });
	};

	ArrowKeySelectProvince = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if(e.keyCode == '38') {
			if(pointer.province > 0){
				pointer.province--;
			}

			if(pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}
			
			this.setState({ pointer });
		} else if(e.keyCode == '40') {
			if(pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if(pointer.province < this.state.provincesData_filtered.length - 1) {
				pointer.province++;
			}
			this.setState({ pointer });
		} else if(e.keyCode == '13') {
			e.preventDefault();
			this.handleAutocompleteBlur('province')
		}

		if(this.state.provincesData_filtered.length && typeof this.state.provincesData_filtered[pointer.province] != "undefined") {
			this.state.formData.province = this.state.provincesData_filtered[pointer.province].name;
			this.state.formData.province_id = this.state.provincesData_filtered[pointer.province].province_id;
		}
	}

	ArrowKeySelectCity = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if(e.keyCode == '38') {
			if(pointer.city > 0){
				pointer.city--;
			}

			if(pointer.city > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}
			
			this.setState({ pointer });
		} else if(e.keyCode == '40') {
			if(pointer.city > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if(pointer.city < this.state.citiesData.length - 1) {
				pointer.city++;
			}
			this.setState({ pointer });
		} else if(e.keyCode == '13') {
			e.preventDefault();
			this.handleAutocompleteBlur('city')
		}

		if(this.state.citiesData.length && typeof this.state.citiesData[pointer.province] != "undefined") {
			this.state.formData.city = this.state.citiesData[pointer.city].name;
			this.state.formData.city_id = this.state.citiesData[pointer.city].city_id;
		}
	}

	handleSubmit = async e => {
		e.preventDefault();
		if (this.checkIsFormValid()) {
			let formData = this.state.formData;

			formData.gender = formData.gender.toUpperCase();
			formData.education = formData.education.toUpperCase();
			formData.city = formData.city.toUpperCase();

			this.handleUpdate(formData);
		}
	};

	checkInputValidity = (array, data) => {
		return array.find(item => item == data) ? true : false;
	}

	checkCityAndProvince = (array, data) => {
		return array.find(item => item.name == data) ? true : false;
	}

	checkIsFormValid = () => {
		let formData = this.state.formData;
		let { formErrors } = this.state;
		let isValid = true;
		
		// Fullname Validation
		if (!formData.name) {
			formErrors.errorFullname = "Nama tidak boleh kosong";
		} else if (!this.regexFullname.test(formData.name)) {
			formErrors.errorFullname = "Hanya dapat memasukkan huruf";
		} else {
			formErrors.errorFullname = "";
		}

		// Phone Number Validation
		if (!formData.phone) {
			formErrors.errorPhoneNumber = "Nomor handphone tidak boleh kosong";
		} else if (!formData.phone || formData.phone.length < 10 || isNaN(formData.phone)) {
			formErrors.errorPhoneNumber =
				"Nomor handphone yang anda masukkan tidak valid";
		} else {
			formErrors.errorPhoneNumber = "";
		}

		// Date of Birth Validation
		if (!formData.birth_date) {
			formErrors.errorDateOfBirth = "Tanggal Lahir tidak boleh kosong";
		} else if (!this.regexDate.test(formData.birth_date)) {
			formErrors.errorDateOfBirth = "Tanggal tidak valid";
		} else {
			formErrors.errorDateOfBirth = "";
		}

		// Study Validation
		if (!formData.education) {
			formErrors.errorStudy = "Pendidikan tidak boleh kosong";
		} else if (!this.checkInputValidity(this.state.educationsData, formData.education)) {
			formErrors.errorStudy = "Pendidikan tidak valid";
		} else {
			formErrors.errorStudy = "";
		}

		// Gender Validation
		if (!formData.gender) {
			formErrors.errorGender = "Jenis Kelamin tidak boleh kosong";
		} else if (!this.checkInputValidity(this.state.genderData, formData.gender)) {
			formErrors.errorGender = "Jenis Kelamin tidak valid";
		} else {
			formErrors.errorGender = "";
		}

		// Domisili Validation
		if (!formData.city) {
			formErrors.errorDomisili = "Domisili tidak boleh kosong";
		} else if (!this.checkCityAndProvince(this.state.citiesData, formData.city)) {
			if(this.state.startEditDomisili) {
				formErrors.errorDomisili = "Kota Domisili tidak valid. Harap pilih dari list yang sudah disediakan";
			} else {
				formErrors.errorDomisili = "";
			}
		} else {
			formErrors.errorDomisili = "";
		}

		// Province Validation
		if (!formData.province) {
			formErrors.errorProvince = "Provinsi tidak boleh kosong";
		} else if (!this.checkCityAndProvince(this.state.provincesData, formData.province)) {
			formErrors.errorProvince = "Provinsi tidak valid. Harap pilih dari list yang sudah disediakan";
		} else {
			formErrors.errorProvince = "";
		}

		// alamat max length 
		if (formData.address != null) {
			if (formData.address.length > 225){
				formErrors.errorAlamat = "Alamat tidak boleh lebih dari 225 karakter"
			}else{
				formErrors.errorAlamat = "";
			}
		}

		this.setState({ formErrors });

		// RETURN ISVALID
		Object.values(formErrors).forEach(value => {
			if (value) {
				this.setState;
				isValid = false;
			}
		});

		return isValid;
	};

	handleUpdate = (formData) => {
		let dataTemp = {
			client_token: this.clientToken,
			device_token: ""
		};

		formData = Object.assign({}, formData, dataTemp);

		$.post(API_UPDATE_PROFILE, formData)
			.then(data => {
				if (data.payload) {
					notify.show(
						"Data Pribadi berhasil diupdate",
						"success"
					);

					this.updateProfileLocalData(data.payload.data[0]);

					setTimeout(function(){
						window.location.reload()
					}, 1000);
				} else {
					notify.show("Terdapat kesalahan, silakan coba lagi", "warning");
				}
			})
			.fail((XMLHttpRequest, textStatus, errorThrown) => {
				let response;

				try {
					response = JSON.parse(XMLHttpRequest.responseText);
				} catch (e) {}

				if (response && response.status) {
					if (response.errors) {
						notify.show(response.errors.email[0], "warning");
					} else {
						notify.show(response.message, "warning");
					}
				}
			});
	};

	updateProfileLocalData = (data) => {
		let userdata = store.get("userdata");
		userdata.nama = data.name;
		userdata.phone = data.phone;

		store.set("userdata", userdata);
	}

	handleDateForm = (state) => {
		state == true ? this.setState({ dateFormType: 'date' }) : this.setState({ dateFormType: 'text' });
	}

	handleAutocompleteBlur = (type) => {
		if(this.state.startPointer) {
			if(type == 'province') {
				this.selectProvince(this.state.provincesData_filtered[this.state.pointer.province]);
			} else if (type == 'city') {
				this.selectCity(this.state.citiesData[this.state.pointer.city]);
			}

			this.state.startPointer = false;
		}

		let { autoCompleteVisibility } = this.state;

		if(this.state.autoCompleteActive[type] == false) {
			autoCompleteVisibility[type] = false;

			this.setState({ autoCompleteVisibility: autoCompleteVisibility });
		}
	}

	handleAutoCompleteActive = (type, state) => {
		let { autoCompleteActive } = this.state;
		autoCompleteActive[type] = state;
		
		this.setState({ autoCompleteActive });
	}

	render() {
		let formData = this.state.formData;
		let formErrors = this.state.formErrors;

		return (
			<div className="edit-data">
				<Row>
                    <Col s={2} m={2} l={2}>
						<p>Nama Lengkap</p>
					</Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<input
							name="fullname"
							placeholder="Masukkan Nama Lengkap"
							type="text"
							onChange={this.handleChange}
							value={formData.name}
						/>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorFullname }
						</div>
                    </Col>
                </Row>
                <Row>
                    <Col s={2} m={2} l={2}>
                        <p>Nomor Telepon</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<input
							name="phoneNumber"
							placeholder="Masukkan Nomor Telepon"
							type="tel"
							onChange={this.handleChange}
							value={formData.phone}
						/>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorPhoneNumber }
						</div>
                    </Col>
                </Row>
                <Row>
                    <Col s={2} m={2} l={2}>
                        <p>Tanggal Lahir</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<input
							name="dateOfBirth"
							type={this.state.dateFormType}
							placeholder="Masukkan Tanggal Lahir"
							className="col s12"
							onChange={this.handleChange}
							onFocus={() => this.handleDateForm(true)}
							onBlur={() => this.handleDateForm(false)}
							value={formData.birth_date}
							max="2900-01-01"
						/>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorDateOfBirth }
						</div>
                    </Col>
                </Row>
                <Row>
                    <Col s={2} m={2} l={2}>
                        <p>Pendidikan</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<select
							name="study"
							className={"drop-down " + (this.state.formData.education ? 'text-inherit' : 'text-grey')}
							value={formData.education}
							onChange={this.handleChange}
						>
							<option value="" disabled selected>Pilih Pendidikan</option>
							{
								this.state.educationsData.map((item) => 
								(
									<option value={item}>{item}</option>
								))
							}
						</select>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorStudy }
						</div>

                    </Col>
                </Row>
                <Row>
                    <Col s={2} m={2} l={2}>
                        <p>Jenis Kelamin</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<select
							name="gender"
							className={"drop-down " + (this.state.formData.education ? 'text-inherit' : 'text-grey')}
							value={formData.gender}
							onChange={this.handleChange}
						>
							<option value="" disabled selected>Pilih Jenis Kelamin</option>
							<option value="L">Laki-laki</option>
							<option value="P">Perempuan</option>
						</select>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorGender }
						</div>

                    </Col>
                </Row>
				<Row>
                    <Col s={2} m={2} l={2}>
                        <p>Provinsi</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<input
							name="provinsi"
							type="text"
							placeholder="Provinsi"
							onBlur={() => this.handleAutocompleteBlur('province')}
							onChange={this.handleChange}
							onFocus={() => this.handleFocus('province', true)}
							onKeyDown={this.ArrowKeySelectProvince}
							value={formData.province}
							className="autocomplete-form"
							autoComplete="off"
							disabled={this.state.provincesData.length ? false : true}
						/>
						<div className="autocomplete-form position-relative">
							<div className={(this.state.autoCompleteVisibility.province == true ? '' : 'autocomplete-none') + " autocomplete-container"}>
								<ul className="autocomplete-list width-100" onMouseEnter={() => this.handleAutoCompleteActive('province', true)} onMouseLeave={() => this.handleAutoCompleteActive('province', false)}>
									{
										this.state.provincesData_filtered.map((item, index) => 
										(
											<li className={"autocomplete-item" + (index == this.state.pointer.province ? ' active' : '')} onClick={(e) => this.selectProvince(e, item)}>{ item.name }</li>
										))
									}
								</ul>
							</div>
							<div className="helper-text font-orange-red inline-block font-tiny">
								{ formErrors.errorProvince }
							</div>
						</div>
                    </Col>
                </Row>
                <Row>
                    <Col s={2} m={2} l={2}>
                        <p>Domisili</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<input
							name="domisili"
							type="text"
							placeholder="Domisili"
							onBlur={() => this.handleAutocompleteBlur('city')}
							onChange={this.handleChange}
							onKeyDown={this.ArrowKeySelectCity}
							value={formData.city}
							className="autocomplete-form"
							onFocus={() => this.handleFocus('city', true)}
							autoComplete="off"
							disabled={this.state.formData.province_id ? false : true}
						/>
						<div className="autocomplete-form position-relative">
							<div className={(this.state.autoCompleteVisibility.city == true ? '' : 'autocomplete-none') + " autocomplete-container"}>
								<ul className="autocomplete-list width-100" onMouseEnter={() => this.handleAutoCompleteActive('city', true)} onMouseLeave={() => this.handleAutoCompleteActive('city', false)}>
									{
										this.state.citiesData.map((item, index) => 
										(
											<li className={"autocomplete-item" + (index == this.state.pointer.city ? ' active' : '')} onClick={() => this.selectCity(item)}>{ item.name }</li>
										))
									}
								</ul>
							</div>
							<div className="helper-text font-orange-red inline-block font-tiny">
								{ formErrors.errorDomisili }
							</div>
						</div>
                    </Col>
                </Row>
				{/* <Row style={{marginTop:20}}>
					<Col s={11} m={11} l={11}>
						<h5 style={{marginBottom:5}}>Data Pekerjaan</h5>
					</Col>
				</Row> 
				<hr /> */}
				<Row>
                    <Col s={2} m={2} l={2}>
						<p>Alamat</p>
					</Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<Input
							type='textarea'
							name="address"
							s={12}
							placeholder="Masukkan Alamat"
							onChange={this.handleChange}
							value={formData.address} />
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorAlamat }
						</div>
                    </Col>
                </Row>
				<Row>
                    <Col s={2} m={2} l={2}>
                        <p>Pekerjaan</p>
                    </Col>
                    <Col s={9} m={9} l={9} className="list-data">
						<select
							name="occupation"
							className={"drop-down " + (this.state.formData.occupation ? 'text-inherit' : 'text-grey')}
							value={formData.occupation}
							onChange={this.handleChange}
						>
							<option value="" disabled selected>Pilih Satu Status Pekerjaan Saat Ini</option>
							<option value="Bekerja (full time/ part time/ pekerja lepas/ pekerja seni)">Bekerja (full time/ part time/ pekerja lepas/ pekerja seni)</option>
							<option value="Wirausaha">Wirausaha</option>
							<option value="Belum/ Tidak Bekerja (Sedang mencari kerja/ ibu rumah tangga/ studi/ sekolah)">Belum/ Tidak Bekerja (Sedang mencari kerja/ ibu rumah tangga/ studi/ sekolah)</option>
						</select>
						<div className="helper-text font-orange-red inline-block font-tiny">
							{ formErrors.errorOccupation }
						</div>

                    </Col>
                </Row>
				<Row className="mt-m">
                    <Col s={2} m={2} l={2}>
						<Button className="btn-small" onClick={this.handleSubmit}>
							Simpan
						</Button>
                    </Col>
				</Row>
			</div>
		)
	}
}

export default PersonalData;
