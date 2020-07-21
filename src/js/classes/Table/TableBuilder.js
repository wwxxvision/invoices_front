export default class TableBuilder {
  constructor(type) {
    this.type = type;
    this.tableFields = [];
    this.schema = null;
    this.data = null;
    this.current = null;
    this.clients = null;
  }

  createFieldsBySchema(schema, fields) {
    fields.forEach(field => {
      let newobject = {};
      for (let key in schema) {
        if (schema[key].visibility) {
          newobject = { ...newobject, [key]: field[key] };
        }
      }

      this.tableFields.push(newobject);
      this.tableFields.map((item, index) => item.uid = index + 1)
    });
  }

  setSchema(schema) {
    this.schema = schema;
  }

  setData(data) {
    this.data = data;
  }

  getTable() {
    return this.tableFields;
  }

  getData() {
    return this.data;
  }

  getCurrent(id) {
    return {
      data: this.data,
      schema: this.schema,
      current: this.data.find(item => item.id === id),
      clients: this.clients
    }
  }

  clearFields() {
    if (this.tableFields.length)
      this.tableFields = [];
  }

  build(result) {
    this.clearFields();
    const { schema, data } = result;
    this.setSchema(schema);
    this.setData(data);
    this.createFieldsBySchema(this.schema, this.data);

    if (result.clients) {
      this.clients = result.clients;
    }

    return this.getTable();
  }
}