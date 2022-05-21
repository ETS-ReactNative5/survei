import React from "react";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import Register from "./Auth/Register";
import ResetPassword from "./Auth/ResetPassword";
import CommunityCatalog from "./Community/Catalog";
import CommunityDetail from "./Community/Detail";
import CommunityRegister from "./Community/Register";
import CourseCatalog from "./Course/Catalog";
import ViewMateri from "./Course/ViewMateri";
import CatalogCourse from "./Course/CatalogCourse";
import CourseCertificate from "./Course/Certificate";
import CourseCoupon from "./Course/Coupon";
import CourseDetail from "./Course/Detail";
import NewCertificate from "./Course/NewCertificate";
import CompetenceCertificate from "./Course/CompetenceCertificate";
import CompletionCertificate from "./Course/CompletionCertificate";
import CourseOrderConfirmation from "./Course/OrderConfirmation/OrderConfirmation";
import CourseRecap from "./Course/Recap";
import EventCatalog from "./Event/Catalog";
import EventDetail from "./Event/Detail";
import EventOrder from "./Event/Order";
import EventOrderConfirmation from "./Event/OrderConfirmation";
import EventTicket from "./Event/Ticket";
import HelpForm from "./Help/Form";
import HelpList from "./Help/List";
import LearningPathCatalog from "./LearningPath/Catalog";
import LearningPathCertificate from "./LearningPath/Certificate";
import LearningPathDetail from "./LearningPath/Detail";
import LearningPathDetailLearn from "./LearningPath/DetailLearn";
import LearningPathOrder from "./LearningPath/Order/Order";
import MentorList from "./Mentor/MentorList";
import Payment from "./Payment/Payment";
import ConfirmationPayment from "./Payment/PaymentBL";
import Catalog from "./Public/Catalog";
import Certificate from "./Public/Certificate";
import WCertificate from "./Public/WCertificate";
import FAQ from "./Public/FAQ";
import Survey from "./Public/Survey";
import Course from "./Public/Home/Course";
import LandingPage from "./Public/Home/LandingPage";
import NewHome from "./Public/Home/NewHome";
import Dentrepreneur from "./Public/Home/SamplePage";
import LPCertificate from "./Public/LPCertificate";
import Search from "./Public/Search";
import Terms from "./Public/Terms";
import QuizAttempt from "./Quiz/Attempt";
import QuizResult from "./Quiz/Result";
import Odoa from "./SpecialEvents/Odoa";
import TransactionDetail from "./Transaction/Detail";
import TransactionList from "./Transaction/List";
import Profile from "./User/Profile";
import PersonalData from "./User/PersonalData";
import { CheckAuth } from "./Util";
import VoucherRedeem from "./Payment/VoucherRedeem";
import CertificateCompetence from "./Public/CertificateCompetence";
import CertificateCompletion from "./Public/CertificateCompletion";
import ChangePassword from "./User/ChangePassword";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

function PrivateRoute({ component: Component, authed, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				CheckAuth() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
							search: "?redirect=" + rest.location.pathname,
						}}
					/>
				)
			}
		/>
	);
}

const Main = (props) => (
	<main>
		<Switch>
			<Route exact path="/" component={LandingPage} />
			<Route exact path="/landingpage" component={NewHome} />
			<Route exact path="/list-course" component={Course} />
			<Route exact path="/dentrepreneur" component={Dentrepreneur} />
			<Route path="/search" component={Search} />
			<Route path="/catalog" component={Catalog} />
			<Route path="/catalog/list-course" component={CatalogCourse} />
			<Route path="/login" component={Login} />
			<Route path="/reset-password" component={ResetPassword} />
			<Route path="/forgot-password" component={ForgotPassword} />
			<Route path="/register" component={Register} />
			<Route path="/logout" component={Logout} />
			<Route path="/faq" component={FAQ} />
			<Route path="/survey" component={Survey} />
			<Route path="/terms" component={Terms} />
			<PrivateRoute path="/prakerja" component={VoucherRedeem} />
			<PrivateRoute path="/profile" component={Profile} />
			<PrivateRoute path="/personal-data" component={PersonalData} />
			<PrivateRoute path="/change-password" component={ChangePassword} />
			<PrivateRoute
				path="/transactions/:invoice_number"
				component={TransactionDetail}
			/>
			<PrivateRoute path="/transactions" component={TransactionList} />
			<Route path="/certificate/:uuid" component={Certificate} />
			<Route
				path="/certificate-competence/:uuid"
				component={CertificateCompetence}
			/>
			<Route
				path="/certificate-completion/:uuid"
				component={CertificateCompletion}
			/>
			<Route path="/wcertificate/:uuid" component={WCertificate} />
			<Route path="/lp-certificate/:uuid" component={LPCertificate} />
			<Route path="/coupon/:uuid" component={CourseCoupon} />
			<Route path="/course/catalog/" component={CourseCatalog} />
			<Route path="/materi" component={ViewMateri} />
			<PrivateRoute
				path="/course/invoice/:invoice_number"
				component={CourseOrderConfirmation}
			/>
			<Route path="/course/:uuid/recap" component={CourseRecap} />
			<Route
				path="/course/:uuid/certificate_old"
				component={CourseCertificate}
			/>
			<Route
				path="/course/:uuid/certificate"
				component={NewCertificate}
			/>
			<Route
				path="/course/:uuid/:competence_uuid/competence-certificate"
				component={CompetenceCertificate}
			/>
			<Route
				path="/course/:uuid/completion-certificate"
				component={CompletionCertificate}
			/>
			<Route path="/course/:uuid/:enroll?" component={CourseDetail} />
			<Route path="/event/catalog" component={EventCatalog} />
			<PrivateRoute
				path="/event/:uuid/order/success"
				component={EventOrderConfirmation}
			/>
			<PrivateRoute path="/event/:uuid/order" component={EventOrder} />
			<PrivateRoute path="/event/:uuid/ticket" component={EventTicket} />
			<Route path="/event/:uuid/:buy?" component={EventDetail} />
			<PrivateRoute
				path="/quiz/result/:uuid/:recap?"
				component={QuizResult}
			/>
			<PrivateRoute path="/quiz/:uuid" component={QuizAttempt} />
			<Route
				path="/learning-path/catalog"
				component={LearningPathCatalog}
			/>
			<Route
				path="/learning-path/:uuid/certificate"
				component={LearningPathCertificate}
			/>
			<Route
				path="/learning-path/:uuid/order"
				component={LearningPathOrder}
			/>
			<Route
				path="/learning-path/:uuid/learn"
				component={LearningPathDetailLearn}
			/>
			<Route path="/learning-path/:uuid" component={LearningPathDetail} />
			<Route path="/community/catalog" component={CommunityCatalog} />
			<PrivateRoute
				path="/community/register"
				component={CommunityRegister}
			/>
			<Route path="/community/:uuid" component={CommunityDetail} />
			<Route path="/help/form" component={HelpForm} />
			<Route path="/help" render={() => <HelpList {...props} />} />
			<Route path="/odoa" component={Odoa} />
			<Route path="/payment" component={Payment} />
			<Route
				exact
				path="/confirmationpayment"
				component={ConfirmationPayment}
			/>
			<Route
				path="/surveypromo517"
				component={() => {
					window.location =
						"https://www.surveymonkey.com/r/SurveyPromo517";
				}}
			/>
			<Route path="/mentor/:token" component={MentorList} />
		</Switch>
	</main>
);

export default Main;
