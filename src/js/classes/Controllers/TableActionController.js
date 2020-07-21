import DispatchWrapper from '../System/DispatchWrapper';
import Client from '../Models/Base/Client';
import Invoice from '../Models/Base/Invoice';
import { CONSTANT } from '../../contants';


export default class TableActionController {
  constructor(dispatch, type) {
    this.type = type;
    this.dispatch = dispatch;
    this.dispatchWrapper = new DispatchWrapper(this.dispatch);
    this.models = {
      'CLIENTS': Client,
      'INVOICES': Invoice
    }
  }

  get currentModel() {
    return this.models[this.type.toUpperCase()]
  }

  __edit(data) {
    this.dispatchWrapper.makeAction(
      'SHOW_MODAL',
      {
        options:
        {
          name: this.type,
          globalData: data,
          schema: data.schema,
          data: data.current,
          action: 'Редактирование',
          sendForm: (body) => {
            this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: true });
            this.currentModel.update(body)
              .then(res => {
                if (!res.status) {
                  this.dispatchWrapper.makeAction(
                    'SHOW_MODAL',
                    {
                      options: {
                        message: `Ошибка ${res.message}`,
                        action: 'Сообщение',
                        timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                      }
                    }
                  );

                  return;
                }

                this.dispatchWrapper.makeAction(
                  'SHOW_MODAL',
                  {
                    options: {
                      name: 'answer',
                      message: `Успешно`,
                      action: 'Сообщение',
                      timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                    }
                  }
                );
                this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'updateTable', value: true });
              })
              .catch((err) => this.dispatchWrapper.makeAction(
                'SHOW_MODAL',
                {
                  options: {
                    name: 'answer',
                    message: `Ошибка ${err}`,
                    action: 'Сообщение',
                    timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                  }
                }
              ))
              .finally(() => {
                this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: false });
              });
          },
          buttons: [],
          form: true
        }
      }
    );
  }

  __delete(item) {
    const buttons = [
      {
        title: "Подтвердить",
        variant: "primary",
        action: (hideModal) => {
          this.currentModel.delete(item.current.id)
            .then(res => {
              hideModal();
              if (!res.status) {
                this.dispatchWrapper.makeAction(
                  'SHOW_MODAL',
                  {
                    options: {
                      message: `Ошибка ${res.message}`,
                      action: 'Сообщение',
                      timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                    }
                  }
                );

                return;
              }

              this.dispatchWrapper.makeAction(
                'SHOW_MODAL',
                {
                  options: {
                    message: `Успешно удалено`,
                    action: 'Сообщение',
                    timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                  }
                }
              );
            })
            .catch(err => {
              this.dispatchWrapper.makeAction(
                'SHOW_MODAL',
                {
                  options: {
                    message: `Ошибка ${err}`,
                    action: 'Сообщение',
                    timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                  }
                }
              );
            })
            .finally(() => {
              this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'updateTable', value: true });
            });
        }
      },
      {
        title: "Отменить",
        variant: "danger",
        action: (hideModal) => {
          hideModal();
        }
      }
    ]

    this.dispatchWrapper.makeAction(
      'SHOW_MODAL',
      {
        options: {
          message: `Вы действительно хотите удалить  ${item.current.name}  ?`,
          action: 'Удаление',
          buttons,
        }
      }
    );
  }

  __print(data) {
    this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: true });

    this.currentModel.getPdf(data.current.id)
      .catch((err) => {
        this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: false })
        this.dispatchWrapper.makeAction(
          'SHOW_MODAL',
          {
            options: {
              message: `Ошибка ${err}`,
              action: 'Сообщение',
              timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
            }
          }
        );
      })
      .finally(() => {
        this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'updateTable', value: true });
        this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: false })
      });
  }

  addField(data) {
    this.dispatchWrapper.makeAction(
      'SHOW_MODAL',
      {
        options:
        {
          name: this.type,
          globalData: data,
          schema: data.schema,
          data: data.data.current,
          action: 'Создание',
          sendForm: (body) => {
            this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: true });
            this.currentModel.create(this.currentModel.modified(body))
              .then(res => {
                if (!res.status) {
                  this.dispatchWrapper.makeAction(
                    'SHOW_MODAL',
                    {
                      options: {
                        message: `Ошибка ${res.message}`,
                        action: 'Сообщение',
                        timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                      }
                    }
                  );

                  return;
                }

                this.dispatchWrapper.makeAction(
                  'SHOW_MODAL',
                  {
                    options: {
                      name: 'answer',
                      message: `Успешно`,
                      action: 'Сообщение',
                      timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                    }
                  }
                );
              })
              .catch((err) => this.dispatchWrapper.makeAction(
                'SHOW_MODAL',
                {
                  options: {
                    name: 'answer',
                    message: `Ошибка ${err}`,
                    action: 'Сообщение',
                    timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
                  }
                }
              ))
              .finally(() => {
                this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'updateTable', value: true });
                this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'showingLoader', value: false });
              }
              );
          },
          form: true
        }
      }
    );
  }

  clickOnTableControlls(nameControll, value) {
    this.dispatchWrapper.makeAction('SETUP_FIELD', { key: 'updateTable', value: false });
    this[`__${nameControll}`](value); // call method by nameControll
  }
}
