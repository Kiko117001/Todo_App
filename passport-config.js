const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcryptjs')
const User = require("./models/userModel");

function initialize(passport, getUserByEmail, GetUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({ email }) //idk?
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, GetUserById(id))
    })

}

module.exports = initialize