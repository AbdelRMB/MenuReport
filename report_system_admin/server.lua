RegisterServerEvent('staffReportsMenu:requestReports')
AddEventHandler('staffReportsMenu:requestReports', function()
    local _source = source

    MySQL.Async.fetchAll('SELECT * FROM reports', {}, function(reports)
        TriggerClientEvent('staffReportsMenu:openMenu', _source, reports)
    end)
end)
