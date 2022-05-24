const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'Thesun',
        address: 'https://www.thesun.co.uk/sport/football/champions-league',
        base: '',
    },
    {
        name: 'ESPN',
        address: 'https://www.espn.com/soccer/league/_/name/uefa.champions',
        base: 'https://www.espn.com',
    },
    {
        name: 'Skysport',
        address: 'https://www.skysports.com/champions-league-news',
        base: '',
    },
    {
        name: 'BBCnews',
        address: 'https://www.bbc.com/sport/football',
        base: 'https://www.bbc.com',
    },
    {
        name: 'BBC',
        address: 'https://www.bbc.com/sport/football/champions-league',
        base: 'https://www.bbc.com',
    },
    {
        name: 'MARCA',
        address: 'https://www.marca.com/en/football/champions-league.html',
        base: '',
    },
    {
        name: "Skynews",
        address: 'https://www.mirror.co.uk/sport/football',
        base: '',
    },
    {
        name: 'Eurosport',
        address: 'https://www.eurosport.com/football',
        base: '',
    },
    {
        name: 'Theguardian',
        address: 'https://www.theguardian.com/football',
        base: '',
    },
    {
        name: 'Talksport',
        address: 'https://talksport.com/football',
        base: '',
    },
    {
        name: 'Dailymail',
        address: 'https://www.dailymail.co.uk/sport/football/index.html',
        base: 'https://www.dailymail.co.uk',
    },
    {
        name: 'Goal',
        address: 'https://www.goal.com/en/news/1',
        base: 'https://www.goal.com',
    },
    {
        name: 'Eveningstandard',
        address: 'https://www.standard.co.uk/sport/football',
        base: 'https://www.standard.co.uk',
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Champions League")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my football news API ')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Champions League")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId,
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))