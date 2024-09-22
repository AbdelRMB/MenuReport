fx_version 'cerulean'
game 'gta5'

author 'Abdelrmb'
description 'Système de report'
version '1.0.0'

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua'
}

-- Configuration des fichiers de la ressource
files {
    'fxmanifest.lua'
}
