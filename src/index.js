import m from "mithril";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'

import ObjectList from './js/ObjectList';

const baseUrl = 'http://localhost:8000';

let collections = [];
let files = [];
let entities = [];

let userId = '';

const updateUserId = () => {
  const value = document.getElementById('user-id-input').value;
  userId = value;
};

let collectionName = '';

const updateCollectionName = () => {
  const value = document.getElementById('collection-name-input').value;
  collectionName = value;
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

const getCollections = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/collections/`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    collections = data;
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

const createCollection = () => {
  m.request({
    method: 'POST',
    url: `${baseUrl}/resources/collections/${collectionName}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getCollections();
  }).catch(handleError);
};

const deleteCollection = () => {
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/collections/${collectionName}`,
    headers: {
      'Authorization': `${userId}`,
    },
    data: {
      collection_name: collectionName
    }
  }).then(data => {
    console.log(data);
    getCollections();
  }).catch(handleError);
};


const getSingleCollection = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/collections/${collectionName}`,
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
    url: `${baseUrl}/resources/collections/${collectionName}/${entityId}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getSingleCollection();
  }).catch(handleError);
};

const deleteEntity = (entityId) => {
  m.request({
    method: 'DELETE',
    url: `${baseUrl}/resources/collections/${collectionName}/${entityId}`,
    headers: {
      'Authorization': `${userId}`,
    }
  }).then(data => {
    console.log(data);
    getSingleCollection();
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
  'Get collections': getCollections,
  'Create collection': createCollection,
  'Delete collection': deleteCollection,
  'Get single collection': getSingleCollection,
};

const App = {
  view: () => {
    return (
      <div className="main-container">
        <div className="header container-fluid">Collections API Test</div>


        <div className="container">

          {showAlert ?
            <div className="alert alert-danger" role="alert">
              <strong>Error: </strong>{alertMessage}
            </div>
            : ''}

          <div className="input-field-container">

            <input id="user-id-input" type="text" className="form-control "
                   placeholder="User ID" onkeyup={updateUserId}/>

            <input id="collection-name-input" type="text" className="form-control"
                   placeholder="Collection Name" onkeyup={updateCollectionName}/>

          </div>

          <div className="control-buttons">

            {Object.entries(buttonActions).map(entry =>
                <button className="btn btn-primary" onclick={entry[1]}>{entry[0]}</button>
            )}

          </div>

          <ObjectList title="Collections" objects={collections}/>

          <ObjectList title="Files in collection" objects={entities}/>

          <ObjectList title="Files" objects={files} selectable={true}
                      onCheckChanged={onCheckChanged}/>

        </div>
      </div>
    );
  }
};

m.mount(document.body, App);
