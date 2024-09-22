local isStaff = true
local isMenuOpen = false  

RegisterKeyMapping('openReportsMenu', 'Ouvrir le menu des reports', 'keyboard', 'F10')

RegisterCommand('openReportsMenu', function()
    if isStaff then
        if not isMenuOpen then 
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
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openMenu',
        reports = reports
    })
end)

RegisterNUICallback('closeMenu', function(data, cb)
    SetNuiFocus(false, false)
    isMenuOpen = false 

    SendNUIMessage({
        action = 'setDisplay',
        display = 'none'
    })

    cb('ok')
end)
