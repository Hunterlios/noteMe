import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(title, note, date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}`,
      body: `${note}`,
      data: { data: "goes here" },
    },
    trigger: { date },
  });
}

export { schedulePushNotification };
