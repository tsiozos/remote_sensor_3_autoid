function hash_string(s: string) {
    let sum = 0;
    for (let i = 0; i < s.length; i++)
        sum += s.charCodeAt(i) % 10;
    sum %= 100;
    if (sum >= 10)
        return sum.toString()
    else
        return "0"+sum.toString();
}
