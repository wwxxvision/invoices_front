import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import GroupInput from './groupInput';
import { inititalForm, updateGroup, setupField, showModal } from '../redux/actions/action';
import ImmutableHelper from '../classes/System/ImmutableHelper';
import InputHandler from '../classes/System/InputHandler';

class FormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsTriggered: false,
      formIsInvalid: false
    }
  }

  validation(rules, value) {
    if (!rules) {
      return true;
    }

    if (!value) {
      return false;
    }

    let checkType = typeof value === rules.type;
    let checkminLength = true;
    let isValide = false;

    if (rules.minLength) {
      checkminLength = value.length > rules.minLength;
    }

    isValide = checkType && checkminLength;

    return isValide;
  }

  componentWillMount() {
    if (!this.props.stateRedux.form)
      this.props.inititalForm(this.initializeForm());
  }

  componentWillUnmount() {
    this.props.inititalForm(null);
  }

  getUsedFields = () => {
    let usedFields = {};
    const fields = this.setDefaultValuesForFields();
    const schema = { ...this.props.schema };

    for (let key in fields) {
      if (schema[key].editable) {
        usedFields = { ...usedFields, [key]: fields[key] };
      }
    }

    return usedFields;
  }

  getFeedBackValideMessage = (name) => (
    <Form.Control.Feedback type="invalid">
      Не валидное значение для поля {name}
    </Form.Control.Feedback>
  )

  validationBeforeSubmit = () => {
    return new Promise((resolve) => {
      let isInValide = Object.keys(this.props.stateRedux.form)
        .some(key => !this.validation(this.props.schema[key].validationRules, this.props.stateRedux.form[key]))

      this.setState({
        formIsInvalid: isInValide
      }, resolve)
    })
  }

  sendForm = (e) => {
    this.setState({
      formIsTriggered: true
    });
    this.validationBeforeSubmit()
      .then(() => {
        if (!this.state.formIsInvalid) {
          this.props.showModal(false);
          this.props.sendForm(this.props.stateRedux.form);
        }
      })

    e.preventDefault();
  };

  setDefaultValuesForFields = () => {
    let fieldWithValue = {};
    const schema = { ...this.props.schema };

    for (let key in schema) {
      let initValue = null;

      if (this.props.data) {
        initValue = this.props.data[key];
      }

      const defaultFieldValue = schema[key].defaultValue;

      fieldWithValue = {
        ...fieldWithValue,
        [key]: initValue ? initValue : defaultFieldValue
      }

      if (fieldWithValue[key] instanceof Array) {
        fieldWithValue[key] = fieldWithValue[key].map((item, index) => {
          item.uid = index + 1;
          return item;
        })
      }
    }

    return fieldWithValue;
  }

  initializeForm = () => this.getUsedFields();

  changedInput = (value, key) => {
    value = InputHandler.handling(key, value);
    let copynewState = ImmutableHelper.getNewCopyNestedObject(
      this.props.stateRedux,
      ['form', key],
      value,
    );

    this.props.inititalForm(copynewState.get('form'));
  };

  incrimentIdForDefaultValue = (allGroups) => {
    return allGroups[allGroups.length - 1].uid + 1;
  }

  addGroupComponent = (defaultValues, allGroups, key) => {
    defaultValues[0].uid = this.incrimentIdForDefaultValue(allGroups);
    let arrWithAddedNewGroup = [...allGroups, defaultValues[0]];
    this.props.updateGroup(arrWithAddedNewGroup, key);
  }

  getInputsTemplate = () => {
    let InputComponent = null;
    let keyByFileds = Object.keys(this.props.stateRedux.form); // getting all keys our fields from state;

    return keyByFileds.map((keyField) => {
      const schemaOfThisField = this.props.schema[keyField];
      switch (schemaOfThisField.inputType) {
        case 'group':
          let groups = ImmutableHelper.getCopyNestedObject({ ...this.props.stateRedux }, ['form', keyField]);

          InputComponent = (
            <>
              {groups.map((group, groupIndex) => (
                <GroupInput
                  key={group.uid}
                  elements={schemaOfThisField.elements}
                  groupName={schemaOfThisField.name}
                  groupIndex={groupIndex}
                  validation={this.validation}
                  getFeedBackValideMessage={this.getFeedBackValideMessage}
                  groupID={group.uid}
                  formIsTriggered={this.state.formIsTriggered}
                  isDynamicGroup={schemaOfThisField.isDynamicGroup}
                  InputHandler={InputHandler}
                />
              ))}

              {schemaOfThisField.isDynamicGroup &&
                <Button onClick={() => this.addGroupComponent(
                  { ...schemaOfThisField.defaultValue },
                  this.props.stateRedux.form[keyField],
                  keyField
                )} variant="primary">Добавить</Button>
              }
            </>
          )
          break;
        case 'select':
          const pathToObject = schemaOfThisField.options[0];
          const keyForShow = schemaOfThisField.options[1];
          const options = this.props.globalData[pathToObject] ? this.props.globalData[pathToObject] : [];
          InputComponent = (
            <Form.Control
              name={schemaOfThisField.name}
              autoComplete="off"
              as="select"
              type={schemaOfThisField.inputType}
              onChange={(e) => this.changedInput(parseInt(e.target.value), keyField)}
              isInvalid={
                !this.validation(schemaOfThisField.validationRules, this.props.stateRedux.form[keyField])
                && this.state.formIsTriggered
              }
              placeholder={schemaOfThisField.placeholder}
              value={this.props.stateRedux.form[keyField]}
            >
              <option value="0">Выбор</option>
              {options.map((option, index) => (<option value={option.id} key={index}>{option[keyForShow]}</option>))}
            </Form.Control>
          )
          break;
        default:
          InputComponent = (
            <Form.Control
              name={schemaOfThisField.name}
              autoComplete="off"
              type={schemaOfThisField.inputType}
              onChange={(e) => this.changedInput(e.target.value, keyField)}
              isInvalid={
                !this.validation(schemaOfThisField.validationRules, this.props.stateRedux.form[keyField])
                && this.state.formIsTriggered
              }
              placeholder={schemaOfThisField.placeholder}
              value={this.props.stateRedux.form[keyField]}
            />
          );
      }

      const inputIsHidden = schemaOfThisField.inputType === 'hidden';
      const groupAddedClassForVisibility = inputIsHidden ? 'hidden' : 'visibile';

      return (
        <Form.Group className={groupAddedClassForVisibility} key={schemaOfThisField.name}>
          <Form.Label>{schemaOfThisField.label.toUpperCase()}</Form.Label>
          {InputComponent}
          {this.getFeedBackValideMessage(schemaOfThisField.label)}
        </Form.Group>
      )
    })
  }

  updateStateFromChildComponent = (newState, key) => {
    let copynewState = ImmutableHelper.getNewCopyNestedObject(
      this.props.stateRedux,
      ['form', key],
      newState,
    );

    this.props.inititalForm(copynewState.get('form'));
  };

  renderChildren = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        callback: this.updateStateFromChildComponent
      });
    });
  }

  render() {
    return (
      <Form validated={false} onSubmit={this.sendForm} className="form">
        {this.renderChildren()}
        {this.props.stateRedux.form &&
          this.getInputsTemplate()
        }
        <Button type="submit">{this.props.titleButton}</Button>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    stateRedux: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    inititalForm: (formData) => dispatch(inititalForm(formData)),
    updateGroup: (newGroup, keyField) => dispatch(updateGroup(newGroup, keyField)),
    setupField: (key, value) => dispatch(setupField(key, value)),
    showModal: (options) => dispatch(showModal(options))
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormBase);