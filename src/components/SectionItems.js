/* eslint-disable */
import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Image from "./Image";
import { Icon } from "react-materialize";
import { FormatDateIndo } from "./Util";
import EventConstants from "./Event/Constants";
import { trans } from "./Lang";

class SectionItems extends React.Component {
	static TYPE_COURSE = 0;
	static TYPE_EVENT = 1;
	static TYPE_JOURNEY = 4;

	render() {
		var data = this.props.data;
		var type = data.type;
		var items = <div></div>;

		console.log("ITEM TYPES >>> ", data);

		if (data.items.length) {
			items = this.props.data.items.map((item) => {
				// Course
				if (type === SectionItems.TYPE_COURSE) {
					return (
						<div className="section-item">
							<Link className="hoverable" to={`/course/${item.slug}`}>
								<Image
									captions={
										<div className="">
											<Icon className="left" small>
												school
											</Icon>{" "}
											Course
										</div>
									}
									height={150}
									src={item.course_image}
								/>
								<div className="pad-s bg-white course-card">
									<div className="h5">{item.title}</div>
									<br />
									<span className="font-light" style={{ color: "#9b9b9b" }}>
										{item.category.name}
									</span>
									<br />
									{item.instructor}
								</div>
							</Link>
						</div>
					);

					// Event
				} else if (type === SectionItems.TYPE_EVENT) {
					return (
						<div className="section-item">
							<Link className="hoverable" to={`/event/${item.slug}`}>
								<Image
									captions={
										<div className="">
											<Icon className="left" small>
												event
											</Icon>{" "}
											Event
										</div>
									}
									height={150}
									src={item.course_image}
								/>
								<div className="pad-s bg-white">
									<div className="h5">{item.title}</div>
									<div className="strong">
										{EventConstants.label(item.type)}
									</div>
									<div className="font-light font-grey">
										{FormatDateIndo(item.held_at, false, true)}
									</div>
									<div className="strong">{item.location}</div>
								</div>
							</Link>
						</div>
					);

					// Journey
				} else if (type === SectionItems.TYPE_JOURNEY) {
					return (
						<div className="section-item">
							<Link className="hoverable" to={`/learning-path/${item.slug}`}>
								<Image
									captions={
										<div className="">
											<Icon className="left" small>
												learning_path
											</Icon>{" "}
											Learning Path
										</div>
									}
									height={150}
									src={item.thumbnail}
								/>
								<div className="pad-s bg-white">
									<div className="h5">{item.title}</div>
									<div className="font-orange mb-s valign-wrapper">
										<Icon tiny className="icon-course">
											book_material
										</Icon>{" "}
										{item.course_count} {trans.course_item}
									</div>
								</div>
							</Link>
						</div>
					);
				}
			});
		}

		var settings = this.props.settings;
		var slidesToShow = 4;

		if (type === SectionItems.TYPE_EVENT) {
			slidesToShow = 3;
		}

		if (!settings) {
			settings = {
				arrows: true,
				speed: 300,
				slidesToShow: slidesToShow,
				slidesToScroll: slidesToShow,
				infinite: false,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: slidesToShow - 1,
							slidesToScroll: slidesToShow - 1,
							infinite: false
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							variableWidth: true
						}
					}
				]
			};
		}

		return (
			<div className="section">
				<Slider {...settings}>{items}</Slider>
			</div>
		);
	}
}
export default SectionItems;
