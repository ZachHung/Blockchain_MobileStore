import React from 'react';
import './UpdateItem.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storage } from '../../firebase';
import { userRequest } from '../../utils/CallApi';
import { hostServer } from '../../utils/const';
import { Link } from 'react-router-dom';

function UpdateItemDetail() {
  const params = useParams();
  const [ItemDetail, setdetailphone] = useState([]);
  const [image, setImage] = useState(null);
  const [urlImage, setUrl] = useState('');

  useEffect(() => {
    userRequest()
      .get('admin/products/edit/' + params.id)
      .then((res) => {
        setdetailphone(res.data.items);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    document.getElementById('isLoading').style.display = 'block';
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setUrl(url);
            var x = document.getElementById('my-image');
            x.style.display = 'block';
            document.getElementById('isLoading').style.display = 'none';
          });
      },
    );
  };

  return (
    <div className="container mt-4 mb-4">
      {ItemDetail.map((ItemDetail) => (
        <div>
          <h1 className="text-center heading">
            Chỉnh sửa thông tin chi tiết sản phẩm {ItemDetail.name}
          </h1>
          {ItemDetail.slug?.map((slug, index) => (
            <div>
              <form
                className="mt-4"
                method="POST"
                action={
                  hostServer +
                  '/api/admin/products/updateDetail/' +
                  slug._id +
                  '?_method=PUT'
                }
              >
                <div>
                  <input
                    type="hidden"
                    id="id"
                    name="id"
                    defaultValue={ItemDetail._id}
                  />

                  <div className="mb-4">
                    <label
                      htmlFor="detail"
                      className="form-label label_level_1"
                    >
                      Bộ nhớ trong
                    </label>
                    <input
                      className="form-control my-input-tag"
                      id="detail"
                      name="detail"
                      defaultValue={slug.detail}
                    />
                  </div>

                  <label className="label_level_1">
                    Màu sắc{' '}
                    <a
                      onClick={myFunction.bind(this, index)}
                      id="add-color"
                      className="btn btn-primary addbnt"
                    >
                      +
                    </a>
                  </label>
                  <p className="decri">
                    Xóa tên màu để xóa màu và thông tin liên quan đến màu đó
                  </p>

                  {slug.color?.map((color) => (
                    <div>
                      <label className="label_level_2">Màu</label>
                      <input
                        className="form-control my-input-tag my-color"
                        onBlur={CheckColor}
                        placeholder="Thông tin về màu này sẽ bị xóa (hình ảnh, số lượng còn lại, giá, giảm giá)"
                        id="name"
                        name="name"
                        defaultValue={color.name}
                      />
                      <br></br>
                      <div className="lavel_2">
                        <div className="mb-4">
                          <label
                            htmlFor="image"
                            className="form-label label_level_3"
                          >
                            Hình ảnh
                          </label>
                          <input
                            className="form-control my-input-tag image"
                            id="image"
                            name="image"
                            defaultValue={color.image}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="number"
                            className="form-label label_level_3"
                          >
                            Số lượng còn lại
                          </label>
                          <input
                            type="number"
                            className="form-control my-input-tag number"
                            id="number"
                            name="number"
                            defaultValue={color.number}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="price"
                            className="form-label label_level_3"
                          >
                            Giá
                          </label>
                          <input
                            type="number"
                            className="form-control my-input-tag price"
                            id="price"
                            name="price"
                            defaultValue={color.price}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="discount"
                            className="form-label label_level_3"
                          >
                            Giảm giá (%)
                          </label>
                          <input
                            type="number"
                            className="form-control my-input-tag discount"
                            id="discount"
                            name="discount"
                            defaultValue={color.discount}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div id="my-color" className="add-info my-color-hidden">
                    <label className="label_level_2">
                      Màu (<span className="require">*</span>)
                    </label>
                    <input
                      placeholder="Nhập vào tên màu"
                      className="form-control my-input-tag name-new"
                      id="name-new"
                    />
                    <br></br>
                    <div className="lavel_2">
                      <div className="mb-4 ">
                        <div className="row">
                          <div className="col-10">
                            <label htmlFor="formFile" className="label_level_3">
                              Hình ảnh (<span className="require">*</span>)
                            </label>
                            <input
                              className="form-control my-input-tag file-input"
                              type="file"
                              onChange={handleChange}
                            />
                            <div className="add-image">
                              <input
                                type="text"
                                className="form-control my-input-tag image-new newImage"
                                defaultValue={urlImage}
                              />
                            </div>
                            <div className="mt-4 add-info isLoading">
                              <h3 className="text-center">Đang tải...</h3>
                            </div>
                          </div>
                          <div className="col">
                            <a
                              className="btn btn-primary upload-bnt"
                              onClick={handleUpload}
                            >
                              Tải lên
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="number"
                          className="form-label label_level_3"
                        >
                          Số lượng còn lại (<span className="require">*</span>)
                        </label>
                        <input
                          placeholder="Nhập vào số lượng"
                          className="form-control my-input-tag number-new"
                          id="number-new"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="price"
                          className="form-label label_level_3"
                        >
                          Giá (<span className="require">*</span>)
                        </label>
                        <input
                          placeholder="Nhập vào giá"
                          className="form-control my-input-tag price-new"
                          id="price-new"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="discount"
                          className="form-label label_level_3"
                        >
                          Giảm giá (%) (<span className="require">*</span>)
                        </label>
                        <input
                          placeholder="Nhập vào giảm giá"
                          className="form-control my-input-tag discount-new"
                          id="discount-new"
                        />
                      </div>
                      <label className="decri">
                        Vui lòng nhập đầy đủ thông tin bên trên
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary my-bnt">
                    Lưu lại
                  </button>
                  <br />
                </div>
              </form>
              <hr></hr>
            </div>
          ))}
          <Link
            className="btn btn-primary my-bnt bnt-back"
            to={`/admin/products/update/${ItemDetail._id}`}
          >
            Quay lại
          </Link>
        </div>
      ))}
    </div>
  );
}

//show and hiden form add color
function myFunction(index) {
  var x = document.getElementsByClassName('my-color-hidden');
  var addcolorbnt = document.getElementsByClassName('addbnt');
  var namenew = document.getElementsByClassName('name-new');
  var imagenew = document.getElementsByClassName('image-new');
  var numbernew = document.getElementsByClassName('number-new');
  var pricenew = document.getElementsByClassName('price-new');
  var discountnew = document.getElementsByClassName('discount-new');
  var myimage = document.getElementsByClassName('add-image');
  var isloadding = document.getElementsByClassName('isLoading');
  if (x[index].style.display !== 'block') {
    x[index].style.display = 'block';
    addcolorbnt[index].innerText = '-';
    namenew[index].name = 'name';
    imagenew[index].name = 'image';
    numbernew[index].name = 'number';
    pricenew[index].name = 'price';
    discountnew[index].name = 'discount';
    myimage[index].id = 'my-image';
    isloadding[index].id = 'isLoading';
    namenew[index].focus();
  } else {
    x[index].style.display = 'none';
    addcolorbnt[index].innerText = '+';
    namenew[index].name = '';
    imagenew[index].name = '';
    numbernew[index].name = '';
    pricenew[index].name = '';
    discountnew[index].name = '';
    myimage[index].id = '';
    isloadding[index].id = '';
  }
}

//check for delete color
function CheckColor() {
  var name = document.getElementsByClassName('my-color');
  var image = document.getElementsByClassName('image');
  var number = document.getElementsByClassName('number');
  var price = document.getElementsByClassName('price');
  var discount = document.getElementsByClassName('discount');
  for (var i = 0; i < name.length; i++) {
    if (name[i].value === '') {
      name[i].name = '';
      image[i].name = '';
      number[i].name = '';
      price[i].name = '';
      discount[i].name = '';
    } else {
      name[i].name = 'name';
      image[i].name = 'image';
      number[i].name = 'number';
      price[i].name = 'price';
      discount[i].name = 'discount';
    }
  }
}

export default UpdateItemDetail;
