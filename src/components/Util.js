import store from "store";
import $ from "jquery";
import { notify } from "react-notify-toast";
import moment from "moment";

export const getBaseUrl = () => {
	let url = "https://" + window.location.host;
	if (window.location.host == "localhost:3000") {
		url = "http://localhost:3000";
	}
	return url;
};

export const getAPIBaseUrl = () => {
	let url = "https://api.geti.id/v1";

	if (window.location.host == "localhost:3000") {
		//url = "http://127.0.0.1:8000/v1";
		url = "https://apidev.geti.id/v1";
	} else if (window.location.host == "lms.skydu.dev") {
		url = "https://lms-api.skydu.dev/dev";
	} else if (window.location.host == "onlinedev2.geti.id") {
		url = "https://apidev.geti.id/v1";
	}

	return url;
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = getAPIBaseUrl();

export const API_HANDESK_URL =
	"https://api.paytrenacademy.com/handesk/public/api";

export const API_HOME = API_BASE_URL + "/home";
export const API_PROVINCE = API_BASE_URL + "/provinces";
export const API_SHORT_PROFILE = API_BASE_URL + "/profile";
export const API_PROFILE = API_BASE_URL + "/users";
export const API_LOGIN = API_BASE_URL + "/auth/login";
export const API_CREATE_PASSWORD = API_BASE_URL + "/auth/password";
export const API_PASSWORD_RESET = API_BASE_URL + "/auth/password/reset";
export const API_PASSWORD_FORGET = API_BASE_URL + "/auth/password/forget";
export const API_REGISTER = API_BASE_URL + "/auth/register";
export const API_OTP_SEND = API_BASE_URL + "/auth/otp/send";
export const API_OTP_VERIFY = API_BASE_URL + "/auth/otp/verify";
export const API_CHECK_PHONENUMBER = API_BASE_URL + "/auth/checkphonenumber";
export const API_VERIFY_EMAIL = API_BASE_URL + "/auth/email/verify";
export const API_LOGOUT = API_BASE_URL + "/logout";
export const API_LOGIN_PAYTREN = API_BASE_URL + "/paytrenLogin";
export const API_PROFILE_PAYTREN = API_BASE_URL + "/paytrenProfile";
export const API_PROFILE_BASE_URL = API_BASE_URL + "/profile";
export const API_COURSE_BASE_URL = API_BASE_URL + "/courses/";
export const API_TICKET_BASE_URL = API_BASE_URL + "/ticket";
export const API_COUPON_BASE_URL = API_BASE_URL + "/coupons";
export const API_EVENT_BASE_URL = API_BASE_URL + "/events";
export const API_QUIZ_BASE_URL = API_BASE_URL + "/quiz/";
export const API_CATEGORY = API_BASE_URL + "/categories";
export const API_CATEGORY_DASHBOARD = API_BASE_URL + "/category_menu";
export const API_USER_COURSE_COUNT =
	API_BASE_URL + "/statistic/statusStatistic";
export const API_SEARCH = API_BASE_URL + "/courses";
export const API_GLOBAL_SEARCH = API_BASE_URL + "/search";
export const API_USER = API_BASE_URL + "/users/";
export const API_LP_CERTIFICATE = API_BASE_URL + "/certificate/";
export const API_LP_WCERTIFICATE = API_BASE_URL + "/wcertificate/";
export const API_CERTIFICATE = API_BASE_URL + "/reports/";
export const API_WCERTIFICATE = API_BASE_URL + "/wcertificate/";
export const API_BUY_COUPON = API_BASE_URL + "/coupons/buy";
export const API_TRANSACTION_HISTORY = API_BASE_URL + "/transactions";
export const API_PRAKERJA = API_BASE_URL + "/payment/prakerja";
export const API_PAYMENT = API_BASE_URL + "/payment";
export const API_VOUCHER = API_BASE_URL + "/vouchers";
export const API_VOUCHER_CHECK = API_BASE_URL + "/check_vouchers";
export const API_BANK_LIST = API_PAYMENT + "/bank_accounts";
export const API_JOURNEY_BASE_URL = API_BASE_URL + "/journeys";
export const API_COMMUNITY_BASE_URL = API_BASE_URL + "/communities";
export const API_COMMUNITY_REGISTER_MEMBERSHIP =
	API_COMMUNITY_BASE_URL + "/register_membership";
export const API_FAQ = API_BASE_URL + "/faq";
export const API_MENTOR = API_BASE_URL + "/mentor";
export const API_MENTEES_LIST = API_MENTOR + "/users";
export const API_MENTEE_CODE = API_MENTOR + "/code?customer=";
export const API_TICKET_URL = API_HANDESK_URL + "/tickets";

export const API_WEBINAR_STATUS_COURSE_USER =
	API_BASE_URL + "/webinars/statusCourseUser";
export const API_BATCH = API_BASE_URL + "/getBatches";

export const API_UPLOAD_UPRAK = API_BASE_URL + "/upload";
export const API_CHECK_UPRAK = API_BASE_URL + "/check";
export const API_DELETE_UPRAK = API_BASE_URL + "/ujian_praktek/delete";
export const API_UJIAN_PRAKTEK = API_BASE_URL + "/ujian_praktek/";

export const API_GET_CITY = API_BASE_URL + "/getCity";
export const API_GET_EDUCATION = API_BASE_URL + "/getEducation";
export const API_DETAIL_PROFILE = API_BASE_URL + "/profile/detail";
export const API_UPDATE_PROFILE = API_BASE_URL + "/profile/update";
export const API_CHANGE_PASSWORD = API_BASE_URL + "/changePassword";
export const API_GET_PROVINCE = API_BASE_URL + "/getProvince";
export const API_CEK_USER_DETAIL = API_BASE_URL + "/detailUser";
export const API_ABSEN_WEBINAR = API_BASE_URL + "/absenWebinar";

export const API_SURVEY = API_BASE_URL + "/survey";

export const MONTH_ARRAY = [
	{ value: 1 },
	{ value: 2 },
	{ value: 3 },
	{ value: 4 },
	{ value: 5 },
	{ value: 6 },
	{ value: 7 },
	{ value: 8 },
	{ value: 9 },
	{ value: 10 },
	{ value: 11 },
	{ value: 12 },
];

export const HijriMonthNames = {
	رمضان: "Ramadhan",
	محرم: "Muharram",
	"ربيع ١": "Rabi'al Awal",
	"ربيع ٢": "Rabi'al Akhir",
	رجب: "Rajab",
	صفر: "Shafar",
	"جُمَادَىٰ ١": "Jumada Awal",
	"جمادى ٢": "Jumada Akhir",
	شعبان: "Sya'ban",
	شوال: "Syawwal",
	"ذو القعدة": "Dzulqadah",
	"ذو الحجة‎": "Dzulhijjah",
};

export const ReadableHijri = (target_date) => {
	const moment_hijri = require("moment-hijri");
	const hijri_timestamp = moment_hijri(target_date);
	const hijri_month = HijriMonthNames[hijri_timestamp.format("iMMM")];
	const hijri_date = hijri_timestamp.format("iDD ");
	const hijri_year = hijri_timestamp.format("iYYYY [H]");
	return hijri_date + hijri_month + " " + hijri_year;
};

export const getYearRangeArray = () => {
	const end_year = moment().year();
	let year_array = Array(end_year - 2017).fill(0);
	return year_array;
};

export const QueryParam = (variable) => {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	var params = {};

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");

		if (variable) {
			if (decodeURIComponent(pair[0]) === variable) {
				return decodeURIComponent(pair[1]);
			}
		} else {
			params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
	}

	if (!variable) {
		return params;
	}

	console.log("Query variable %s not found", variable);
};

export const RecordSearch = (search_text, records, identifier) => {
	if (search_text) {
		return records.filter(
			(element) =>
				element[identifier]
					.toLowerCase()
					.indexOf(search_text.toLowerCase()) > -1,
		);
	}
	return records;
};

export const GetRecordIndex = (target_record, records) => {
	return records.indexOf(target_record);
};

export const AjaxSetup = (props) => {
	const API_HANDESK_TOKEN = "the-api-token";
	const token = store.get("auth_token");

	$.ajaxSetup({
		headers: {
			Authorization: token,
			"Access-Control-Allow-Origin": "*",
			token: API_HANDESK_TOKEN,
		},
		timeout: 30000,
		beforeSend: function (xhr) {
			$(".loading").show();
			$("form button").attr("disabled", "disabled");
			xhr.setRequestHeader("Accept", "text/json");
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			var status = XMLHttpRequest.status;

			if (XMLHttpRequest.readyState == 4) {
				// HTTP error (can be checked by XMLHttpRequest.status and statusText)
				if (status == 401) {
					ClearUserData();
					$(".modal-close").trigger("click");
					notify.show(
						"Ups, email atau password Anda salah.",
						"warning",
					);
					const redirect_url =
						"/login?redirect=" + window.location.pathname;
					props.history.push(redirect_url);
				} else if (status == 404) {
					props.history.push("/");
				} else if (status == 422) {
					var response = JSON.parse(XMLHttpRequest.responseText);
					var errorMsg =
						response["errors"][Object.keys(response.errors)[0]];
					notify.show(errorMsg, "warning");
					$(".error-msg").html(errorMsg);
				} else if (status == 400) {
					var response = JSON.parse(XMLHttpRequest.responseText);

					if (response.message && !$(".error-msg").length) {
						notify.show(response.message, "warning");
					}
				} else if (status != 403) {
					notify.show(
						status + " : " + XMLHttpRequest.statusText,
						"warning",
					);
				}
			} else if (XMLHttpRequest.readyState == 0) {
				//Network error(i.e. connection refused, access denied due to CORS, etc.)
				notify.show(
					"Tidak bisa terhubung ke server, silahkan cek koneksi Anda",
					"warning",
				);
				$(".reload-page").show();
			} else {
				notify.show(
					"Oops Terjadi kesalahan, silakan coba lagi",
					"warning",
				);
			}
		},
		complete(xhr, status) {
			$(".loading").hide();
			$("form button").removeAttr("disabled");
		},
	});
};

export const CheckAuth = () => {
	var token = store.get("auth_token");
	var userdata = store.get("userdata");

	if (token) {
		return userdata;
	}

	return false;
};

export const ClearUserData = () => {
	store.remove("auth_token");
	store.remove("userdata");
	store.remove("course_categories");
	store.remove("data_is_completed");
	$.ajaxSetup({
		headers: { Authorization: null, "Access-Control-Allow-Origin": "*" },
	});
};

export const FormatNumber = (nStr) => {
	var nStr = nStr + "";
	var x = nStr.split(".");
	var x1 = x[0];
	var x2 = x.length > 1 ? "." + x[1] : "";
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "." + "$2");
	}
	return x1 + x2;
};

