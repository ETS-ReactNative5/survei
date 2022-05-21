import React from "react";
import Home from "./Home";
import { Row, Col, Card, Icon, CardTitle, Modal, Button } from "react-materialize";
import { notify } from "react-notify-toast";
import Slider from "react-slick";
import { CheckAuth, BASE_URL, API_COURSE_BASE_URL, API_CATEGORY_DASHBOARD, API_USER_COURSE_COUNT } from "../../Util";
import Image from "../../Image";
import './Landingpage.css';
import { Link } from 'react-router-dom';
import store from 'store';
import $ from 'jquery';
import { alert } from "../../Lang";
import VideoPlayer from "../../Reuseables/VideoPlayer";
import ReactPlayer from 'react-player'
import * as rdd from 'react-device-detect';


let URL_IMG = '';
class LandingPage extends Home {
	constructor(props) {
		super(props);
		this.state = {
			courses: [], 
			categories: [], 
			facilitator: [], 
			contributor: [], 
			detail_facilitator: [], 
			detail_contributor: [], 
			countUserJoin: [], 
			countSertificate: [],
			getFavorite: [],
			user_review: [],
			detail_kisah_sukses: [],
			jumlahnya: 0,
			showVideo: false,
			max_ctitle_length: 45
		};
	}

	componentDidMount() {
		this.handleLoadData().then(() => {
			if (this.props.location.state != undefined) {
				if (this.props.location.state.login == 1) {
					notify.show(
						"Selamat akun anda telah aktif di online.geti.id",
						"success", 2000
					);
				}
			}
		})
	}


	handleLoadData = async() => {

		fetch('./facilitator.json')
			.then(response => response.json())
			.then((data) => {
				let facilitatorData = { facilitator: data.facilitator };
				console.log("FACILITATOR DATA LP >>> ", facilitatorData);
				store.set("facilitator_data", facilitatorData);
				this.setState(facilitatorData);
			});

		fetch('./contributor.json')
			.then(response => response.json())
			.then((data) => {
				let contributorData = { contributor: data.contributors };
				console.log("CONTRIBUTOR DATA LP >>> ", contributorData);
				store.set("contributor_data", contributorData);
				this.setState(contributorData);
			});

		fetch('./user_review.json')
			.then(response => response.json())
			.then((data) => {
				let contributorData = { user_review: data.contributors };
				this.setState(contributorData);
			});

		$.get(API_COURSE_BASE_URL, { journey: 1 })
			.then((data) => {
				let courseData = { courses: data.payload };
				store.set("course_data", courseData);
				this.setState(courseData);

			});


		$.get(API_CATEGORY_DASHBOARD, { journey: 1 })
			.then((data) => {
				let categoryData = { categories: data.payload };
				store.set("category_data", categoryData);
				console.log("CATEGORY DATA LP >>> ", categoryData);
				this.setState(categoryData);
			});

		// $.get(API_USER_COURSE_COUNT, {journey : 1})
		// .then((data) => {
		//   	let count_data = { countUserJoin: data.payload.userjoined,countSertificate: data.payload.certificate,getFavorite: data.payload.favourite_course };
		//   	store.set("category_data", count_data);
		//   	console.log("CATEGORY DATA LP >>> ", count_data);
		//   	this.setState(count_data);
		// });

	}

	//render course title
	renderCourseTitle = (title) => {
		console.log('title length : ' + title.length);
		return title.length < this.state.max_ctitle_length ? title : title.substring(0, this.state.max_ctitle_length) + "..."
	}


	getCourse = () => {
		var course = (
			this.state.courses.slice(0, 8).map(item => (
				<Col
					l={3}
					m={3}
					s={12}
				>
					<Link to={`/course/${item.slug}`}>
						<Card
							closeIcon={<Icon>close</Icon>}
							header={<CardTitle image={item.thumbnail_small}></CardTitle>}
							revealIcon={<Icon>more_vert</Icon>}
							className="card-course"
						>
							<div className="content-desktop">{this.renderCourseTitle(item.title)}</div>
							<div className="content-mobile">{item.title}</div>
							<div style={{ bottom: "0px" }}>Rp. {item.final_price}</div>
						</Card>
					</Link>
				</Col>
			))
		)
		return course;
	}

	onMediaAction = () => {
		this.setState({
			showVideo: false
		});
	}

