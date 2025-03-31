import 'frida-il2cpp-bridge';

Il2Cpp.perform(() => {
  const TakashoCore = Il2Cpp.domain.assembly('Takasho.Core').image;
  const Ceal = TakashoCore.class('Takasho.Ceal');
  const Error = TakashoCore.class('Takasho.Error');

  const LettuceRainbow = Il2Cpp.domain.assembly('Lettuce.Infrastructure.Rainbow').image;
  const Foundation_Rainbow_Runtime = LettuceRainbow.class('Foundation.Rainbow.Runtime.Rainbow');

  const UniTaskModule = Il2Cpp.domain.assembly('UniTask').image;
  const UniTaskClass = UniTaskModule.class('Cysharp.Threading.Tasks.UniTask');
  const YieldMethod = UniTaskClass.method('Yield');

  const RainbowModule = Il2Cpp.domain.assembly('Lettuce.Infrastructure.Rainbow').image;
  const RainbowClass = RainbowModule.class('Foundation.Rainbow.Runtime.Rainbow');

  const TrySendMethod = RainbowClass.method('TrySend');
  TrySendMethod.implementation = function () {
    return YieldMethod.invoke();
  };

  console.log('[🔵] Loadeding classes');
  console.log(`📌 ${Ceal.name}: Done`);
  console.log(`📌 ${Error.name}: Done`);
  console.log(`📌 ${Foundation_Rainbow_Runtime.name}: Done`);
  console.log('[🔵] Done');

  // @ts-ignore
  Ceal.method('IsValidPem').implementation = function (this: Il2Cpp.Object, pem: Il2Cpp.String) {
    console.log('[📦] IsValidPem called');
    console.log(`📌 PEM: ${pem.content}`);
    return true;
  };

  Error.methods.forEach((method) => {
    if (method.name === '.ctor') {
      // @ts-ignore
      method.implementation = function (
        this: Il2Cpp.Object,
        requestId: Il2Cpp.String,
        endpointId: Il2Cpp.String,
        code: Il2Cpp.Object,
        debugMessage: Il2Cpp.String,
        maintenanceMessage: Il2Cpp.String,
      ) {
        console.log('[📦] Error.ctor called');
        console.log(`📌 RequestId: ${requestId.content}`);
        console.log(`📌 EndpointId: ${endpointId.content}`);
        console.log(`📌 Code: ${code}`);
        if (debugMessage.content) {
          console.log(`📌 DebugMessage: ${debugMessage.content}`);
        }
      };
    }
  });

  // @ts-ignore
  Foundation_Rainbow_Runtime.method('Chs').implementation = function (
    this: Il2Cpp.Object,
    debug: boolean,
    emulator: boolean,
    frida: boolean,
    jailbreakAndRooted: boolean,
    modifyBinary: boolean,
    modifyFirePoint: boolean,
    modifyFunction: boolean,
    vspaceApp: boolean,
    modifyMemory: boolean,
  ) {
    console.log('[📦] Chs called');
    console.log(`📌 Debugger: ${debug}`);
    console.log(`📌 Emulator: ${emulator}`);
    console.log(`📌 Frida: ${frida}`);
    console.log(`📌 Jailbreak: ${jailbreakAndRooted}`);
    console.log(`📌 ModifyBinary: ${modifyBinary}`);
    console.log(`📌 ModifyFirePoint: ${modifyFirePoint}`);
    console.log(`📌 ModifyFunction: ${modifyFunction}`);
    console.log(`📌 VSpaceApp: ${vspaceApp}`);
    console.log(`📌 ModifyMemory: ${modifyMemory}`);
    return false;
  };

  const requestSentEventCtor = TakashoCore.class('Takasho.Requester/RequestSentEvent').method('.ctor');
  const observerClass = TakashoCore.class('Takasho.Requester/ObserverCollection');

  /* SEND REQUESTS */
  // @ts-ignore
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
  // @ts-ignore
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
