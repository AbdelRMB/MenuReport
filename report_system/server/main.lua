RegisterCommand('report', function(source, args, rawCommand)
    local playerId = source
    local playerName = GetPlayerName(source)
    local message = table.concat(args, " ")

    if message == "" then
        TriggerClientEvent('chat:addMessage', source, {
            color = {255, 0, 0},
            multiline = true,
            args = {"Erreur", "Veuillez entrer un message pour le report."}
        })
        return
    end

    -- Calcul de la date d'expiration
    local expirationTime = os.date('%Y-%m-%d %H:%M:%S', os.time() + (3 * 24 * 60 * 60))

    -- Insertion dans la base de données avec l'ID du joueur
    MySQL.Async.execute('INSERT INTO reports (player_id, player_name, message, status, expiration_time) VALUES (@playerId, @playerName, @message, @status, @expirationTime)', {
        ['@playerId'] = playerId,
        ['@playerName'] = playerName,
        ['@message'] = message,
        ['@status'] = false,
        ['@expirationTime'] = expirationTime
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('chat:addMessage', source, {
                color = {0, 255, 0},
                multiline = true,
                args = {"Succès", "Votre report a été envoyé aux staffs."}
            })
        else
            TriggerClientEvent('chat:addMessage', source, {
                color = {255, 0, 0},
                multiline = true,
                args = {"Erreur", "Une erreur est survenue lors de l'envoi de votre report."}
            })
        end
    end)
end, false)

-- suppression des reports expirés
function cleanExpiredReports()
    MySQL.Async.execute('DELETE FROM reports WHERE expiration_time < NOW()', {}, function(affectedRows)
        print(affectedRows .. " reports expirés ont été supprimés de la base de données.")
    end)
end

-- attente chaque heure pour la vérification
CreateThread(function()
    while true do
        Wait(60 * 60 * 1000)
        cleanExpiredReports()
    end
end)
