const { $ } = require('@wdio/globals')
const Page = require('./page');
const { _ } = require('lodash')

const productMap = {
    'teddyBear': {
        'id': 1,
        'name': 'Teddy Bear',
        'price': 12.99
    },
    'stuffedFrog': {
        'id': 2,
        'name': 'Stuffed Frog',
        'price': 10.99
    },
    'handmadeDoll': {
        'id': 3,
        'name': 'Handmade Doll',
        'price': 10.99
    },
    'fluffyBunny': {
        'id': 4,
        'name': 'Fluffy Bunny',
        'price': 9.99
    },
    'smileyBear': {
        'id': 5,
        'name': 'Smiley Bear',
        'price': 14.99
    },
    'funnyCow': {
        'id': 6,
        'name': 'Funny Cow',
        'price': 10.99
    },
    'valentineBear': {
        'id': 7,
        'name': 'Valentine Bear',
        'price': 14.99
    },
    'smileyFace': {
        'id': 8,
        'name': 'Smiley Face',
        'price': 9.99
    }
}

class ShopPage extends Page {
    /* Element Locators */

    get cartCount () {
        return $('.cart-count')
    }

    /**
     * Dynamically get the product locator based on the name
     * @param {*} name 
     * @returns element locator of the product
     */
    getProductLocator (name) {
        try {
            return $(`#product-${productMap[name].id}`);
        } catch {
            return $('#product-x')
        }
    }

   /**
    * Dynamically get the product price from productMap based on the name
    * @param {*} name 
    * @returns the product price
    */
    getProductPrice (name) {
        return productMap[this.getProductByName(name)].price
    }

    /**
     * Get the key from productMap based on the product name
     * @param {*} name 
     * @returns product key
     */
    getProductByName (name) {
        return _.findKey(productMap, (product) => product.name === name)
    }

    /**
     * Adds the item to cart by clicking its Buy button
     * @param {*} item 
     */
    async addToCart (item) {
        await this.getProductLocator(item).$('a.btn').click()
    }

    /**
     * Adds X number of one item at a time
     * @param {*} name 
     * @param {*} count 
     */
    async addToCartXTimes (item, count) {
        for (let i = 0; i < count; i++) {
            await this.addToCart(item)
        }
    }

    open () {
        return super.open('#/shop');
    }
}

module.exports = new ShopPage();
