// @ts-nocheck
import 'frida-il2cpp-bridge';

Il2Cpp.perform(() => {
  const TakashoCore = Il2Cpp.domain.assembly('Takasho.Core').image;

  const requestSentEventCtor = TakashoCore.class('Takasho.Requester/RequestSentEvent');
  const observerClass = TakashoCore.class('Takasho.Requester/ObserverCollection');

  /* SEND REQUESTS */

  requestSentEventCtor.method('.ctor').implementation = function (
    this: Il2Cpp.Object,
    endpointId: Il2Cpp.String,
    requestId: Il2Cpp.String,
    request: Il2Cpp.Object,
    playerId: Il2Cpp.String,
    requestOptions: Il2Cpp.Object,
  ) {
    console.log('[📦] RequestSentEvent called');

    console.log(`📌 Endpoint: ${endpointId.content}`);

    const stringified = request?.method('ToString')?.invoke()?.toString();

    if (stringified !== '"{ }"') {
      console.log(`[🟢] Content: ${stringified}`);
    }

    const result = this.method('.ctor').invoke(endpointId, requestId, request, playerId, requestOptions);
    return result;
  };

  /* RECEIVE RESPONSES */

  observerClass.method('RaiseResponseReceived').implementation = function (
    this: Il2Cpp.Class,
    apiResult: Il2Cpp.Object,
    clientState: Il2Cpp.Object,
  ) {
    console.log('[📦] RaiseResponseReceived called');

    console.log(`📌 Endpoint: ${apiResult.field('endpointId').value}`);
    console.log(`Success?: ${apiResult.method('get_IsSuccess').invoke()}`);

    const resultValue = apiResult.field('result').value as Il2Cpp.Object;
    const stringified = resultValue.method('ToString').invoke().toString();

    if (stringified !== '"{ }"') {
      console.log(`[🔴] Content: ${stringified}`);
    }

    const result = this.method('RaiseResponseReceived').invoke(apiResult, clientState);
    return result;
  };
});
