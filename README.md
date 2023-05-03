build
```
docker build -t mypillbox .
```
for adb over usb:
```
docker run --privileged --name pillbox_app -it -v /dev/bus/usb:/dev/bus/usb mypillbox
```
for adb over wifi:

```
docker run --privileged --name pillbox_app -it -e IP_ADB={{YOUR_IP_ADDRESS}} mypillbox
```
Example:
```
docker run --privileged --name pillbox_app -it -e IP_ADB=192.168.55.102 mypillbox