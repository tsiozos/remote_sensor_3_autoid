radio.setGroup(99);
radio.setTransmitPower(7);

//device id is the serial number modulo 990 + 10
//so range is actually 10 ~ 999
let devID = Math.abs(control.deviceSerialNumber() % 990 + 10);

serial.writeLine("my devID "+devID);
basic.showString(devID.toString(),100);

//Pressing A dumps data
input.onButtonPressed(Button.A, function() {
    serial.writeLine(encodeSensors());
    basic.showString(devID.toString(), 100);
})

function encodeSensors() {
    let transtrin=devID.toString()+";";
    transtrin += "T:"+(input.temperature()-3.5)+";";
    transtrin += "L:"+input.lightLevel()+";"; 
    transtrin += "C:"+input.compassHeading()+";";
    transtrin += "X:"+hash_string(transtrin);
    return transtrin;    
}

function transmitEverything() {
    let transtr = encodeSensors();
    serial.writeLine(transtr);
}

control.setInterval(function() {
    transmitEverything()
}, 1000, control.IntervalMode.Interval)

//serial.writeLine((b_crc32("let's hope")).toString());