function hash_string(s: string) {
    
    //serial.writeLine("IN HASH STRING");
    let sum = 0;
    for (let i = 0; i < s.length; i++)
        sum += (41957*i*s.charCodeAt(i)) % 1000; //random primary number
    sum %= 1000;
    if (sum >= 100)
        return sum.toString()
    else if (sum >= 10)
        return "0"+sum.toString()
    else if (sum >= 0)
        return "00"+sum.toString();
    
    return "000";
}
