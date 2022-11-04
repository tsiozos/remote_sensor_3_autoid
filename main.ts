radio.setGroup(99);
radio.setTransmitPower(7);

//device id is the serial number modulo 990 + 10
//so range is actually 10 ~ 999
let devID = Math.abs(control.deviceSerialNumber() % 990 + 10);

serial.writeLine("my devID "+devID);
basic.showString(devID.toString(),100);
serial.writeLine("Sensors: "+encodeSensors())

//Pressing A dumps data
input.onButtonPressed(Button.A, function() {
    serial.writeLine(encodeSensors());
    basic.showString(devID.toString(), 100);
})

function encodeSensors() {
    let transtrin=devID.toString()+";";
    transtrin += "T:"+(input.temperature()-4)+";";
    transtrin += "L:"+input.lightLevel()+";"; 
    transtrin += "C:"+input.compassHeading()+";";
    transtrin += "M:"+Math.trunc(input.magneticForce(Dimension.Strength));
    return transtrin;    
}

function transmitEverything() {
    let transtr = encodeSensors();
    serial.writeLine(transtr);
    for (let i=0;i<3;i++)
        radio.sendString(transtr);
}

control.setInterval(function() {
    transmitEverything()
}, 1000, control.IntervalMode.Interval)

radio.onReceivedString(function(rS: string) {
    serial.writeLine(rS)
})
//serial.writeLine((b_crc32("let's hope")).toString());