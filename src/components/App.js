/* eslint-disable */
import $ from "jquery";
import React from "react";
import { Col, Icon, Modal, Preloader, ProgressBar, Row, SideNav, SideNavItem } from "react-materialize";
import Notifications, { notify } from "react-notify-toast";
import { Link, withRouter } from "react-router-dom";
import store from "store";
import "../styles/app.css";
import { trans } from "./Lang";
import Main from "./Main";
import { API_CATEGORY, API_PROVINCE, BASE_URL, CheckAuth, API_CEK_USER_DETAIL } from "./Util";


class App extends React.Component {
	static CONTACT_PHONE = "0811 9309 114";
	static CONTACT_EMAIL = "campus.hq@geti.id";
	static FB_URL = "https://www.facebook.com/GeTi.Incubator/";
	static IG_URL = "https://www.instagram.com/geti.incubator/?hl=en";

	constructor(props) {
		super(props);
		store.remove("home_data");

		this.state = {
			loading: false,
			loadingCategory: true,
			categories: [],
			os: null,
			search_url: "/course/catalog",
			is_completed: true,
			ticket_counter: 0
		};

		window.onpopstate = function(e) {
			if ($(".modal-overlay").length > 0) {
				$(".modal-overlay").click();
				props.history.go(1);
			}
		};

		this.socmedClick = this.socmedClick.bind(this);

		$(".btn-help").css({
			position: "fixed",
			bottom: "0rem",
			right: "0rem"
		});
	}

	componentDidMount() {
		if (!this.state.categories.length) {
			this.handleLoadData();
		}
	}

	handleLoadData = e => {
		var categories = null;

		if (!categories) {
			$.getJSON(API_CATEGORY).then(data => {
				this.setState({ categories: data.payload, loadingCategory: false });

				if(CheckAuth()) {
					this.checkPersonalDataStatus();
				}
			});
		} else {
			this.setState({ categories: categories, loadingCategory: false });
		}

		var provinces = store.get("provinces");

		if (!provinces) {
			$.getJSON(API_PROVINCE).then(data => {
				store.set("provinces", data.payload);
			});
		}
	};

	checkPersonalDataStatus = () => {
		var data_is_completed = store.get("data_is_completed");

		if(!data_is_completed) {
			$.getJSON(API_CEK_USER_DETAIL).then(data => {
				this.setState({ is_completed: data.payload.status });

				store.set("data_is_completed", data.payload.status);
			});	
		}
	}

	toggleTopNotification = (saveState, e) => {
		$("#root").toggleClass("mt-65");
		if (saveState) {
			store.set("top-notification", true);
		}
	};

	handleSearchCourse = (target, e) => {
		e.preventDefault();
		let param = { query: $(target).val() };

		$(target).blur();

		this.props.history.push("/search?" + $.param(param));
	};

	socmedClick = e => {
		console.log(e.target);
	};

	notifyPersonalData = () => {
		return (
			<div className="notify-personal-data" onClick={() => this.props.history.push("/personal-data", {needRefresh: false})}>
				Harap lengkapi data pribadi kamu. Klik di sini untuk melengkapi.
			</div>
		)
	}

