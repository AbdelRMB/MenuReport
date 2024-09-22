local isStaff = true
local isMenuOpen = false  -- Variable pour suivre l'état du menu

RegisterKeyMapping('openReportsMenu', 'Ouvrir le menu des reports', 'keyboard', 'F10')

RegisterCommand('openReportsMenu', function()
    if isStaff then
        if not isMenuOpen then  -- Vérifiez si le menu n'est pas déjà ouvert
            isMenuOpen = true
            TriggerServerEvent('staffReportsMenu:requestReports')
        end
    else
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            multiline = true,
            args = {"Erreur", "Vous n'avez pas accès à ce menu."}
        })
    end
end, false)

RegisterNetEvent('staffReportsMenu:openMenu')
AddEventHandler('staffReportsMenu:openMenu', function(reports)
    SendNUIMessage({
        action = 'openMenu',
        reports = reports
    })

    -- Forcer l'affichage du body en flex
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'setDisplay',
        display = 'flex'
    })
end)

RegisterNUICallback('closeMenu', function(data, cb)
    SetNuiFocus(false, false)
    isMenuOpen = false  -- Réinitialiser l'état lorsque le menu est fermé

    -- Réinitialiser l'affichage du body à none
    SendNUIMessage({
        action = 'setDisplay',
        display = 'none'
    })

    cb('ok')
end)
