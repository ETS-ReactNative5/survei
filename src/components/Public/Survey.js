import React from "react";
import $ from "jquery";
import Page from "../Page";
import { API_GET_PROVINCE, API_COURSE_BASE_URL, API_SURVEY } from "../Util";
import { Row, Col, Input, Button } from "react-materialize";
import { notify } from "react-notify-toast";
import "../../styles/survey.css";

class Survey extends Page {
	constructor(props) {
		super(props);
		this.state = {
			dateFormType: "text",
			autoCompleteVisibility: {
				province: false,
				course: false,
			},
			autoCompleteActive: {
				province: false,
				course: false,
			},
			startEditDomisili: false,
			pointer: {
				province: 0,
				course: 0,
			},
			startPointer: false,
			provincesData: [],
			provincesData_filtered: [],
			genderData: ["L", "P"],
			coursesData: [],
			coursesData_filtered: [],
			formData: {
				name: "",
				email: "",
				gender: "",
				age: "",
				province: "",
				province_id: "",
				course: "",
				course_id: "",
				question: [
					{ id: "1", answer: "" },
					{ id: "2", answer: "" },
					{ id: "3", answer: "" },
					{ id: "4", answer: "" },
					{ id: "5", answer: "" },
				],
				comment: "",
			},
			formErrors: {
				errorFullname: "",
				errorEmail: "",
				errorGender: "",
				errorAge: "",
				errorProvince: "",
				errorCourse: "",
			},
		};

		this.regexFullname = RegExp(/^[A-Za-z ]+$/);
		this.regexDate = RegExp(
			/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
		);
		this.clientToken = "aa6d8694eea3d1b52aa6e4169b0a822665b56fc4";
	}

	componentDidMount() {
		this.loadProvincesData();
		this.loadCoursesData();
	}

	selectProvince = (e, province) => {
		if (typeof province != "undefined") {
			let formData = this.state.formData;
			formData.province = province.name;
			formData.province_id = province.province_id;

			this.setState({
				autoCompleteVisibility: {
					province: false,
					course: false,
				},
			});
		}
	};

	loadProvincesData = () => {
		$.getJSON(API_GET_PROVINCE).then((data) => {
			this.setState({
				provincesData: data.payload,
			});
		});
	};

	loadProvincesData_filtered = (keyword) => {
		let result = this.state.provincesData.filter((province) =>
			province.name.toLowerCase().includes(keyword.toLowerCase()),
		);

		this.setState({ provincesData_filtered: result });
	};

	selectCourse = (e, course) => {
		if (typeof course != "undefined") {
			let formData = this.state.formData;
			formData.course = course.title;
			formData.course_id = course.uuid;

			this.setState({
				autoCompleteVisibility: {
					province: false,
					course: false,
				},
			});
		}
	};

	loadCoursesData = () => {
		$.getJSON(API_COURSE_BASE_URL).then((data) => {
			this.setState({
				coursesData: data.payload,
			});
		});
	};

	loadCoursesData_filtered = (keyword) => {
		let result = this.state.coursesData.filter((course) =>
			course.title.toLowerCase().includes(keyword.toLowerCase()),
		);

		this.setState({ coursesData_filtered: result });
	};

	handleFocus = (type, state) => {
		let { autoCompleteVisibility } = this.state;
		autoCompleteVisibility[type] = state;

		if (!this.state.formData[type]) {
			this.setState({ provincesData_filtered: this.state.provincesData });
		}
	};

	handleChange = (e) => {
		let { value, name } = e.target;
		let { formData } = this.state;

		switch (name) {
			case "fullname":
				formData.name = value;
				break;
			case "email":
				formData.email = value;
				break;
			case "gender":
				formData.gender = value;
				break;
			case "umur":
				formData.age = parseInt(value);
				break;
			case "provinsi":
				formData.province = value;
				this.loadProvincesData_filtered(value);
				this.setState({
					autoCompleteVisibility: {
						province: true,
						course: false,
					},
				});
				this.state.pointer.province = 0;
				break;
			case "pelajaran":
				formData.course = value;
				this.loadCoursesData_filtered(value);
				this.setState({
					autoCompleteVisibility: {
						province: false,
						course: true,
					},
				});
				this.state.pointer.course = 0;
				break;
			case "question_1":
				formData.question[0].answer = value;
				break;
			case "question_2":
				formData.question[1].answer = value;
				break;
			case "question_3":
				formData.question[2].answer = value;
				break;
			case "question_4":
				formData.question[3].answer = value;
				break;
			case "question_5":
				formData.question[4].answer = value;
				break;
			case "comment":
				formData.comment = value;
				break;
			default:
				break;
		}

		this.setState({ formData });
	};

