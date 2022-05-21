import React from "react";
import $ from "jquery";
import "../../styles/course-catalog.css";
import { Col, Input, Row } from "react-materialize";
import { NumericalSlider, RadioGroup } from "../Reuseables";
import store from "store";
import { API_CATEGORY, API_SEARCH, BASE_URL } from "../Util";

class NewCourseCatalog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			chosen_categories: ""
		};

		this.categoryChecked = this.categoryChecked.bind(this);
	}

	componentDidMount() {
		$(".loading").hide();
		this.loadCourseCategories();
	}

	categoryChecked = e => {
		let { chosen_categories } = this.state;
		if (e.target.checked) {
			this.setState({ chosen_categories: e.target.value });
			$("#category_" + chosen_categories).prop("checked", true);
		}
	};

	loadCourseCategories = () => {
		let course_categories = store.get("course_categories");
		if (!course_categories) {
			$.get(API_CATEGORY).then(data => {
				let { categories } = this.state;
				data.payload.map(category => {
					categories.push({ label: category.name, value: category.id });
				});
				this.setState({ categories: categories });
				store.set("course_categories", categories);
			});
		} else {
			this.setState({ categories: course_categories });
		}
	};

	render() {
		let { categories, chosen_categories } = this.state;
		return (
			<div className="pad-small bg-white">
				<Row>
					<Col l={6} m={6} s={6}>
						<h5 id="filter-title">Filter</h5>
					</Col>
					<Col l={6} m={6} s={6} onClick={() => $(".reset-range").click()}>
						<span id="reset-filter">Reset</span>
					</Col>
				</Row>
				<div id="course-filter-main-div">
					<NumericalSlider
						title="Rentang Harga"
						max_limit={50000}
						name={"price"}
						multiple={1000}
					/>
					{/*<Input type="checkbox" label="Dapat dibeli dengan Voucher Ekstra" id="promo-label" className="filled-in"/>*/}
					<br />
					{/*<h6>Kategori</h6>
                    <br/>
                    <div className="category-checkboxes">
                        { categories &&
                            <RadioGroup name="course_category" options={categories}/>
                        }
                    </div>*/}
				</div>
			</div>
		);
	}
}

export default NewCourseCatalog;
