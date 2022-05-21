import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import $ from "jquery";

class Carousel extends React.Component {
	handleClick = e => {
		var el = $(e.target)
			.parent()
			.parent();

		if (!el.hasClass("slick-active")) {
			e.preventDefault();
			if (el.prev().hasClass("slick-active")) {
				this.slider.slickNext();
			} else {
				this.slider.slickPrev();
			}
		}
	};

	render() {
		if (!this.props.items.length) {
			return <div></div>;
		}

		var banner = this.props.items.map((item, i) => {
			return (
				<div className="section-item hoverable">
					<Link
						onClick={this.handleClick.bind(this)}
						to={`/course/${item.slug}`}
					>
						<img src={item.image_url}  alt="slide"/>
					</Link>
				</div>
			);
		});

		var settings = this.props.settings;

		if (!settings) {
			settings = {
				arrows: false,
				dots: true,
				centerMode: true,
				infinite: true,
				speed: 500,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				centerPadding: "350px",
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							centerPadding: "300px"
						}
					},
					{
						breakpoint: 600,
						settings: {
							centerPadding: "60px"
						}
					},
					{
						breakpoint: 480,
						settings: {
							centerPadding: "20px"
						}
					}
				]
			};
		}

		return (
			<div className="banner">
				<Slider ref={c => (this.slider = c)} {...settings}>
					{banner}
				</Slider>
			</div>
		);
	}
}
export default Carousel;
