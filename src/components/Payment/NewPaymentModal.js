import React from 'react';
import {
    Col,
    Row
} from 'react-materialize';
import {
	jade_green,
	pastel_red
} from '../../styles/ColorConsts';
import '../../styles/payment-modal.css';
import { FormatPrice , BASE_URL } from '../Util';

const DISCOUNT_TYPE = "1";
const REWARD_TYPE = "9";

class NewPaymentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_method: 0,
            payment_confirmed: false,
            typed_code: ""
        }
    }

    dispatch = action => {
        switch(action) {
            case "PAYMENT_CONFIRMED": {
                this.setState({payment_confirmed: true});
            }
            case "PAYMENT_CANCELLED": {
                this.setState({payment_confirmed: false});
            }
        }
    }

    getCalculationBox(item) {
        const { price, discount, score, rabat, title, final_price } = item;
		const ItemComponent = ({name, cost, amount_type}) =>
		<Row className="item-component">
			<Col s={6} m={6} l={6}>
				<span style={{color: amount_type === REWARD_TYPE ? jade_green : ''}}>{name}</span>
			</Col>
			<Col s={6} m={6} l={6}>
            	<span className="right" style={{color: amount_type === DISCOUNT_TYPE ? pastel_red : amount_type === REWARD_TYPE ? jade_green: ""}}>
					{amount_type === DISCOUNT_TYPE? "-": amount_type === REWARD_TYPE ? "+" : ""}{FormatPrice(cost? cost:0)}
				</span>
        	</Col>
		</Row>;
		return(
			<div id="calc-container">
					<ItemComponent name={title} cost={price}/>
					{/*<ItemComponent name="Diskon" cost={discount} amount_type={DISCOUNT_TYPE}/>*/}
					<hr/>
					<ItemComponent name="Total" cost={price-discount}/>
					{/*<ItemComponent name="Rabat" amount_type={REWARD_TYPE} cost={rabat}/>*/}
					<ItemComponent name="Score" amount_type={REWARD_TYPE} cost={score}/>
			</div>
		);
    }

    getPaymentCodeBox(){
        return false;
    }

    submitPayment(){
        return false;
    }

}

export default NewPaymentModal;