	render() {
		let counter = this.state.ticket_counter;

		return (
			<div>
				<ProgressBar className="fixed loading" style={{ display: "none" }} />

				{!this.state.is_completed && (this.notifyPersonalData())}

				<Notifications />

				<div className={ !this.state.is_completed ? 'navbar-fixed mt-m' : 'navbar-fixed' }>
					<nav className="shadowed">
						<div className="nav-wrapper">
							<Link to="/" className="brand-logo hide-on-med-and-down">
								<img
									src={BASE_URL + "/img/white-label/logo/logo-horizontal.png"}
								/>
							</Link>
							<a
								href="#"
								data-activates="mobile-demo"
								className="button-collapse"
							>
								<i className="material-icons">menu</i>
							</a>
							<form
								onSubmit={this.handleSearchCourse.bind(this, "#search_mobile")}
								className="hide-on-large-only"
							>
								<div className="input-field">
									<Link to="/" className="brand-logo">
										<img
											src={
												BASE_URL + "/img/white-label/logo/logo-horizontal.png"
											}
										/>
									</Link>
									<Link
										id="search_url"
										to="{this.state.search_url}"
										className="hide"
									/>
									<input
										placeholder={`Cari ${trans.course} atau event`}
										id="search_mobile"
										type="search"
									/>
									<label className="label-icon" for="search">
										<i className="material-icons">search</i>
									</label>
								</div>
							</form>

							{CheckAuth() && (
								<ul
									className="right hide-on-med-and-down"
									style={{ marginRight: "180px" }}
								>
									<li>
										<Link className="font-orange" to="/course/catalog">
											Semua Kelas
										</Link>
									</li>
									<li>
										<Link className="font-orange" to="/profile">
											Kelas Saya
										</Link>
									</li>
								</ul>
							)}

							<SideNav
								trigger={
									CheckAuth() ? (
										<a
											className="right btn-menu font-orange ellipsis"
											style={{ maxWidth: "180px" }}
										>
											{counter > 0 && (
												<div
													className="badge hide red center absolute-right"
													style={{ top: 0 }}
												>
													{counter}
												</div>
											)}
											<span>
												<img className="circle" src={CheckAuth().foto} />
												<span className="hide-on-med-and-down">
													{" "}
													&nbsp; &nbsp; {CheckAuth().nama}{" "}
												</span>
											</span>
										</a>
									) : (
										<a className="right btn-menu font-orange hide-on-large-only">
											<i className="material-icons">menu</i>
										</a>
									)
								}
								options={{
									closeOnClick: true,
									edge: "right",
									draggable: false
								}}
							>
								{CheckAuth() && (
									<span>
										<SideNavItem
											userView
											user={{
												image: CheckAuth().foto,
												name: CheckAuth().nama
											}}
										/>
										<SideNavItem divider />
										<li>
											<Link to="/profile">Kelas Saya</Link>
										</li>
										<li>
											<Link to="/personal-data">Data Pribadi</Link>
										</li>
										<li>
											<Link to="/change-password">Ubah Password</Link>
										</li>
										<li>
											<a href="https://geti.id/karir" target="_blank">Karir</a>
										</li>
										<li>
											<Link to="/transactions">Transaksi</Link>
										</li>
										<li>
											<Link className="hide-on-large-only" to="/catalog">
												Katalog
											</Link>
										</li>
										<li>
											<Link to="/logout">Logout</Link>
										</li>
									</span>
								)}

								{!CheckAuth() && (
									<span>
										<li>
											<Link className="hide-on-large-only" to="/catalog">
												Katalog
											</Link>
										</li>
										<li>
											<Link to="/login">Masuk</Link>
										</li>
									</span>
								)}
							</SideNav>
							<div style={{ marginLeft: "130px" }}>
								<Modal
									bottomSheet
									trigger={
										<a className="left center-align mr-s font-grey font-tiny prl-m btn-catalog hide-on-med-and-down">
											<Icon className="ic-catalog" medium>
												apps
											</Icon>
											<span className="hide-on-med-and-down">Katalog</span>
										</a>
									}
								>
									<Row className="container">
										<Col s={12}>
											<a className="modal-close right">
												<Icon>clear</Icon>
											</a>
											<h4 className="mb-m">Katalog {trans.course}</h4>
											<hr />
										</Col>

										{this.state.loadingCategory && (
											<center className="pt-m loading">
												<Preloader size="big" />
											</center>
										)}
										{this.state.loadingCategory ||
											this.state.categories.map((category, i) => (
												<Col
													s={12}
													m={category.subcategories.length > 6 ? 9 : 6}
													className="height-100 pr-s"
												>
													<div className="valign-wrapper mb-xs">
														<img
															className="tiny mr-s"
															src={category.icon_url}
														/>
														<div className="h5">{category.name}</div>
													</div>
													<div style={{ marginLeft: "45px" }}>
														{Array.isArray(category.subcategories) &&
															category.subcategories.map((subcategory, j) => (
																<span className="inline">
																	<Link
																		className="modal-close"
																		to={`/course/catalog?category_id=${subcategory.id}`}
																	>
																		{subcategory.name} (
																		{subcategory.available_courses.length})
																	</Link>{" "}
																	&nbsp; &nbsp;{" "}
																</span>
															))}
													</div>
												</Col>
											))}
									</Row>
								</Modal>

								<form
									style={{ width: "220px", marginRight: "10px" }}
									onSubmit={this.handleSearchCourse.bind(this, "#search")}
									className="hide-on-med-and-down left form-bordered"
								>
									<div className="input-field">
										<input
											className="search"
											placeholder={`Cari ${trans.course} atau event`}
											id="search"
											type="text"
										/>
									</div>
								</form>
								{/* <ul className="hide-on-med-and-down">
									<li>
										<Link to="/course/catalog">Course</Link>
									</li>
									<li>
										<Link to="/event/catalog">Event</Link>
									</li>
								</ul> */}
							</div>

							{!CheckAuth() && (
								<ul id="nav-mobile" className="right hide-on-med-and-down">
									<li>
										<Link to="/login">
											<Icon className="left" small>
												person_outline
											</Icon>
											Masuk
										</Link>
									</li>
								</ul>
							)}
						</div>
					</nav>
				</div>

				<Main counter={counter} />

				<footer className="page-footer example">
					<div className="container">
						<div className="row">
							<Col s={12} className="font-grey strong center-s mb-m">
								<Link to="/faq">
									FAQ
								</Link>
								 &nbsp;|&nbsp; Privacy Policy
							</Col>
							<Col
								l={2}
								m={12}
								className="font-grey center-s hide-on-med-and-down"
							>
								<div className="valign-wrapper">
									<img
										className="mr-s height-30"
										src={BASE_URL + "/img/white-label/logo/logo.png"}
									/>
								</div>
							</Col>
							<Col s={12} m={10} l={10} className="footer-wrapper">
								<Col s={12} m={4} l={4}>
									<h5>Contact Us</h5>
									<h6 className="contact-text text-grey"><span className="strong text-grey">Email:</span> {App.CONTACT_EMAIL}</h6>
									<h6 className="contact-text text-grey"><span className="strong text-grey">Phone:</span> {App.CONTACT_PHONE}</h6>
								</Col>
								<Col s={12} m={5} l={5}>
									<Row>
										<h5>Social Media</h5>
									</Row>

									<Row className="socmed-wrapper">
										<Col l={4}>
											<div className="d-flex justify-content-between">
												<a
													onClick={this.socmedClick}
													href={App.FB_URL}
													target="_blank"
												>
													<img
														className="mr-s height-30"
														src={BASE_URL + "/img/home/ic_facebook.png"}
														name="FACEBOOK"
													/>
												</a>
												<a
													onClick={this.socmedClick}
													href={App.IG_URL}
													target="_blank"
												>
													<img
														className="height-30"
														src={BASE_URL + "/img/home/ic_instagram.png"}
														name="INSTAGRAM"
													/>
												</a>
											</div>
										</Col>
									</Row>
								</Col>

								<Col s={12} m={3} l={3}>
									<Row>
										<h5>Verified by</h5>
									</Row>
									<Row>
										<Col
											m={12}
											s={12}
											l={12}
											className="center-s right-align valign-wrapper google-icon"
										>
											<a href="https://www.google.com/partners/agency?id=3822485700" target="_blank">
												<img src="https://www.gstatic.com/partners/badge/images/2021/PartnerBadgeClickable.svg"/>
											</a>
										</Col>
									</Row>
								</Col>
							</Col>
							<Col s={12} className="center geti-copyright text-left text-grey">
								<hr />
								<span>
									Copyright 2017 © GeTI Online.
								</span>
							</Col>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

export default withRouter(App);
