import React from "react";
import Home from "./Home";
import { Row, Col, Modal, Button, Slider, Slide } from "react-materialize";
import { CheckAuth, BASE_URL, API_COURSE_BASE_URL, API_CATEGORY } from "../../Util";
import Image from "../../Image";
import './Landingpage.css';
import { Link } from 'react-router-dom';

class LandingPage extends Home {
	constructor(props) {
		super(props);
	}

	render() {
        const sectionname = {
			color: "#df2e2e",
			margin: "10px",
            padding: "10px",
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
			color: "#8388BF"
		}

		const icontext = {
			lineHeight: "1.5"
		}

		const iconcolumn = {
			padding: "20px"
		}

		let announcement = this.state.announcement;
		let isLogin = CheckAuth() != "";

		return (
			<div>

				{this.getSlider2()}

				<div className="pad-xl fadeIn wow">
					<div style={sectionname}><h4>Category</h4></div>
					<div className="container">
						<Row>
							{this.getCategory()}								
						</Row>
					</div>
				</div>

				<div className="bg-white pad-xl fadeIn wow">			
					<div style={sectionname}><h4>Course</h4></div>            
					<div className="container">
						<Row>
							{this.getCourse2()}
						</Row>
						<Row>
							<Col s={12} m={12} l={12} style={{textAlign: "center", fontSize: "18px", color: "#8388BF", fontWeight: "700"}}>
							<Link to={`/list-course`}>See More</Link>
							</Col>
						</Row>
					</div>
				</div>

				<div className="pad-xl fadeIn wow">
					<div className="container center">
						<div style={sectionname}><h3 className="font-orange mb-m">Kenapa harus belajar di GeTI Online</h3></div>
						<Row>
							<Col s={12} m={3} l={3} className="pad-s fadeIn wow" style={iconcolumn}>
								<img className="mb-s icon-home" src={ BASE_URL + "/img/icon/entrepreneur.png"} />
								<h4 style={icontitle}>Tahapan Program Menuju Global Entrepreneur</h4>
								<p style={icontext}>GeTI memiliki 4 (empat) tahapan program (journey) yang terbukti membuat semua orang dari berbagai kalangan umur dan latar belakang pendidikan dapat menjadi global entrepreneur berbasis digital.</p>
							</Col>
							<Col s={12} m={3} l={3} className="pad-s fadeIn wow" style={iconcolumn}>
								<img className="mb-s icon-home" src={ BASE_URL + "/img/icon/teacher.png"} />
								<h4 style={icontitle}>Masa Inkubasi (Pendampingan) Pasca Pelatihan</h4>
								<p style={icontext}>Usai mengikuti kelas, GeTI menyediakan masa inkubasi (pendampingan) secara online (digital) sebagai sarana tanya-jawab & konsultasi pasca pelatihan.</p>
							</Col>
							<Col s={12} m={3} l={3} className="pad-s fadeIn wow" style={iconcolumn}>
								<img className="mb-s icon-home" src={ BASE_URL + "/img/icon/team-leader.png"} />
								<h4 style={icontitle}>Komunitas Global Entrepreneur</h4>
								<p style={icontext}>Setiap alumni GETI dapat bergabung dalam ekosistem global entrepreneur yang siap mendukung pemasaran skala ekspor yaitu: perijinan perusahaan/ lisensi produk, layanan logistik & transportasi, global buyer channel, akses ekspor melalui platform digital e-commerce dan display sample produk skala ekspor melalui export hub.</p>
							</Col>
							<Col s={12} m={3} l={3} className="pad-s fadeIn wow" style={iconcolumn}>
								<img className="mb-s icon-home" src={ BASE_URL + "/img/icon/quality.png"} />
								<h4 style={icontitle}>E-Sertificate</h4>
								<p style={icontext}>Setiap alumni GETI memperoleh electronic certificate (E-Certificate) sebagai standar kelulusan pada setiap tahap dan
								untuk isinya nanti ini</p>
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

                <div className="pb-l pt-m">
                    <Row className="container mb-0">
                        <Col s={12} m={12} className="fadeIn wow">
                            <iframe style={video} src="https://www.youtube.com/embed/FTXCHJ8oGIY" frameBorder="0" allowFullScreen={true}></iframe>
                        </Col>
                    </Row>
                </div>
                                
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
