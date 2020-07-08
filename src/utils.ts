export function getWhitelistedAddresses({addedEventName, removedEventName, tokenContract, options, resolve, reject}: any) {
  tokenContract.getPastEvents(addedEventName, options, (error: any, events: any[]) => {
    if (error) reject(error);
    if (!events) reject(new Error(`${addedEventName} events came back undefined`));
    if (!events.length) resolve([]);

    const whitelistedAddedCount: any = {};
    const addedAddresses = events.map((event: any) => {
      const address = event.returnValues.account;
      whitelistedAddedCount[address] =
        whitelistedAddedCount[address] ? whitelistedAddedCount[address] + 1 : 1;
      return address;
    });

    // eslint-disable-next-line no-shadow
    tokenContract.getPastEvents(removedEventName, options, (error: any, events: any[]) => {
      if (error) reject(error);
      if (!events) reject(new Error(`${removedEventName} events came back undefined`));
      if (!events.length) resolve(addedAddresses);

      const whitelistedRemoveCount: any = {};
      events.forEach((event: any) => {
        const address = event.returnValues.account;
        whitelistedRemoveCount[address] =
          whitelistedRemoveCount[address] ? whitelistedRemoveCount[address] + 1 : 1;
      });

      const currentlyWhitelistedAddresses: string[] = [];
      Object.keys(whitelistedAddedCount).forEach((address: string) => {
        const addedCount = whitelistedAddedCount[address];
        const removedCount = whitelistedRemoveCount[address] ?
          whitelistedRemoveCount[address] : 0;

        if (addedCount > removedCount) {
          currentlyWhitelistedAddresses.push(address);
        }
      });

      resolve(currentlyWhitelistedAddresses);
    });
  });
}
