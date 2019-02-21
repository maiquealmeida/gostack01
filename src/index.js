const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.set('view engine', 'njk')
app.use(express.urlencoded({ extended: false }))

/**
 * Deve verificar se o usuario enviou corretamente
 * a variavel idade.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkPostMiddleware = (req, res, next) => {
  if (req.body.age === undefined) {
    return res.redirect('/')
  }
  next()
}

/**
 * Garante que somente usuarios menor de 18 anos terao acesso a rota.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkMinorAgeMiddleware = (req, res, next) => {
  if (req.query.age === undefined) {
    return res.redirect('/')
  }

  if (req.query.age < 18) {
    next()
    return
  }

  return res.redirect(`/major?age=${req.query.age}`)
}

/**
 * Garante que somente usuarios com 18 anos ou mais terao acesso a rota.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkMajorAgeMiddleware = (req, res, next) => {
  if (req.query.age === undefined) {
    return res.redirect('/')
  }

  if (req.query.age >= 18) {
    next()
    return
  }

  return res.redirect(`/minor?age=${req.query.age}`)
}

/* ----------- */
/* -- ROTAS -- */
/* ----------- */
app.get('/', (req, res) => {
  return res.render('index')
})

app.post('/check', checkPostMiddleware, (req, res) => {
  if (req.body.age > 18) {
    return res.redirect(`/major?age=${req.body.age}`)
  }

  return res.redirect(`/minor?age=${req.body.age}`)
})

app.get('/minor', checkMinorAgeMiddleware, (req, res) => {
  return res.render('show', {
    situacao: 'menor de idade',
    age: req.query.age,
    icon: 'ei-close-o',
    color: 'minor'
  })
})

app.get('/major', checkMajorAgeMiddleware, (req, res) => {
  return res.render('show', {
    situacao: 'maior de idade',
    age: req.query.age,
    icon: 'ei-like',
    color: 'major'
  })
})

app.get('/nome/:name', (req, res) => {
  return res.json({ message: `Welcome to the Jungle ${req.params.name}` })
})

app.listen(3000)
