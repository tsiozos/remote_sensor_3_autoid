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
        
    }

    return res;
}