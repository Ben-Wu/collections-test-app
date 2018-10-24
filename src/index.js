import m from "mithril";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'

import ObjectList from './js/ObjectList';

const baseUrl = 'http://localhost:8000';

let carts = [];
let files = [];
let entities = [];

let userId = '';

const updateUserId = () => {
  userId  = document.getElementById('user-id-input').value;
};

let cartName = '';

const updateCartName = () => {
  cartName = document.getElementById('cart-name-input').value;
};

let cartId = '';

const updateCartId = () => {
  cartId = document.getElementById('cart-id-input').value;
};

let alertMessage = '';
let showAlert = false;

const handleError = err => {
    console.error(err);
    alertMessage = err.Message ? err.Message : err;
    showAlert = true;
    setTimeout(() => {
      showAlert = false;
      m.redraw();
    }, 5000);
};

const getCarts = () => {
  if (!userId) {
    handleError('User ID required');
    return;
  }
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/carts/`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    carts = data;
  }).catch(handleError);
};

const getFiles = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/repository/files/`
  }).then(data => {
    console.log(data.hits);
    files = data.hits.flatMap(hit => hit.files.map(file => Object.assign(file, hit.bundles[0])));
  }).catch(handleError);
};

const createCart = () => {
  if (!userId || !cartName) {
    handleError('User ID and Cart name required');
    return;
  }
  m.request({
    method: 'POST',
    url: `${baseUrl}/resources/carts/`,
    headers: {
      'Authorization': `${userId}`,
    },
    data: {
      cartName
    }
  }).then(data => {
    console.log(data);
    getCarts();
  }).catch(handleError);
};

const deleteCart = (givenId) => {
  if (!userId) {
    handleError('User ID required');
    return;
  }
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/carts/${givenId}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCarts();
  }).catch(handleError);
};


const getCartItems = () => {
  if (!userId || !cartId) {
    handleError('User ID and Cart ID required');
    return;
  }
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/carts/${cartId}/items`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    entities = data;
  }).catch(handleError);
};

const addToCart = (entityId, bundleId, bundleVersion) => {
  if (!userId || !cartId) {
    handleError('User ID and Cart ID required');
    return;
  }
  m.request({
    method: 'POST',
    url: `${baseUrl}/resources/carts/${cartId}/items`,
    headers: {
      'Authorization': `${userId}`,
    },
    data: {
      entityType: 'files',
      entityId,
      bundleId,
      bundleVersion
    }
  }).then(data => {
    console.log(data);
    getCartItems();
  }).catch(handleError);
};

const deleteFromCart = (cartItemId) => {
  if (!userId) {
    handleError('User ID required');
    return;
  }
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/carts/${cartId}/items/${cartItemId}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCartItems();
  }).catch(handleError);
};

const buttonActions = {
  'Get files': getFiles,
  'Get carts': getCarts,
  'Create cart': createCart,
  'Get items in cart': getCartItems,
};

const App = {
  oninit: getFiles,
  view: () => {
    return (
      <div className="main-container">
        <div className="header container-fluid">Collections/Cart API Test</div>


        <div className="container">

          {showAlert ?
            <div className="alert alert-danger" role="alert">
              <strong>Error: </strong>{alertMessage}
            </div>
            : ''}

          <div className="input-field-container">

            <input id="user-id-input" type="text" className="form-control "
                   placeholder="User ID" onkeyup={updateUserId}/>

            <input id="cart-name-input" type="text" className="form-control"
                   placeholder="Cart Name" onkeyup={updateCartName}/>

            <input id="cart-id-input" type="text" className="form-control"
                   placeholder="Cart ID" onkeyup={updateCartId}/>

          </div>

          <div className="control-buttons row">

            {Object.entries(buttonActions).map(entry =>
                <button className="btn btn-primary" onclick={entry[1]}>{entry[0]}</button>
            )}

          </div>

          <ObjectList title="Collections" objects={carts}
                      addButton={true}
                      buttonProperties={
                        {
                          buttonClass: "btn-danger",
                          buttonText: "Delete cart",
                          onButtonClick: (properties => deleteCart(properties.CartId))
                        }
                      }/>

          <ObjectList title="Files in cart" objects={entities}
                      addButton={true}
                      buttonProperties={
                        {
                          buttonClass: "btn-danger",
                          buttonText: "Remove",
                          onButtonClick: (properties => deleteFromCart(properties.CartItemId))
                        }
                      }/>

          <ObjectList title="Files" objects={files}
                      addButton={true}
                      buttonProperties={
                        {
                          buttonClass: "btn-success",
                          buttonText: "Add to cart",
                          onButtonClick: (properties => addToCart(
                            properties.uuid, properties.bundleUuid, properties.bundleVersion))
                        }
                      }/>

        </div>
      </div>
    );
  }
};

m.mount(document.body, App);
