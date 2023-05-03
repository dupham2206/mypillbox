```
docker build -t mypillbox .
```
```
docker run --privileged --name pillbox_app -it -v /dev/bus/usb:/dev/bus/usb mypillbox
```
