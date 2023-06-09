FROM reactnativecommunity/react-native-android:latest

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

RUN --mount=type=cache,target=/root/.cache \
    apt update && apt install openjdk-11-jdk -y \
    && update-java-alternatives --set /usr/lib/jvm/java-1.11.0-openjdk-amd64

# install node version 14.17.3
RUN --mount=type=cache,target=/root/.cache \
    n 14.17.3 

# install adb tools
RUN --mount=type=cache,target=/root/.cache \
    apt-get update \
    && apt-get install -y android-tools-adb usbutils

# clone project
RUN --mount=type=cache,target=/root/.cache \
    git clone https://github.com/dupham2206/mypillbox.git

# install dependencies
RUN --mount=type=cache,target=/root/.cache \
    cd mypillbox && npm install

# gradlew
RUN --mount=type=cache,target=/root/.cache \
    cd mypillbox/android && chmod +x gradlew  && ./gradlew clean


CMD adb devices \
    && cd mypillbox && npx react-native run-android \
    && npx react-native start