export const FormatPrice = (nStr, discount, additional) => {
	if (discount) {
		nStr = nStr * (1 - discount / 100);
	}

	if (additional) {
		nStr += additional;
	}

	nStr = Math.round(nStr) + "";
	let x = nStr.split(".");
	let x1 = x[0];
	let x2 = x.length > 1 ? "." + x[1] : "";
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "." + "$2");
	}
	return "Rp" + x1 + x2;
};

export const FormatDate = (date) => {
	var d = date ? new Date(date) : new Date(),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-") + " 00:00:00";
};

export const FormatDateRange = (from, to) => {
	var dateFrom = FormatDateIndo(from, false, true);
	var dateTo = FormatDateIndo(to, false, true);

	if (dateFrom == dateTo) {
		return (
			dateFrom +
			(from === to
				? " " + FormatTime(from)
				: ", " + FormatTime(from) + " - " + FormatTime(to))
		);
	} else {
		return (
			dateFrom +
			" " +
			FormatTime(from) +
			" s/d " +
			dateTo +
			" " +
			FormatTime(to)
		);
	}
};

export const FormatWeekRange = (from, to) => {
	var dateFrom = FormatDateIndo(from, false, false, true);
	var dateTo = FormatDateIndo(to, false, false, true);

	if (dateFrom.month == dateTo.month) {
		return (
			dateFrom.date +
			" - " +
			dateTo.date +
			" " +
			dateFrom.month +
			" " +
			dateTo.year
		);
	} else {
		return (
			dateFrom.date +
			" " +
			dateFrom.month +
			" - " +
			dateTo.date +
			" " +
			dateTo.month +
			" " +
			dateTo.year
		);
	}
};

