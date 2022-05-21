/* eslint-disable */

import React from 'react';
import {
	Button,
	Modal,
	Col
} from 'react-materialize';
import '../../styles/mini-components.css';

export const ScrollingModal = ({trigger, contents, ...rest}) => {
	return (
		<Modal
			trigger={trigger}
			className="scrolling-modal"
			options={rest.options}
			id={rest.id}
			bottomSheet={true}>
				<div className="modal-close scrolling-modal-close" onClick={rest.onClose}>
					<i className="fa fa-close"/>
				</div>
				<br/>
				{contents}
		</Modal>
	);
}

export const IconText = ({icon, text, col}) => {
	return (
		<Col l={col} m={col} s={col}>
			<div className="valign-wrapper mb-s">
			<img src={icon} id="pa-green-logo"/>
			<span style={{color: "#27ae60"}} id="pac-point-info" className="font-heavy">
			+ {text}
			</span>
			</div>
		</Col>
	);
}
