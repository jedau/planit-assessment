const { $ } = require('@wdio/globals')
const Page = require('./page');

class ContactPage extends Page {
  /**
   * Element locators
   */
  get lblHeader () {
    return $('#header-message');
  }
  
  get inputForename () {
    return $('#forename');
  }

  get lblForenameError () {
    return $('#forename-err');
  }

  get inputSurname () {
    return $('#surname');
  }

  get inputEmail () {
    return $('#email');
  }

  get lblEmailError () {
    return $('#email-err');
  }

  get inputTelephone () {
    return $('#telephone');
  }

  get inputMessage () {
    return $('#message');
  }

  get lblMessageError () {
    return $('#message-err');
  }

  get btnSubmit () {
    return $('.btn-contact');
  }

  get modalSending () {
    return $('div.popup')
  }

  get lblSuccess () {
    return $('.alert-success')
  }

  get btnBack () {
    return $('/html/body/div[2]/div/a')
  }

  /**
   * Waits for the feedback progress bar to complete
   */
  async waitForFeedbackToBeSent () {
    await browser.waitUntil(async () => {
      return await (await $('div.popup')).isDisplayed() === false
    }, {timeout: 100000});
  }

  open () {
    return super.open('#/contact');
  }
}

module.exports = new ContactPage();
