/* eslint-disable */
import React from 'react';
import { Input } from 'react-materialize';
import store from 'store';
import '../../styles/radio-group.css';

class RadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosen_value: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange = (e) => {
        const { name } = this.props;
        this.setState({chosen_value: e.target.value});
        store.set(name, e.target.value);
    }

    render() {
        const { name, options, required } = this.props;
        let { chosen_value } = this.state;
        return(
            <div>
                { options.map( (option) =>
                    <div className="payment-method-inputs">
                        <Input type="radio" name={name} onChange={this.handleChange} value={option.value} label={option.label} checked={ chosen_value == option.value } required={required}/>
                    </div>
                )}
            </div>
        );
    }
}

export default RadioGroup;