	ArrowKeySelectProvince = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if (e.keyCode == "38") {
			if (pointer.province > 0) {
				pointer.province--;
			}

			if (pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}

			this.setState({ pointer });
		} else if (e.keyCode == "40") {
			if (pointer.province > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if (
				pointer.province <
				this.state.provincesData_filtered.length - 1
			) {
				pointer.province++;
			}
			this.setState({ pointer });
		} else if (e.keyCode == "13") {
			e.preventDefault();
			this.handleAutocompleteBlur("province");
		}

		if (
			this.state.provincesData_filtered.length &&
			typeof this.state.provincesData_filtered[pointer.province] !=
				"undefined"
		) {
			this.state.formData.province =
				this.state.provincesData_filtered[pointer.province].name;
			this.state.formData.province_id =
				this.state.provincesData_filtered[pointer.province].province_id;
		}
	};

	ArrowKeySelectCourse = (e) => {
		this.state.startPointer = true;

		let pointer = this.state.pointer;

		if (e.keyCode == "38") {
			if (pointer.course > 0) {
				pointer.course--;
			}

			if (pointer.course > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position - 36);
			}

			this.setState({ pointer });
		} else if (e.keyCode == "40") {
			if (pointer.course > 5) {
				let position = $(".autocomplete-list").scrollTop();
				$(".autocomplete-list").scrollTop(position + 36);
			}

			if (pointer.course < this.state.coursesData_filtered.length - 1) {
				pointer.course++;
			}
			this.setState({ pointer });
		} else if (e.keyCode == "13") {
			e.preventDefault();
			this.handleAutocompleteBlur("course");
		}

