module.exports = (app) => {

    const consent = require('../controllers/apiController.js');
    const authentication = require('../middleware/auth.js')

    app.get('/consents', authentication, consent.ListConsents);

    app.post('/give-consent', authentication, consent.GiveConsents);

    app.put('/:id', authentication, consent.updateConsent);

    app.delete('/:id', authentication, consent.deleteConsent);
    
}