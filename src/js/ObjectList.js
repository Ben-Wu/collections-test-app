import m from "mithril";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.scss'

const TableRow = {
  view: vnode => {
    const properties = vnode.attrs.properties;
    const buttonProperties = vnode.attrs.buttonProperties;

    const button = buttonProperties
      ? <button className={`btn ${buttonProperties.buttonClass}`}
                onclick={() => buttonProperties.onButtonClick(properties)}>
        {buttonProperties.buttonText}
        </button>
      : '';

    const values = [button].concat(Object.entries(properties).map(x => <td>{x[1]}</td>));

    return (
      <tr className="object-table-row">
        {values}
      </tr>
    );
  }
};

const ObjectList = {
  view: vnode => {
    const title = vnode.attrs.title;
    const objects = vnode.attrs.objects;
    const addButton = vnode.attrs.addButton;
    const buttonProperties = vnode.attrs.buttonProperties;

    return (
      <div className="object-list">
        <div className="object-list-header">{title}</div>
          <table className="table table-striped">
            <thead>
            <tr>
              {objects.length
                ? [addButton ? <th scope="col"/> : '']
                  .concat(Object.entries(objects[0]).map(x => <th scope="col">{x[0]}</th>))
                : ''}
            </tr>
            </thead>
            <tbody>
            {objects.length
              ? objects.map(object =>
                <TableRow properties={object}
                          buttonProperties={addButton ? buttonProperties : ''}/>)
              : 'None found'}
            </tbody>
          </table>
      </div>
    );
  }
};

export default ObjectList;
