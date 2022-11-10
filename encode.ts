// κωδικοποίηση αποκωδικοποίηση
let coder = "0123456789ABCDEF";

// return an encoded string of thenum in base
function encode(thenum: number, base: number): string {
    let finalstr = "0";
    if (thenum > 0) {
        finalstr = "";
        while (thenum > 0) {
            let digit = thenum % base;
            finalstr = coder.charAt(digit)+finalstr;
            thenum = Math.idiv(thenum, base); 
        }
    }
    return finalstr;
}

function decode(thestr: string, base: number): number {
    let res = 0;
    if (thestr.length > 0) {
        for (let i=0; i<thestr.length; i++) {
            //serial.writeLine(">" + thestr[i] + " val=" + coder.indexOf(thestr[i]) + " pow=" + ((thestr.length - 1) - i).toString());
            res += Math.pow(base,((thestr.length-1)-i))*coder.indexOf(thestr[i]);
            //serial.writeLine("new res:"+res.toString());
        }
    }

    return res;
}