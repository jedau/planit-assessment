const { expect } = require('@wdio/globals')
const { Key } = require('webdriverio')
const HomePage = require('../pageobjects/home.page')
const ShopPage = require('../pageobjects/shop.page')
const ContactPage = require('../pageobjects/contact.page')
const CartPage = require('../pageobjects/cart.page')

describe('Planit Technical Assessment', () => {
    it('[TC01] The Contact Page should display the correct error messages if there are missing mandatory values', async () => {
        await HomePage.open()
        await HomePage.navigateTo('contact')
        await expect(browser).toHaveUrl(`${browser.options.baseUrl}/#/contact`)
        await ContactPage.waitForPageToLoad()
        // Clicking the submit button should display the error messages
        // and not submit the form if a mandatory field is blank
        await ContactPage.btnSubmit.click()

        // Verify if the error messages are correct
        await expect(ContactPage.btnSubmit).toBeExisting()
        await expect(ContactPage.lblHeader).toBeExisting()
        await expect(ContactPage.lblHeader).toHaveText('We welcome your feedback - but we won\'t get it unless you complete the form correctly.')
        await expect(ContactPage.lblForenameError).toBeExisting()
        await expect(ContactPage.lblForenameError).toHaveText('Forename is required')
        await expect(ContactPage.lblEmailError).toBeExisting()
        await expect(ContactPage.lblEmailError).toHaveText('Email is required')
        await expect(ContactPage.lblMessageError).toBeExisting()
        await expect(ContactPage.lblMessageError).toHaveText('Message is required')
        
        // Populate mandatory fields
        await ContactPage.inputForename.setValue('Valid Name')
        await ContactPage.inputEmail.setValue('valid@email.com')
        await ContactPage.inputMessage.setValue('This is a valid message')
        
        // Validate errors are gone
        await expect(ContactPage.lblHeader).toBeExisting()
        await expect(ContactPage.lblHeader).toHaveText('We welcome your feedback - tell it how it is.')
        await expect(ContactPage.lblForenameError).not.toBeExisting()
        await expect(ContactPage.lblEmailError).not.toBeExisting()
        await expect(ContactPage.lblMessageError).not.toBeExisting()
    })

    it('[TC02] The Contact Page should be able to submit valid feedback 5 times', async () => {
        await HomePage.open()
        await HomePage.navigateTo('contact')
        await expect(browser).toHaveUrl(`${browser.options.baseUrl}/#/contact`)
        await ContactPage.waitForPageToLoad()
        for (let i = 0; i < 5; i++) {
            let forename = (Math.random() + 1).toString(36).substring(7)
            let email = `${(Math.random() + 1).toString(36).substring(7)}@${(Math.random() + 1).toString(36).substring(7)}.com`
            let message = (Math.random() + 1).toString(36).substring(7)
            
            // Populate mandatory fields
            await ContactPage.inputForename.setValue(forename)
            await ContactPage.inputEmail.setValue(email)
            await ContactPage.inputMessage.setValue(message)
            
            // Click submit button
            await ContactPage.btnSubmit.click()
            await ContactPage.waitForFeedbackToBeSent()
            
            // Validate successful submission message
            await expect(ContactPage.lblSuccess).toHaveText(`Thanks ${forename}, we appreciate your feedback.`)
            await ContactPage.btnBack.click()
        }
    })

    it('[TC03] The Shop Page should be able to add the correct items to the cart', async () => {
        await HomePage.open()
        await HomePage.navigateTo('shop')
        await expect(browser).toHaveUrl(`${browser.options.baseUrl}/#/shop`)
        await ShopPage.waitForPageToLoad()
        await browser.setTimeout({ 'script': 60000 })

        // Input the items to buy and how many
        // Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear
        await expect(ShopPage.cartCount).toBeExisting()
        let itemsToAdd = { 
            'stuffedFrog': 2,
            'fluffyBunny': 5,
            'valentineBear': 3
        }
        let itemCount = 0
        for (let item in itemsToAdd) {
            await expect(ShopPage.getProductLocator(item)).toBeExisting()
            await ShopPage.addToCartXTimes(item, itemsToAdd[item])
            itemCount += itemsToAdd[item]
            expect(parseInt(await ShopPage.cartCount.getText())).toEqual(itemCount)
        }

        // Go to the cart page
        await ShopPage.navigateTo('cart')

        await expect(CartPage.cart).toBeExisting()
        // let itemsInCart = await CartPage.cartItems.$$('tr')
        let itemsInCart = await CartPage.cartItems
        let sumSubtotal = 0
        for (let i = 0; i < itemsInCart.length; i++) {
            let itemDetails = await itemsInCart[i].$$('td')
            let itemName = await itemDetails[0].getText()
            let itemPrice = parseFloat((await itemDetails[1].getText()).substring(1))
            let itemSubtotal = parseFloat((await itemDetails[3].getText()).substring(1))
            let expectedPrice = ShopPage.getProductPrice(itemName)
            let expectedSubtotal = expectedPrice * itemsToAdd[ShopPage.getProductByName(itemName)]
            // Verify the subtotal for each product is correct
            expect(itemSubtotal).toEqual(expectedSubtotal)
            sumSubtotal += itemSubtotal
            // Verify the price for each product
            expect(itemPrice).toEqual(expectedPrice)
        }

        // Verify that total = sum(sub totals)
        let cartTotal = parseFloat((await CartPage.cartTotal.getText()).split(' ')[1])
        expect(cartTotal).toEqual(sumSubtotal)
    })
})