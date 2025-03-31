// @ts-nocheck
import 'frida-il2cpp-bridge';

Il2Cpp.perform(() => {
  const TakashoCore = Il2Cpp.domain.assembly('Takasho.Core').image;

  const requestSentEventCtor = TakashoCore.class('Takasho.Requester/RequestSentEvent').method('.ctor');
  const observerClass = TakashoCore.class('Takasho.Requester/ObserverCollection');

  /* SEND REQUESTS */

  requestSentEventCtor.implementation = function (
    this: Il2Cpp.Object,
    endpointId: Il2Cpp.String,
    _requestId: Il2Cpp.String,
    request: Il2Cpp.Object,
    _playerId: Il2Cpp.String,
    requestOptions: Il2Cpp.Object, // ⚠️
  ) {
    console.log('[📦] RequestSentEvent called');

    // console.log(`📌 Endpoint: ${endpointId.content}`);

    const stringified = request?.method('ToString')?.invoke()?.toString();

    if (stringified !== '"{ }"') {
      console.log(`[🟢] Content: ${stringified}`);
    }
  };

  /* RECEIVE RESPONSES */

  observerClass.method('RaiseResponseReceived').implementation = function (
    this: Il2Cpp.Class,
    apiResult: Il2Cpp.Object,
    _: Il2Cpp.Object,
  ) {
    console.log('[📦] RaiseResponseReceived called');

    // console.log(`📌 Endpoint: ${apiResult.field('endpointId').value}`);
    // console.log(`Success?: ${apiResult.method('get_IsSuccess').invoke()}`);

    const resultValue = apiResult.field('result').value as Il2Cpp.Object;
    const stringified = resultValue.method('ToString').invoke().toString();

    if (stringified !== '"{ }"') {
      console.log(`[🔴] Content: ${stringified}`);
    }
  };
});
