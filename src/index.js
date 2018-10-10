import m from "mithril";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'

const baseUrl = 'http://localhost:8000';

let collections = [];
let files = [];

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

let fileId = '';

const updateFileId = () => {
  const value = document.getElementById('file-id-input').value;
  fileId = value;
};

let alertMessage = '';
let showAlert = false;

const getCollections = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/resources/collections/`,
    headers: {
      'Authorization': `${userId}`,
    },
    data: {}
  }).then(data => {
    console.log(data);
    collections = data;
  }).catch(err => {
    console.error(err);
    alertMessage = err;
    showAlert = true;
    setTimeout(() => showAlert = false, 3000);
  });
};

const getFiles = () => {
  m.request({
    method: 'GET',
    url: `${baseUrl}/repository/files/`,
    data: {}
  }).then(data => {
    console.log(data.hits);
    files = data.hits.flatMap(x => x.files);
  }).catch(err => {
    console.error(err);
    alertMessage = err;
    showAlert = true;
    setTimeout(() => showAlert = false, 3000);
  });
};

const TableRow = {
  view: vnode => {
    const properties = vnode.attrs.properties;
    return (
      <tr>
        {properties.map(prop => <td>{prop}</td>)}
      </tr>
    );
  }
};

const ObjectList = {
  view: vnode => {
    const title = vnode.attrs.title;
    const objects = vnode.attrs.objects;

    console.log(objects);

    return (
      <div className="object-list">
        <div className="object-list-header">{title}</div>
          <table className="table table-striped">
            <thead>
            <tr>
              {objects.length
                ? Object.entries(objects[0]).map(x => <th scope="col">{x[0]}</th>)
                : ''}
            </tr>
            </thead>
            <tbody>
            {objects.length
              ? objects.map(object => <TableRow properties={Object.entries(object).map(x => x[1])}/>)
              : 'None found'}
            </tbody>
          </table>
      </div>
    );
  }
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

            <input id="file-id-input" type="text" className="form-control"
                   placeholder="File ID" onkeyup={updateFileId}/>

          </div>

          <div className="control-buttons">

            <button className="btn btn-primary" onclick={getCollections}>Get collections</button>

            <button className="btn btn-primary" onclick={getFiles}>Get files</button>

          </div>

          <ObjectList title="Collections" objects={collections}/>

          <ObjectList title="Files" objects={files}/>
        </div>
      </div>
    );
  }
};

m.mount(document.body, App);
