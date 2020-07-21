import Base from '../Base';
import Service from '../../System/Service';
import moment from 'moment';
import Pdf from '../Pdf';

class Invoice extends Base {
  constructor() {
    super('invoice');
  }

  getPdf(itemID) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/json'
      };

      Service.getting(`/${this.url}/pdf/${itemID}`, headers, true)
        .then((res) => {
          resolve(res);

          if (res?.pdf)
            this.print(res.pdf.data);
        })
        .catch(reject);
    })
  }

  utcDateCreated() {
    const now = new Date();
    return moment.utc(now).format().valueOf();
  }

  print(buffer) {
    const pdf = new Pdf(buffer);
    pdf.create();
  }

  modified(data) {
    data.dateCreated = this.utcDateCreated();

    return data;
  }
}

export default new Invoice();