export const months = [
	"Januari",
	"Februari",
	"Maret",
	"April",
	"Mei",
	"Juni",
	"Juli",
	"Agustus",
	"September",
	"Oktober",
	"November",
	"Desember",
];

export const FormatDateIndo = (
	dateString,
	includeTime,
	includeDay,
	dataOnly,
) => {
	var date = dateString
		? new Date(dateString.replace(/\s/, "T") + "+07:00")
		: new Date();
	var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

	var month = months[date.getMonth()];
	var day = date.getDay();
	var year = date.getYear();

	var timeString = "";
	var dayString = "";
	var dateString =
		date.getDate() + " " + month + " " + (year < 1000 ? year + 1900 : year);

	if (includeTime) {
		timeString = " " + FormatTime(date);
	}

	if (includeDay) {
		dayString = days[day] + ", ";
	}

	if (dataOnly) {
		var mDate = date.getDate();

		return {
			date: mDate < 10 ? "0" + mDate : mDate,
			month: month,
			monthInt: date.getMonth() + 1,
			shortMonth: month.substring(0, 3),
			year: year < 1000 ? year + 1900 : year,
			day: days[day],
		};
	}

	return dayString + dateString + timeString;
};

export const FormatTime = (date) => {
	if (typeof date == "string") {
		date = new Date(date.replace(/\s/, "T"));
	}

	var hour = date.getHours();
	var minute = date.getMinutes();

	return (
		(hour < 10 ? "0" + hour : hour) +
		":" +
		(minute < 10 ? "0" + minute : minute)
	);
};

export const sleep = (delay) => {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
};

export const setLocalStorage = (storageName, data) => {
	localStorage.setItem(storageName, JSON.stringify(data));
};

export const getLocalStorage = (storageName) => {
	return JSON.parse(localStorage.getItem(storageName));
};

export const removeLocalStorage = (storageName) => {
	return JSON.parse(localStorage.removeItem(storageName));
};

export const scrollToTop = (offset) => {
	if (!offset) {
		offset = 0;
	}
	return $("html, body").animate({ scrollTop: offset });
};
