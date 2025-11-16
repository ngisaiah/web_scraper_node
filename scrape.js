import puppeteer from "puppeteer";
// Node file system module
import fs from "fs";

const scrape = async () => {
    // headless browser (browser w/o gui)
    const browser = await puppeteer.launch()
    // creates new page in browser
    const page = await browser.newPage()
    
    // Variables for iterating through multiple pages
    const allBooks = []
    let currentPage = 1
    const maxPages = 2

    while(currentPage <= maxPages) {
        // url we are scraping
        const url = `https://books.toscrape.com/catalogue/page-${currentPage}.html`
        // uses pages obj to interact with new window
        await page.goto(url)
        // allows us to run javascript in context of the page
        const books = await page.evaluate(() => {
            // Selects product All books (by class)
            const bookElements = document.querySelectorAll('.product_pod')
            // Puts product objects into an array
            return Array.from(bookElements).map(book => {
                // Creates new array with data were looking for (titles, price, availability, rating & link)
                const title = book.querySelector('h3 a').getAttribute('title')
                const price = book.querySelector('.price_color').textContent
                const stock = book.querySelector('.instock.availability') 
                    ? 'in stock' 
                    : 'out of stock'
                const rating = book.querySelector('.star-rating').className.split(' ')[1]
                const link = book.querySelector('h3 a').getAttribute('href')
                // returns object with all the data
                return price
            })

        })
        // Pushes objects(books) into an array
        // allBooks.push(...books)
         console.log(`Books on page ${currentPage}: `, books)
        // Increments currentPage until it equals max page
        currentPage++
    }

    // saves data to books.json
    fs.writeFileSync('books.json', JSON.stringify(allBooks, null, 2))

    // console.log('Data saved to books.json')

    // close browser when done
    await browser.close();
}

scrape();