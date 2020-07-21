import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {
  faBan,
  faDownload,
  faEdit,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import Filter from '../classes/System/Filter';
import Translator from '../classes/System/Translator';
import TableActionController from '../classes/Controllers/TableActionController';
import TableBuilder from '../classes/Table/TableBuilder';
import { Spinner } from 'react-bootstrap';
import Service from '../classes/System/Service';
import { Button } from 'react-bootstrap';

export default function TableCrud({ type }) {
  const dispatch = useDispatch();
  const tableActionController = new TableActionController(dispatch, type);
  const [tableBuilder, updateTableBuidler] = useState(new TableBuilder(type));
  const [staticTablefields, setStaticTableFieldes] = useState([]);
  const [searchString, setSearchString] = useState(null);
  const [fieldsTable, setFieldsTable] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const updateTable = useSelector(state => state.updateTable);
  const controlls = [
    {
      name: 'edit',
      icon: <FontAwesomeIcon icon={faEdit} />,
      action: false,
      accesPathes: ['clients', 'invoices']
    },
    {
      name: 'delete',
      icon: <FontAwesomeIcon icon={faBan} />,
      action: false,
      accesPathes: ['clients', 'invoices']
    },
    {
      name: 'print',
      icon: <FontAwesomeIcon icon={faDownload} />,
      action: false,
      accesPathes: ['invoices']
    },
  ];

  const uploadTableData = () => {
    setLoading(true);
    Service.getting(`/${type}`, { 'Content-type': 'application/json' }, true)
      .then(res => {
        const table = tableBuilder.build(res[type]);
        setFieldsTable(table);
        setStaticTableFieldes(table);
      })
      .catch(err => console.log(err))
      .then(() => setLoading(false));
  }

  useEffect(() => {
    uploadTableData();
  }, [])

  useEffect(() => {
    if (searchString) {
      const filterResult = Filter.getResult(searchString, fieldsTable);

      if (filterResult.length) {
        setFieldsTable(filterResult);
      }

      else {
        setFieldsTable(staticTablefields);
      }
    }
    else {
      setFieldsTable(staticTablefields);
    }
  }, [searchString]);

  useEffect(() => {
    if (updateTable) {
      uploadTableData();
    }
  }, [updateTable])

  const sort = () => {
    setFieldsTable([...fieldsTable].map(fieldsTable.pop, fieldsTable));
  }

  //Functions

  const getControllsforCurrentPage = (controlls) => {
    return controlls.filter(controll => {
      let canUseThis = controll.accesPathes.some(path => path === type);

      if (canUseThis) {
        return controll;
      }

      return false;
    })
      .filter(controll => controll);
  }

  const changeSearchBar = (e) => setSearchString(e.target.value);

  // Templates

  const getControlls = (current) => {
    let controllsFiltered = getControllsforCurrentPage(controlls);
    return (
      <>
        <td className="table-crud__ceil table-crud__ceil-controllers">
          {controllsFiltered.map((controll, index) => (
            <span onClick={() => tableActionController.clickOnTableControlls(controll.name, tableBuilder.getCurrent(current.id))} key={index}>
              {controll.icon}
            </span>
          ))}
        </td>
      </>
    )
  }

  const getRows = () => {
    return (
      <>
        {fieldsTable.map((field, index) => (
          <tr className="table-crud__body" key={index}>
            {Object.keys(field).map((keyField, indexKey) => {
              return (
                <td className="table-crud__data" key={indexKey}>
                  {field[keyField]}
                </td>
              )
            })}

            {getControlls(tableBuilder.getData()[index])}
          </tr>
        ))}
      </>
    )
  }

  const getHeads = () => {
    let copyFields = fieldsTable;
    const field = copyFields[0];

    return (
      <>
        {Object.keys(field).map((keyField, index) => (
          <th key={index}>
            {Translator.translateKey(keyField).toUpperCase()}
          </th>
        ))}
        <th></th>
      </>
    )
  }

  const getContent = () => {
    const hasFields = Boolean(fieldsTable.length);

    if (hasFields) {
      return (
        <Table className="table-crud">
          <thead>
            <tr className="table-crud__header">
              {getHeads()}
            </tr>
          </thead>
          <tbody>
            {getRows()}
          </tbody>
        </Table>
      )
    }

    return (
      <span>Список пуст</span>
    )
  }


  if (!isLoading) {
    return (
      <>
        <div className="topbar">
          <div className="block flex">
            <div className="search">
              <input onChange={changeSearchBar} className="input" placeholder={"Поиск"} type="text" />
              <div className="icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </div>
            <Button className="mg-10" onClick={sort}>Сортировать</Button>
          </div>
          <div className="block">
            <Button onClick={() => tableActionController.addField(tableBuilder)} variant="success">Добавить</Button>
          </div>
        </div>
        {getContent()}
      </>
    )
  }

  return (<span className="table__preloader"><Spinner animation="border" variant="primary" /></span>)
}