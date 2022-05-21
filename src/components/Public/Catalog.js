import React from 'react'
import store from 'store'
import $ from 'jquery';
import Page from '../Page'
import { QueryParam, API_CATEGORY, FormatPrice , BASE_URL } from '../Util'
import { Row, Col, ProgressBar, Input, Preloader, Icon, Collapsible, CollapsibleItem, Collection, CollectionItem } from 'react-materialize'
import { Link } from 'react-router-dom'

class Catalog extends Page {
	static LIMIT = 20;

	constructor(props) {
	    super(props);
	    let params = QueryParam();

	    this.state = {categories: null};
			this.categoryClick = this.categoryClick.bind(this);
	}

	componentDidMount() {
	    this.handleLoadData();
	}

  handleLoadData = (params) => {
  		if (!params) {
  			params = this.state.params;
  		}

  		$.getJSON(API_CATEGORY)
        .then((data) => {
          this.setState({ categories: data.payload });
      });
	}

	categoryClick = (category, subcategory, e) =>{
	}

  render() {
    let categories = this.state.categories;

  	if (categories === null) {
      return super.render();
    }

  	return (
      <div className="container-small mt-m-l mb-m-l">
        <Collapsible>
        {categories.map((category, i) =>
          <CollapsibleItem key={i} header={
              <div className="valign-wrapper">
                <img className="tiny mr-s" src={category.icon_url} /><span> {category.name} </span>
              </div>
            } icon='keyboard_arrow_up'>
            <Collection>
            {Array.isArray(category.subcategories) && category.subcategories.map((subcategory, j) =>{
								this.categoryClick = this.categoryClick.bind(this, category, subcategory);
								return <Link onClick={this.categoryClick} style={{padding:'20px', paddingLeft : '65px'}} className="collection-item" to={`/course/catalog?category_id=${subcategory.id}`}>{subcategory.name} ({subcategory.available_courses.length} Courses)</Link>
						}
            )}
            </Collection>
          </CollapsibleItem>)}
        </Collapsible>
      </div>
    )
	}
}

export default Catalog
