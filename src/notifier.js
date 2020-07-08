import notify from 'bnc-notify';

export default (network = 1) => {
  return notify({
    dappId: '1cd447b9-145b-4ed5-a67b-c04e12b304e6',
    networkId: network,
    darkMode: true,
    desktopPosition: "topRight",
  });
};
