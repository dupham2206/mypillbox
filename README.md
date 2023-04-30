```
docker build -t mypillbox .
```
```
docker run --privileged --name pillbox_app -d -v /dev/bus/usb:/dev/bus/usb mypillbox
```