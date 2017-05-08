'use strict'
var ALFABETO =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
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
        inv: l[i-1].z
    }
}
Number.prototype.isCoprimeOf = function(b){
    return euclides(this,b) == 1;
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
function logBase(base,arg){
    return Math.log(arg)/ Math.log(base);
}
function blockSize(n){

    //log(base=b, arg = n) = (j-1)
    return Math.floor(logBase(ALFABETO.length, n) );
}
function RSA(p=61,q=53,d=2753){
    //Trabajando con numero muy grandes
    // Libreria BigInteger
    /*
    p = bigInt(p);
    q = bigInt(q);
    d = bigInt(d);
    var n = p.multiply(q);
    var phi_n = p.minus(1).multiply( q.minus(1));

    //var phi_n =(p-1)*(q-1);

    //var e = phi_n.value.euclidesExt(d.value).inv;
    console.log(n,phi_n,d);

    */
    
    var n=p*q;
    var phi_n =(p-1)*(q-1);
    var e = phi_n.euclidesExt(d).inv;
    console.log(n,phi_n,d,e);

}
