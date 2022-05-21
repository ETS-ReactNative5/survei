import LocalizedStrings from "react-localization";

let idDictionary = {
	you: "Anda",
	registered: "Terdaftar",
	register: "Daftar",
	succesfully: "Berhasil",
	event: "Event",
	course: "Course",
	course_item: "Course",
	coupon: "Kupon",
	all: "Semua",
	see: "Lihat",
	result: "Hasil",
	free_course: "Course Gratis",
	paid_course: "Course Berbayar",
	search_result: "Hasil Pencarian",
	for: "Untuk",
	by: "Oleh",
	explore: "Jelajah",
	enrolled: "Sudah Terdaftar",
	not_found: "Tidak Ditemukan",
	free: "Gratis",
	type: "Jenis",
	filter: "Filter",
	lecturer: "Pengajar",
	lecture: "Materi",
	learning_path: "Syllabus",
	must: "Harus",
	login: "Login",
	finish: "Menyelesaikan",
	first: "Terlebih dahulu",
	previous: "sebelumnya {0}",
	chapter: "Bab",
	bundle: "Paket",
	buy: "Beli",
	submitted: "Mengirim",
	review: "Ulasan",
	column: "Kolom",
	rating: "Rating",
	"can't": "Tidak boleh",
	empty: "Kosong"
};

let alertIdDictionary = {
	invalid_coupon: "Kupon tidak valid atau sudah habis",
	chapter_not_finished: "",
	invalid_pin_digit: "PIN harus terdiri dari 6 digit angka",
	rating_not_valid: "Kolom rating tidak boleh ada yang kosong"
};

export const trans = new LocalizedStrings({
	id: idDictionary
});

export const alert = new LocalizedStrings({
	id: alertIdDictionary
});
