import React from "react";
import { Button, Input, Modal } from "react-materialize";
import StarRatings from "react-star-ratings";
import "../../styles/rating-modal.css";
import $ from "jquery";
import { notify } from "react-notify-toast";
import { alert } from "../Lang";
import store from "store";

export const RatingBlock = ({
	rating_value,
	hover_color,
	rated_color,
	callback,
	...rest
}) => {
	return (
		<div id="rating-block">
			<StarRatings
				rating={rating_value}
				starRatedColor={rated_color}
				starHoverColor={hover_color}
				starDimension={rest.dimension}
				changeRating={callback}
				numberOfStars={rest.total_stars}
				name={rest.name}
			/>
		</div>
	);
};
export const CommentBlock = ({ title, label, callback, ...rest }) => {
	return (
		<div id="comment-block">
			<span id="comment-title">
				<h5>{title}</h5>
			</span>
			<p style={{lineHeight:1.2, color:'#5a5a5a', marginBottom:5}}>
				{rest.description}
			</p>
			<Input
				label={label}
				placeholder={rest.placeholder}
				onChange={callback}
				name={rest.name}
			/>
		</div>
	);
};

class RatingModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		props.rating_specs.map(spec => {
			this.state[spec.name] = 5;
		});
		props.comment_specs.map(spec => {
			this.state[spec.name] = "";
		});

		this.changeRating = this.changeRating.bind(this);
		this.commentChange = this.commentChange.bind(this);
		this.handleSubmitReview = this.handleSubmitReview.bind(this);
		this.closeRatingModal = this.closeRatingModal.bind(this);
	}

	componentDidMount() {
		let { is_open, modal_name } = this.props;
		if (is_open) {
			$("#" + modal_name + "_button").trigger("click");
		}
	}

	changeRating = (newRating, name) => {
		this.setState({ [name]: newRating });
	};

	closeRatingModal = e => {
		let { rating_specs, modal_name } = this.props;
		const item_type = rating_specs[0].item;
		const review_state_string = "review_" + item_type;
		store.remove(review_state_string);
	};

	commentChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	handleSubmitReview = e => {
		e.preventDefault();
		const { rating_specs, comment_specs, api_url, callback } = this.props;
		const params = { voucher_code: this.state.voucher_code };
		const item_type = rating_specs[0].item;
		const review_state_string = "review_" + item_type;
		comment_specs.forEach(element => {
			params[element.name] = this.state[element.name];
		});
		const RatingNotValidExpection = 465;
		let rating_error;
		try {
			rating_specs.forEach(element => {
				if (element.rating === 0) {
					throw RatingNotValidExpection;
				}
				params[element.name] = this.state[element.name];
			});
		} catch (e) {
			if (e === RatingNotValidExpection) {
				rating_error = true;
				notify.show(`${alert.rating_not_valid} `, "warning");
			}
		}
		if (!rating_error) {
			$.post(api_url, params)
				.then(data => {
					notify.show(data.payload, "success");
					store.remove(review_state_string);

					console.log('update user name: ', params['user_name'], store.get('userdata'))
					if (params['user_name'] && store.get('userdata')) {
						let userdata = store.get('userdata')
						userdata.nama = params['user_name']
						console.log('userdata nama updated')
						store.set('userdata', userdata)
					}
					console.log('userdata: ', store.get('userdata'))

					$(".top-right-button").find(".fa-close").trigger("click");

					if (callback) {
						callback();
					}
				})
				.catch((xhr) => {
					console.log('CATCH REVIEW: ', xhr);
					notify.show("Terjadi kesalahan: " + xhr.responseJSON.message, "warning");
				});
		}
	};

	render() {
		let {
			header,
			rating_specs,
			comment_specs,
			modal_name,
			voucher_used
		} = this.props;
		console.log("VOUCHERCODE>>>",voucher_used)
		let voucherValid = voucher_used !== undefined && voucher_used !== null && voucher_used.length > 0;
		return (
			<div id="outer-rating-modal">
				<Modal
					id={modal_name + "_modal"}
					header={header}
					trigger={<Button id={modal_name + "_button"} className="hide" />}
					modalOptions={{ dismissible: false }}
				>
					{rating_specs &&
						rating_specs.map(spec => (
							<RatingBlock
								key={spec.item}
								total_stars={5}
								hover_color="#ffbf00"
								rated_color="#ffbf00"
								callback={this.changeRating}
								topic={spec.topic}
								item={spec.item}
								dimension="32px"
								rating_value={this.state[spec.name] > 0 ? this.state[spec.name] : 5}
								name={spec.name}
							/>
						))}
					{comment_specs &&
						comment_specs.map(spec => (
							<CommentBlock
								key={spec.name}
								title={spec.title}
								placeholder={spec.placeholder}
								description={spec.description}
								callback={this.commentChange}
								name={spec.name}
							/>
						))}
					{/* <div id="comment-block">
						<span id="comment-title">
							<h5>Anda Peserta Kartu Prakerja?</h5>
						</span>
						<p id="comment-desc" style={{lineHeight:1.2, color:'#5a5a5a', marginBottom:5}}>
							Berikut langkah-langkah melihat kode voucher kursus di aplikasi Bukalapak:
						</p>
						<ol style={{color:'#5a5a5a',marginTop:0,paddingLeft:'15px'}}>
							<li>Pada halaman awal aplikasi <strong>Bukalapak</strong>, pilih menu 'Transaksi'</li>
							<li>Lihat di 'Tagihan', pilih voucher kursus untuk melihat kode voucher</li>
							<li>Pada halaman 'Detil Tagihan', klik 'Lihat Kupon'</li>
						</ol>
						<Input
							placeholder={'Kode Voucher dari Bukalapak'}
							onChange={this.commentChange}
							name={'voucher_code'}
							style={{marginBottom:0}}
							disabled={voucherValid}
							value={voucherValid ? voucher_used : this.state.voucher_code}
						/>
					</div> */}
					<div className="top-right-button">
						<a className="modal-close" onClick={this.closeRatingModal}>
							{" "}
							<i className="fa fa-close" />{" "}
						</a>
					</div>
					<Button id="rating-modal-button" onClick={this.handleSubmitReview}>
						{" "}
						Kirim{" "}
					</Button>
				</Modal>
			</div>
		);
	}
}

export default RatingModal;
