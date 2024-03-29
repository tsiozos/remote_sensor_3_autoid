
//radio.setTransmitPower(0);
radio.off();
let radioStayOn = false;
//radio.setTransmitSerialNumber(false);

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

// Enums for sensor symbols
class Sensors {
    static STATION = "+"
    static TIME = ">"
    static TEMP = "@"
    static LIGHT = "^"
    static HEADING = "&"
    static MAGNETIC = "%"
    static HASH = "*"
    static ALL = "+>@^&%*"
    static toName(sensorSymbol: string): string {
        switch(sensorSymbol) {
            case Sensors.STATION: return "STATION";
            case Sensors.TIME: return "TIME";
            case Sensors.TEMP: return "TEMP";
            case Sensors.LIGHT: return "LIGHT";
            case Sensors.HEADING: return "HEADING";
            case Sensors.MAGNETIC: return "MAGNTEIC";
            case Sensors.HASH: return "HASH";
            default: return "UNDEFINED";
        }
    }
};

class SensorData {
    public Station: string;
    public Time: int32;
    
}

function encodeSensors() {
    let transtrin=Sensors.STATION+devID.toString();
    transtrin += Sensors.TIME+encode(Math.floor(input.runningTime() / 1000)%86400,62);
    transtrin += Sensors.TEMP+encode((input.temperature()-4),62);
    transtrin += Sensors.LIGHT+encode(input.lightLevel(),62); 
    //transtrin += Sensors.HEADING+encode(input.compassHeading(),62);
    //transtrin += Sensors.MAGNETIC+encode(Math.trunc(input.magneticForce(Dimension.Strength)),62);
    transtrin += Sensors.HASH+hash_string(transtrin);
    return transtrin;    
}

function extractValue(s: string, start: number): string {
    let sval = "";
    for (let i=start+1; i<s.length && (Sensors.ALL.indexOf(s[i]) == -1); i++)
        sval += s[i];
    return sval;
}

function extractValues2(inString: string) {
    let values: {[key:string]:string}={};
    let separators: string = Sensors.ALL;

    for (let onesep of separators) {
        let idx = inString.indexOf(onesep)
        if (idx != -1) {
            let mykey = onesep
            let myval = extractValue(inString, idx);
            //idx++;
            //while (inString.indexOf(inString[idx]) != -1) myval += inString[idx];
            values[mykey]=myval;
        }

    }
    return values;
}



// function decodeSensors(encoded: string, sens: Sensors) {
//     let res: {[key:string]:string} = extractValues(encoded);
//     return res;
// }

/*
ΤΟ ΜΕΓΙΣΤΟ ΜΗΚΟΣ ΜΕΤΑΔΟΣΗΣ string ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ 19.

*/
function transmitEverything() {
    if (!radioStayOn) radio.on();
    radio.setTransmitPower(7);
    radio.setGroup(99);
    let transtr = encodeSensors();
    serial.writeLine(transtr);
    for (let i=0;i<3;i++) {
        radio.sendString(transtr);
        basic.pause(randint(50,100));
    }
    if (!radioStayOn) radio.off();
}

control.setInterval(function() {
    transmitEverything()
}, 5000, control.IntervalMode.Interval)

radio.onReceivedString(function(rS: string) {
    if (check_hash(rS)) {
        serial.writeLine("OK: "+rS)
        serial.writeLine("Decoded:")
        let sens = extractValues2(rS);
        for (let key of Object.keys(sens))
            if (key == Sensors.HASH || key == Sensors.STATION)
                serial.writeLine(Sensors.toName(key)+"=" + sens[key]);
            else
                serial.writeLine(Sensors.toName(key) + "=" + decode(sens[key], 62))
                
        //serial.writeLine(decodeSensors(rS,Sensors.ALL))
    }
    else
        serial.writeLine("HASH ERROR on RCV str");
    
})

input.onButtonPressed(Button.B, function() {
    radioStayOn = !radioStayOn;
    if (radioStayOn) {
        led.plot(2,2)
        radio.on();
    }
    else {
        led.unplot(2,2)
        radio.off()
    };
})

// *************** TEST ***************
serial.writeLine("**** START ****")
//serial.writeLine(hash_string("hello, there"));
//serial.writeLine(hash_string("hello ,there"));

//for (let i=0; i< 300; i++)
//    serial.writeLine(i+": "+encode(i,16));
//let s1 = encode(999999999,62);
//serial.writeLine("999999999 = 62x "+s1);
//serial.writeLine("62x "+s1+" = "+decode(s1,62).toString());

//serial.writeLine("station="+extractValue("+45@44%53&180",0));
//serial.writeLine("temp=" + extractValue("+45@44%53&180", 3));
//serial.writeLine("heading=" + extractValue("+45@44%53&180", 9));

