import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp1 from "./components/SignUp1";
import SignUp2 from "./Pages/SignUp2";
import ProtectedRoute from "./components/ProtectedRoute";
import DashBoard from "./Pages/DashBoard";
import OTP from "./components/Otp";
import InviteMembers from "./components/InviteMembers";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import UploadPage from "./components/UploadPage";
import PDFPreviewPage from "./components/PDFPreviewPage";
import PricingPlans from "./Pages/PricingPlans";
import Sign1 from "./Pages/Sign1";
import Sign2 from "./Pages/Sign2";
import Sign3 from "./Pages/Sign3";
import { AuthProvider } from "./context/AuthProvider";
import Documents from "./Pages/Documents";
import Activity from "./Pages/Activity";
import Verify from "./Pages/Verify";
import Editor from "./Pages/Editor"
import ScreenA from "./Pages/ScreenA";
import ScreenB from "./Pages/ScreenB"
import Expaired from "./components/Expaired";
import Completed from "./components/Completed";
import Draft from "./components/Draft";
import Pending from "./components/Pending";
import PDFDisplayPage from "./components/PDFDisplayPage";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthProvider><Login /></AuthProvider>} />
                <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
                <Route path="/signup-1" element={<SignUp1 />} />
                <Route path="/signup-2" element={<SignUp2 />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/invite-members" element={<AuthProvider><InviteMembers /></AuthProvider>} />
                <Route path="/upload" element={<AuthProvider><UploadPage /></AuthProvider>} />
                <Route path="/preview" element={<AuthProvider><PDFPreviewPage /></AuthProvider>} />
                <Route path="/pricing-plans" element={<PricingPlans />} />
                <Route path="/sign-1" element={<AuthProvider><Sign1 /></AuthProvider>} />
                <Route path="/sign-2" element={<AuthProvider><Sign2 /></AuthProvider>} />
                <Route path="/sign-3" element={<AuthProvider><Sign3 /></AuthProvider>} />
                <Route path="/verify-email" element={<Verify/>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/editor" element={<AuthProvider><Editor/></AuthProvider>}/>
                <Route path="/documents" element={<AuthProvider><Documents/></AuthProvider>}/>
                <Route path="/pending" element={<AuthProvider><Pending/></AuthProvider>}/>
                <Route path="/completed" element={<AuthProvider><Completed/></AuthProvider>}/>
                <Route path="/drafts" element={<AuthProvider><Draft/></AuthProvider>}/>
                <Route path="/expired" element={<AuthProvider><Expaired/></AuthProvider>}/>
                <Route path="/activity" element={<AuthProvider><Activity/></AuthProvider>}/>
                <Route path="/display-pdf/:documentId" element={<AuthProvider><PDFDisplayPage/></AuthProvider>}/>
                <Route path="/screen-a" element={<ScreenA />} />
                <Route path="/screen-b" element={<ScreenB />} />
                <Route
                    path="/dashboard"
                    element={
                        <AuthProvider>
                            <ProtectedRoute><DashBoard /></ProtectedRoute>
                        </AuthProvider>
                    }
                />
                <Route path="/forget-password" element={<AuthProvider><ForgetPassword /></AuthProvider>} />
            </Routes>
        </Router>
    );
};

export default App;
