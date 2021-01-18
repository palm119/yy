/**
* MP3Player
* Create by xrh
*/

//% weight=9 color=#1133ff icon="\uf001" block="MP3播放器"
namespace dysv17f {
    let isConnected: boolean = false;

    /**
     * 枚举：动作
     */
    export enum playType {
        //% block="播放"
        Play = 0x02,
        //% block="暂停"
        Pause = 0x03,
        //% block="停止"
        Stop = 0x04,
        //% block="上一首"
        PlayPrevious = 0x05,
        //% block="下一首"
        PlayNext = 0x06
    }

    /**
     * 枚举：EQ
     */
    export enum EQ {
        //% block="正常"
        Normal = 0x00,
        //% block="流行"
        Pop = 0x01,
        //% block="摇滚"
        Rock = 0x02,
        //% block="爵士"
        Jazz = 0x03,
        //% block="古典"
        Classic = 0x04
    }

    /**
     * 枚举：播放模式
     */
    export enum playLoop {
        //% block="全盘循环"
        AllLoop = 0x00,
        //% block="单曲循环"
        SingLoop = 0x01,
        //% block="单曲停止"
        SingStop = 0x02,
        //% block="全盘随机"
        AllRandom = 0x03,
        //% block="目录循环"
        DirLoop = 0x04,
        //% block="目录随机"
        DirRandom = 0x05,
        //% block="目录顺序"
        DirOrder = 0x06,
        //% block="顺序播放"
        AllOrder = 0x07
   }

    /**
     * 发送组合命令到串口
     */
    function innerCall(CMD: number, len: number, data: string): void {
        if (!isConnected) {
            connect(SerialPin.P0, SerialPin.P1)
        }

        /* [AA,CMD,len,data,checksum] */
        let dataArr = pins.createBuffer(len+4);

        //数据头
        dataArr[0] = 0xAA   //固定
        dataArr[1] = CMD    //命令
        dataArr[2] = len    //长度
    
        //数据位
        for (let i = 0; i < len; i++) {
            dataArr.setNumber(NumberFormat.UInt8BE, i+3, data.charCodeAt(i))
        }

        //校验位
        let total = 0;
        for (let i = 0; i < len+3; i++) {
            total += dataArr[i]
        }
        dataArr[len+3] = total & 0xFF

        // for (let i = 0; i < len+4; i++) {
        //     basic.showNumber(dataArr[i])
        // }

        //发送数据
        serial.writeBuffer(dataArr)
        basic.pause(100)
    }

    /**
     * 连接DY-SV17F设备
     * @param pinRX RX端口, eg: SerialPin.P0
     * @param pinTX TX端口, eg: SerialPin.P1
     */
    //% blockId="dfplayermini_connect" block="连接DY-SV17F设备， RX引脚%pinRX|TX引脚%pinTX"
    //% weight=96
    export function connect(pinRX: SerialPin = SerialPin.P0, pinTX: SerialPin = SerialPin.P1): void {
        serial.redirect(pinRX, pinTX, BaudRate.BaudRate9600)
        isConnected = true
        basic.pause(100)
    }

    /**
     * 按下按钮
     * @param myPlayType 动作类型, eg: 0
     */
    //% blockId="dfplayermini_press" block="按下%myPlayType"
    //% weight=95
    export function press(myPlayType: playType): void {
        innerCall(myPlayType, 0x00, "")
    }

    /**
     * 播放FLASH的文件夹中歌曲，目录为空则播放根目录歌曲
     * @param dir       目录
     * @param fileName  文件名
     */
    //% blockId="dfplayermini_playMp3Folder" block="指定播放mp3文件夹中歌曲，目录%dir|文件名%fileName"
    //% weight=94 fileNumber.min=1 fileNumber.max=255
    export function playFlash(dir: string, fileName: string): void {
        let file
        if (dir.length>0) {
            file = "/"+ dir+"*/"+fileName+"*mp3";
        } else {
            file = "/"+fileName+"*mp3";
        }
        innerCall(0x08, file.length+1, String.fromCharCode(0x02)+strToUpperCase(file))
    }

    /**
     * 设置播放音量
     * @param volume 设置音量, eg: 30
    //% weight=93
    */
    //% blockId="dfplayermini_setVolume" block="设置音量大小(0~30)%volume"
    //% weight=94 volume.min=0 volume.max=30
    export function setVolume(volume: number): void {
        innerCall(0x13, 0x01, String.fromCharCode(volume))
    }

    /**
     * 设置播放模式
     * @param mPlayLoop 播放模式 eg: 0
    */
    //% block="设置播放模式%mPlayLoop"
    //% weight=92
    export function setLoop(mPlayLoop: playLoop): void {
        innerCall(0x18, 0x01, String.fromCharCode(mPlayLoop))
     }

    /**
     * 设置均衡器
     * @param eq 设置EQ, eg: 0
   */
    //% blockId="dfplayermini_setEQ" block="设置EQ%eq"
    //% weight=91
    export function setEQ(eq: EQ): void {
        innerCall(0x1A, 0x01, String.fromCharCode(eq))
    }

    /**
     * 字符串转化为大写
    */
    function strToUpperCase(str: string): string {
        let ret = ''
        for(let i = 0; i < str.length; i++){
            let code = str.charCodeAt(i)
            if(code <= 122 && code>=97){
                ret += String.fromCharCode(code - 32)
            }else{
                ret += str[i]
            }
        }
        return ret
    }

}
