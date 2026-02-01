const DEVICE_ID_KEY = 'arcana-device-id';

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const setDeviceId = (newId) => {
  localStorage.setItem(DEVICE_ID_KEY, newId);
};

export const getSyncCode = () => {
  return getDeviceId();
};
