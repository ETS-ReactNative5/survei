import React from 'react'

class Image extends React.Component {
  render() {
  	var className = "image " + this.props.className;
  	var height = this.props.height ? this.props.height : "auto";
  	var caption = "";

  	if (this.props.caption) {
  		caption = <div className="caption">{this.props.caption}</div>
  	}

    return <div style={{backgroundImage: `url(${this.props.src})`, height: `${height}`}} className={className}>
    	{caption}
    	<img src={this.props.src} style={{display: 'none'}} />
    </div>
  }
}
export default Image
