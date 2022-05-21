import React from 'react';
import {
    Button,
    Col,
    Input,
    Row
} from 'react-materialize';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import store from 'store';

class NumericalSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            min_value: 0,
            max_value: props.max_limit
        }
        this.sliderChange = this.sliderChange.bind(this);
        this.resetRange = this.resetRange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        let { min_value, max_value } = this.state;
        const { name } = this.props;
        if (prevState.min_value !== min_value || prevState.max_value !== max_value) {
            this.SaveFilterToStore(min_value, max_value, name);
        }
    }

    componentDidMount() {
        let { min_value, max_value } = this.state;
        const multiple = this.props.multiple ? this.props.multiple : 1;
        max_value = this.state.max_value * multiple;
        this.setState({ max_value: max_value });
        let value_range = store.get(this.props.name + "_range");
        if (value_range) {
            min_value = value_range[this.props.name + "_min"];
            max_value = value_range[this.props.name + "_max"];
            this.setState({ min_value: min_value, max_value: max_value });
        }
    }

    resetRange = () => {
        const multiple = this.props.multiple ? this.props.multiple : 1;
        const name = this.props.name;
        let { max_value } = this.state;
        max_value = this.props.max_limit * multiple;
        this.setState({ min_value: 0, max_value: max_value });
        this.SaveFilterToStore(0, max_value, name);
    }

    sliderChange = (e) => {
        let multiple = this.props.multiple ? this.props.multiple : 1;
        const { name } = this.props;
        let min_value = e[0] * multiple;
        let max_value = e[1] * multiple;
        this.setState({ min_value: min_value, max_value: max_value });
        this.SaveFilterToStore(min_value, max_value, name);
    }

    SaveFilterToStore(min_value, max_value, name) {
        let value_range_obj = {};
        value_range_obj[name + "_min"] = min_value;
        value_range_obj[name + "_max"] = max_value;
        store.set(name + "_range", value_range_obj);
    }


    render() {
        let { min_value, max_value } = this.state;
        let { title, max_limit, name } = this.props;
        const multiple = this.props.multiple ? this.props.multiple : 1;
        return (
            <div>
                <h6>{title}</h6>
                <Button id={name + "-range-reset"} onClick={this.resetRange} className="reset-range hide" />
                <Row className="range-filter">
                    <Col l={5} m={5} s={5} className="price-filter">
                        <Input value={min_value} onChange={(e) => {
                            this.setState({ min_value: e.target.value });
                        }} />
                    </Col>
                    <Col l={2} m={2} s={2} className="dash-text">
                        <i className="fa fa-minus" />
                    </Col>
                    <Col l={5} m={5} s={5} className="price-filter">
                        <Input value={max_value} onChange={(e) => this.setState({ max_value: e.target.value })} />
                    </Col>
                </Row>
                <div className="slider-container">
                    <Range className="numeric-slider" onChange={this.sliderChange}
                        allowCross={true}
                        value={[min_value / multiple, max_value / multiple]}
                        max={max_limit} />
                </div>
            </div>
        );
    }

}

export default NumericalSlider;
