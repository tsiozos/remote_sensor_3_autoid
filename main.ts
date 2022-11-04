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
    let transtrin="+"+devID.toString()+";";
    transtrin += Math.floor(input.runningTime() / 1000) + ";";
    transtrin += "T"+(input.temperature()-4)+";";
    transtrin += "L"+input.lightLevel()+";"; 
    transtrin += "C"+input.compassHeading()+";";
    transtrin += "M"+Math.trunc(input.magneticForce(Dimension.Strength))+";";
    transtrin += hash_string(transtrin);
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
}, 15000, control.IntervalMode.Interval)

radio.onReceivedString(function(rS: string) {
    serial.writeLine(rS);
    let l = rS.split(";");
    serial.writeLine("DATA RCV:");
    for (let i=0; i<l.length; i++)
        serial.writeLine(i+":"+l[i]);
})

// *************** TEST ***************
serial.writeLine("**** START ****")
serial.writeLine(hash_string("hello, there"));
serial.writeLine(hash_string("hello ,there"));