	getFacilitator = () => {
		let img_path = `${process.env.PUBLIC_URL}`;

		var facilitator = (
			this.state.facilitator.map(item => (

				<Col
					l={4}
					m={4}
					s={12}
				>
					{/* <a href={'http://www.geti.id/v1/read_facilitator/teacher/' + item.id_artikel} target='_blank'> */}

					<Card onClick={() => this.clikDetailFacilitator(item.id_artikel)}
						style={{ cursor: 'pointer' }}
						closeIcon={<Icon>close</Icon>}
						// header={<CardTitle image={ 'http://geti.id/files/media/' + item.foto }></CardTitle>}
						header={<CardTitle image={`${img_path}/landing_page/${item.foto}`}></CardTitle>}
						className="card-facilitator-contributor"
					>
						<p style={{ fontWeight: "bold" }}>{item.judul}</p>
						{item.subjudul}
					</Card>
				</Col>
			))
		)
		return facilitator;
	}

	getContributor = () => {
		let img_path = `${process.env.PUBLIC_URL}`;
		var contributors = (
			this.state.contributor.map(item => (
				<Col
					l={4}
					m={4}
					s={12}
				>
					<Card onClick={() => this.clikDetailContributor(item.id_artikel)}
						style={{ cursor: 'pointer' }}
						closeIcon={<Icon>close</Icon>}
						// header={<CardTitle image={ 'http://geti.id/files/media/' + item.foto }></CardTitle>}
						header={<CardTitle image={`${img_path}/landing_page/${item.foto}`}></CardTitle>}
						className="card-facilitator-contributor"
					>
						<p style={{ fontWeight: "bold" }}>{item.judul}</p>
						{item.subjudul}
					</Card>
				</Col>

			))
		)
		return contributors;
	}

	getUserJoin = () => {
		// var 	bilangan = 23456789;

		// var	reverse = bilangan.toString().split('').reverse().join(''),
		// 	ribuan 	= reverse.match(/\d{1,3}/g);
		// 	ribuan	= ribuan.join('.').split('').reverse().join('');

		let countcourse = this.state.countUserJoin;
		var dataCountingCourse = (
			countcourse.map(item => item.total_count)
		)
		const numb = parseInt(dataCountingCourse);
		return this.formatRibuan(numb);
	}

	getCountSertificateCourse = () => {
		let countcourse = this.state.countSertificate;

		var dataCountingCourse = (
			countcourse.map(item => item.total_count)
		)
		// return dataCountingCourse;
		const numb = parseInt(dataCountingCourse);
		return this.formatRibuan(numb);
	}

	getFavoriteCourse = () => {
		let countcourse = this.state.getFavorite;

		var dataCountingCourse = (
			countcourse.map(item => (
				<li>
					<Link to={`/course/${item.title}`} style={{ color: '#1839f4', textDecoration: 'underline', fontWeight: 'bolder' }}>
						{item.title}
					</Link>
				</li>
			))
		)
		return dataCountingCourse;
	}

	formatRibuan = (numb) => {
		return parseFloat(numb).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	}


	clikDetailFacilitator = (id_artikel) => {
		this.setState({ detail_facilitator: [] });
		$("#btn-modal-detail-contributor").trigger("click");
		$(".loading").hide();
		let all_facilitators = this.state.facilitator;
		let filter_data = all_facilitators.filter(val => val.id_artikel == id_artikel);
		this.setState({
			detail_facilitator: filter_data
		});

	}
	clikDetailContributor = (id_artikel) => {
		this.setState({ detail_facilitator: [] });
		$("#btn-modal-detail-contributor").trigger("click");
		$(".loading").hide();
		let all_contributor = this.state.contributor;
		let filter_data = all_contributor.filter(val => val.id_artikel == id_artikel);
		this.setState({
			detail_facilitator: filter_data
		});

	}

	clikDetailKisahSukses = (id_review) => {
		this.setState({ detail_kisah_sukses: [] });

		console.log(id_review)
		$("#btn-modal-kisah-sukses").trigger("click");
		$(".loading").hide();
		let all_user_review = this.state.user_review;
		let filter_data = all_user_review.filter(val => val.id == id_review);
		this.setState({
			detail_kisah_sukses: filter_data,
			showVideo: true
		});

	}



