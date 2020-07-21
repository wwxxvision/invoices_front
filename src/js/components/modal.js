import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import DispatchWrapper from '../classes/System/DispatchWrapper';
import { Button } from 'react-bootstrap';
import FormBase from './form';
import PropTypes from 'prop-types';

export default function BaseModal(props) {
  const dispatchWrapper = new DispatchWrapper(useDispatch());
  const hideModal = () => dispatchWrapper.makeAction('SHOW_MODAL', { options: false });
  let timer = null;

  const getFooter = () => {
    const haveButtons = props.buttons && props.buttons.length;
    if (haveButtons) {
      return (
        props.buttons.map(button => (
          <Button
            onClick={() => button.action(hideModal, props)}
            variant={button.variant}>
            {button.title}
          </Button>)
        )
      )
    }

    return (<></>)
  }

  useEffect(() => {
    if (props.timeLife) {
      setTimeout(() => {
        hideModal();
        clearTimeout(timer);
      }, props.timeLife)
    }
  }, []);

  return (
    <>
      <Modal
        show={true}
        onHide={hideModal}
        dialogClassName={"modal__window"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal__title">
            {props.action}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{props.message && props.message}</p>
          {props.body && <props.body {...props}  />}
          {props.form && <FormBase titleButton="Сохранить" {...props} />}
        </Modal.Body>

        <Modal.Footer>
          {getFooter()}
        </Modal.Footer>
      </Modal>
    </>
  )
}

BaseModal.propTypes = {
  buttons: PropTypes.array,
  message: PropTypes.string,
  body: PropTypes.func,
  action: PropTypes.string
}

BaseModal.defaultProps  = {
  buttons: [],
  body: null,
  message: null,
  action: 'Действие'
}