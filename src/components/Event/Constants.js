/* eslint-disable */

import { EventCategories } from '../Consts';

class EventConstants {
	static ALL_TIME = 0;
	static TODAY = 1;
	static TOMORROW = 2;
	static THIS_WEEK = 3;
	static NEXT_WEEK = 4;
	static THIS_MONTH = 5;
	static NEXT_MONTH = 6;

	static TYPE_STANDARD = 1;
    static TYPE_ADVANCE = 2;
    static TYPE_BUNDLE = 3;


	static getCategory(category_id) {
		let target_obj = EventCategories.find(function(element) {
			return element.id == category_id;
		});

		return target_obj.name;
	}

	static getTimes() {
		let times = {};

		times[EventConstants.ALL_TIME] = "Semua waktu";
		times[EventConstants.TODAY] = "Hari ini";
		times[EventConstants.TOMORROW] = "Besok";
		times[EventConstants.THIS_WEEK] = "Minggu ini";
		times[EventConstants.NEXT_WEEK] = "Minggu depan";
		times[EventConstants.THIS_MONTH] = "Bulan ini";
		times[EventConstants.NEXT_MONTH] = "Bulan depan";

		return times;
	}

	static label(type) {
		if (type == EventConstants.TYPE_BUNDLE) {
			return "Event Bundle";
		}
		if (type == EventConstants.TYPE_ADVANCE) {
			return "Event Khusus";
		}

		return "Event Standar";
	}

	static isEarly(data) {
	    if (!data || !data.early_ticket_date) {
	      return false;
	    }

	    let earlyBird = new Date(data.early_ticket_date.replace(/\s/, 'T'));
	    let now = new Date();

	    return earlyBird.getTime() > now.getTime() && data.early_ticket_price < data.ticket_price;
	  }

	static getPrice(data) {
	    if (!data) {
	      return 0;
	    }

	    return this.isEarly(data) ? data.early_ticket_price : data.ticket_price;
	}


}
export default EventConstants
