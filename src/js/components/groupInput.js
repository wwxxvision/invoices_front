import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ImmutableHelper from '../classes/System/ImmutableHelper';
import DispatchWrapper from '../classes/System/DispatchWrapper';

export default function GroupInput(props) {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const dispatchWrapper = new DispatchWrapper(dispatch);
  const groups = state.form[props.groupName];
  const deleteField = () => {
    let immutableGroups = ImmutableHelper.getImmutableList(groups);
    let deleted = immutableGroups.deleteIn([props.groupIndex]);

    dispatchWrapper.makeAction('UDPATE_GROUP', { newGroup: deleted.toJS(), keyField: props.groupName });
  }
  const changedInput = (value, elementName) => {
    let copynewState = ImmutableHelper.getNewCopyNestedObject(
      state,
      ['form', props.groupName, props.groupIndex, elementName], //path to object field
      value,
    );

    dispatchWrapper.makeAction('INITIAL_FORM', { formData: copynewState.get('form') });
  }
  const moreThenOneItem = groups.length > 1;
  const getControlsButtonsByComponent = () => (
    <>
      <Form.Row className="flex-space-between">
        {moreThenOneItem &&
          <Button onClick={deleteField} variant="danger">Удалить</Button>
        }
      </Form.Row>
    </>
  )

  return (
    <div className="form__module">
      <div className="module__wrapper">
        <div>
          {props.elements.map((element, index) => (
            <Form.Group key={index}>
              <Form.Label className="module__title">{element.label.toUpperCase()}</Form.Label>
              <Form.Control
                type={element.type}
                onChange={(e) => changedInput(props.InputHandler.handling(element.name, e.target.value), element.name)}
                isInvalid={
                  !props.validation(element.validationRules, groups[props.groupIndex][element.name])
                  && props.formIsTriggered
                }
                value={groups[props.groupIndex][element.name]}
                placeholder={element.placeholder}
              />
              {props.getFeedBackValideMessage(element.label)}
            </Form.Group>
          )
          )}
          {props.isDynamicGroup &&
            getControlsButtonsByComponent()
          }
        </div>
      </div>
    </div>
  )
}