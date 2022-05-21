import React from "react";
import Home from "./Home";
import App from "../../App";
import { Row, Col, Modal, Button, Slider, Slide } from "react-materialize";
import { CheckAuth, BASE_URL } from "../../Util";
import Image from "../../Image";
import { trans } from "../../Lang";

class NewHome extends Home {
	constructor(props) {
		super(props);
	}

	render() {
		let announcement = this.state.announcement;
		let isLogin = CheckAuth() != "";

		return (
			<div>
				{this.getSlider()}

				{!isLogin && (
					<span>
						<div className="bg-white pad-xl">
							<div className="container">
								<h3 className="font-orange center mb-m">Mengenai GeTI Online</h3>
								<Row>
									<Col className="fadeInLeft wow" s={12} m={5}>
										<img
											className="mb-s hide-on-med-and-down"
											src={BASE_URL + "/img/home/ic_benefit_1.png"}
										/>
										<h4 className="font-orange">
											Sistem Inkubasi Bisnis Digital
										</h4>
										<div>
											GeTi Online akan membantu Anda untuk mencapai cita-cita dalam membangun bisnis berbasis 
											digital dan menghadapi persaingan digital dalam bimbingan GeTi.
										</div>
									</Col>
									<Col className="align-right fadeInRight wow" s={12} m={7}>
										<img
											className="almost-full"
											src={BASE_URL + "/img/white-label/pictures/product-1.png"}
										/>
									</Col>
								</Row>
								<Row>
									<Col
										s={12}
										m={7}
										className="hide-on-small-only fadeInLeft wow"
									>
										<img
											className="almost-full"
											src={
												BASE_URL +
												"/img/white-label/pictures/img_dummy_value02.png"
											}
										/>
									</Col>
									<Col className="fadeInRight wow" s={12} m={5}>
										<img
											className="mb-s hide-on-med-and-down"
											src={BASE_URL + "/img/home/ic_benefit_2.png"}
										/>
										<h4 className="font-orange">
											Langsung Tergabung Dalam Ekosistem Global Export
										</h4>
										<div>
											GeTI Online didukung oleh ekosistem yang membantu dalam menjalankan bisnis berbasis 
											digital sampai tahap ekspor, dengan tujuan akhir menjadi eksportir berbasis digital 
											dengan tergabung dalam E-Commerce Global Digital Export.
										</div>
									</Col>
									<Col
										s={12}
										m={7}
										className="hide-on-med-and-up fadeInLeft wow"
									>
										<img
											className="almost-full"
											src={
												BASE_URL +
												"/img/white-label/pictures/img_dummy_value02.png"
											}
										/>
									</Col>
								</Row>
								<Row>
									<Col className="fadeInLeft wow" s={12} m={5}>
										<img
											className="mb-s hide-on-med-and-down"
											src={BASE_URL + "/img/home/ic_benefit_3.png"}
										/>
										<h4 className="font-orange">
											E-Certificate
										</h4>
										<div>
											GeTI Online memberikan sertifikasi sebagai global digital entrepreneur, 
											dengan juga bekerja sama dengan Digital E-Commerce sebagai pelaku bisnis berbasis digital.
										</div>
									</Col>
									<Col className="align-right fadeInRight wow" s={12} m={7}>
										<img
											className="almost-full"
											src={
												BASE_URL +
												"/img/white-label/pictures/img_dummy_value03.png"
											}
										/>
									</Col>
								</Row>
							</div>
						</div>

						<div className="bg-grey pad-xl">
							<div className="container center fadeIn wow">
								<h3 className="font-orange mb-m">
									4 Langkah Mudah
									<br />
									Menjadi Global Digital Entrepreneur
								</h3>
								<Row>
									<Col className="pad-s" m={3} s={12}>
										<img
											className="mb-s icon-home"
											src={BASE_URL + "/img/white-label/icons/Icon-1.png"}
										/>
										<h5 className="font-orange">Daftar di GeTI Online</h5>
										<div>Daftarkan GeTI ID Anda.</div>
									</Col>
									<Col className="pad-s" m={3} s={12}>
										<img
											className="mb-s icon-home"
											src={BASE_URL + "/img/white-label/icons/Icon-2.png"}
										/>
										<h5 className="font-orange">
											Daftar {trans.course} yang Tersedia
										</h5>
										<div>
											Pilih dari course yang tersedia di GeTI Online.
										</div>
									</Col>
									<Col className="pad-s" m={3} s={12}>
										<img
											className="mb-s icon-home"
											src={BASE_URL + "/img/white-label/icons/Icon-3.png"}
										/>
										<h5 className="font-orange">
											Kerjakan
											<br />
											Assignment
										</h5>
										<div>
											Uji pemahaman Anda setelah mengikuti {trans.course} dari GeTI
										</div>
									</Col>
									<Col className="pad-s" m={3} s={12}>
										<img
											className="mb-s icon-home"
											src={BASE_URL + "/img/white-label/icons/Icon-4.png"}
										/>
										<h5 className="font-orange">
											Dapatkan
											<br />
											E-Certificate
										</h5>
										<div>
											Sebagai bukti bahwa Anda telah menyelesaikan{" "}
											{trans.course}{" "} dari GeTI
										</div>
									</Col>
								</Row>
							</div>
						</div>

						<div className="bg-white pad-xl testimoni fadeIn wow">
							<div className="container center">
								<h3 className="font-orange mb-0">Testimonial</h3>
								<Slider className="bg-white" indicators>
									<Slide placement="center">
										<Testimonial
											content="Melalui GeTI saya kini siap menjalankan whatsapp business dan email marketing untuk kantor saya."
											user="Siska"
											role="CRM Class"
											avatar={
												BASE_URL +
												"/img/white-label/facilitator/facilitator-1.jpg"
											}
										/>
									</Slide>
									<Slide placement="center">
										<Testimonial
											content="Saya jadi lebih banyak tahu mengenai e-commerce itu apa dan keunggulan e-commerce itu apa. Pengetahuan itu harus banyak kita gali karena ilmu itu tidak akan pernah habis bahkan akan kita bawa sampai mati."
											user="Sarah"
											role="Mahasiswi UKI"
											avatar={
												BASE_URL +
												"/img/white-label/facilitator/facilitator-2.jpg"
											}
										/>
									</Slide>
									<Slide placement="center">
										<Testimonial
											content="Motivasi terbesar saya mengikuti kelas digital marketing dan trade ekspor impor di GeTI, untuk lebih mengetahui konsep digital marketing. Saya mahasiswa semester akhir dan kebetulan mempunyai ide bisnis, Tapi masih abu-abu mengenai konsep marketing, pemasaran, penjualan dan kolaborasi. Terima Kasih GeTI."
											user="Rizky"
											role="Mahasiswa IPMI"
											avatar={
												BASE_URL +
												"/img/white-label/facilitator/facilitator-3.jpg"
											}
										/>
									</Slide>
								</Slider>
							</div>
						</div>

						<Row className="mb-0">
							<Col
								className="pad-xl-l bg-testimoni-left height-450"
								s={12}
								l={6}
							>
								<div className="width-400 fadeInLeft wow">
									<img
										className="mb-s"
										src={BASE_URL + "/img/home/img_quote.png"}
									/>
									<h4 className="font-white mb-s">
										Saya ikut kelas GeTI untuk mendapatkan pelajaran tentang copywriting dan mengetahui 
										fun-nya dunia digital. Selain itu, bisa mengetahui bagaimana caranya online shop kita bisa booming.
									</h4>
									<h5 className="font-white">Yuli</h5>
									<div className="font-white">Peserta GOMA Batch 10</div>
								</div>
							</Col>

							<Col
								className="pad-xl-l bg-testimoni-right height-450"
								s={12}
								l={6}
							>
								<div className="width-400 fadeInRight wow">
									<img
										className="mb-s"
										src={BASE_URL + "/img/home/img_quote.png"}
									/>
									<h4 className="font-white mb-s">
										Banyak banget yang bisa kita dapatkan di GeTI ini, mulai dari bagaimana caranya menjadi digital 
										marketer yang bisa membuat mempromosikan untuk produknya, copywriting, hingga mendesain logo.
									</h4>
									<h5 className="font-white">Salsa</h5>
									<div className="font-white">Peserta GOMA Batch 4</div>
								</div>
							</Col>
						</Row>
					</span>
				)}

				<div className="pad-l bg-white fadeIn wow">{this.getSection()}</div>

				<div className="bg-white bg-download">
					<div className="container">
						<Row>
							<Col
								className="height-450 height-300-s center-m fadeInLeft wow"
								l={6}
								s={12}
							>
								<div className="pad-xl">
									<h3 className="font-white mb-s center-m">
										Dapatkan Promo Eksklusif
										<br />
										GeTI Online
									</h3>
									<div className="mb-s font-white center-m">
										Daftarkan GeTI ID Anda untuk mendapatkan promo dan hadiah eksklusif bagi pengguna.
									</div>
								</div>
							</Col>
						</Row>
					</div>
				</div>

				{announcement && (
					<Modal
						trigger={
							<Button id="announcement-btn" className="hide">
								SUBMIT
							</Button>
						}
					>
						<div className="center almost-full">
							<img
								className="mb-s"
								src={BASE_URL + "/img/ic_announcement.png"}
							/>
							<h4 className="font-light">{announcement.title}</h4>
							{announcement.image_url && (
								<img className="mb-s height-150" src={announcement.image_url} />
							)}
							<div className="mb-m">{announcement.detail}</div>
							{!announcement.info_url && (
								<a className="btn modal-close capitalize btn-outline">Oke</a>
							)}
							{announcement.info_url && (
								<a
									href={announcement.info_url}
									target="_blank"
									className="btn modal-close capitalize btn-outline"
								>
									Lebih Lanjut
								</a>
							)}
						</div>
					</Modal>
				)}
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

export default NewHome;
