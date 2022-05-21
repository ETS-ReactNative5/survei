import React from "react";
import Home from "../../components/Public/Home/Home";
import { Row, Col, Icon, CardTitle, Card, Slider, Slide } from "react-materialize";
import { CheckAuth,BASE_URL, API_HOME, API_COURSE_BASE_URL, API_CATEGORY } from "../../components/Util";
import $ from 'jquery';
import store from 'store';
import { Link } from 'react-router-dom';

class CatalogCourse extends Home {
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

                <h4>Daftar Kelas</h4>

			</div>
		);
	}
}


export default CatalogCourse;
