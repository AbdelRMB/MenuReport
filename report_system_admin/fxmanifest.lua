fx_version 'cerulean'
game 'gta5'

author 'Abdelrmb'
description 'Menu de gestion des reports'
version '1.0.0'

client_scripts {
    'client.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server.lua'
}

ui_page 'src/index.html'

files {
    'src/index.html',
    'src/js/main.js',
    'src/style/main.css'
}
