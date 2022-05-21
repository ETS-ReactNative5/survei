import React, { Component } from 'react';
import PopupBerhasil from '../../assets/popup_berhasil.svg';
import PopupGagal from '../../assets/popup_error.svg';
import { Link } from 'react-router-dom';
import "../../styles/popup.css";

class PopUp extends Component {
  render() {
    return (
      <div id="popup" className="popup-container">
        <div className="popup-wrapper bg-white text-center">
          <div className="popup-title">
            <div className="font-largest font-heavy mb-s">{this.props.title}</div>
          </div>
          <div className="popup-image mb-s">
            <img src={ (this.props.status) ? PopupBerhasil : PopupGagal } />
          </div>
          <div className="popup-desc font-thick-gray mb-s">
            <span>{this.props.desc}</span>
          </div>
          <div className="popup-button full">
            {
              (this.props.status)
                ? <Link to={this.props.redirectSuccess} className="btn full">{this.props.buttonTextSuccess}</Link>
                : <button onClick={this.props.hidePopup} className="btn full">
                    {this.props.buttonTextError}
                  </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PopUp;