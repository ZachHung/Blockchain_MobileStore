import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
import { userRequest } from '../../utils/CallApi';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './Purchase.scss';
import { currentChange } from '../../utils/const';
import ModalPopUp from '../../components/modal';

export default function Purchase() {
  const [productsList, setProductsList] = useState([]);
  const [reload, setReload] = useState(false);
  const userCurrent = useSelector((state) => state.user.current);
  const userID = userCurrent._id;
  const navigateCart = useNavigate();

  // console.log('user', user._id);
  const [clickedDeleteButton, setClickedDeleteButton] = useState({
    productID: '',
  });
  const [activeStatus, setActiveStatus] = useState({
    all: true,
    delivering: false,
    delivered: false,
  });
  const [modalState, setModalState] = useState(undefined);
  const user = useSelector((state) => state.user);

  // get all purchase
  const getPurchase = () => {
    userRequest()
      .get(`purchase/all/${user.current._id}`)
      .then((res) => {
        console.log(res.data);
        setProductsList(res.data);
      });
  };
  const getDeliveringPurchase = () => {
    userRequest()
      .get(`purchase/delivering/${user.current._id}`)
      .then((res) => {
        setProductsList(res.data);
      });
  };
  const getDeliveredPurchase = () => {
    userRequest()
      .get(`purchase/delivered/${user.current._id}`)
      .then((res) => {
        setProductsList(res.data);
      });
  };

  useEffect(() => {
    getPurchase();
  }, []);
  const handelClickConfirm = () => {
    userRequest()
      .put(`purchase/update/${userID}/${clickedDeleteButton.productID}`)
      .then(() => {
        getPurchase();
        setModalState(false);
      });
  };
  const handleClickAllProduct = () => {
    // console.log('all');
    getPurchase();
    setActiveStatus({
      all: true,
      delivering: false,
      delivered: false,
    });
  };
  const handleClickDelivering = () => {
    // console.log('delivering');

    getDeliveringPurchase();
    setActiveStatus({
      all: false,
      delivering: true,
      delivered: false,
    });
  };
  const handleClickDelivered = () => {
    // console.log('delovered');

    getDeliveredPurchase();
    setActiveStatus({
      all: false,
      delivering: false,
      delivered: true,
    });
  };
  const handleClickedDeleteButton = (productId) => {
    setModalState(true);
    setClickedDeleteButton({ productID: productId });
    // console.log('userID: ', userID, ' , productID: ', productId);
  };
  const handleRepurchase = (optionID, color) => {
    // console.log('optionID: ', optionID, 'color: ', color);
    userRequest()
      .post(`cart/add/${userID}`, {
        optionID: optionID,
        color: color,
      })
      .then(() => {
        navigateCart('../cart');
      })
      .catch((err) => console.log(err));
  };
  const handleRenderProduct = (item, product) => {
    if (!item.deleted) {
      return (
        <div className="products">
          <div key={item._id} className="single_product">
            <div className="info">
              <div className="brand_status">
                <div className="brand">
                  <p>
                    Thương hiệu:
                    <strong id="brandProduct">
                      {' '}
                      {item.optionID.item.brand.name}{' '}
                    </strong>{' '}
                    | Ngày mua:{' '}
                    <strong id="dateProduct">
                      {moment(product.createAt).format('LLLL')}
                    </strong>
                  </p>
                </div>
                <div className="status">
                  <p>
                    Trạng thái:{' '}
                    <strong id="statusProduct">{product.status}</strong>
                  </p>
                </div>
              </div>
              <hr />
              <a href="/phone/iphone11-256GB" className="name_price">
                <div className="img_name">
                  <script>var bool = true</script>
                  <img
                    id="imgProduct"
                    src={`${item.optionID.color[0].image}`}
                    alt=""
                  />
                  <div className="name_num">
                    <p className="name" id="nameProduct">
                      {item.optionID.item.name}{' '}
                    </p>
                    <p className="num">
                      x<strong id="numProduct">{item.quantity} </strong>
                    </p>
                    <p className="num">
                      Màu: <strong id="colorProduct">{item.color}</strong>
                      {/* Màu: <strong id="colorProduct">{item._id}</strong> */}
                    </p>
                  </div>
                </div>

                <div className="price_one_product">
                  <p>
                    <strong id="priceProduct">
                      {currentChange(item.optionID.color[0].price)}
                    </strong>{' '}
                  </p>
                </div>
              </a>
              <hr />
            </div>
            <div className="price">
              <div className="action" style={{ marginBottom: '3rem' }}>
                <button
                  className="btn  "
                  type="submit"
                  onClick={() =>
                    handleRepurchase(item.optionID._id, item.color)
                  }
                >
                  Mua lại
                </button>
                <button
                  className="btn "
                  onClick={() => handleClickedDeleteButton(item._id)}
                >
                  Xóa
                </button>
              </div>
              <p id="totalPrice">
                Tổng số tiền:{' '}
                <strong>
                  {currentChange(item.optionID.color[0].price * item.quantity)}
                </strong>
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Header />
      <ModalPopUp
        name={'lịch sử mua hàng'}
        modalState={modalState}
        handelClickConfirm={handelClickConfirm}
        toogleState={setModalState}
      />
      <section className="container_purchase">
        <div className="status_menu">
          <div
            className={activeStatus.all ? 'statusAll active' : 'statusAll'}
            onClick={() => handleClickAllProduct()}
          >
            <a>Tất cả</a>
          </div>
          <div
            className={
              activeStatus.delivering
                ? 'statusDelivering active'
                : 'statusDelivering'
            }
            onClick={() => handleClickDelivering()}
          >
            <a>Đang giao </a>
          </div>
          <div
            className={
              activeStatus.delivered
                ? 'statusDelivered active'
                : 'statusDelivered'
            }
            onClick={() => handleClickDelivered()}
          >
            <a>Đã giao</a>
          </div>
        </div>

        <div className="search">
          <input
            type="text"
            className="searchTerm"
            id="searchBoxPurchase"
            placeholder=" Tìm kiếm lịch sử mua hàng... "
          />
          <button type="submit" className="searchButton">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {productsList.map((product) =>
          product.list.map((item) => handleRenderProduct(item, product)),
        )}
      </section>
      <Footer />
    </>
  );
}
