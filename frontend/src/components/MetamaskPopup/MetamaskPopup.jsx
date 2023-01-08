import './MetamaskPopup.scss';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

const MetamaskPopUP = ({
  account,
  number,
  show,
  hideMetaMaskPopup,
  showLoading,
  handleSuccessTransaction,
  handleFailTransaction,
}) => {
  console.log('ETH wallet', process.env.REACT_APP_ETH_WALLET);
  const modalContainerRef = useRef();
  const transactionParameters = {
    gasPrice: Number(20000000000).toString(16),
    to: process.env.REACT_APP_ETH_WALLET,
    from: account,
    value: Number(number * Math.pow(10, 18)).toString(16),
  };
  const handleClickBackGround = (e) => {
    if (
      modalContainerRef.current &&
      !modalContainerRef.current.contains(e.target)
    ) {
      hideMetaMaskPopup();
    }
  };

  const handleSend = async () => {
    console.log({ account });
    try {
      showLoading();
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      handleSuccessTransaction();
    } catch (error) {
      handleFailTransaction();
    }
  };

  return (
    <div
      className={`remove-modal${show ? ' opened' : ''}`}
      onClick={handleClickBackGround}
    >
      <div className="modal-background">
        <div className="modal-container" ref={modalContainerRef}>
          <div className="modal__content">
            <p>Số lượng ETH Cần Thanh Toán {number} </p>
          </div>

          <div className="modal__footer">
            <button
              className="modal__button--confirm confirm-btn"
              onClick={handleSend}
            >
              Xác Nhận
            </button>
            <button
              className="modal__button--cancel cancel-btn"
              onClick={hideMetaMaskPopup}
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MetamaskPopUP;
