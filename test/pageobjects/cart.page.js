const { $ } = require('@wdio/globals')
const Page = require('./page');
const ShopPage = require('./shop.page')

class CartPage extends Page {
    /* Element Locators */
    
    get cart () {
        return $('.cart-items').$('tbody')
    }

    get cartItems () {
        return $('.cart-items').$('tbody').$$('tr')
    }

    get cartTotal () {
        return $('.cart-items').$('tfoot').$$('tr')[0]
    }

    open () {
        return super.open('#/cart');
    }
}

module.exports = new CartPage();
