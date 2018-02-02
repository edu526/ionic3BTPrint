import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
declare var BTPrinter;
@Injectable()
export class PrintProvider {

    constructor(
        // private btSerial: BluetoothSerial,
        private alertCtrl: AlertController
    ) {

    }

    searchBt(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            BTPrinter.list(function (data) {
                data = data.map(dat => {
                    return {
                        name: dat,
                        id: dat
                    }
                })
                resolve(data);
            }, function (err) {
                reject(err);
            })
        })
    }

    connectBT(address): Observable<any> {
        return Observable.create(observable => {
            BTPrinter.connect(function (data) {
                console.log("Success");
                console.log(data)

                observable.next(data);

            }, function (err) {
                console.log("Error");
                console.log(err)

                observable.error(err);
            }, address)
        });

        // return this.btSerial.connect(address);
    }

    disconnect(): Observable<any> {
        return Observable.create(observable => {
            BTPrinter.disconnect(function (data) {
                console.log("Success");
                console.log(data)
                observable.next(data);
            }, function (err) {
                console.log("Error");
                console.log(err)
                observable.error(err);
            })
        })
    }

    testPrint(address) {
        this.disconnect()
            .subscribe(() => {
                this._testPrint(address);
            }, () => {
                this._testPrint(address);
            })
    }

    private _testPrint(address) {
        let printData = "<h2>Test hello this is a test \n\n\n\n Hello Test 123 123 123\n\n\n<h2>"


        let xyz = this.connectBT(address)
            .subscribe(data => {
                this._write(printData)
                    .then(dataz => {
                        console.log("WRITE SUCCESS", dataz);

                        let mno = this.alertCtrl.create({
                            title: "Print SUCCESS!",
                            buttons: ['Dismiss']
                        });
                        mno.present();
                        this.disconnect();
                        xyz.unsubscribe();
                    }, errx => {
                        console.log("WRITE FAILED", errx);
                        let mno = this.alertCtrl.create({
                            title: "ERROR " + errx,
                            buttons: ['Dismiss']
                        });
                        mno.present();
                    });
            }, err => {
                console.log("CONNECTION ERROR", err);
                let mno = this.alertCtrl.create({
                    title: "ERROR " + err,
                    buttons: ['Dismiss']
                });
                mno.present();
            });

    }

    private _write(content) {
        return new Promise((resolve, reject) => {
            BTPrinter.printText(function (data) {
                console.log("Success");
                console.log(data)

                resolve(data);
            }, function (err) {
                console.log("Error");
                console.log(err)

                reject(err);
            }, content);
        })
    }

}
