import m from "mithril";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.scss'

const TableRow = {
  view: vnode => {
    const onCheckChanged = vnode.attrs.onCheckChanged;
    const properties = vnode.attrs.properties;

    const onChange = (element) => {
      const checkValue = element.target.checked;
      onCheckChanged(checkValue, properties);
    };

    const checkbox = vnode.attrs.selectable
      ? <td className="table-checkbox" onchange={onChange}><input type="checkbox"/></td>
      : '';

    const values = [checkbox].concat(Object.entries(properties).map(x => <td>{x[1]}</td>));

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
    const onCheckChanged = vnode.attrs.onCheckChanged;
    const selectable = vnode.attrs.selectable;

    return (
      <div className="object-list">
        <div className="object-list-header">{title}</div>
          <table className="table table-striped">
            <thead>
            <tr>
              {objects.length
                ? [selectable ? <th scope="col">Selected</th> : '']
                  .concat(Object.entries(objects[0]).map(x => <th scope="col">{x[0]}</th>))
                : ''}
            </tr>
            </thead>
            <tbody>
            {objects.length
              ? objects.map(object =>
                <TableRow selectable={selectable}
                          onCheckChanged={onCheckChanged}
                          properties={object}/>)
              : 'None found'}
            </tbody>
          </table>
      </div>
    );
  }
};

export default ObjectList;
