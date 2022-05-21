import React from "react";
import TransactionConstants from "../Constants";

const TransactionPipe = props => {
	const { status } = props;

	return (
		<div>
			{// Transaction Pipe
			(status === TransactionConstants.STATUS_PENDING ||
				status === TransactionConstants.STATUS_CONFIRMED ||
				status === TransactionConstants.STATUS_VERIFIED) && (
				<section className="transaction-pipe center-align">
					<div className="transaction-pipe-item">
						<div className="pipe-item-bullet bg-dark"></div>
						<div className="pipe-item-line bg-dark"></div>
						<div className="pipe-item-title font-dark">Pembayaran</div>
					</div>
					<div className="transaction-pipe-item">
						<div
							className={
								status === TransactionConstants.STATUS_CONFIRMED ||
								status === TransactionConstants.STATUS_VERIFIED
									? "pipe-item-bullet bg-dark"
									: "pipe-item-bullet bg-grey"
							}
						></div>
						<div
							className={
								status === TransactionConstants.STATUS_VERIFIED
									? "pipe-item-line bg-dark"
									: "pipe-item-line bg-grey"
							}
						></div>
						<div
							className={
								status === TransactionConstants.STATUS_CONFIRMED ||
								status === TransactionConstants.STATUS_VERIFIED
									? "pipe-item-title font-dark"
									: "pipe-item-title font-grey"
							}
						>
							Menunggu Konfirmasi
						</div>
					</div>
					<div className="transaction-pipe-item">
						<div
							className={
								status === TransactionConstants.STATUS_VERIFIED
									? "pipe-item-bullet bg-dark"
									: "pipe-item-bullet bg-grey"
							}
						></div>
						<div
							className={
								status === TransactionConstants.STATUS_VERIFIED
									? "pipe-item-title font-dark"
									: "pipe-item-title font-grey"
							}
						>
							Siap Belajar
						</div>
					</div>
				</section>
			)
			// End Transaction Pipe
			}
		</div>
	);
};

export default TransactionPipe;
