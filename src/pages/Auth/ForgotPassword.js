import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/AuthStyle.css';

const ForgotPassword = () => {

    return (
        <Layout title={"Log In"}>
            <div className="form-container ">
                <form >
                    <h4 className="title"> <i class="fa-solid fa-lock"></i> Reset Password</h4>
                    <div className="mb-3">
                        <input type="email" className="form-control" id="exampleInputEmail" placeholder='Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="exampleInputEmail" placeholder='What is your favorite food?' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Enter New Password' required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn"> Reset Password </button>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/login">Back to Log In</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;