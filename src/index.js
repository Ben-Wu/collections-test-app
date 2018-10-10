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

let alertMessage = '';
let showAlert = false;

const handleError = err => {
    console.error(err);
    alertMessage = err.Message;
    showAlert = true;
    setTimeout(() => {
      showAlert = false;
      m.redraw();
    }, 5000);
};

const getCarts = () => {
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
    files = data.hits.flatMap(x => x.files);
  }).catch(handleError);
};

const createCarts = () => {
  m.request({
    method: 'POST',
    url: `${baseUrl}/resources/carts/${cartName}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCarts();
  }).catch(handleError);
};

const deleteCarts = () => {
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/carts/${cartName}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCarts();
  }).catch(handleError);
};


const getCartItems = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/cart-items/${cartName}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    entities = data;
  }).catch(handleError);
};

const createEntity = (entityId) => {
  m.request({
    method: 'POST',
    url: `${baseUrl}/resources/cart-items/${cartName}?entity_id=${entityId}`,
    headers: {
      'Authorization': `${userId}`,
    },

  }).then(data => {
    console.log(data);
    getCartItems();
  }).catch(handleError);
};

const deleteEntity = (entityId) => {
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/cart-items/${cartName}?entity_id=${entityId}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCartItems();
  }).catch(handleError);
};

const onCheckChanged = (value, properties) => {
  if (value) {
    createEntity(properties.uuid);
  } else {
    deleteEntity(properties.uuid);
  }
};

const buttonActions = {
  'Get files': getFiles,
  'Get carts': getCarts,
  'Create cart': createCarts,
  'Delete cart': deleteCarts,
  'Get single cart': getCartItems,
};

const App = {
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

          </div>

          <div className="control-buttons">

            {Object.entries(buttonActions).map(entry =>
                <button className="btn btn-primary" onclick={entry[1]}>{entry[0]}</button>
            )}

          </div>

          <ObjectList title="Collections" objects={carts}/>

          <ObjectList title="Files in cart" objects={entities}/>

          <ObjectList title="Files" objects={files} selectable={true}
                      onCheckChanged={onCheckChanged}/>

        </div>
      </div>
    );
  }
};

m.mount(document.body, App);
