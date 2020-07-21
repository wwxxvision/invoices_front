export default class Pdf {
  constructor(data) {
    this.data = data;
  }

  create() {
    const buffer = Buffer.from(this.data);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    this.createFrame(url);
  }

  createFrame(url) {
    const pdfWindow = window.open(url);

    pdfWindow.print();
  }
}

