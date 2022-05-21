import React from "react";
import Home from "./Home";
import { Row, Col, Icon, CardTitle, Card } from "react-materialize";
import { CheckAuth, API_COURSE_BASE_URL } from "../../Util";
import './Landingpage.css';
import $ from 'jquery';
import store from 'store';
import { Link } from 'react-router-dom';

class Course extends Home {
	constructor(props) {
		super(props);
		this.state = { 
			kursus: [],
			max_title_length: 45
		};
	}

	componentDidMount() {

		$.get(API_COURSE_BASE_URL, {journey : 1})
		.then((data) => {
		  let courseData = { kursus: data.payload };
		  store.set("course_data", courseData);

		//   console.log("COURSE DATA >>> ", courseData);
		  
		  this.setState(courseData);
  
	  });
  
	}

	renderTitle = (title) => {
		return title.length < this.state.max_title_length ? title : title.substring(0, this.state.max_title_length) + "..."
	}

	getKurses = () => {
		var course = (
		  this.state.kursus.map(item => (
			  <Col
				l={3}
				m={3}
				s={12}
			  >
				<Card
				  closeIcon={<Icon>close</Icon>}
				  header={<CardTitle image={item.thumbnail}></CardTitle>}
				  revealIcon={<Icon>more_vert</Icon>}
				>
				  <Link to={`/course/${item.slug}`}>
					  	<div className="content-desktop">{ this.renderTitle(item.title) }</div>
					  	<div className="content-mobile">{ item.title }</div> 
				  		<div style={{bottom: "0px"}}>Rp. { item.final_price }</div>
				  </Link>
				</Card>
			  </Col>          
		  ))
		)
		return course;
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

		let announcement = this.state.announcement;
		let isLogin = CheckAuth() != "";

		return (
			<div>

				<div className="bg-white pad-xl fadeIn wow">			
					<div style={sectionname}><h4>Daftar Kelas</h4></div>            
					<div className="container">
						<Row>
							{this.getKurses()}
						</Row>
					</div>
				</div>
                                
			</div>
		);
	}
}


export default Course;
