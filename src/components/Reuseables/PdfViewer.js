import React from "react";
import { Document, Outline, Page } from "react-pdf";
import { Button, Icon, Card } from "react-materialize";

const ZOOM_STEP = 0.1;

class PdfViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			numPages: null,
			pageNumber: 1,
			pdfScale: 1
		}
	}

	onDocLoadSuccess = ({ numPages }) => {
		this.setState({ numPages });
		this.props.onMediaAction(this.props.topic, 3);
	}

	zoomOutPdf = () => {
		console.log('pdfScale: ' + this.state)
		if (this.state.pdfScale >= 0.5) {
			this.setState({pdfScale: this.state.pdfScale - ZOOM_STEP});
		}
	}

	zoomInPdf = () => {
		if (this.state.pdfScale < 1.5) {
			this.setState({pdfScale: this.state.pdfScale + ZOOM_STEP});
		}
	}

	onItemClick = ({ pageNumber: itemPageNumber }) => {
		this.setState({pageNumber: itemPageNumber});
	  }
	

	render() {
		const { pageNumber, numPages, pdfScale } = this.state;
		const { url } = this.props;

		return (
			<div className="pdf-div">
				<Button className="pdf-zoom-in"
					floating small
					icon={<Icon>zoom_in</Icon>}
					node="button"
					waves="light"
					onClick={this.zoomInPdf}
				/>
				<Button
					floating small className="pdf-zoom-out"
					icon={<Icon>zoom_out</Icon>}
					node="button"
					waves="light"
					onClick={this.zoomOutPdf}
				/>
				<Document
					file={url}
					onLoadSuccess = {this.onDocLoadSuccess}
					>
     				 <Outline onItemClick={this.onItemClick} />
					  <Page pageNumber={pageNumber || 1} />
					{/* {Array.from(
							new Array(numPages),
							(el, index) => (
								<Card className={"pdf-page"}>
									<Page className=""
										scale={pdfScale}
										key={`page_${index + 1}`}
										pageNumber={index + 1}
									/>
								</Card>
							),
						)} */}
					</Document>
			</div>
		);
	}
}

export default PdfViewer;
