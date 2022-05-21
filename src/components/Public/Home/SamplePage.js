import React from "react";
import Home from "./Home";
import Carousel from '../../Carousel';
import { Row, Col, Icon, CardTitle, Card, Slider, Slide } from "react-materialize";
import { CheckAuth,BASE_URL, API_HOME, API_COURSE_BASE_URL, API_CATEGORY } from "../../Util";
import Image from "../../Image";
import './Landingpage.css';
import $ from 'jquery';
import store from 'store';
import { Link } from 'react-router-dom';

class LandingPage extends Home {
	constructor(props) {
		super(props);
	}


	render() {

        return (
			<div className="pad-s mb-0">

                <img src={ BASE_URL + "/img/dentrepreneur.png"} width="100%" />

			</div>
		);
	}
}


export default LandingPage;
