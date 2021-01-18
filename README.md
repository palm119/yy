# DY-SV17F Driver For Microbit
makecode pxt extension for DY-SV17F mp3 Audio Board

## 更新:
2021.1.18: <br>
>初始化版本，支持DY-SV17F主控的mp3播放器模块<br>
有问题可以联系我：xurunhua@139.com<br>

## Basic Usage

```blocks
input.onButtonPressed(Button.A, function () {
    dysv17f.playFlash("clock", "time")
})
input.onButtonPressed(Button.B, function () {
    dysv17f.press(dysv17f.playType.PlayNext)
})
dysv17f.connect(SerialPin.P0, SerialPin.P1)
dysv17f.setVolume(30)
```

Use ``||connect||`` to connect to DY-SV17F mp3 Audio Board.

Use ``||setVolume||`` to set Volume.

Use ``||playFlash||`` to play mp3 in the flash.

## Supported targets

* for PXT/microbit

## License

MIT
