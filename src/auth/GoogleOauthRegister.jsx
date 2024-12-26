import '../EditNote.css';
import './GoogleOauth.css';

const GoogleOauthRegister = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/accounts/google/login/';
  };

  return (
    <>
      <div className="separation-line">
        <hr />
        <p>or</p>
        <hr />
      </div>
      <button
        type="button"
        className="google-button"
        onClick={handleGoogleLogin}
      >
        <img src="google.png" alt="Google icon" />
        {'Register with Google'}
      </button>
    </>
  );
};

export default GoogleOauthRegister;
