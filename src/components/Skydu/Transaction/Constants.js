import {trans} from '../Lang';

class TransactionConstants {
  // item type
  static TYPE_COURSE = 1;
  static TYPE_EVENT = 4;
  static TYPE_MODULE_SUBSCRIPTION = 3;

  // payment method
  static BANK_TRANSFER = 1;
  static PAYTREN = 2;
  static MIDTRANS = 3;

  static STATUS_QUEUED = -6;
  static STATUS_PENDING = -5;
  static STATUS_CONFIRMED = -4;
  static STATUS_EXPIRED = -3;
  static STATUS_REJECTED = -2;
  static STATUS_VERIFIED = 0;

  static STATUSES = [
    TransactionConstants.STATUS_PENDING,
    TransactionConstants.STATUS_CONFIRMED,
    TransactionConstants.STATUS_REJECTED,
    TransactionConstants.STATUS_EXPIRED,
    TransactionConstants.STATUS_VERIFIED
  ]


  static label(type) {
  	if (type == TransactionConstants.TYPE_COURSE) {
  		return trans.course;
  	} else if (type == TransactionConstants.TYPE_EVENT) {
  		return "Event";
  	} else if (type == TransactionConstants.TYPE_MODULE_SUBSCRIPTION) {
      return "Paket Belajar";
    } else if (type == TransactionConstants.TYPE_COUPON) {
  		return "Kupon";
  	} else if (type == TransactionConstants.TYPE_LEARNING_PATH) {
      return trans.learning_path;
    }

    return "-";
  }

  static statusLabel(status) {
    if (status == TransactionConstants.STATUS_PENDING) {
      return trans.pending;
    }

    if (status == TransactionConstants.STATUS_CONFIRMED) {
      return trans.waiting_approval
    }

    if (status == TransactionConstants.STATUS_EXPIRED) {
      return trans.expired
    }

    if (status == TransactionConstants.STATUS_REJECTED) {
      return trans.rejected
    }

    if (status == TransactionConstants.STATUS_VERIFIED) {
      return trans.success
    }

    return "";
  }
}
export default TransactionConstants
