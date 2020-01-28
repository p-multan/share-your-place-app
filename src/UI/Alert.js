export class Alert {
  constructor(msg, alertClass) {
    this.msg = msg;
    this.alertClass = alertClass;
  }

  createAlert() {
    this.alertDiv = document.createElement('div');
    this.alertDiv.className = `alert alert--${this.alertClass}`;
    this.alertDiv.appendChild(document.createTextNode(this.msg));

    document.body.insertAdjacentElement('afterbegin', this.alertDiv);

    this.deleteAlert();
  }

  deleteAlert() {
    setTimeout(() => {
      document.body.removeChild(this.alertDiv);
      this.alertDiv = null;
    }, 3000);
  }
}
