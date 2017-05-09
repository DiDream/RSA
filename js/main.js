'use strict'
var ALFABETO = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X':23 , 'Y':24 , 'Z': 25};
var ALFABETO_LENGTH = Object.keys(ALFABETO).length;

var PRIME_NUMBERS = [2,3,5,7,11,13,17,19,23];
var N = 100;

Number.prototype.isOdd= function(){
    return this%2 != 0;
}
String.prototype.toNumber = function(){
    return Number(this);
}
function fastExponentiation(base, b, m){ //  base=> base de exponent, b=> exponente, m=> modulo

    var x = 1;
    var y = base%m;
    // var logs = [];
    // logs.push({y,b,x})
    while(b>0 && y>1){

        if(b.isOdd()){
            x = (x*y)% m;
            b--;
            // logs.push({y:'',b,x})
        }else {
            y= (y*y)%m;
            b/=2;
            // logs.push({y,b,x:''})
        }

    }
    // return {logs, value: x};
    return x;
}

function euclides(a,b){
    var r, mcd = a<b? a : b;
    while(r = a%b){
        a = b;
        b= mcd =r;
    }
    return mcd;
}
function euclidesExtendido(num1,num2){
    var [a,b] = num1>num2? [num1,num2]: [num2,num1];
    var l = [{x: '',z: 0}, {x: a ,z: 1}, {x: b}];

    var i= l.length-1, x;

    while(x = l[i-1].x % l[i].x){
        l[i].z = - Math.floor( l[i-1].x/ l[i].x) * l[i-1].z + l[i-2].z ;
        l.push( {x} );
        i++;
    }
    l[i].z = '';
    return {
        logs: l,
        mcd: l[i].x,
        inv: (l[i-1].z + a) % a
    }
}
Number.prototype.isCoprimeOf = function(b){
    return euclidesExtendido(this,b).mcd == 1;
}
String.prototype.isCoprimeOf = function(b){
    return euclidesExtendido( this.toNumber() ,b).mcd == 1;
}

Number.prototype.euclidesExt = function(b){
    return euclidesExtendido(this,b);
}
Number.prototype.coprimeNumbers = function() {
    var coprimes = [1];
    for(var i=2; i<this; i++){
        if(this.isCoprimeOf(i)) coprimes.push(i);
    }
    return coprimes;
}
String.prototype.isPrime = function(){
    return Number(this).isPrime();
}
Number.prototype.isPrime = function(){
    if(this===1) return true;

    for(var i=0; i<PRIME_NUMBERS.length; i++){
        //== el numero es primo STOP
        //% == 0 no es primo STOP
        //% != 0 no es divisible ++
        if(this==PRIME_NUMBERS[i]) return true;

        if(this%PRIME_NUMBERS[i] == 0) return false;
    }
    var minusOne = this-1;
    var exp= Math.floor( (minusOne)/2 );
    var maybe = false;
    for(var i=0; i<N ; i++){
        var a = Math.floor(Math.random()* minusOne + 1);

        var r = fastExponentiation(a,exp,this);

        if(r == minusOne) maybe=true;
        else{
            if(r!=1) return false
        }
    }

    return maybe;
    // maybe == true si ha habido algun r == this-1 (-1)
    // maybe == false si todos todos los r's han sido UNOS
}

function submitted(e, form){
    e.preventDefault();
    var p = form.p.value.toNumber() , q =form.q.value.toNumber(), d=form.d.value.toNumber();
    if (!p.isPrime() || !q.isPrime()) {
        alert("Inserte numero primos para p y q");
        return false;
    }
    var phi_n = (p-1)*(q-1);
    if(!d.isCoprimeOf(phi_n)){
        alert('d debe ser coprimo de '+ phi_n);
        return false;
    }
    var encrypt = form.encrypt[0].checked;
    var message = form.message.value;
    message = encrypt?
                    message.split(' ').join('').toUpperCase(): //mas rapido que replace(/\s/g, '')
                    message.split(',').map(Number);
    console.log(message);
    RSA({
        p,q,d,
        message,
        encrypt,
        phi_n
    })
}

function isPrime(input){
    if( !(input instanceof HTMLInputElement) ){
        throw "Tipo de dato no permitido";
    }
    if( input.value.isPrime() ){
        input.setCustomValidity('');

    }else {
        input.setCustomValidity('Inserta un numero primo');
    }
}
function logBase(base,arg){
    return Math.log(arg)/ Math.log(base);
}
function blockSize(n){
    //log(base=b, arg = n) = (j-1)
    return Math.floor(logBase(ALFABETO_LENGTH, n) );
}
function RSA(values){
    var {p,q,d,message,encrypt,phi_n} = values;
    var n =  p*q;
    var e = phi_n.euclidesExt(d).inv;
    var ij = blockSize(n); //tamaño del bloque
    console.log('n', n, 'phi', phi_n, 'd',d,'e',e, 'message', message,'block', ij);
    if(encrypt) {
        var messageBlocks = [];
        var a = message.length % ij;
        var limit = message.length-a;
        for(var i=0; i< limit; i+=ij){
            messageBlocks.push(message.substring(i,i+ij));
        }

        if(a>0) messageBlocks.push(message.substring(limit));

        console.log(messageBlocks);
        // Cifrar
        var codedMessage = [];
        var encryptedMessage = [];
        messageBlocks.forEach(function(m){

            var cod =0;
            var exp = ij-1;

            for(var i=0; i<m.length; i++){
                cod += ALFABETO[ m[i] ] * (ALFABETO_LENGTH** (exp-i) );
            }
            codedMessage.push(cod);
            encryptedMessage.push( fastExponentiation(cod,e,n) );
        })

        // var a = message.length % ij;
        // var limit = message.length-a;
        // var cod;
        // for(var i=0; i<limit; i+= ij){
        //     cod = 0;
        //     for(var j=0; j<ij; j++){
        //
        //         cod += ALFABETO[ message[i+j] ] * (ALFABETO_LENGTH ** (ij-1-j));
        //
        //     }
        //     codedMessage.push(cod);
        //     encryptedMessage.push( fastExponentiation(cod,e,n) );
        // }
        // cod=0;
        // for(var i=0; i<a; i++){
        //     cod += ALFABETO[ message[limit+i] ] * (ALFABETO_LENGTH ** (ij-1-i) )
        // }
        console.log(codedMessage, encryptedMessage);

    }else {
        var decryptMessage = [];
        message.forEach(function(c){
            console.log(typeof c, c);
            decryptMessage.push( fastExponentiation(c,d,n) );
        });
        console.log(message,decryptMessage);
    }

}
