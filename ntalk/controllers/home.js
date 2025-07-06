module.exports = function(app) {
    var Usuario = app.models.usuario;

    var HomeController = {
        index: function(req, res) {
            res.render('home/index');
        },

        login: async function(req, res) {
            try {
                const query = { email: req.body.email };
                const usuario = await Usuario.findOne(query).select('nome email').exec();
                
                if (usuario) {
                    req.session.usuario = usuario;
                    return res.redirect('/contatos');
                } else {
                    const novoUsuario = await Usuario.create(req.body.usuario);
                    req.session.usuario = novoUsuario;
                    return res.redirect('/contatos');
                }
            } catch (err) {
                return res.redirect('/');
            }
        },
        logout: function(req, res) {
            req.session.destroy();
            res.redirect('/');
        }
    };
    return HomeController;
};