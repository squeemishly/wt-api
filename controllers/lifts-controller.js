const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

class LiftsController {
  static getAllLifts(req, res) {
    database.raw(`SELECT id, name FROM lifts`)
    .then( data => {
      return res.json(data.rows)
    })
  }

  static findLift(req, res) {
    const { id } = req.params
    database.raw(`SELECT id, name FROM lifts WHERE id = ?`, [id])
    .then( data => {
      if (data.rows.length < 1) {
        res.sendStatus(404)
      } else {
        return res.json(data.rows)
      }
    })
  }

  static createLift(req, res) {
    const lift = req.body.lift
    const name = lift.name

    if (name === "") {
      res.sendStatus(400)
    } else {
      database.raw(`INSERT INTO lifts (name, created_at) VALUES (?, ?) RETURNING id, name`, [name, new Date])
      .then( data => {
        return res.json(data.rows)
      })
    }
  }

  static updateLift(req, res) {
    const { id } = req.params
    const lift = req.body.lift
    const name = lift.name

    if (name === "") {
      res.sendStatus(400)
    } else {
      database.raw(`UPDATE lifts SET name = ? WHERE id = ? RETURNING id, name`, [name, id])
      .then( data => {
        if (data.rows.length < 1) {
            res.sendStatus(404)
        } else {
          return res.json(data.rows)
        }
      })
    }
  }

  static deleteLift(req, res) {
    const { id } = req.params
    database.raw(`DELETE FROM lifts WHERE id = ?`, [id])
    .then(data => {
      if (data.rowCount < 1) {
        res.sendStatus(404)
      } else {
        res.sendStatus(200)
      }
    })
  }
}

module.exports = LiftsController
