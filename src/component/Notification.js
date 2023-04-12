import PushNotification from "react-native-push-notification";
const scheduleNotification = (title, message, date) => {
    console.log("notification function")
    PushNotification.localNotificationSchedule({
        title: title,
        message: message,
        date: date,
        channelId: "channel-id",
        allowWhileIdle: true,
    })
}
export {scheduleNotification};