const Mega = require('megadb');
const sitesCadastrados = new Mega.crearDB('Sites')
const axios = require('axios');
require("./server.js")

async function valide(response, linkPai) {
    try{

    response.data.split("<a").forEach((val) => {
        var link = null
        var name = null;
        val.split(`href="`).forEach((val) => {
            link = val.split('"')[0]
        })
        name = val.split(`>`)[1].split(`</a>`)[0].replace('</a', "")
        

        tryAcess({name, link, linkPai: linkPai})
    })

    response.data.split("<a").forEach((val) => {
        var link = null
        var name = null;
        val.split('href=`').forEach((val) => {
            link = val.split('`')[0]
        })
        name = val.split(`>`)[1].split(`</a>`)[0].replace('</a', "")
        
        tryAcess({name, link, linkPai: linkPai}) 
    })

    response.data.split("<a").forEach((val) => {
        var link = null
        var name = null;
        val.split(`href='`).forEach((val) => {
            link = val.split("'")[0]
        })
        name = val.split(`>`)[1].split(`</a>`)[0].replace('</a', "")
        

        tryAcess({name, link, linkPai: linkPai})
    })

    
    } catch (err) {
        1*1
    }
}

function tryAcess(link) {
    axios.get(link.link)
        .then(async (response) => {
            var arrSites = await sitesCadastrados.obtener('SITES')
            var igual = false;

            arrSites.forEach((val, i) => {
                if (!link.name.includes("<") && !link.name.includes(">")) {
                    if (val.link == link.link) {
                        var addKey = true;

                        arrSites[i].keys.forEach((val) => {
                            if (val.toString().trim().toLowerCase() == link.name.trim().toLowerCase()) {
                                addKey = false;
                            }
                        })

                        if (addKey) {
                            val.keys.push(link.name)
                            val.rel++
                            console.log('link ' + link.link + " editado!")
                            igual = true;
                        }
                    }
                }
            })
            
            if (!igual) {
                if (!link.name.includes("<") &&!link.name.includes(">")) {
                    var linky = link.link
                    if(linky.startsWith("/")) {
                        linky.replace("/", "")
                        linky = link.linkPai + linky
                    }
                    arrSites.push({keys: [link.name], link: linky, rel: 1})
                    console.log('link ' + link.link + " adicionado!")
                    valide(response, linky.split("/")[0]+"/")
                }
            }
            sitesCadastrados.set("SITES", arrSites)
            arrSites = undefined
        }).catch(O_o => {})
}

async function a() {
    var aa = await sitesCadastrados.obtener('PRESITES')
    aa.forEach(async (val) => {
        axios.get(val)
        .then(async (r) => {
            valide(r, val);
        })
    })
}

a()
