import React from 'react';
import TextInPut from '../../components/TextInPut/TextInPut';
import { faMailBulk, faCode, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { publicRequest } from '../../utils/CallApi';
import './Recovery.scss';
import { useState } from 'react';
export default function Recovery() {
  const [formEmail, setFormEmail] = useState({});
  const [formCode, setFormCode] = useState({});
  const [formPassword, setFormPassword] = useState({});
  const [openCodeForm, setOpenSendCode] = useState(false);
  const [openNormalForm, setOpenNormalForm] = useState(true);
  const [openSetPassword, setOpenSetPassword] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidVerifyPassword, setIsValidVerifyPassword] = useState(false);
  const navigate = useNavigate();
  const handleInput = (name, value) => {
    setErrorText('');
    setFormEmail({ ...formEmail, [name]: `${value}` });
  };
  const handleFormCode = (name, value) => {
    setErrorText('');
    setFormCode({ ...formCode, [name]: `${value}` });
  };
  const handleFormPassword = (name, value) => {
    setErrorText('');
    setFormPassword({ ...formPassword, [name]: `${value}` });
  };
  const handleSubmitEmail = (e) => {
    e.preventDefault();

    if (isValidEmail) {
      publicRequest
        .post('account/recovery', formEmail)
        .then((res) => {
          console.log(res);
          if (res.status === 202) {
            setErrorText(res.data.message);
          } else {
            setOpenNormalForm(false);
            setOpenSendCode(true);
            setOpenSetPassword(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorText('L???i H??? Th???ng Vui L??ng Nh???p L???i');
        });
    }
  };
  const handleSubmitCode = (e) => {
    e.preventDefault();
    if (isValidCode) {
      publicRequest
        .post('account/recovery/confirm', { ...formEmail, ...formCode })
        .then((res) => {
          console.log(res);
          if (res.status === 202) {
            setErrorText(res.data.message);
          } else {
            setOpenSendCode(false);
            setOpenSetPassword(true);
          }
        })
        .catch((err) => {
          setErrorText('L???i H??? Th???ng');
        });
    }
  };
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (!(isValidPassword && isValidVerifyPassword)) {
      setErrorText('Vui L??ng Nh???p ?????y ????? Th??ng Tin');
    } else if (formPassword.password !== formPassword.verifyPassword) {
      setErrorText('M???t Kh???u Kh??ng Kh???p');
    } else {
      publicRequest
        .post('account/recovery/update', formPassword)
        .then((res) => {
          if (res.status === 202) {
            setErrorText(res.data.message);
          } else {
            navigate('/login');
          }
        })
        .catch((err) => {
          setErrorText('L???i H??? Th???ng');
        });
    }
  };

  return (
    <>
      <Header color="#CAE5E8" />
      <div className="container_recovery">
        <div className="recovery row container-md">
          <div className="title col-xl-6 col-12">
            <p>
              ?????ng Lo L???ng! <br></br> Ch??ng T??i S??? H??? Tr??? B???n!{' '}
            </p>
          </div>
          <div className="form_container col-xl-6 col-12">
            <div className="form_wrapper">
              <p className="form_title">Kh??i Ph???c T??i Kho???n</p>
              <p className="form_error">{errorText}</p>
              <form className={openNormalForm ? 'form' : 'hide'}>
                <TextInPut
                  icon={faMailBulk}
                  type="email"
                  placeholder="Nh???p Email"
                  name="email"
                  getInput={handleInput}
                  checkValid={(value) => setIsValidEmail(value)}
                ></TextInPut>
                <input
                  type="submit"
                  onClick={(e) => {
                    handleSubmitEmail(e);
                  }}
                  value="G???i"
                ></input>
              </form>
              <form className={openCodeForm ? 'form' : 'hide'}>
                <TextInPut
                  icon={faCode}
                  type="text"
                  placeholder="Nh???p M?? X??c Nh???n"
                  name="code"
                  getInput={handleFormCode}
                  checkValid={(value) => setIsValidCode(value)}
                ></TextInPut>

                <input
                  type="submit"
                  onClick={(e) => handleSubmitCode(e)}
                  value="X??c Nh???n"
                ></input>
              </form>

              <form className={openSetPassword ? 'form' : 'hide'}>
                <TextInPut
                  icon={faKey}
                  type="password"
                  placeholder="Nh???p M???t Kh???u"
                  name="password"
                  getInput={handleFormPassword}
                  checkValid={(value) => setIsValidPassword(value)}
                ></TextInPut>

                <TextInPut
                  icon={faKey}
                  type="password"
                  placeholder="X??c Nh???n M???t Kh???u"
                  name="verifyPassword"
                  getInput={handleFormPassword}
                  checkValid={(value) => setIsValidVerifyPassword(value)}
                ></TextInPut>

                <input
                  type="submit"
                  onClick={(e) => handleSubmitPassword(e)}
                  value="X??c Nh???n"
                ></input>
              </form>
              <div className="login_footer">
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  to="/login"
                >
                  <p>Quay L???i ????ng Nh???p </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer color="#CAE5E8" />
    </>
  );
}
