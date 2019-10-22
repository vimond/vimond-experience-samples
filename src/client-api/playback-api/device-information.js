// const device = { device: { label: 'CHIEF_HOPPER_IPHONE_X', udid: '2cc6031b-80ea-4357-ba7d-e7c72401c542' } };

const browserNames = [
    { match: /Edge/i, name: 'Microsoft Edge' },
    { match: /Android.*Chrome/i, name: 'Google Chrome Android' },
    { match: /Chrome/i, name: 'Google Chrome' },
    { match: /Firefox/i, name: 'Firefox' },
    { match: /Safari/i, name: 'Safari' },
    { match: /MSIE/i, name: 'Internet Explorer' }
  ],
  osNames = [
    { match: /Android/i, name: 'Android' },
    { match: /OS X/i, name: 'MacOS X' },
    { match: /iPad/i, name: 'iPad' },
    { match: /iPhone/i, name: 'iPhone' },
    { match: /iPod/i, name: 'iPod' },
    { match: /Windows/i, name: 'Windows' },
    { match: /Linux/i, name: 'Linux' }
  ],
  separator = ', ';

function generateSimpleFingerprint() {

  const nav = window.navigator;
  const screen = window.screen;
  let fingerprint = nav.mimeTypes.length;
  fingerprint += nav.userAgent.replace(/\D+/g, '');
  fingerprint += nav.plugins.length;
  fingerprint += screen.height || '';
  fingerprint += screen.width || '';
  fingerprint += screen.pixelDepth || '';

  return fingerprint;
};

function assembleDeviceLabel() {
  const userAgent = navigator.userAgent;
  let deviceName;

  for (let i = 0; i < browserNames.length; i++) {
    if (browserNames[i].match.test(userAgent)) {
      deviceName = browserNames[i].name;
      break;
    }
  }

  if (deviceName) {
    for (let j = 0; j < osNames.length; j++) {
      if (osNames[j].match.test(userAgent)) {
        deviceName += separator + osNames[j].name;
        return deviceName;
      }
    }
  } else {
    return (navigator.vendor || navigator.product) + separator + (navigator.oscpu || navigator.platform);
  }
}

function getDeviceInformation() {
  const key = 'deviceInfo';
  try {
    const storedInfoString = window.localStorage.getItem(key);
    if (storedInfoString) {
      let deviceInformation;
      try {
        deviceInformation = JSON.parse(storedInfoString);
      } catch (e) {
      }
      if (deviceInformation && deviceInformation.udid && deviceInformation.label) {
        return {
          deviceInformation
        };
      }
    }
  } catch (e) {}
  const deviceInformation = {
    device: {
      udid: generateSimpleFingerprint(),
      label: assembleDeviceLabel()
    }
  };

  try {
    window.localStorage.setItem(key, JSON.stringify(deviceInformation));
  } catch (e) {}

  return {
    deviceInformation
  };
}

const getDeviceInformationService = () => {
  return {
    get: () => Promise.resolve(getDeviceInformation())
  };
};

export default getDeviceInformationService;
