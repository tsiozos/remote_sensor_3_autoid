radio.setGroup(99);
radio.setTransmitPower(7);
radio.setTransmitSerialNumber(false);

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
    let transtrin="+"+devID.toString();
    transtrin += "r"+encode(Math.floor(input.runningTime() / 1000)%86400,16);
    transtrin += "t"+encode((input.temperature()-4),16);
    transtrin += "L"+encode(input.lightLevel(),16); 
    //transtrin += "H"+encode(input.compassHeading(),16);
    //transtrin += "M"+encode(Math.trunc(input.magneticForce(Dimension.Strength)),16);
    transtrin += "h"+hash_string(transtrin);
    return transtrin;    
}

/*
ΤΟ ΜΕΓΙΣΤΟ ΜΗΚΟΣ ΜΕΤΑΔΟΣΗΣ string ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ 19.

*/
function transmitEverything() {
    let transtr = encodeSensors();
    serial.writeLine(transtr);
    for (let i=0;i<3;i++) {
        radio.sendString(transtr);
        basic.pause(randint(50,100));
    }
}

control.setInterval(function() {
    transmitEverything()
}, 5000, control.IntervalMode.Interval)

radio.onReceivedString(function(rS: string) {
    if (check_hash(rS))
        serial.writeLine("OK: "+rS);
    
})

// *************** TEST ***************
serial.writeLine("**** START ****")
//serial.writeLine(hash_string("hello, there"));
//serial.writeLine(hash_string("hello ,there"));

//for (let i=0; i< 300; i++)
//    serial.writeLine(i+": "+encode(i,16));
//let s1 = encode(1345892,16);
//serial.writeLine("1345892 = 0x"+s1);
//serial.writeLine("0x"+s1+" = "+decode(s1,16).toString());