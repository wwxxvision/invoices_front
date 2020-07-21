import {
  SHOW_MODAL,
  SET_USER_STATUS,
  SETUP_FIELD,
  INITIAL_FORM,
  UDPATE_GROUP
} from './actionTypes';


function showModal(options) {
  return { type: SHOW_MODAL, options }
}

function setUserStatus(status) {
  return { type: SET_USER_STATUS, status }
}

function setupField(key, value) {
  return { type: SETUP_FIELD, key, value }
}

function inititalForm(formData) {
  return { type: INITIAL_FORM, formData }
}

function updateGroup(newGroup, keyField) {
  return { type: UDPATE_GROUP, newGroup, keyField }
}

export {
  showModal,
  setUserStatus,
  setupField,
  inititalForm,
  updateGroup
}