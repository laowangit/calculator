$(document).ready(function() {
    $('#totalCapital').val('10000');
    $('#stopLossPercent').val('2');
    $('#marginRate').val('100');

    $('#tradingSymbol').change(function() {

        $('#entryPrice, #stopLoss').val('');
        $('#baseCurrencyExchangeRate, #quotedCurrencyExchangeRate, #contractSize, #marginRate, #marginCurrencyExchangeRate').val('');
        
        $('#totalCapital').val('10000');
        $('#stopLossPercent').val('2');
        $('#marginRate').val('100');

        $('#positionSizeResultSection').addClass('hidden');
        $('#marginResultSection').addClass('hidden');

        const selectedValue = $(this).val();
        
        $('#baseCurrencyExchangeRateField, #quotedCurrencyExchangeRateField, #contractSizeField, #marginCurrencyExchangeRateField').addClass('hidden');
        
        if (selectedValue === 'indirect_cross' || selectedValue === 'direct_cross') {
            $('#baseCurrencyExchangeRateField').removeClass('hidden');
            $('#quotedCurrencyExchangeRateField').removeClass('hidden');

        }
        
        const contractSizeTypes = ['oil', 'usindex', 'germanindex', 'japanindex', 'hkindex'];
        if (contractSizeTypes.includes(selectedValue)) {
            $('#contractSizeField').removeClass('hidden');
        }
        
        const marginCurrencyExchangeRateTypes = ['germanindex', 'japanindex', 'hkindex'];
        if (marginCurrencyExchangeRateTypes.includes(selectedValue)) {
            $('#marginCurrencyExchangeRateField').removeClass('hidden');
        }
        
        $('#positionSizeResultSection').addClass('hidden');
        $('#marginResultSection').addClass('hidden');
    });
    
    $('#calculateBtn').click(function() {
        if (!$('#positionCalculator')[0].checkValidity()) {
            alert('请填写所有必填字段！');
            return;
        }

        const tradeType = $('#tradingSymbol').val();
        const leverSize = $('#leverSize').val();
        const entryPrice = parseFloat($('#entryPrice').val());
        const stopLoss = parseFloat($('#stopLoss').val());
        const totalCapital = parseFloat($('#totalCapital').val());
        const stopLossPercent = parseFloat($('#stopLossPercent').val());
        const baseCurrencyExchangeRate = $('#baseCurrencyExchangeRateField').is(':visible') ? parseFloat($('#baseCurrencyExchangeRate').val()) : null;
        const quotedCurrencyExchangeRate = $('#quotedCurrencyExchangeRateField').is(':visible') ? parseFloat($('#quotedCurrencyExchangeRate').val()) : null;
        const contractSize = $('#contractSizeField').is(':visible') ? parseFloat($('#contractSize').val()) : null;
        const marginRate = $('#marginRateField').is(':visible') ? parseFloat($('#marginRate').val()) : null;
        const marginCurrencyExchangeRate = $('#marginCurrencyExchangeRateField').is(':visible') ? parseFloat($('#marginCurrencyExchangeRate').val()) : null;
        
        let riskAmount = totalCapital * (stopLossPercent / 100);
        let pointsRisk = Math.abs(entryPrice - stopLoss);
        let positionSize;
        let margin;
        switch(tradeType){
            case 'indirect':
                positionSize = riskAmount / (pointsRisk * 100000)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 100000 / leverSize * entryPrice
                } else {
                    margin = positionSize * 100000 * marginRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'direct':
                positionSize = riskAmount * entryPrice / (pointsRisk * 100000)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 100000 / leverSize
                } else {
                    margin = positionSize * 100000 * marginRate / 100
                }
                margin = myToFixed(margin, 2)
                break;
            case 'indirect_cross':
                positionSize = riskAmount / (pointsRisk * 100000 * quotedCurrencyExchangeRate)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 100000 / leverSize * baseCurrencyExchangeRate
                } else {
                    margin = positionSize * 100000 * marginRate / 100 * baseCurrencyExchangeRate
                }
                margin = myToFixed(margin, 2)
                break;
            case 'direct_cross':
                positionSize = riskAmount * quotedCurrencyExchangeRate / (pointsRisk * 100000)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 100000 / leverSize * baseCurrencyExchangeRate
                } else {
                    margin = positionSize * 100000 * marginRate / 100 * baseCurrencyExchangeRate
                }
                margin = myToFixed(margin, 2)
                break;
            case 'gold':
                positionSize = riskAmount / (pointsRisk * 100)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 100 / leverSize * entryPrice
                } else {
                    margin = positionSize * 100 * marginRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'silver':
                positionSize = riskAmount / (pointsRisk * 5000)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * 5000 / leverSize * entryPrice
                } else {
                    margin = positionSize * 5000 * marginRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'oil':
                positionSize = riskAmount / (pointsRisk * contractSize)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * contractSize / leverSize * entryPrice
                } else {
                    margin = positionSize * contractSize * marginRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'usindex':
                positionSize = riskAmount / (pointsRisk * contractSize)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * contractSize / leverSize * entryPrice
                } else {
                    margin = positionSize * contractSize * marginRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'germanindex':
                positionSize = riskAmount / (pointsRisk * contractSize * marginCurrencyExchangeRate)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * contractSize * marginCurrencyExchangeRate / leverSize * entryPrice
                } else {
                    margin = positionSize * contractSize * marginRate * marginCurrencyExchangeRate / 100 * entryPrice
                }
                margin = myToFixed(margin, 2)
                break;
            case 'japanindex':
                positionSize = riskAmount * marginCurrencyExchangeRate / (pointsRisk * contractSize)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * contractSize / leverSize * entryPrice / marginCurrencyExchangeRate
                } else {
                    margin = positionSize * contractSize * marginRate / 100 * entryPrice / marginCurrencyExchangeRate
                }
                margin = myToFixed(margin, 2)
                break;
            case 'hkindex':
                positionSize = riskAmount * marginCurrencyExchangeRate / (pointsRisk * contractSize)
                positionSize = myToFixed(positionSize, 2);
                if (marginRate == 100) {
                    margin = positionSize * contractSize / leverSize * entryPrice / marginCurrencyExchangeRate
                } else {
                    margin = positionSize * contractSize * marginRate / 100 * entryPrice / marginCurrencyExchangeRate
                }
                margin = myToFixed(margin, 2)
                break;
        }

        $('#positionSizeResultSection').removeClass('hidden');
        $('#marginResultSection').removeClass('hidden');
        
        $('#positionSizeResult').text(positionSize);
        $('#marginResult').text(margin);
    });
});



function myToFixed(num, digits = 0) {
    let zeroStrNum = num.toString();

    const dotIndex = zeroStrNum.indexOf('.')
    if(dotIndex === -1 || (zeroStrNum.length -(dotIndex + 1) <= digits)){
        return num.toFixed(digits)
    }

    let numArr = zeroStrNum.match(/\d/g) || [];
    numArr = numArr.slice(0, dotIndex + digits + 1)

    if (parseInt(numArr[numArr.length -1], 10) > 4) {
        for (let i = numArr.length - 2; i >= 0; i--){
            numArr[i] = String(parseInt(numArr[i], 10) + 1);
            if (numArr[i] === '10'){
                numArr[i] = '0';
            } else {
                break;
            }
        }
    }

    numArr.splice(dotIndex, 0, ".")
    numArr.pop()

    return Number(numArr.join('')).toFixed(digits)
}