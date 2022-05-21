/* eslint-disable */
import {trans} from '../Lang';
class TransactionConstants {
  // status type
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

  // item type
  static TYPE_COURSE = 0;
  static TYPE_EVENT = 1;
  static TYPE_COUPON = 2;
  static TYPE_LEARNING_PATH = 3;

  // payment method
  static DEPOSIT = 20;
  static VOUCHER = 1;
  static COUPON = 2;
  static PUT = 23;
  static COMMUNITY = 4;
  static MAIN_VOUCHER = 11;
  static TRANSFER = 98;

// reverse dari payment method
  static paymentMethods = {
    '0': 'Deposit',
    '20': 'Deposit',
    '1': 'Poin Belajar',
    '2': 'Coupon',
    '3': 'PUT',
    '23': 'PUT',
    '4': 'Community'
  };

  static label(type) {
  	if (type == TransactionConstants.TYPE_COURSE) {
  		return trans.course;
  	} else if (type == TransactionConstants.TYPE_EVENT) {
  		return "Event";
  	} else if (type == TransactionConstants.TYPE_COUPON) {
  		return "Kupon";
  	} else if (type == TransactionConstants.TYPE_LEARNING_PATH) {
      return trans.learning_path;
    }

    return "-";
  }
}
export default TransactionConstants
