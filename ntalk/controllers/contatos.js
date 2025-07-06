module.exports = function(app) {
    var Usuario = app.models.usuario;

    var ContatosController = {
        index: async function(req, res) {
            try {
                const _id = req.session.usuario._id;
                const usuario = await Usuario.findById(_id).exec();
                const contatos = usuario.contatos;
                res.render('contatos/index', { contatos: contatos, usuario });
            } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);
            }
        },
        create: async function(req, res) {
            try {
                const _id = req.session.usuario._id;
                const contato = req.body.contato;
                const usuario = await Usuario.findById(_id).exec();
                usuario.contatos.push(contato);
                await usuario.save();
                res.redirect('/contatos');
           } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);
           }
        },
        show: async function(req, res) {
            try {
                var _id = req.session.usuario._id;
                var contatoID = req.params.id;
                var contato = await Usuario.findById(_id).exec();
                contato = contato.contatos.id(contatoID);
                res.render('contatos/show', { contato: contato });
            } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);  
            }
        },
        edit: async function(req, res) {
            try {
              var _id = req.session.usuario._id;
              var contatoID = req.params.id;
              var contato = await Usuario.findById(_id).exec(); 
              contato = contato.contatos.id(contatoID);
              res.render('contatos/edit', { contato: contato }); 
            } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);
            }
        },
        update: async function(req, res) {
            try {
                var _id = req.session.usuario._id;
                var contatoID = req.params.id;
                var usuario = await Usuario.findById(_id).exec();
                const contato = usuario.contatos.id(contatoID);
                contato.nome = req.body.contato.nome;
                contato.email = req.body.contato.email;
                await usuario.save();
                res.redirect('/contatos');
            } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);
            }
        },
        destroy: async function(req, res) {
            try {
                var _id = req.session.usuario._id;
                var contatoID = req.params.id;
                var usuario = await Usuario.findById(_id).exec();
                usuario.contatos.id(contatoID).remove();
                await usuario.save();
                res.redirect('/contatos');
            } catch (error) {
                res.status(500).send("Ocorreu um erro: " + error);
            }
        }
    }
    return ContatosController;
};