const { browser } = require('@wdio/globals')

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
module.exports = class Page {

    get navHome () {
        return $('#nav-home');
    }

    get navShop () {
        return $('#nav-shop');
    }

    get navContact () {
        return $('#nav-contact');
    }

    get navLogin () {
        return $('#nav-login');
    }

    get navCart () {
        return $('#nav-cart');
    }

    async navigateTo (page) {
        await (await $(`#nav-${page}`)).click()
    }

    open (path) {
        return browser.url(path)
    }

    async waitForPageToLoad () {
        await browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
              timeout: 6000,
              timeoutMsg: 'Page did not load correctly'
            }
        );
    }
}