	render() {

		let imgTpl = (this.state.categories || []).map((image, index) => {
			return (
				<div key={image.Id} className="slick-kategory">
					{image.id == 1
						?
						<div>
							<Link to={'/prakerja'}>
								<img src={image.icon_url} />
								<p className="categoryText">{image.name}</p>
								<p style={{ padding: "10px" }}>{image.title}</p>
							</Link>
							<div className="flex-jc-center">
								<Button variant="contained" color="primary">
									<a target="_blank" href='https://geti.id/prakerja' className="text-white">INFO SELENGKAPNYA</a>
								</Button>
							</div>
						</div>
						:
						<div>
							{/* <Link to={`/course/catalog?category_id=${image.id}`}> */}
							<a href="https://reguler.geti.id">
								<img src={image.icon_url} />
								<p className="categoryText">{image.name}</p>
								<p style={{ padding: "10px" }}>{image.title}</p>
								<div className="flex-jc-center">
									<Button variant="contained" color="primary">
										<span className="text-white">INFO SELENGKAPNYA</span>
									</Button>
								</div>
							</a>
						</div>
					}
				</div>
			);
		});
		let list_kisah_sukses = (this.state.user_review || []).map((item, index) => {
			return (
				<div key={item.id} className="slick-kategory">
					<Row>
						<Col
							m={6}
							s={12}
						>
							<Card onClick={() => this.clikDetailKisahSukses(item.id)}
								closeIcon={<Icon>close</Icon>}
								header={<CardTitle image={`/img/kisah_sukses_testimoni/${item.images}`} />}
								horizontal
								revealIcon={<Icon>more_vert</Icon>}
								className="card-kisah-sukses"
							>
								<img onClick={() => this.clikDetailKisahSukses(item.id)} className="btnplay" src={`/img/play_button.png`} />
								<Row className="break-word">
									<div className="wrapper">
										<img className="circle imgProfile" src={`/img/kisah_sukses_testimoni/${item.images}`} />
										<div className="name">{item.name.substring(0, 50)}</div>

									</div>
									<div>
										<Col l={12} m={12} s={12}>
											<p className="review-detail break-word">{item.title.substring(0, 90)}
											</p>
										</Col>
									</div>
								</Row>
								{/* </h6> */}
							</Card>
						</Col>
					</Row>
				</div>
			);
		});

		const ImgBanner = [
			{
				'key': '1',
				'img': '/img/banner/THE-FIRST.jpg',
				'title': 'First Global Ecommerce',
				'a': '/prakerja',
			},
			{
				'key': '2',
				'img': '/img/banner/design_new2.jpg',
				'title': 'Surabaya',
				'a': '/course/trik-jadi-youtuber-sukses',
			},
			{
				'key': '3',
				'img': '/img/banner/design_new3.jpg',
				'title': 'Bangka Belitung',
			},
			{
				'key': '4',
				'img': '/img/banner/design_new4.jpg',
				'title': 'Bangka Belitung',
			},
			{
				'key': '5',
				'img': '/img/banner/design_new5.jpg',
				'title': 'Bangka Belitung',
			},
			{
				'key': '6',
				'img': '/img/banner/design_new6.jpg',
				'title': 'DKI Jakarta',
			},
		];

		const sectionname = {
			color: "#df2e2e",
			margin: "20px",
			padding: "20px",
			fontSize: "1.5em",
			fontWeight: "bold",
			textAlign: "center"
		};

		const bannerSection = {
			color: "#df2e2e",
			padding: "40px",
			fontSize: "1.5em",
			fontWeight: "bold",
			textAlign: "center"
		};

		const video = {
			width: "100%",
			height: "500px",
			border: "0"
		};

		const icontitle = {
			padding: "10px",
			fontSize: "18px",
			fontWeight: "700",
			color: "#8388BF",
			textAlign: "left"
		}

		const icontext = {
			fontSize: "10px",
			lineHeight: "1.5",
			paddingLeft: "10px",
			textAlign: "left"
		}

		const iconcolumn = {
			padding: "10px"
		}

		const article = {
			border: "1px solid #ccc",
			borderRadius: "5px",
			backgroundColor: "#FFFFFF",
			height: "550px",
			width: "550px",
		}

		const playerwrapper = {
			position: "relative",
			paddingTop: "2%" /* 720 / 1280 = 0.5625 */
		}

		const reactplayer = {
			position: "1px solid #ccc",
			absolute: "5px",
			top: '0',
			left: '0',
		}

		const settings = {
			draggable: true,
			dots: false,
			autoplay: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1
		};

		const settings_category = {
			dots: false,
			autoplay: true,
			infinite: true,
			slidesToShow: 2,
			slidesToScroll: 2,
			responsive: [
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						initialSlide: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		};

		const style_kisah_sukses = {
			dots: false,
			autoplay: false,
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 4,
			responsive: [
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
						initialSlide: 4
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		};

		let BannerCekSertifikat = () => {
			return(	
				<div 
					style={{position:"relative"}}
					className="hide-on-med-and-down "
				>
					<img 
						src="/img/banner/bk_background1.png" 
						alt=""
						style={{ 
							width:"100%",
							height:"auto",
							zIndex:"-1"
						}}
						className="bg-white pad-m"
					/>
					<div>
						<h5
							style={{
								fontSize:"1.8vw",
								color: "white",
								position:"absolute",
								top: '31%',
								left: '18%'
							}} 
							className="bottom-left"

						>
							Jangan lupa untuk cek status sertifikat<br/>
							dan tukar kode voucher kamu di sini.
						</h5>
						<a href="https://nanya.online/cs-tanya-sertifikat" target="_blank">
							<img 
								src="/img/banner/bk_imagebtnwa_ver2.png" 
								alt="" 
								style={{ 
									width: '14%',
									height: 'auto',
									position:"absolute",
									top: '22%',
									left: '55%'
								}}
							/>
						</a>
						<a href="https://bit.ly/redeemvouchergetincubator" target="_blank">
							<img 
								src="/img/banner/bk_imagebtnkode_ver2.png" 
								alt="" 
								style={{ 
									width: '14%',
									height: 'auto',
									zIndex:'1',
									position:"absolute",
									top: '22%',
									left: '70%'
								}}
							/>
						</a>
					</div>
				</div>
			)
		}

		let MbBannerCekSertifikat = () => {
			return(	
				<div 
					style={{
						position:"relative",
					}}
				>
					<img 
						src="/img/banner/mbver2_new_background.png" 
						alt=""
						style={{ 
							width:"100%",
							height:"auto",
							// zIndex:"-2"
						}}
						className="container"
					/>
					<div>
						<h5
							style={{
								fontSize: "4vw",
								color: "white",
								position:"absolute",
								top: "35%",
								left: "30%",
								transform: "translate( -22%, -50% )"
							}} 
							className="bottom-left text-center"

						>
							Jangan lupa untuk cek status sertifikat<br/>
							dan tukar kode voucher kamu di sini.
						</h5>
					</div>
					<div>
						<a href="https://wa.wizard.id/d3ffd3" target="_blank">
							<img 
								src="/img/banner/mbver2_button-cek-status.png" 
								alt="" 
								style={{ 
									width: '32%',
									height: 'auto',
									position:"absolute",
									top: '50%',
									left: '16%'
								}}
							/>
						</a>
						<a href="/prakerja">
							<img 
								src="/img/banner/mbver2_tukar-kode-button.png" 
								alt="" 
								style={{ 
									width: '32%',
									height: 'auto',
									zIndex:'1',
									position:"absolute",
									top: '50%',
									left: '51%'
								}}
							/>
						</a>
					</div>
				</div>
			)
		}
		
		let MidBannerCekSertifikat = () => {
			return(	
				<div 
					style={{position:"relative", zIndex:'1'}}
					className="hide-on-large-only hide-on-small-only"
				>
					<img 
						src="/img/banner/mbver2_new_background.png" 
						alt=""
						style={{ 
							width:"100%",
							height:"auto",
							// zIndex:"-1"
						}}
						className="bg-white"
					/>
					<div>
						<h3
							style={{
								// fontSize: "18",
								fontSize: "4vw",
								color: "white",
								position:"absolute",
								top: "35%",
								left: "30%",
								transform: "translate( -22%, -50% )"
							}} 
							className="bottom-left text-center"

						>
							Jangan lupa untuk cek status sertifikat<br/>
							dan tukar kode voucher kamu di sini.
						</h3>
						<a href="https://wa.wizard.id/d3ffd3" target="_blank">
							<img 
								src="/img/banner/mbver2_button-cek-status.png" 
								alt="" 
								style={{ 
									width: '32%',
									height: 'auto',
									position:"absolute",
									top: '50%',
									left: '16%'
								}}
							/>
						</a>
						<a href="/prakerja">
							<img 
								src="/img/banner/mbver2_tukar-kode-button.png" 
								alt="" 
								style={{ 
									width: '32%',
									height: 'auto',
									zIndex:'1',
									position:"absolute",
									top: '50%',
									left: '51%'
								}}
							/>
						</a>
					</div>
				</div>
			)
		}

		let announcement = this.state.announcement;
		let user_review_data = this.state.user_review;
		let isLogin = CheckAuth() != "";

		return (
			<div>
				<div className="hide-on-med-and-down">
					{BannerCekSertifikat()}
				</div>
				<div className="hide-on-med-and-up">
					{MbBannerCekSertifikat()}
				</div>
				<div>
					{MidBannerCekSertifikat()}
				</div>
				<div className="container banner">
					<Slider {...settings}>
						{ImgBanner.map(item => (
							<div>
								<a href={item.a}>
									<img src={BASE_URL + item.img} alt={item.title} />
								</a>
							</div>
						))}
					</Slider>
				</div>


				<div className="bg-white pad-m fadeIn wow">
					<div style={sectionname}><h4>Daftar Kategori</h4></div>
					<div className="container kategori slide-daftar-kategori">
						{imgTpl.length > 0 ? <Slider {...settings_category}>{imgTpl}</Slider> : null}
					</div>
				</div>

				<div className="fadeIn wow kenapa-section">
					<div className="wow-wrapper">
						<div className="container center">
							<div style={sectionname}><h3 className="font-orange">KENAPA HARUS BELAJAR DI LPK GETI INCUBATOR</h3></div>
							<Row>
								<Col s={12} m={6} l={6} className="pad-s fadeIn wow" style={iconcolumn}>
									<Row className="bacgroundCategory d-flex align-items-center mb-m">
										<Col s={12} m={3} l={3}>
											<img src={BASE_URL + "/img/why-choose-geti/polos-01.png"} />
										</Col>
										<Col s={12} m={9} l={9}>
											<h4 style={icontitle}>Tahapan Program Menuju Global Entrepreneur</h4>
											<p style={icontext}>
												GeTI memiliki empat tahapan program yang terbukti membuat semua orang dari berbagai kalangan umur dan latar belakang pendidikan dapat menjadi global entrepreneur berbasis digital.
											</p>
										</Col>
									</Row>
								</Col>
								<Col s={12} m={6} l={6} className="pad-s fadeIn wow" style={iconcolumn}>
									<Row className="bacgroundCategory mb-m">
										<Col s={12} m={3} l={3}>
											<img src={BASE_URL + "/img/why-choose-geti/polos-02.png"} />
										</Col>
										<Col s={12} m={9} l={9}>
											<h4 className="mb-0" style={icontitle}>Masa Inkubasi (Pendampingan) Pasca Pelatihan</h4>
											<p style={icontext} className="mt-0 mb-0">
												Usai mengikuti kelas, GeTI menyediakan masa inkubasi secara online sebagai sarana tanya-jawab dan konsultasi pasca pelatihan untuk pendampingan berkelanjutan kepada peserta pelatihan.
											</p>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col s={12} m={6} l={6} className="pad-s fadeIn wow secondRow" style={iconcolumn}>
									<Row className="bacgroundCategory mb-m">
										<Col s={12} m={3} l={3}>
											<img src={BASE_URL + "/img/why-choose-geti/polos-03.png"} />
										</Col>
										<Col s={12} m={9} l={9}>
											<h4 style={icontitle}>Komunitas Global Entrepreneur</h4>
											<p style={icontext}>
												Setiap alumni GeTI dapat bergabung dalam ekosistem global entrepreneur yang siap mendukung pemasaran skala ekspor dengan layanan melalui export hub.
											</p>
										</Col>
									</Row>
								</Col>
								<Col s={12} m={6} l={6} className="pad-s fadeIn wow secondRow" style={iconcolumn}>
									<Row className="bacgroundCategory mb-m">
										<Col s={12} m={3} l={3}>
											<img src={BASE_URL + "/img/why-choose-geti/polos-04.png"} />
										</Col>
										<Col s={12} m={9} l={9}>
											<h4 style={icontitle}>E-Sertificate</h4>
											<p style={icontext}>
												Setiap alumni GeTI memperoleh electronic certificate (e-certificate) sebagai standar kelulusan setelah mengikuti rangkaian pelatihan berdasarkan kategori kelas.
											</p>
										</Col>
									</Row>
								</Col>
							</Row>
						</div>
					</div>
				</div>

				{/* <div className="pad-l fadeIn wow">
					<div className="container center">
						<div style={sectionname}><h4>GeTI adalah Lembaga Pendidikan berbasis inkubasi yang bertujuan untuk <span className="font-orange mb-m">mencetak anak negeri berkompetensi.</span></h4></div>
						<Row>
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow" >
								<Row className="bacgroundCategory" style={{minHeight:'300px',maxHeight:'280px',boxShadow:'4px 3px 12px 1px #ccd4d7',borderRadius:'20px'}}>
									<Col s={12} m={12} l={12}>
										<img src={ BASE_URL + "/img/icon/entrepreneur.png"} />	
									</Col>
									<Col s={12} m={12} l={12}>
										<h4 style={{textAlign:'center',fontSize:'22px',color:'#aeb6ba'}}>User bergabung</h4>
										<h1 style={{textAlign:'center',color:'#0962aa'}}>
											{this.getUserJoin()}
										</h1>									
									</Col>
								</Row>								
							</Col>
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow" >
								<Row className="bacgroundCategory" style={{minHeight:'300px',maxHeight:'280px',boxShadow:'4px 3px 12px 1px #ccd4d7',borderRadius:'20px'}}>
									<Col s={12} m={12} l={12}>
										<img src={ BASE_URL + "/img/icon/quality.png"} />
									</Col>
									<Col s={12} m={12} l={12}>
										<h4 style={{textAlign:'center',fontSize:'22px',color:'#aeb6ba'}}>Certificate created</h4>
										<h1 style={{textAlign:'center',color:'#0962aa'}}>
											{this.getCountSertificateCourse()}
										</h1>
										
									</Col>
								</Row>								
							</Col>							
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow" >
								<Row className="bacgroundCategory" style={{minHeight:'300px',maxHeight:'280px',boxShadow:'4px 3px 12px 1px #ccd4d7',borderRadius:'20px'}}>
									<Col s={12} m={12} l={12}>
										<img src={ BASE_URL + "/img/ic_medallion.png"} />
									</Col>
									<Col s={12} m={12} l={12}>
										<h4 style={{textAlign:'center',fontSize:'22px',color:'#aeb6ba'}}>Top 2 Classes All the Time </h4>
										<ul style={{textAlign:'center',lineHeight:'35px'}}>
											{this.getFavoriteCourse()}
										</ul>
									</Col>
								</Row>								
							</Col>							
						</Row>
											
					</div>
				</div> */}

				<div className="bg-white pad-l fadeIn wow">
					<div style={sectionname}><h4>Course</h4></div>
					<div className="container">
						<Row>
							{this.getCourse()}
						</Row>
						<Row>
							<Col s={12} m={12} l={12} style={{ textAlign: "center", fontSize: "18px", color: "#8388BF", fontWeight: "700", paddingTop: "20px" }}>
								<Link to={`/list-course`}>See More</Link>
							</Col>
						</Row>
					</div>
				</div>

				<div className="pad-l fadeIn wow">
					<div style={sectionname}><h4>Instruktur</h4></div>
					<div className="container facilitator">
						<Row>
							{this.getFacilitator()}
						</Row>
					</div>
					<div style={sectionname}><h4>The Contributors</h4></div>
					<div className="container facilitator">
						<Row>
							{this.getContributor()}
						</Row>
					</div>
				</div>

				<div className="bg-white pad-l fadeIn wow">
					<div style={sectionname}>
						<h4 className="font-orange mb-0">Kisah Sukses</h4>
						<h6 className="font-black mb-m">Ikuti jejak mereka sukses belajar dan meniti karir</h6>
						<div className="container kategori slide-kisah-sukses">
							{list_kisah_sukses.length > 0 ? <Slider {...style_kisah_sukses}>{list_kisah_sukses}</Slider> : null}
						</div>
					</div>
				</div>

				<div className="pad-l fadeIn wow" style={{ display: 'none' }}>
					<div style={sectionname}><h4>Artikel</h4></div>
					<div className="container">
						<Row>
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow">
								<div className="article-box">
									<a target="_blank" href="http://www.geti.id/v1/read/article/574">
										<img className="mb-s" src="http://geti.id/files/media/rsz_shutterstock_1698110098.jpg" />
										<div style={{ padding: "5px", paddingLeft: "20px" }}>
											PERUBAHAN POLA KONSUMSI INFORMASI MASYARAKAT DI TENGAH WABAH COVID-19
										</div>
									</a>
								</div>
							</Col>
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow">
								<div className="article-box">
									<a target="_blank" href="http://www.geti.id/v1/read/article/573">
										<img className="mb-s" src="http://geti.id/files/media/rsz_91514499_572369723370706_8528389936668922271_n.jpg" />
										<div style={{ padding: "5px", paddingLeft: "20px" }}>
											LAKUKAN TIPS INI! ATASI DAMPAK CORONA DENGAN PASAR GO DIGITAL
										</div>
									</a>
								</div>
							</Col>
							<Col s={12} m={4} l={4} className="pad-s fadeIn wow">
								<div className="article-box">
									<a target="_blank" href="http://www.geti.id/v1/read/article/572">
										<img className="mb-s" src="http://geti.id/files/media/rsz_2img20200311151821_1.jpg" />
										<div style={{ padding: "5px", paddingLeft: "20px" }}>
											KOLABORASI GETI INCUBATOR & AEXI EXPORT HUB SEBAGAI RUMAH UKM-NYA INDONESIA
										</div>
									</a>
								</div>
							</Col>
						</Row>
						<Row>
							<Col s={12} m={12} l={12} style={{ textAlign: "center", fontSize: "18px", fontWeight: "700" }}>
								<Button variant="contained" color="primary">
									<a target="_blank" href='http://www.geti.id/v1/read/articles' style={{ color: "#FFFFFF" }}>Lihat Lainnya</a>
								</Button>
							</Col>
						</Row>
					</div>
				</div>
				{/* 
                <div className="bg-white pad-l fadeIn wow">
                    <Row className="container">
                        <Col s={12} m={12} className="fadeIn wow">
                            <img src="http://www.geti.id/v1/assets/images/slidebannerlogocollaborationGeTI-02.jpg" />
                        </Col>
                    </Row>
				</div>

                <div className="pad-l fadeIn wow">
                    <Row className="container">
                        <Col s={12} m={12} className="fadeIn wow">
                            <img src="http://www.geti.id/v1/assets/images/Geti_media_coverage.jpeg" />
                        </Col>
                    </Row>
				</div>				 */}

				<div className="bg-white pb-l pt-m">
					<div style={sectionname}><h4>Video Tutorial Kelas GeTI Online</h4></div>
					<Row className="container">
						<Col s={12} m={4} l={4} className="fadeIn wow">
							<iframe src="https://www.youtube.com/embed/05S7WXhPOhI" frameBorder="0" allowFullScreen={true}></iframe>
							<div>Pendaftaran Akun dan Redeem Voucher</div>
						</Col>
						<Col s={12} m={4} l={4} className="fadeIn wow">
							<iframe src="https://www.youtube.com/embed/Nak_UFj7-AA" frameBorder="0" allowFullScreen={true}></iframe>
							<div>Isi Kuis</div>
						</Col>
						<Col s={12} m={4} l={4} className="fadeIn wow">
							<iframe src="https://www.youtube.com/embed/yQXQyMVsvH4" frameBorder="0" allowFullScreen={true}></iframe>
							<div>Rating Kelas</div>
						</Col>
					</Row>
					<Row className="container">
						<Col m={2} l={2}></Col>
						<Col s={12} m={4} l={4} className="fadeIn wow">
							<iframe src="https://www.youtube.com/embed/7-EyBoOGiJs" frameBorder="0" allowFullScreen={true}></iframe>
							<div>e-Sertifikat</div>
						</Col>
						<Col s={12} m={4} l={4} className="fadeIn wow">
							<iframe src="https://www.youtube.com/embed/KT9rC4bQJ3g" frameBorder="0" allowFullScreen={true}></iframe>
							<div>Unduh e-Sertifikat</div>
						</Col>
						<Col m={2} l={2}></Col>
					</Row>
				</div>

				{/* MODAL POP UP DETAIL*/}
				<Modal trigger={<Button className="hide" id="btn-modal-detail-contributor" />}
					modalOptions={{ dismissible: true }}
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
						<div className="mb-m">
							<div className="container facilitator">
								<div className="top-right-button">
									<a className="modal-close">
										{" "}
										<i className="fa fa-close" />{" "}
									</a>
								</div>
								<Col
									l={6}
									m={6}
									s={12}
								>
									{
										this.state.detail_facilitator ? this.state.detail_facilitator.map(val => {
											return (
												<div>
													{/* <Card style={{boxShadow:'none'}}
														
														header={<CardTitle image={`${process.env.PUBLIC_URL}/landing_page/${val.foto}`}></CardTitle>}
													>
													</Card> */}
													<div>
														<img src={`${process.env.PUBLIC_URL}/landing_page/${val.foto}`} style={{ width: '250px', height: '250px', borderRadius: '150px' }} />
													</div>

													<div className="text-justify" >
														<h5>{val.judul} </h5>
														<h6>{val.subjudul} </h6>
														<hr />
														<p>{val.kilasan}</p>
													</div>
												</div>
											)
										}) : ''
									}

								</Col>
							</div>
						</div>
					</div>
				</Modal>

				{/* MODAL POP UP KISAH SUKSES*/}
				<Modal trigger={<Button className="hide" id="btn-modal-kisah-sukses" />}
					modalOptions={{ dismissible: true }}
					id="modal-kisah-sukses"
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
					{/* <div className="center full"> */}
					{/* <div className="mb-m"> */}
					{/* <div className="container facilitator"> */}
					<div className="top-right-button">
						<a className="modal-close" onClick={() => this.onMediaAction()}>
							{" "}
							<i className="fa fa-close" />{" "}
						</a>
					</div>



					<Row>
						{
							this.state.detail_kisah_sukses ? this.state.detail_kisah_sukses.map(val => {
								return (
									<span>
										{/* <Row style={{marginLeft:'-10px'}}> */}
										<Col className="col-images-review" l={6} m={6} s={12}>
											{/* <img  src={`/img/kisah_sukses_testimoni/${val.images}`} /> */}
											<div className="video-comment">
												{/* <iframe src="https://www.youtube.com/embed/y6is0GLW7SU?autoplay=1&controls=0" width="480" height="400" frameBorder="0" allowFullScreen={true}></iframe> */}
												<div className='player-wrapper' style={playerwrapper}>
													<ReactPlayer style={reactplayer}
														url={val.video}
														// url='/video/video1.mp4'
														className='react-player ReactPlayerBox'
														playing={this.state.showVideo}
														width='400px'
														height='400px'
														controls={true}
													// onPause={(evntState) => this.onMediaAction(evntState)}
													// onPlay={(evntState) => this.onMediaAction(evntState)}
													/>
												</div>
											</div>

										</Col>
										<Col className="col-images-review-content" id="col-images-review-content" l={6} m={6} s={12}>
											<h4>{val.title}</h4>
											<p>{val.comment}</p>

											<div className="wrapper-parent">
												<Row className="wrapper">
													<img className="circle review-item" src={`/img/kisah_sukses_testimoni/${val.images}`} width="30" height="30" />
													<span className="review-item review-name">{val.name}</span>
												</Row>
											</div>
										</Col>
										{/* </Row> */}

										{/* <Card style={{boxShadow:'none'}}
														
														header={<CardTitle image={`${process.env.PUBLIC_URL}/landing_page/${val.foto}`}></CardTitle>}
													>
													</Card> */}
									</span>
								)
							}) : ''
						}

					</Row>
					{/* </div> */}
					{/* </div> */}
					{/* </div> */}
				</Modal>

			</div>
		);
	}
}

class Testimonial extends React.Component {
	render() {
		return (
			<div>
				<p className="h5 font-grey container-small mb-s mnt-m">
					{this.props.content}
				</p>
				<Image
					src={this.props.avatar}
					className="medium center avatar circle mb-s"
				/>
				<h5 className="font-orange">{this.props.user}</h5>
				<div className="font-grey">{this.props.role}</div>
			</div>
		);
	}
}


export default LandingPage;
