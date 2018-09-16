'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cobranca;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var request = (0, _superagentPromise2.default)(_superagent2.default, _bluebird2.default);
var route = function route(path) {
    return 'https://api.totalvoice.com.br' + path;
};

var cobrancaInText = 'PODERÁ SER PROTOCOLADO A PETIÇÃO EXTRA JUDICIAL REFERENTE AO NÃO CUMPRIMENTO DO SEU COMPROMISSO.';

var sms = function sms(to, token) {
    return request.post(route('/sms')).set('Access-Token', token).set('Accept', 'application/json').send({ numero_destino: to, mensagem: cobrancaInText });
};

var call = function call(from, to, token, tipo) {
    var stringTipo = "alo";
    if (tipo == 0) {
        tipo = Math.floor(Math.random() * 6 + 1);
    }
    

    switch(tipo) {
    case 1:
	//Manter essa linha para Eliminar a opçao 1 (ligacao muda)
	//"Vocês já estão bravos? Não? Então espera ai."
        stringTipo = 'http://eriberto.pro.br/files/a-silence.mp3';
        break;
    case 2:
	//Manter essa linha para Eliminar a opçao 2 (ligacao muda)
	//"Alô? Alô? Alô? Oi, está me ouvindo? Então espera ai que já te ligo de novo."
        stringTipo = 'http://eriberto.pro.br/files/a-silence.mp3';
        break;
    case 3:
	//Manter essa linha para adicionar darthVader
	//"Você irá receber ligações infinitamente, até que pare de ligar no meu número"
        stringTipo = 'http://www.orangefreesounds.com/wp-content/uploads/2014/09/Darth-vader-breathing.mp3';
        break;
    /**case 4:
	//Manter essa linha para Eliminar a opçao 4 (ligacao muda)
	//"Esse é meu jeito de viver, ninguém nunca foi igual, a minha vida é fazer, o bem vencer o mal, pelo mundo viajarei tentando encontrar, o pokemon e com o seu poder tudo transformar"
        stringTipo = 'http://eriberto.pro.br/files/a-silence.mp3';
        break;**/
    case 5:
	//Manter essa linha para Eliminar a opçao 5 (ligacao muda)
	//"Olá, tudo bem? Parece que o jogo virou, não é mesmo? Vou te ligar repetidamente, igual vocês fazem comigo"
        stringTipo = 'http://eriberto.pro.br/files/a-silence.mp3';
        break;
    case 6:
	//Criando nova opção de gemidao
        stringTipo = 'https://github.com/haskellcamargo/gemidao-do-zap/raw/master/resources/gemidao.mp3';
        break;
    default:
	//Linha padrao do script original
        stringTipo = 'http://8balls.com.br/sejavip2/' + tipo+'.mp3';
    } 

    return request.post(route('/composto')).set('Access-Token', token).set('Accept', 'application/json').send({
        numero_destino: to,
        dados: [{
            acao: 'audio',
            acao_dados: {
                url_audio: stringTipo
            }
        }],
        bina: from
    });
};

function cobranca(args) {
    if (!/^[a-f0-9]{32}$/.test(args.token)) {
        return (0, _bluebird.reject)(new Error('Token inválido. Obtenha um em https://totalvoice.com.br'));
    }

    if (!/^[0-9]{10,11}$/.test(args.para)) {
        return (0, _bluebird.reject)(new Error('Número de telefone inválido'));
    }

    var action = args.sms ? sms(args.para, args.token) : call(args.de, args.para, args.token, args.tipo);

    return action.catch(function (err) {
        if (err.status === 405 || err.status === 403) {
            return (0, _bluebird.reject)(new Error((err.body || err.response.body).mensagem));
        }

        return (0, _bluebird.reject)(err);
    });
}
