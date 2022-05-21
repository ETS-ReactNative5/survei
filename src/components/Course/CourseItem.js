/* eslint-disable */

import React from 'react';
import { Col, Row, Icon } from 'react-materialize';
import { Link } from 'react-router-dom';
import Image from '../Image';
import { FormatPrice , BASE_URL } from '../Util';
import { trans } from '../Lang';

class CourseItem extends React.Component {

  render() {
    let data = this.props.data;
    let className = this.props.className;

    return (
      <Row>
        <Col m={12}>
          <Link to={`/course/${data.slug}`}>
            <div className={className || "bg-white pad-m mb-s section-card hoverable"}>
              <Image src={data.thumbnail} className="square" />
              <div className="content">
                  <h5>{data.title}</h5>
                  <div className="font-grey mb-s">{data.instructor}</div>
                      <div className="mb-s font-orange font-medium">{data.price == 0 ? trans.free : FormatPrice(data.price)}</div>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
    )
  }
}

export default CourseItem;
