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
    transtrin += "r"+encode(Math.floor(input.runningTime() / 1000),16);
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
    for (let i=0;i<3;i++)
        radio.sendString(transtr);
}

control.setInterval(function() {
    transmitEverything()
}, 5000, control.IntervalMode.Interval)

radio.onReceivedString(function(rS: string) {
    //return;
    serial.writeLine(rS);
    //let l = rS.split(";");

    //check if hash is ok
    let hashstr = parseInt(rS.slice(-2),16);
    let checkstr = rS.slice(0,-3); //cut out the "h" too
    let encodedhash = parseInt(hash_string(checkstr),16);
    if (hashstr != encodedhash) {
        serial.writeLine("ERROR at hash");
        serial.writeLine(">> "+hashstr);
        serial.writeLine(">>> "+encodedhash);
    }
    else {
        serial.writeLine("DATA RCV:"+rS);
        
    }
})

// *************** TEST ***************
serial.writeLine("**** START ****")
//serial.writeLine(hash_string("hello, there"));
//serial.writeLine(hash_string("hello ,there"));

//for (let i=0; i< 20; i++)
//    serial.writeLine(encode(i,16));