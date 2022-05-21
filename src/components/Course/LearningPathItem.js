/* eslint-disable */

import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../Image';
import { trans } from '../Lang';
import { Icon } from 'react-materialize';

class LearningPathItem extends React.Component {

  render() {
    let data = this.props.data;
    let className = this.props.className;
    let listCategoryLength = this.props.data.categories.length;
    let listCategory = this.props.data.categories.map((category, i) =>
      <span>{i == (listCategoryLength - 1) ? category.name : category.name + ', '}</span>);

    return (
      <Link to={`/learning-path/${data.slug}`}>
        <div className={className || "bg-white pad-m mb-s section-card"}>
          <Image src={data.thumbnail} className="square" />
          <div className="content">
            <h5 className="ellipsis hidden-overflow mh-40">{data.title}</h5>
            <div className="font-grey mb-s valign-wrapper"><Icon tiny className="icon-course">book_material</Icon> {data.course_count} {trans.course}</div>
            <div className="mb-s"><b>Skills: </b>{listCategory}</div>
          </div>
        </div>
      </Link>
    )
  }
}

export default LearningPathItem;
