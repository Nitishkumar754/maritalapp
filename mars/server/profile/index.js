var router = require('express').Router()

var profileCtrl = require('./controller')

// router.get('/:id', profileCtrl.getProfile)
router.get('/all', profileCtrl.getAll)
router.get('/:id', profileCtrl.getProfile)


module.exports = router