		if (
			this.state.coursesData_filtered.length &&
			typeof this.state.coursesData_filtered[pointer.course] !=
				"undefined"
		) {
			this.state.formData.course =
				this.state.coursesData_filtered[pointer.course].title;
			this.state.formData.course_id =
				this.state.coursesData_filtered[pointer.course].uuid;
		}
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		if (this.checkIsFormValid()) {
			let formData = this.state.formData;

			formData.gender = formData.gender.toUpperCase();

			this.handleUpdate(formData);
		}
	};

	checkInputValidity = (array, data) => {
		return array.find((item) => item == data) ? true : false;
	};

	checkCityAndProvince = (array, data) => {
		return array.find((item) => item.name == data) ? true : false;
	};

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

		// Email Validation
		if (!formData.email) {
			formErrors.errorEmail = "Email tidak boleh kosong";
		} else if (!formData.email || !formData.email.includes("@")) {
			formErrors.errorEmail = "Email yang anda masukkan tidak valid";
		} else {
			formErrors.errorEmail = "";
		}

		// Gender Validation
		if (!formData.gender) {
			formErrors.errorGender = "Jenis Kelamin tidak boleh kosong";
		} else if (
			!this.checkInputValidity(this.state.genderData, formData.gender)
		) {
			formErrors.errorGender = "Jenis Kelamin tidak valid";
		} else {
			formErrors.errorGender = "";
		}

		// Province Validation
		if (!formData.province) {
			formErrors.errorProvince = "Provinsi tidak boleh kosong";
		} else if (
			!this.checkCityAndProvince(
				this.state.provincesData,
				formData.province,
			)
		) {
			formErrors.errorProvince =
				"Provinsi tidak valid. Harap pilih dari list yang sudah disediakan";
		} else {
			formErrors.errorProvince = "";
		}

		this.setState({ formErrors });

		// RETURN ISVALID
		Object.values(formErrors).forEach((value) => {
			if (value) {
				this.setState;
				isValid = false;
			}
		});

		return isValid;
	};

	handleAutocompleteBlur = (type) => {
		if (this.state.startPointer) {
			if (type == "province") {
				this.selectProvince(
					this.state.provincesData_filtered[
						this.state.pointer.province
					],
				);
			} else if (type == "course") {
				this.selectCourse(
					this.state.coursesData_filtered[this.state.pointer.course],
				);
			}

			this.state.startPointer = false;
		}

		let { autoCompleteVisibility } = this.state;

		if (this.state.autoCompleteActive[type] == false) {
			autoCompleteVisibility[type] = false;

			this.setState({ autoCompleteVisibility: autoCompleteVisibility });
		}
	};

	handleAutoCompleteActive = (type, state) => {
		let { autoCompleteActive } = this.state;
		autoCompleteActive[type] = state;

		this.setState({ autoCompleteActive });
	};

	handleUpdate = (params) => {
		$.post(API_SURVEY, params)
			.then((data) => {
				if (data.payload) {
					notify.show("Data Survey berhasil disimpan", "success");

					setTimeout(function () {
						window.location.reload();
					}, 1000);
				} else {
					notify.show(
						"Terdapat kesalahan, silakan coba lagi",
						"warning",
					);
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

	render() {
		let bannerImage = "img/survey-img/Gambar banner-03.png";
		let formData = this.state.formData;
		let formErrors = this.state.formErrors;

		return (
			<div>
				<div className="survey-header">
					<div className="container survey-container">
						<Row className="mb-0 align-items-center">
							<Col l={7}>
								<h2 className="text-black h2-survey-banner">
									SURVEY
									<br />
									TIM CUSTOMER SERVICE
									<br />
									LPK GETI INCUBATOR!
								</h2>
								<p className="p-survey-banner">
									Suvey tim customer service ini kami
									laksanakan untuk meningkatkan pelayanan
									penanganan pertanyaan atau keluhan peserta
									oleh tim customer service di LPK GETI
									Incubator. Hasil survey Getters akan kami
									jadikan acuan pelayanan pelatihan agar lebih
									baik lagi kedepannya.
								</p>
							</Col>
							<Col l={5}>
								<div>
									<img
										src={bannerImage}
										className="survey-banner"
									></img>
								</div>
							</Col>
						</Row>
					</div>
				</div>
				<div className="survey-body">
					<div className="container">
						{/* Nama Lengkap */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>Nama Lengkap Anda</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<input
									name="fullname"
									placeholder="Masukkan Nama Lengkap Anda"
									type="text"
									onChange={this.handleChange}
									value={formData.name}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{formErrors.errorFullname}
								</div>
							</Col>
						</Row>

						{/* Email */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>Alamat Email Anda</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<input
									name="email"
									placeholder="Masukkan Alamat Email Anda"
									type="email"
									onChange={this.handleChange}
									value={formData.email}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{formErrors.errorEmail}
								</div>
							</Col>
						</Row>

						{/* Jenis Kelamin */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>Jenis Kelamin Anda</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<select
									name="gender"
									className={
										"drop-down " +
										(this.state.formData.education
											? "text-inherit"
											: "text-grey")
									}
									value={formData.gender}
									onChange={this.handleChange}
								>
									<option value="" disabled selected>
										Pilih Jenis Kelamin
									</option>
									<option value="L">Laki-laki</option>
									<option value="P">Perempuan</option>
								</select>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{formErrors.errorGender}
								</div>
							</Col>
						</Row>

						{/* Umur */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Usia Anda (isi hanya dengan ANGKA, contoh:
									30)
								</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<input
									name="umur"
									placeholder="Masukkan Usia Anda"
									type="number"
									onChange={this.handleChange}
									value={formData.age}
								/>
								<div className="helper-text font-orange-red inline-block font-tiny">
									{formErrors.errorAge}
								</div>
							</Col>
						</Row>

						{/* Provinsi */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>Domisili berdasarkan Provinsi Anda</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<input
									name="provinsi"
									type="text"
									placeholder="Provinsi"
									onBlur={() =>
										this.handleAutocompleteBlur("province")
									}
									onChange={this.handleChange}
									onFocus={() =>
										this.handleFocus("province", true)
									}
									onKeyDown={this.ArrowKeySelectProvince}
									value={formData.province}
									className="autocomplete-form"
									autoComplete="off"
									disabled={
										this.state.provincesData.length
											? false
											: true
									}
								/>
								<div className="autocomplete-form position-relative">
									<div
										className={
											(this.state.autoCompleteVisibility
												.province == true
												? ""
												: "autocomplete-none") +
											" autocomplete-container"
										}
									>
										<ul
											className="autocomplete-list width-100"
											onMouseEnter={() =>
												this.handleAutoCompleteActive(
													"province",
													true,
												)
											}
											onMouseLeave={() =>
												this.handleAutoCompleteActive(
													"province",
													false,
												)
											}
										>
											{this.state.provincesData_filtered.map(
												(item, index) => (
													<li
														className={
															"autocomplete-item" +
															(index ==
															this.state.pointer
																.province
																? " active"
																: "")
														}
														onClick={(e) =>
															this.selectProvince(
																e,
																item,
															)
														}
													>
														{item.name}
													</li>
												),
											)}
										</ul>
									</div>
									<div className="helper-text font-orange-red inline-block font-tiny">
										{formErrors.errorProvince}
									</div>
								</div>
							</Col>
						</Row>

						{/* Course */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>Topik Pelatihan yang Anda Ikuti</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<input
									name="pelajaran"
									type="text"
									placeholder="Masukkan Kelas yang Anda Ikuti"
									onBlur={() =>
										this.handleAutocompleteBlur("course")
									}
									onChange={this.handleChange}
									onFocus={() =>
										this.handleFocus("course", true)
									}
									onKeyDown={this.ArrowKeySelectCourse}
									value={formData.course}
									className="autocomplete-form"
									autoComplete="off"
									disabled={
										this.state.coursesData.length
											? false
											: true
									}
								/>
								<div className="autocomplete-form position-relative">
									<div
										className={
											(this.state.autoCompleteVisibility
												.course == true
												? ""
												: "autocomplete-none") +
											" autocomplete-container"
										}
									>
										<ul
											className="autocomplete-list width-100"
											onMouseEnter={() =>
												this.handleAutoCompleteActive(
													"course",
													true,
												)
											}
											onMouseLeave={() =>
												this.handleAutoCompleteActive(
													"course",
													false,
												)
											}
										>
											{this.state.coursesData_filtered.map(
												(item, index) => (
													<li
														className={
															"autocomplete-item" +
															(index ==
															this.state.pointer
																.course
																? " active"
																: "")
														}
														onClick={(e) =>
															this.selectCourse(
																e,
																item,
															)
														}
													>
														{item.title}
													</li>
												),
											)}
										</ul>
									</div>
									<div className="helper-text font-orange-red inline-block font-tiny">
										{formErrors.errorCourse}
									</div>
								</div>
							</Col>
						</Row>

						{/* Question 1 */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Tingkat kecepatan tim customer service dalam
									membalas chat Anda?
								</p>
							</Col>
							<Col
								s={12}
								m={12}
								l={12}
								style={{ display: "flex" }}
							>
								<p style={{ marginRight: "10px" }}>
									Sangat Buruk
								</p>
								<Input
									name="question_1"
									type="radio"
									className="with-gap"
									value="1"
									onChange={this.handleChange}
								/>
								<Input
									name="question_1"
									type="radio"
									className="with-gap"
									value="2"
									onChange={this.handleChange}
								/>
								<Input
									name="question_1"
									type="radio"
									className="with-gap"
									value="3"
									onChange={this.handleChange}
								/>
								<Input
									name="question_1"
									type="radio"
									className="with-gap"
									value="4"
									onChange={this.handleChange}
								/>
								<Input
									name="question_1"
									type="radio"
									className="with-gap"
									value="5"
									onChange={this.handleChange}
								/>
								<p style={{ marginLeft: "10px" }}>
									Sangat Baik
								</p>
							</Col>
						</Row>

						{/* Question 2 */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Tingkat ketepatan tim customer service dalam
									memahami pertanyaan atau keluhan Anda?
								</p>
							</Col>
							<Col
								s={12}
								m={12}
								l={12}
								style={{ display: "flex" }}
							>
								<p style={{ marginRight: "10px" }}>
									Sangat Buruk
								</p>
								<Input
									name="question_2"
									type="radio"
									className="with-gap"
									value="1"
									onChange={this.handleChange}
								/>
								<Input
									name="question_2"
									type="radio"
									className="with-gap"
									value="2"
									onChange={this.handleChange}
								/>
								<Input
									name="question_2"
									type="radio"
									className="with-gap"
									value="3"
									onChange={this.handleChange}
								/>
								<Input
									name="question_2"
									type="radio"
									className="with-gap"
									value="4"
									onChange={this.handleChange}
								/>
								<Input
									name="question_2"
									type="radio"
									className="with-gap"
									value="5"
									onChange={this.handleChange}
								/>
								<p style={{ marginLeft: "10px" }}>
									Sangat Baik
								</p>
							</Col>
						</Row>

						{/* Question 3 */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Tata bahasa yang digunakan tim customer
									service untuk berkomunikasi dengan Anda?
								</p>
							</Col>
							<Col
								s={12}
								m={12}
								l={12}
								style={{ display: "flex" }}
							>
								<p style={{ marginRight: "10px" }}>
									Sangat Buruk
								</p>
								<Input
									name="question_3"
									type="radio"
									className="with-gap"
									value="1"
									onChange={this.handleChange}
								/>
								<Input
									name="question_3"
									type="radio"
									className="with-gap"
									value="2"
									onChange={this.handleChange}
								/>
								<Input
									name="question_3"
									type="radio"
									className="with-gap"
									value="3"
									onChange={this.handleChange}
								/>
								<Input
									name="question_3"
									type="radio"
									className="with-gap"
									value="4"
									onChange={this.handleChange}
								/>
								<Input
									name="question_3"
									type="radio"
									className="with-gap"
									value="5"
									onChange={this.handleChange}
								/>
								<p style={{ marginLeft: "10px" }}>
									Sangat Baik
								</p>
							</Col>
						</Row>

						{/* Question 4 */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Tingkat Ketepatan informasi dari tim
									customer service dalam menjawab pertanyaan
									atau menangani keluhan Anda?
								</p>
							</Col>
							<Col
								s={12}
								m={12}
								l={12}
								style={{ display: "flex" }}
							>
								<p style={{ marginRight: "10px" }}>
									Sangat Buruk
								</p>
								<Input
									name="question_4"
									type="radio"
									className="with-gap"
									value="1"
									onChange={this.handleChange}
								/>
								<Input
									name="question_4"
									type="radio"
									className="with-gap"
									value="2"
									onChange={this.handleChange}
								/>
								<Input
									name="question_4"
									type="radio"
									className="with-gap"
									value="3"
									onChange={this.handleChange}
								/>
								<Input
									name="question_4"
									type="radio"
									className="with-gap"
									value="4"
									onChange={this.handleChange}
								/>
								<Input
									name="question_4"
									type="radio"
									className="with-gap"
									value="5"
									onChange={this.handleChange}
								/>
								<p style={{ marginLeft: "10px" }}>
									Sangat Baik
								</p>
							</Col>
						</Row>

						{/* Question 5 */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Apakah Anda puas dengan pelayanan tim
									customer service LPK GETI?
								</p>
							</Col>
							<Col
								s={12}
								m={12}
								l={12}
								style={{ display: "flex" }}
							>
								<p style={{ marginRight: "10px" }}>
									Sangat Buruk
								</p>
								<Input
									name="question_5"
									type="radio"
									className="with-gap"
									value="1"
									onChange={this.handleChange}
								/>
								<Input
									name="question_5"
									type="radio"
									className="with-gap"
									value="2"
									onChange={this.handleChange}
								/>
								<Input
									name="question_5"
									type="radio"
									className="with-gap"
									value="3"
									onChange={this.handleChange}
								/>
								<Input
									name="question_5"
									type="radio"
									className="with-gap"
									value="4"
									onChange={this.handleChange}
								/>
								<Input
									name="question_5"
									type="radio"
									className="with-gap"
									value="5"
									onChange={this.handleChange}
								/>
								<p style={{ marginLeft: "10px" }}>
									Sangat Baik
								</p>
							</Col>
						</Row>

						{/* Kritik / saran  */}
						<Row>
							<Col s={12} m={12} l={12}>
								<p>
									Kritik/saran untuk tim customer service LPK
									GETI Incubator
								</p>
							</Col>
							<Col s={12} m={12} l={12}>
								<Input
									name="comment"
									placeholder="Tulis Kritik dan Saran Anda"
									type="textarea"
									s={12}
									m={12}
									l={12}
									onChange={this.handleChange}
									value={formData.comment}
								/>
							</Col>
						</Row>

						<Row className="mt-s mb-s">
							<Col s={2} m={2} l={2}>
								<Button
									className="btn-small"
									onClick={this.handleSubmit}
								>
									Simpan
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}

export default Survey;
